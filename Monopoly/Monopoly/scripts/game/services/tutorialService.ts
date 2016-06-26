module Services {

    export class TutorialService implements Interfaces.ITutorialService {
        private numSteps: number;
        private numStepsGame: number;
        private numStepsManage: number;
        private data: Model.TutorialData;
        public timeoutService: angular.ITimeoutService;
        gameService: Interfaces.IGameService;
        swipeService: any;
        static $inject = ["$swipe", "$timeout", "gameService"];
        constructor(swipeService: any, timeoutService: angular.ITimeoutService, gameService: Interfaces.IGameService) {
            this.numStepsGame = 6;
            this.numStepsManage = 9;
            this.numSteps = this.numStepsGame;
            this.timeoutService = timeoutService;
            this.gameService = gameService;
            this.swipeService = swipeService;            
        }

        public initialize(data: Model.TutorialData) {
            this.data = data;
            this.currentStep = undefined;
        }

        public advanceToNextStep() {
            var hasAdvanced = false;
            if (!this.currentStep) {
                this.currentStep = 1;
                hasAdvanced = true;
            } else {
                if (this.canAdvance) {
                    this.currentStep++;
                    hasAdvanced = true;
                }
            }
            if (hasAdvanced) {
                this.setupCurrentStep();
                if (this.data.customFunction) {
                    this.data.customFunction(this, this.data, undefined);
                }
            }
        }

        public endCurrentSection() {
            if (this.currentStep <= this.numStepsGame) {
                this.currentStep = this.numStepsGame + 1;
            } else if (this.currentStep <= this.numStepsManage) {
                this.currentStep = this.numStepsManage + 1;
            }
        }

        get canAdvance(): boolean {
            if (!this.currentStep || this.currentStep > this.numSteps) {
                return false;
            }
            return true;
        }

        get canAdvanceByClick(): boolean {
            return this.canAdvance && !this.data.disableClickForward;
        }

        get isActive(): boolean {
            return this.currentStep && this.currentStep <= this.numSteps;
        }

        public currentStep: number;

        public canExecuteAction(action: string): boolean {
            if (!this.isActive) {
                return true;
            }
            if (action === "setupthrow" && this.currentStep === 5) {
                return true;
            }
            if (action === "manage" && this.currentStep > this.numStepsGame) {
                return true;
            }
            if (action === "pause" && this.currentStep > this.numStepsGame) {
                return true;
            }

            return false;
        }

        public executeActionCallback(action: string) {
            if (this.data.executeOnAction) {
                this.data.executeOnAction(action, this, this.data);
            }    
        }

        public initManageModeTutorial(scope: angular.IScope) {
            if (this.numSteps === this.numStepsGame) {
                this.numSteps = this.numStepsManage;
                var that = this;
                // delay showing the tutorial message before the new camera position is loaded
                this.timeoutService(() => {
                    scope.$apply(() => {
                        that.advanceToNextStep();
                    });                    
                }, 1500);
            }
        }

        private setupCurrentStep() {
            if (this.currentStep === 1) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Welcome to MOONopoly! A historical moment has been reached where the Moon is now available to the wealthiest explorers of the world.";
                this.data.messageDialogTop = 70;
                this.data.messagePaddingTop = 25;
            } else if (this.currentStep === 2) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "It is only fair for the Moon to be divided among them by chance and strategic skills.";
                this.data.messagePaddingTop = 50;
            } else if (this.currentStep === 3) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "In a turn based game you have a choice of THROWING the dice, MANAGING your assets and ENDING current turn.";
                this.data.messagePaddingTop = 35;
            } else if (this.currentStep === 4) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "To select your action, swipe your finger over the buttons at the bottom of the screen.";
                this.data.messagePaddingTop = 50;
                this.data.customFunction = (tutorialService: Interfaces.ITutorialService, stepData: Model.TutorialData, backwards: boolean) => {
                    // this custom function will iterate over visible buttons and highlight them one at a time
                    var highlighted = $("#commandPanel img.highlightedButton");
                    var nextHighlighted;
                    if (highlighted.length === 0) {
                        nextHighlighted = $("#commandPanel a:visible img.unhighlightedButton").first();                        
                        var position = nextHighlighted[0].getBoundingClientRect();
                        $("#handCursor").css("top", position.top - 90);
                        $("#handCursor").css("left", position.left);
                        $("#handCursor").show();
                        //nextHighlighted.parent().append($("[name='handCursor']"));
                        //nextHighlighted.parent().children("[name='handCursor']").show();
                    } else {
                        highlighted.removeClass("highlightedButton").addClass("unhighlightedButton");
                        highlighted.parent().children().children(".commandButtonOverlayText").hide();
                        if (tutorialService.currentStep === 4) {
                            highlighted = highlighted.first().parent();
                            nextHighlighted = backwards ? highlighted.prevAll("a:visible") : highlighted.nextAll("a:visible");
                            if (nextHighlighted.length === 0) {
                                // change direction if the end has been reached
                                if (backwards) {
                                    backwards = false;
                                } else {
                                    backwards = true;
                                }
                                nextHighlighted = backwards ? highlighted.prevAll("a:visible").first().children("img") : highlighted.nextAll("a:visible").first().children("img"); //$("#commandPanel a:visible img").first();
                            } else {
                                nextHighlighted = backwards ? nextHighlighted.first().children("img") : nextHighlighted.first().children("img");
                            }
                        }
                    }
                    if (nextHighlighted) {
                        nextHighlighted.removeClass("unhighlightedButton").addClass("highlightedButton");
                        nextHighlighted.parent().children().children(".commandButtonOverlayText").show();
                        var nextHighlighted2 = backwards ? nextHighlighted.parent().prevAll("a:visible") : nextHighlighted.parent().nextAll("a:visible");
                        var nextBackwards = nextHighlighted2.length > 0 ? backwards : !backwards;
                        $("#handCursor").animate({
                            left: nextBackwards ? "-=65" : "+=65" }, 1000);
                        tutorialService.timeoutService(() => {
                            if (stepData.customFunction && tutorialService.currentStep === 4) {
                                stepData.customFunction(tutorialService, stepData, backwards);
                            } else {
                                highlighted = $("#commandPanel img.highlightedButton");
                                highlighted.removeClass("highlightedButton").addClass("unhighlightedButton");
                                highlighted.parent().children().children(".commandButtonOverlayText").hide();
                                $("#handCursor").hide();
                            }
                        }, 1000);
                    }
                };
            } else if (this.currentStep === 5) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Try THROWING the dice for your first move.";
                this.data.messagePaddingTop = 55;
                this.data.disableClickForward = true;
                this.data.customFunction = undefined;
                this.data.executeOnAction = (action: string, tutorialService: Interfaces.ITutorialService, stepData: Model.TutorialData) => {
                    if (action === "setupthrow") {
                        stepData.messageDialogVisible = false;
                    }
                    if (action === "throw") {
                        tutorialService.advanceToNextStep();
                    }
                }
            } else if (this.currentStep === 6) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Tap anywhere on the dice to drop it to the Moon surface.";
                this.data.messageDialogTop = 180;
                this.data.messagePaddingTop = 55;
                this.data.disableClickForward = false;
                this.data.customFunction = undefined;
                this.data.executeOnAction = undefined;
            // step 7 is a marker that ends tutorial mode on the main screen
            } else if (this.currentStep === 8) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "On this screen you can view properties and manage those owned by you.";
                this.data.messageDialogTop = 70;
                this.data.messagePaddingTop = 50;
            } else if (this.currentStep === 9) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Swipe your finger left or right to highlight another group, then tap anywhere on a chosen property to select it.";
                this.data.messageDialogTop = 70;
                this.data.messagePaddingTop = 35;
            } else {
                this.data.messageDialogVisible = false;
                this.data.customFunction = undefined;
            }
        }
    }

    monopolyApp.service("tutorialService", TutorialService);    
}
