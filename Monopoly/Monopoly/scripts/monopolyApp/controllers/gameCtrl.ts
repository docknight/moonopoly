/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/game.ts" />
module MonopolyApp.controllers {
    declare var sweetAlert: any;

    export class GameController {
        scope: angular.IScope;
        rootScope: angular.IRootScopeService;
        stateService: angular.ui.IStateService;
        stateParamsService: angular.ui.IStateParamsService;
        timeoutService: angular.ITimeoutService;
        compileService: angular.ICompileService;
        gameService: Interfaces.IGameService;
        drawingService: Interfaces.IDrawingService;
        aiService: Interfaces.IAIService;
        themeService: Interfaces.IThemeService;
        settingsService: Interfaces.ISettingsService;
        tutorialService: Interfaces.ITutorialService;
        tradeService: Interfaces.ITradeService;
        swipeService: any;
        static $inject = ["$state", "$stateParams", "$swipe", "$scope", "$rootScope", "$timeout", "$compile", "gameService", "drawingService", "aiService", "themeService", "settingsService", "tutorialService", "tradeService"];

        private players: Array<Viewmodels.Player>;
        private boardFields: Array<Viewmodels.BoardField>;
        private currentCard: Viewmodels.Card; // card currently being displayed
        private scene: BABYLON.Scene;
        private gameEngine: BABYLON.Engine;
        private gameCamera: BABYLON.FreeCamera;
        private gameCameraPosition: BABYLON.Vector3;
        private gameCameraRotation: BABYLON.Vector3;
        private manageMode: boolean;
        private focusedAssetGroupIndex: number; // currently focused asset group in manage mode
        private swipeInProgress: boolean;
        private confirmButtonCallback: (data: any) => void; // callbacks currently assigned to action buttons
        private cancelButtonCallback: (data: any) => void;
        private diceThrowCompleted: JQueryDeferred<{}>;
        private playerMoving: boolean; // true while the player is moving on the board
        private player1MoneySlider: any;
        private player2MoneySlider: any;

        availableActions: Viewmodels.AvailableActions;
        assetToBuy: Model.Asset; // asset currently available for purchase
        assetToManage: Model.Asset; // asset currently being managed
        messages: Array<string>;
        actionButtonsVisible: boolean;
        tutorial: boolean;
        tutorialData: Model.TutorialData;
        tradeMode: boolean;
        commandPanelBottomOffset: number;

        get currentPlayer(): string {
            return this.gameService.getCurrentPlayer();
        }

        get playerModels(): Array<Viewmodels.Player> {
            return this.players;
        }

        get theme(): Interfaces.ITheme {
            return this.themeService.theme;
        }

        constructor(stateService: angular.ui.IStateService, stateParamsService: angular.ui.IStateParamsService, swipeService: any, scope: angular.IScope, rootScope: angular.IRootScopeService, timeoutService: angular.ITimeoutService, compileService: angular.ICompileService, gameService: Interfaces.IGameService, drawingService: Interfaces.IDrawingService, aiService: Interfaces.IAIService, themeService: Interfaces.IThemeService, settingsService: Interfaces.ISettingsService, tutorialService: Interfaces.ITutorialService, tradeService: Interfaces.ITradeService) {
            this.scope = scope;
            this.rootScope = rootScope;
            this.stateService = stateService;
            this.stateParamsService = stateParamsService;
            this.timeoutService = timeoutService;
            this.compileService = compileService;
            this.gameService = gameService;
            this.drawingService = drawingService;
            this.aiService = aiService;
            this.themeService = themeService;
            this.swipeService = swipeService;
            this.settingsService = settingsService;
            this.tutorialService = tutorialService;
            this.tradeService = tradeService;
            var spService: any = this.stateParamsService;
            var loadGame:boolean = eval(spService.loadGame);
            this.initGame(loadGame);
            var sceneCreated = this.createScene();
            this.availableActions = new Viewmodels.AvailableActions();
            this.setAvailableActions();
            this.initMessageHistory();
            this.currentCard = new Viewmodels.Card();
            this.bindInputEvents();
            this.commandPanelBottomOffset = this.settingsService.options.staticCamera ? 20 : 2;
            var that = this;
            this.scope.$on("$destroy", () => {
                window.removeEventListener("resize", that.resizeEventListener);
                var windowAny: any = window;
                windowAny.gameEngine = undefined;
                that.unbindInputEvents();
                that.gameEngine.dispose();
                that.scene = undefined;
                delete that.gameEngine;
                console.log("Scene destroyed!");
            });
            this.timeoutService(() => {
                that.initAudio();
                that.stopMusic();
                //that.playMusic();
            });
            $.when(sceneCreated).done(() => {
                for (var i = 0; i < 12; i++) {
                    that.refreshBoardFieldGroupHouses(i);
                }
                //if (loadGame) {
                    that.refreshBoardFieldMortgage();
                //}
                that.initTutorial(loadGame);
                if (loadGame) {
                    that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, that.gameService.getCurrentPlayerPosition().index, that.settingsService.options.staticCamera ? 1 : undefined);
                }
                if (this.gameService.isComputerMove) {
                    that.timeoutService(() => {
                        that.setupThrowDice();
                    }, 3000);
                }
            });
        }

        initGame(loadGame?: boolean) {
            this.tradeMode = false;
            this.gameService.initGame(loadGame);
            this.drawingService.initGame();
            if (loadGame) {
                this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
            }
        }

        setupThrowDice() {
            if (this.isBlockedByTutorial("setupthrow")) {
                return;
            }
            if (this.gameService.canThrowDice) {
                this.executeTutorialCallback("setupthrow");
                this.gameService.throwDice();
                this.setAvailableActions();
                this.commandPanelBottomOffset = 2;
                this.drawingService.setupDiceForThrow(this.scene);
                $.when(this.drawingService.moveCameraForDiceThrow(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition())).done(() => {
                    var that = this;
                    this.scope.$apply(() => {
                        this.executeTutorialCallback("throw");
                    });
                    if (this.gameService.isComputerMove) {
                        this.throwDice(this.drawingService.getRandomPointOnDice());
                    }
                });
            }
        }

        throwDice(impulsePoint?: BABYLON.Vector3) {
            if (this.gameService.gameState === Model.GameState.ThrowDice) {
                this.diceThrowCompleted = $.Deferred();
                this.drawingService.animateDiceThrow(this.scene, impulsePoint);
                var that = this;
                $.when(this.diceThrowCompleted).done(() => {
                    that.diceThrowCompleted = undefined;
                    var diceResult = that.drawingService.getDiceResult();
                    if (diceResult && diceResult > 0) {
                        that.gameService.setDiceResult(diceResult);
                        that.drawingService.unregisterPhysicsMeshes(that.scene);
                        that.movePlayer();
                    } else {
                        // something went wrong - unable to determine dice orientation; just drop it again from a height
                        that.resetOverboardDice(new BABYLON.Vector3(0, -1, 0));
                        that.drawingService.unregisterPhysicsMeshes(that.scene);
                        that.throwDice();
                    }
                });
            }
        }

        // move player to a destination defined by last dice throw or by explicit parameter value (as requested by an event card, for instance)
        movePlayer(newPositionIndex?: number, backwards?: boolean, doubleRent?: boolean): JQueryDeferred<{}> {
            var d = $.Deferred();
            var oldPosition = this.gameService.getCurrentPlayerPosition();
            var newPosition = this.gameService.moveCurrentPlayer(newPositionIndex, doubleRent);
            var cameraMovementCompleted = this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, oldPosition.index);
            var that = this;
            $.when(cameraMovementCompleted).done(() => {
                cameraMovementCompleted = that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, oldPosition.index, 30, true);
                $.when(cameraMovementCompleted).done(() => {
                    var animateMoveCompleted: JQueryDeferred<{}>;
                    var followBoardAnimation: JQueryDeferred<{}> = $.Deferred();
                    if (newPosition) {
                        that.playerMoving = true;
                        that.playRocketSound();
                        animateMoveCompleted = that.animateMove(oldPosition, newPosition, newPositionIndex !== undefined, backwards);
                        //var positionsToMove = oldPosition.index < newPosition.index ? newPosition.index - oldPosition.index : (40 - oldPosition.index) + newPosition.index;
                        var positionsToMove = backwards ? (newPosition.index <= oldPosition.index ? oldPosition.index - newPosition.index : 40 - newPosition.index + oldPosition.index) :
                            newPosition.index >= oldPosition.index ? newPosition.index - oldPosition.index : 40 - oldPosition.index + newPosition.index;

                        that.followBoardFields(oldPosition.index, positionsToMove, that.drawingService, that.scene, that.gameCamera, that, followBoardAnimation, newPositionIndex !== undefined, backwards);
                    } else {
                        animateMoveCompleted = $.Deferred().resolve();
                        followBoardAnimation = $.Deferred().resolve();
                    }
                    $.when.apply($, [animateMoveCompleted, followBoardAnimation]).done(() => {
                        that.playerMoving = false;
                        that.playRocketSound(true);
                        that.scope.$apply(() => {
                            that.setAvailableActions();
                            $.when(that.processDestinationField()).done(() => {
                                that.gameService.moveProcessingDone();
                                if (that.gameService.isComputerMove && (that.gameService.canEndTurn || that.gameService.canSurrender || that.gameService.canGetOutOfJail)) {
                                    // since movePlayer() can be executed several times during a single move, we must ensure this block only runs once
                                    var computerActions: JQueryDeferred<{}> = $.Deferred();
                                    that.processComputerActions(computerActions);
                                    $.when(computerActions).done((anotherMove) => {
                                        if (!anotherMove) {
                                            // end the turn after processing, unless one of the computer actions resulted in another move 
                                            // (for instance, if computer bailed out of jail)
                                            that.endTurn();
                                        }
                                        that.updatePlayersForView();
                                        that.setAvailableActions();
                                        d.resolve();
                                    });
                                } else {
                                    that.timeoutService(() => {
                                        that.scope.$apply(() => {
                                            that.setAvailableActions();
                                        });
                                    });
                                    d.resolve();
                                }
                            });
                        });
                    });
                });
            });
            return d;
        }

        private processComputerActions(allActionsProcessed: JQueryDeferred<{}>, skipBuyingHouses?: boolean) {
            var actions = this.aiService.afterMoveProcessing(skipBuyingHouses);
            var computerActions = $.Deferred();
            var tradeActions = $.Deferred();
            if (actions.length === 0 || actions.filter(a => a.actionType === Model.AIActionType.Trade).length === 0) {
                tradeActions.resolve();
            }
            if (actions.length > 0) {
                var tradingAlreadyProcessed = false; // allow at most one trading action per processing sequence
                var tradeSkipped = false;
                actions.forEach(action => {
                    if (action.actionType === Model.AIActionType.Buy) {
                        this.buy();
                    }
                    if (action.actionType === Model.AIActionType.Mortgage || action.actionType === Model.AIActionType.Unmortgage) {
                        this.toggleMortgageAsset(action.asset);
                    }
                    if (action.actionType === Model.AIActionType.SellHouse || action.actionType === Model.AIActionType.SellHotel) {
                        this.gameService.removeHousePreview(this.currentPlayer, action.position);
                        if (this.gameService.commitHouseOrHotel(this.currentPlayer, 0, action.asset.group)) {
                            var viewBoardField = this.boardFields.filter(f => f.index === action.position)[0];
                            this.drawingService.setBoardFieldHouses(viewBoardField, action.asset.houses, action.asset.hotel, undefined, undefined, this.scene);
                            this.showMessage(this.currentPlayer + " sold " + (action.actionType === Model.AIActionType.SellHouse ? "a " + this.theme.house : this.theme.hotel) + " on " + action.asset.name + ".");
                        }
                    }
                    if (action.actionType === Model.AIActionType.BuyHouse || action.actionType === Model.AIActionType.BuyHotel) {
                        for (var i = 0; i < action.numHousesOrHotels; i++)
                        {
                            this.gameService.addHousePreviewForGroup(this.currentPlayer, action.assetGroup);
                            if (!this.gameService.commitHouseOrHotel(this.currentPlayer, 0, action.assetGroup)) {
                                // TODO: something wrong; log an error, at least
                            }
                        }
                        var groupFields = this.gameService.getGroupBoardFields(action.assetGroup);
                        groupFields.forEach(groupField => {
                            var viewBoardFieldWithHouse = this.boardFields.filter(f => f.index === groupField.index)[0];
                            this.drawingService.setBoardFieldHouses(viewBoardFieldWithHouse, groupField.asset.houses, groupField.asset.hotel, undefined, undefined, this.scene);                            
                        });
                        this.showMessage(this.currentPlayer + " bought " + action.numHousesOrHotels + " " + (action.actionType === Model.AIActionType.BuyHouse ? this.theme.house : this.theme.hotel) + "s.");

                    }
                    if (action.actionType === Model.AIActionType.Surrender) {
                        this.doSurrender();
                    }
                    if (action.actionType === Model.AIActionType.GetOutOfJail) {
                        this.getOutOfJail();
                    }
                    if (action.actionType === Model.AIActionType.Trade && !tradingAlreadyProcessed) {
                        tradingAlreadyProcessed = true;
                        if (!action.tradeState.secondPlayer.human) {
                            this.tradeService.executeTrade(action.tradeState);
                            // redraw board field owner boxes
                            this.redrawTradeBoardFields(action.tradeState);
                            this.updatePlayersForView();
                            this.showTradeMessage(action.tradeState);
                            tradeActions.resolve();
                        } else {
                            //var that = this;
                            //var player1MoneyMsg = action.tradeState.firstPlayerMoney ? (" and " + that.themeService.theme.moneySymbol + action.tradeState.firstPlayerMoney) : "";
                            //var player2MoneyMsg = action.tradeState.secondPlayerMoney ? (" and " + that.themeService.theme.moneySymbol + action.tradeState.secondPlayerMoney) : "";
                            //sweetAlert({
                            //    title: "Trade message for " + action.tradeState.secondPlayer.playerName,
                            //    text: action.tradeState.firstPlayer.playerName + " wants to trade " + (action.tradeState.firstPlayerSelectedAssets.length > 0 ? action.tradeState.firstPlayerSelectedAssets[0].name : "no assets") + player1MoneyMsg + " for " + (action.tradeState.secondPlayerSelectedAssets.length > 0 ? action.tradeState.secondPlayerSelectedAssets[0].name : "no assets") + player2MoneyMsg + ". Do you wish to accept the trade offer?",
                            //    type: "info",
                            //    showCancelButton: true,
                            //    confirmButtonText: "Yes",
                            //    cancelButtonText: "No"
                            //},
                            //    isConfirm => {
                            //        if (isConfirm) {
                            //            that.tradeService.executeTrade(action.tradeState);
                            //            // redraw board field owner boxes
                            //            this.redrawTradeBoardFields(action.tradeState);
                            //            this.updatePlayersForView();
                            //            this.showTradeMessage(action.tradeState);
                            //        }
                            //        tradeActions.resolve();
                            //    });
                            var viewPlayer = this.players.filter(p => p.name === action.tradeState.secondPlayer.playerName)[0];
                            if (!viewPlayer.numTurnsToWaitBeforeTrade || viewPlayer.numTurnsToWaitBeforeTrade === 0) {
                                var that = this;
                                sweetAlert({
                                        title: "Trade message for " + action.tradeState.secondPlayer.playerName,
                                        text: action.tradeState.secondPlayer.playerName + ", " + action.tradeState.firstPlayer.playerName + " has a trade offer for you.",
                                        type: "info",
                                        showCancelButton: true,
                                        confirmButtonText: "Let me see",
                                        cancelButtonText: "Not now"
                                    },
                                    isConfirm => {
                                        if (isConfirm) {
                                            $("#commandPanel").hide();
                                            that.tradeWith(action.tradeState.secondPlayer.playerName, tradeActions);
                                            var tradeState = that.tradeService.getTradeState();
                                            tradeState.initializeFrom(action.tradeState);
                                            that.makeTradeOffer();
                                        } else {
                                            // trade, initiated by the computer, has been rejected by the human player - set the counter to avoid the player being flooded by trade offers
                                            viewPlayer.numTurnsToWaitBeforeTrade = 5;
                                            tradeActions.resolve();
                                        }
                                    });
                            } else {
                                tradeSkipped = true;
                                tradeActions.resolve();
                            }
                        }
                    }
                });
                // give other players time to catch up with computer's actions
                this.timeoutService(() => {
                    computerActions.resolve();
                }, !tradeSkipped || actions.length > 1 ? 3000 : 0);
            } else {
                if (this.gameService.anyFlyByEvents) {
                    // give other players time to catch up with computer's actions
                    this.timeoutService(() => {
                        computerActions.resolve();
                    }, 3000);
                } else {
                    computerActions.resolve();
                }
            }
            var that = this;
            $.when.apply($, [computerActions, tradeActions]).done(() => {
                if (actions.length > 0 && actions.every(a => a.actionType !== Model.AIActionType.GetOutOfJail && a.actionType !== Model.AIActionType.Surrender)) {
                    // if any action, beside getting out of jail or surrendering, has been processed, repeat until there are no more actions for the computer to perform
                    that.processComputerActions(allActionsProcessed);
                } else {
                    allActionsProcessed.resolve(actions.length > 0 && actions.some(a => a.actionType === Model.AIActionType.GetOutOfJail));
                }
            });
        }

        // animate game camera by following board fields from player current field to its movement destination field; this animation occurs at the same time that the player is moving
        private followBoardFields(positionIndex: number, positionsLeftToMove: number, drawingService: Interfaces.IDrawingService, scene: BABYLON.Scene, camera: BABYLON.FreeCamera, gameController: GameController, followBoardAnimation: JQueryDeferred<{}>, fast?: boolean, backwards?: boolean) {
            if (positionsLeftToMove > 0) {
                var numFrames = 0;
                var processedEvent: Model.ProcessingEvent;
                do {
                    if (backwards) {
                        positionIndex--;
                        if (positionIndex < 0) {
                            positionIndex = 40 + positionIndex;
                        }
                    } else {
                        positionIndex = (positionIndex + 1) % 40;
                    }

                    positionsLeftToMove--;
                    var numFramesOneField = positionIndex % 10 === 0 ? drawingService.framesToMoveOneBoardField * 2 : drawingService.framesToMoveOneBoardField;
                    if (fast) {
                        numFramesOneField = Math.floor(numFramesOneField / 2);
                    }
                    numFrames += numFramesOneField;
                    processedEvent = gameController.gameService.processFlyBy(positionIndex, backwards);
                } while (positionIndex % 10 !== 0 && positionsLeftToMove > 0 && processedEvent === Model.ProcessingEvent.None);

                var cameraMoveCompleted = drawingService.returnCameraToMainPosition(scene, camera, positionIndex, numFrames, true);
                $.when(cameraMoveCompleted).done(() => {
                    if (processedEvent !== Model.ProcessingEvent.None) {
                        gameController.timeoutService(() => {
                            gameController.scope.$apply(() => {
                                gameController.updatePlayersForView();
                            });
                        });
                    }
                    gameController.showMessageForEvent(processedEvent);
                    gameController.followBoardFields(positionIndex, positionsLeftToMove, drawingService, scene, camera, gameController, followBoardAnimation, fast, backwards);
                });
            } else {
                followBoardAnimation.resolve();
            }
        }

        buy() {
            var bought = this.gameService.buy();
            if (bought) {
                var boardField = this.gameService.getCurrentPlayerPosition();
                this.drawingService.setBoardFieldOwner(this.boardFields.filter(f => f.index === boardField.index)[0], boardField.asset, this.scene, true);
                this.showMessage(this.currentPlayer + " bought " + boardField.asset.name + " for " + this.theme.moneySymbol + boardField.asset.price + ".");
                this.updatePlayersForView();
            }
            this.setAvailableActions();
        }

        manage() {
            if (!this.manageMode) {
                if (this.isBlockedByTutorial("manage")) {
                    return;
                }

                this.manageMode = true;
                this.actionButtonsVisible = false;
                this.focusedAssetGroupIndex = this.gameService.manage();
                this.gameCameraPosition = new BABYLON.Vector3(this.gameCamera.position.x, this.gameCamera.position.y, this.gameCamera.position.z);
                this.gameCameraRotation = new BABYLON.Vector3(this.gameCamera.rotation.x, this.gameCamera.rotation.y, this.gameCamera.rotation.z);
                this.setupManageHighlight(true);
                this.setAvailableActions();
                $("#commandPanel").hide();
                $("#manageCommandPanel").addClass("panelShown");
                $("#manageCommandPanel").show();
                if (this.tutorial) {
                    this.tutorialService.initManageModeTutorial(this.scope);
                }
                //var that = this;
                //this.timeoutService(() => { $(window).on("click", null, that, that.handleClickEvent); }, 1000, false);
                //this.scope.$evalAsync(() => { $(window).on("click", null, that, that.handleClickEvent); });

                //$(window).on("click", null, this, this.handleClickEvent);
            }
        }

        returnFromManage() {
            this.manageMode = false;
            //$(window).off("click", this.handleClickEvent);
            this.closeAssetManagementWindow();            
            //this.scene.activeCamera = this.gameCamera;
            this.gameCamera.position = new BABYLON.Vector3(this.gameCameraPosition.x, this.gameCameraPosition.y, this.gameCameraPosition.z);
            this.gameCamera.rotation = new BABYLON.Vector3(this.gameCameraRotation.x, this.gameCameraRotation.y, this.gameCameraRotation.z);

            this.gameService.returnFromManage();
            if (this.tutorialService.isActive) {
                this.tutorialService.endCurrentSection();
            }
            this.drawingService.returnFromManage(this.scene);
            this.setAvailableActions();
            this.actionButtonsVisible = false;
            this.toggleManageCommandPanel(true);
            // show command panel in the next event loop iteration to avoid its mouse event handler to process this event by highlighting one of its buttons
            this.timeoutService(() => {
                $("#commandPanel").show();
            });           
        }

        trade() {
            if (this.gameService.canTrade) {
                $("#commandPanel").hide();
                var players = this.gameService.getPlayersForTrade();
                var that = this;
                if (players.length === 2) {
                    var secondPlayer = this.gameService.players.filter(p => p.playerName !== this.currentPlayer)[0];
                    this.tradeWith(secondPlayer.playerName, undefined);
                } else {
                    $("[name|='tradeButtonPlayer']").hide();
                    this.gameService.players.forEach((p, i) => {
                        if (p.playerName !== that.currentPlayer && players.filter(playerForTrade => playerForTrade.playerName === p.playerName).length > 0) {
                            $("[name='tradeButtonPlayer-" + (i + 1) + "']").show();
                        }
                    });
                    var theHtml = $("#playersForTrade").html();
                    // compile the HTML that will be inserted into the modal dialog so that the angular events will fire
                    var compiledHtml = this.compileService(theHtml)(this.scope);
                    sweetAlert({
                        title: "Choose player to trade with",
                        text: theHtml,
                        html: true,
                        showCancelButton: false,
                        confirmButtonText: "Cancel"
                    },
                        isConfirm => {
                            $("#commandPanel").show();
                        });
                    // finally, inject the compiled elements into the DOM
                    $(".sweet-alert [name='playersForTradeTable']").replaceWith(compiledHtml);
                }
            }
        }

        tradeWith(playerToTradeWith: string, tradeActions: JQueryDeferred<{}>) {
            sweetAlert.close();
            var firstPlayer = this.gameService.players.filter(p => p.playerName === this.currentPlayer)[0];
            var secondPlayer = this.gameService.players.filter(p => p.playerName === playerToTradeWith)[0];
            if (!firstPlayer || !secondPlayer) {
                return;
            }
            this.gameService.trade();
            this.tradeMode = true;
            var treeContainer: any = $("#leftTree");
            // fix the height so that it does not increase after additional data is added into container
            $("#leftTree").css("max-height", $("#leftTree").height() + "px");
            $("#leftTree").css("height", $("#leftTree").height() + "px");            
            this.tradeService.start(firstPlayer, secondPlayer, this.scope, tradeActions);
            var data = this.tradeService.buildAssetTree(this.tradeService.buildPlayerAssetList(firstPlayer));
            treeContainer.jstree({
                'core': {
                    'data': data,
                    worker: false,
                    "themes": { "stripes": true, dots: false, variant: "large", responsive: true, icons: false }
                }
            });
            treeContainer.on("activate_node.jstree", this, this.onActivateTradeNode);
            treeContainer = $("#rightTree");
            // fix the height so that it does not increase after additional data is added into container
            $("#rightTree").css("max-height", $("#rightTree").height() + "px");
            $("#rightTree").css("height", $("#rightTree").height() + "px");            
            data = this.tradeService.buildAssetTree(this.tradeService.buildPlayerAssetList(secondPlayer));
            treeContainer.jstree({
                'core': {
                    'data': data,
                    worker: false,
                    "themes": { "stripes": true, dots: false, variant: "large", responsive: true, icons: false }
                }
            });
            treeContainer.on("activate_node.jstree", this, this.onActivateTradeNode);
            var that = this;

            this.player1MoneySlider = {
                value: this.tradeService.getTradeState().firstPlayerMoney,
                options: {
                    floor: 0,
                    ceil: this.tradeService.getTradeState().firstPlayer.money,
                    showSelectionBar: true,
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    onChange: function (id) {
                        that.tradeService.getTradeState().firstPlayerMoney = that.player1MoneySlider.value;
                        that.tradeService.setCounterOffer();
                    }
                }
            };
            this.player2MoneySlider = {
                value: this.tradeService.getTradeState().secondPlayerMoney,
                options: {
                    floor: 0,
                    ceil: this.tradeService.getTradeState().secondPlayer.money,
                    showSelectionBar: true,
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    onChange: function (id) {
                        that.tradeService.getTradeState().secondPlayerMoney = that.player2MoneySlider.value;
                        that.tradeService.setCounterOffer();
                    }
                }
            };
            this.rootScope.$broadcast('rzSliderForceRender');

            // fix the height so that it does not increase after additional data is added into container
            //$("#firstPlayerSelectedAssets").css("max-height", $("#firstPlayerSelectedAssets").height() + "px");
            //$("#firstPlayerSelectedAssets").css("height", $("#firstPlayerSelectedAssets").height() + "px");            
            //$("#secondPlayerSelectedAssets").css("max-height", $("#secondPlayerSelectedAssets").height() + "px");
            //$("#secondPlayerSelectedAssets").css("height", $("#secondPlayerSelectedAssets").height() + "px");            
        }

        returnFromTrade(execute: boolean) {
            if (this.tradeMode) {
                this.gameService.returnFromTrade();
                this.tradeMode = false;
                var treeContainer: any = $("#leftTree");
                treeContainer.jstree("destroy");
                treeContainer = $("#rightTree");
                treeContainer.jstree("destroy");
                //$("#player1TradeMoney").slider("destroy");
                //$("#player2TradeMoney").slider("destroy");
                var that = this;
                // show command panel in the next event loop iteration to avoid its mouse event handler to process this event by highlighting one of its buttons
                this.timeoutService(() => {
                    $("#commandPanel").show();
                    var tradeState = this.tradeService.getTradeState();
                    if (execute) {
                        // redraw board field owner boxes
                        that.redrawTradeBoardFields(tradeState);
                        that.updatePlayersForView();
                        that.showTradeMessage(tradeState);
                    }
                    if (tradeState.tradeActions) {
                        tradeState.tradeActions.resolve();
                    }
                });           
            }
        }

        endTurn() {
            if (this.gameService.canEndTurn) {
                var viewPlayer = this.players.filter(p => p.name === this.currentPlayer)[0];
                if (viewPlayer.numTurnsToWaitBeforeTrade && viewPlayer.numTurnsToWaitBeforeTrade > 0) {
                    viewPlayer.numTurnsToWaitBeforeTrade--;
                }
                var activePlayer = this.currentPlayer;
                this.gameService.endTurn();
                this.gameService.saveGame();
                var that = this;
                if (activePlayer === this.currentPlayer) {
                    this.showMessage(this.currentPlayer + " has been granted another turn.");
                } else {
                    this.showMessage(this.currentPlayer + " is starting his turn.");
                }
                this.timeoutService(() => {
                    that.scope.$apply(() => {
                        this.commandPanelBottomOffset = this.settingsService.options.staticCamera ? 20 : 2;
                        that.setAvailableActions();
                    });
                });
                $.when(this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition().index)).done(() => {
                    if (that.gameService.isComputerMove) {
                        var computerActions: JQueryDeferred<{}> = $.Deferred();
                        that.processComputerActions(computerActions);
                        $.when(computerActions).done(() => {
                            that.updatePlayersForView();
                            that.timeoutService(() => {
                                that.setupThrowDice();
                            }, 700);
                        });
                    }
                });
            }
        }

        pause() {
            if (this.isBlockedByTutorial("pause")) {
                return;
            }
            this.gameService.saveGame();
            //this.drawingService.cleanup(this.scene);
            //this.scene = undefined;
            this.stateService.go("pause");
        }

        closeAssetManagementWindow() {            
            $("#assetManagement").removeClass("assetManagementShown");
            $("#assetManagement").hide();
            this.showManageCommandPanel();                
        }

        executeConfirmAction(data: any) {
            this.confirmButtonCallback(data);
        }

        executeCancelAction(data: any) {
            this.cancelButtonCallback(data);
        }

        showMessageForEvent(processingEvent: Model.ProcessingEvent) {
            if (processingEvent === Model.ProcessingEvent.None) {
                return;
            } else if (processingEvent === Model.ProcessingEvent.PassGoAward) {
                this.showMessage(this.gameService.getCurrentPlayer() + " passed START and received " + this.themeService.theme.moneySymbol + this.settingsService.settings.rules.passStartAward + ".");
            }
        }

        makeTradeOffer() {
            this.timeoutService(() => {
                this.unhighlightTradeButton($(".highlightedTradeButton"));
            });
            if (this.tradeService.makeTradeOffer()) {
                var that = this;
                sweetAlert({
                    title: "Trade confirmation",
                    text: "Your trade offer has been accepted!",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                },
                    isConfirm => {
                        that.returnFromTrade(true);
                    });
            }
        }

        acceptTradeOffer() {
            this.tradeService.acceptTradeOffer();
            this.returnFromTrade(true);
            //this.unhighlightTradeButton($(".highlightedTradeButton"));
        }

        toggleMortgageConfirm() {
            if (this.gameService.canMortgage(this.assetToManage)) {
                var that = this;
                var dialogText;
                if (!this.assetToManage.mortgage) {
                    dialogText = "Do you wish to mortgage " + this.assetToManage.name + " for " + this.themeService.theme.moneySymbol + this.assetToManage.valueMortgage + "?";
                } else {
                    dialogText = "Do you wish to pay off mortgage " + this.assetToManage.name + " for " + this.themeService.theme.moneySymbol + (Math.floor(this.assetToManage.valueMortgage * 1.1)) + "?";
                }
                sweetAlert({
                        title: "Mortgage confirmation",
                        text: dialogText,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No"
                    },
                    isConfirm => {
                        if (isConfirm) {
                            if (!this.toggleMortgageAsset(this.assetToManage)) {
                                this.showConfirmationPopup("Sorry, you do not have enough money!", true, false);
                            }
                            this.scope.$apply(() => {
                                this.updatePlayersForView();
                            });
                        }
                    });
            }
        }

        toggleMortgageAsset(asset: Model.Asset): boolean {
            var success = this.gameService.toggleMortgageAsset(asset);
            if (success) {
                var viewBoardField = this.boardFields.filter(boardField => boardField.assetName && boardField.assetName === asset.name)[0];
                this.drawingService.setBoardFieldMortgage(viewBoardField, asset, this.scene, true);
                if (asset.mortgage) {
                    this.showMessage(this.currentPlayer + " mortgaged " + asset.name + ".");
                } else {
                    this.showMessage(this.currentPlayer + " released mortgage on " + asset.name + ".");
                }
            }
            return success;
        }

        showConfirmationPopup(text: string, isError: boolean, isSuccess: boolean) {
            sweetAlert({
                title: isError ? "Error" : "Moonopoly message",
                text: text,
                type: isError ? "error" : (isSuccess ? "success" : "info"),
                confirmButtonText: "Ok",
                allowOutsideClick: true
            });
        }

        showActionPopup(text: string, onConfirm: () => any, onCancel: () => any) {
            sweetAlert({
                    title: "Moonopoly message",
                    text: text,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"
                },
                isConfirm => {
                    if (isConfirm) {
                        onConfirm();
                    } else {
                        onCancel();
                    }
                });
        }

        public canMortgageSelected(): boolean {
            return this.gameService.canMortgage(this.assetToManage);
        }

        public getOutOfJail() {
            this.gameService.getOutOfJail();
            this.showMessage(this.currentPlayer + " paid " + this.themeService.theme.moneySymbol + this.gameService.gameParams.jailBail + " to end his quarantine.");
            this.setAvailableActions();
            if (this.gameService.lastDiceResult) {
                this.movePlayer();
            }
        }

        public surrender() {
            var that = this;
            if (this.gameService.canSurrender) {
                this.showActionPopup("Are you sure you wish to surrender?", () => {
                    that.doSurrender();
                    that.endTurn();
                }, () => {});
            }
        }

        private redrawTradeBoardFields(tradeState: Model.TradeState) {
            // redraw board field owner boxes
            var that = this;
            tradeState.firstPlayerSelectedAssets.forEach(firstPlayerAsset => {
                var boardField = that.boardFields.filter(f => f.assetName === firstPlayerAsset.name)[0];
                that.drawingService.setBoardFieldOwner(boardField, firstPlayerAsset, that.scene, true);
            });
            tradeState.secondPlayerSelectedAssets.forEach(secondPlayerAsset => {
                var boardField = that.boardFields.filter(f => f.assetName === secondPlayerAsset.name)[0];
                that.drawingService.setBoardFieldOwner(boardField, secondPlayerAsset, that.scene, true);
            });
        }

        private doSurrender() {
            if (this.gameService.canSurrender) {
                this.clearCurrentPlayerFromBoard();
                this.gameService.surrender();
                this.showMessage(this.currentPlayer + " has surrendered!");
                this.setAvailableActions();
                if (this.gameService.gameState === Model.GameState.EndOfGame) {
                    this.showConfirmationPopup(this.gameService.winner + " has won the game!", false, true);
                }
            }
        }

        private createScene(): JQueryDeferred<{}> {
            var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
            this.gameEngine = new BABYLON.Engine(canvas, true);
            var d = this.createBoard(this.gameEngine, canvas);
            //BABYLON.Scene.MaxDeltaTime = 30.0;
            var that = this;
            this.gameEngine.runRenderLoop(() => {
                if (that.scene) {
                    if (that.gameService.gameState === Model.GameState.Move || that.gameService.gameState === Model.GameState.Process) {
                        that.scene.render();
                    } else {
                        // not sure why, but the input handlers starve unless the render loop is re-inserted in the queue using a timeout service
                        that.timeoutService(() => {
                            if (that.scene) {
                                if (that.gameService.gameState === Model.GameState.ThrowDice && that.diceThrowCompleted) {
                                    // if the game is at the dice throw state and the dice throw has been triggered, verify if it is done, otherwise just follow with the camera
                                    if (that.drawingService.isDiceAtRestAfterThrowing(that.scene)) {
                                        that.diceThrowCompleted.resolve();
                                    } else {
                                        var dicePhysicsLocation = that.drawingService.getDiceLocation(that.scene);
                                        if (dicePhysicsLocation) {
                                            that.resetOverboardDice(dicePhysicsLocation);
                                            that.gameCamera.setTarget(new BABYLON.Vector3(dicePhysicsLocation.x, dicePhysicsLocation.y, dicePhysicsLocation.z));
                                            if (that.drawingService.diceIsColliding()) {
                                                that.playBounceSound();
                                            }
                                        }
                                    }
                                }
                                that.scene.render();
                            }
                        }, 1, false);
                    }
                }
            });

            // Watch for browser/canvas resize events
            window.addEventListener("resize", this.resizeEventListener);
            return d;
        }

        private resizeEventListener() {
            //this.gameEngine.resize();
            var windowAny: any = window;
            var gameEngine: any = windowAny.gameEngine;
            if (gameEngine) {
                gameEngine.resize();
            }
        }

        private createBoard(engine, canvas): JQueryDeferred<{}> {
            var d = $.Deferred();
            // This creates a basic Babylon Scene object (non-mesh)
            this.scene = new BABYLON.Scene(engine);
            this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            //this.scene.setGravity(new BABYLON.Vector3(0, -10, 0));

            // This creates and positions a free camera (non-mesh)
            this.gameCamera = new BABYLON.FreeCamera("camera1", BABYLON.Vector3.Zero(), this.scene);
            this.drawingService.setGameCameraInitialPosition(this.gameCamera);
            this.scene.activeCamera = this.gameCamera;

            // This attaches the camera to the canvas
            //this.gameCamera.attachControl(canvas, true);

            //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), this.scene);
            //light.intensity = 0.35;
            //var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, -1), this.scene);
            //light2.intensity = 0.35;
            //var light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(6, 27, 6), this.scene);
            //light3.intensity = 0.55;

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), this.scene);
            light.intensity = 0.43;
            light.diffuse = new BABYLON.Color3(1, 1, 1);
            light.specular = new BABYLON.Color3(1, 1, 1);
            light.groundColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, -1), this.scene);
            light2.intensity = 0.43;
            light2.diffuse = new BABYLON.Color3(1, 1, 1);
            light2.specular = new BABYLON.Color3(1, 1, 1);
            light2.groundColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            var light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(12, 27, 12), this.scene);
            light3.intensity = 0.58;

            var shadowGenerator: BABYLON.ShadowGenerator = undefined;
            if (this.settingsService.options.shadows) {
                shadowGenerator = new BABYLON.ShadowGenerator(1024, light3);
                shadowGenerator.bias = 0.00001;
                //shadowGenerator.usePoissonSampling = true;
                shadowGenerator.useVarianceShadowMap = true;
                //shadowGenerator.useBlurVarianceShadowMap = true;
            }

            this.drawingService.createBoard(this.scene, []);
            this.initPlayers();            
            var meshLoads = this.drawingService.loadMeshes(this.players, this.scene, shadowGenerator, this);
            var that = this;
            $.when.apply($, meshLoads).done(() => {
                that.setupPlayerPositions(that);
                that.setupBoardFields();
                d.resolve();
            });
            
            return d;
        }

        private initPlayers() {
            this.players = [];
            var that = this;
            var index = 0;
            this.gameService.players.forEach((player) => {
                var playerModel = new Viewmodels.Player();
                playerModel.name = player.playerName;
                playerModel.money = player.money;
                playerModel.index = index;
                playerModel.color = this.getColor(player.color);
                playerModel.active = player.active;
                that.playerModels.push(playerModel);
                index++;
            });
        }

        private getColor(playerColor: Model.PlayerColor): string {
            if (playerColor === Model.PlayerColor.Blue) {
                return "#4C4CFF";
            } else if (playerColor === Model.PlayerColor.Red) {
                return "#FF4C4C";
            } else if (playerColor === Model.PlayerColor.Green) {
                return "#4CFF4C";
            } else if (playerColor === Model.PlayerColor.Yellow) {
                return "#FFFF4C";
            }

            return "#000000";
        }

        private setupBoardFields() {
            this.boardFields = [];
            for (var i = 0; i < 40; i++) {
                var boardField = new Viewmodels.BoardField();
                boardField.index = i;
                this.boardFields.push(boardField);
            }
            for (var assetGroup = Model.AssetGroup.First; assetGroup <= Model.AssetGroup.Railway; assetGroup++) {
                var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                groupBoardFields.forEach(groupBoardField => {
                    var viewBoardField = this.boardFields.filter(f => f.index === groupBoardField.index)[0];
                    viewBoardField.assetName = groupBoardField.asset.name;
                    if (!groupBoardField.asset.unowned) {
                        this.drawingService.setBoardFieldOwner(viewBoardField, groupBoardField.asset, this.scene, false);
                    }
                });
            }
        }

        private setupPlayerPositions(that: GameController) {
            that.players.forEach((playerModel) => {
                if (playerModel.active) {
                    that.drawingService.positionPlayer(playerModel);
                }
            });
        }

        private setAvailableActions() {
            this.availableActions.endTurn = !this.gameService.isComputerMove && this.gameService.canEndTurn;
            this.availableActions.throwDice = !this.gameService.isComputerMove && this.gameService.canThrowDice;
            this.availableActions.buy = !this.gameService.isComputerMove && this.gameService.canBuy;
            this.availableActions.manage = !this.gameService.isComputerMove && this.gameService.canManage;
            this.availableActions.trade = !this.gameService.isComputerMove && this.gameService.canTrade;
            this.availableActions.getOutOfJail = !this.gameService.isComputerMove && this.gameService.canGetOutOfJail;
            this.availableActions.surrender = !this.gameService.isComputerMove && this.gameService.canSurrender;
            this.availableActions.pause = (!this.gameService.isComputerMove || this.gameService.players.filter(p => p.active && p.human).length === 0) && this.gameService.canPause;
        }

        private animateMove(oldPosition: Model.BoardField, newPosition: Model.BoardField, fast?: boolean, backwards?: boolean): JQueryDeferred<{}> {
            var playerModel = this.players.filter(p => p.name === this.gameService.getCurrentPlayer())[0];
            return this.drawingService.animatePlayerMove(oldPosition, newPosition, playerModel, this.scene, fast, backwards);
        }

        private processDestinationField(): JQueryDeferred<{}> {
            var d = $.Deferred();
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Asset) {
                $.when(this.processAssetField(this.gameService.getCurrentPlayerPosition())).done(() => { d.resolve(); });                
            }
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Treasure || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Event) {
                $.when(this.processCardField(this.gameService.getCurrentPlayerPosition())).done(() => {
                    d.resolve();
                });
            }
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Tax || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.TaxIncome) {
                $.when(this.processTaxField(this.gameService.getCurrentPlayerPosition().type)).done(() => {
                    d.resolve();
                });                
            }
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.GoToPrison) {
                $.when(this.processGoToPrisonField()).done(() => {
                    d.resolve();
                });
            } else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.PrisonAndVisit) {
                this.processPrisonField();
                d.resolve();
            } else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.FreeParking) {
                d.resolve();
            } else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Start) {
                d.resolve();
            }
            return d;
        }

        private processAssetField(position: Model.BoardField): JQueryDeferred<{}> {
            var d = $.Deferred();
            this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
            if (!position.asset.unowned && position.asset.owner !== this.gameService.getCurrentPlayer()) {
                var result = this.gameService.processOwnedFieldVisit();
                if (result.message) {
                    this.showMessage(result.message);
                    if (this.gameService.isComputerMove) {
                        // give other players time to catch up with computer's actions
                        this.timeoutService(() => {
                            d.resolve();
                        }, 3000);
                    } else {
                        d.resolve();
                    }
                } else {
                    d.resolve();
                }
                this.updatePlayersForView();
            } else {
                d.resolve();
            }
            return d;
        }

        private showMessage(message: string) {
            $("#messageOverlay").stop();
            $("#messageOverlay").css({ opacity: 1, top: 0 });
            var overlayOffset = Math.floor(jQuery(window).height() * 0.15);
            $("#messageOverlay").html(message).show().animate({
                top: `-=${overlayOffset}px`,
                opacity: 0
            }, 5000, () => {
                $("#messageOverlay").hide();
                $("#messageOverlay").css({ opacity: 1, top: 0 });
            });
            this.messages.push(message);
            this.refreshMessageHistory();
        }

        private handleSwipe(left: boolean) {
            if (this.manageMode) {
                if (!this.tutorialService.isActive) {
                    this.focusedAssetGroupIndex = this.gameService.manageFocusChange(left);
                    this.setupManageHighlight(true);
                }
            }
        }

        private setupManageHighlight(animate: boolean) {
            this.drawingService.setManageCameraPosition(this.gameCamera, this.focusedAssetGroupIndex, this.scene, animate);
            if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex)) {
                this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
            }            
        }

        private handleClickEvent(eventObject: JQueryEventObject, ...data: any[]) {
            var thisInstance = <GameController>eventObject.data;
            var mouseEventObject: TouchEvent;
            if (thisInstance.tutorialService.isActive && thisInstance.tutorialService.canAdvanceByClick && $("#tutorialMessage:visible").length > 0) {
                thisInstance.scope.$apply(() => {
                    thisInstance.tutorialService.advanceToNextStep();
                });
                return;
            }
            if (thisInstance.manageMode && !thisInstance.swipeInProgress) {
                mouseEventObject = </*JQueryMouseEventObject*/TouchEvent>eventObject.originalEvent;
                var pickedObject = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                if (pickedObject && pickedObject.pickedObjectType === Viewmodels.PickedObjectType.BoardField) {
                    if ($("#assetManagement").hasClass("assetManagementShown")) {
                        return;
                    }
                    var groupFields = thisInstance.gameService.getBoardFieldsInGroup(thisInstance.focusedAssetGroupIndex);
                    var clickedFields = groupFields.filter(f => f.index === pickedObject.position);
                    if (clickedFields.length > 0) {
                        // user clicked a field that is currently focused - show its details
                        thisInstance.scope.$apply(() => {
                            thisInstance.manageField(clickedFields[0].asset);
                        });
                    }
                } else if (pickedObject && pickedObject.pickedObjectType === Viewmodels.PickedObjectType.AddHouse) {
                    thisInstance.addHousePreview(pickedObject.position);
                } else if (pickedObject && pickedObject.pickedObjectType === Viewmodels.PickedObjectType.RemoveHouse) {
                    thisInstance.removeHousePreview(pickedObject.position);
                }
            }
            if (thisInstance.gameService.gameState === Model.GameState.ThrowDice && !thisInstance.swipeInProgress && !thisInstance.gameService.isComputerMove) {
                mouseEventObject = <TouchEvent>eventObject.originalEvent;
                var pickedObject2 = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                if (pickedObject2 && pickedObject2.pickedObjectType === Viewmodels.PickedObjectType.Dice) {
                    thisInstance.throwDice(pickedObject2.pickedPoint);
                }
            }
        }

        private manageField(asset: Model.Asset) {
            this.assetToManage = asset;
            $("#assetManagement").addClass("assetManagementShown");
            this.toggleManageCommandPanel();
            $("#assetManagement").show();
        }

        private toggleManageCommandPanel(hide?: boolean) {
            if (hide) {
                $("#manageCommandPanel").removeClass("panelShown").addClass("panelHidden");
                $("#manageCommandPanel").hide();
                return;
            }
            if ($("#manageCommandPanel").hasClass("panelShown")) {
                $("#manageCommandPanel").removeClass("panelShown").addClass("panelHidden");
                $("#manageCommandPanel").hide();
            } else {
                $("#manageCommandPanel").removeClass("panelHidden").addClass("panelShown");
                $("#manageCommandPanel").show();
            }
        }

        private showManageCommandPanel() {
            $("#manageCommandPanel").removeClass("panelHidden").addClass("panelShown");
            $("#manageCommandPanel").show();
        }

        private swipeMove(coords: any) {
            this.swipeInProgress = true;
            if (this.manageMode) {
                this.drawingService.onSwipeMove(this.scene, coords);
            }
        }

        private swipeEnd(coords: any, event: any) {
            if (!this.swipeInProgress) {
                return;
            }
            if (this.manageMode) {
                var pickedObject = this.drawingService.onSwipeEnd(this.scene, coords);
                if (pickedObject && pickedObject.pickedObjectType === Viewmodels.PickedObjectType.AddHouse) {
                    //this.addHousePreview(pickedObject.position);
                }
            }
            this.timeoutService(() => this.swipeInProgress = false, 100, false);
        }

        private swipeCancel(event: any) {
            this.swipeInProgress = false;
        }

        private addHousePreview(position: number) {
            if (this.gameService.addHousePreview(this.gameService.getCurrentPlayer(), position)) {
                this.setupActionButtonsForHousePreview(position);
                this.drawingService.showHouseButtons(0, this.scene, this.gameService.getAssetGroup(position));
            }
        }

        private removeHousePreview(position: number) {
            if (this.gameService.removeHousePreview(this.gameService.getCurrentPlayer(), position)) {
                this.setupActionButtonsForHousePreview(position);
                this.drawingService.showHouseButtons(0, this.scene, this.gameService.getAssetGroup(position));
            }
        }

        private setupActionButtonsForHousePreview(position: number) {
            var assetGroup = this.gameService.getBoardFieldGroup(position);
            var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
            var hasUncommittedUpgrades = false;
            groupBoardFields.forEach(field => {
                hasUncommittedUpgrades = hasUncommittedUpgrades || field.asset.hasUncommittedUpgrades();
            });
            this.refreshBoardFieldGroupHouses(0, assetGroup);
            if (hasUncommittedUpgrades) {
                this.setupActionButtons(this.commitHouses, this.rollbackHouses);
            } else {
                var that = this;
                this.scope.$apply(() => {
                    that.actionButtonsVisible = false;
                });
            }            
        }

        private setupActionButtons(confirmCallback: (data: any) => void, cancelCallback: (data: any) => void) {
            this.confirmButtonCallback = confirmCallback;
            this.cancelButtonCallback = cancelCallback;
            this.drawingService.showActionButtons();
            var that = this;
            this.scope.$apply(() => {
                that.actionButtonsVisible = true;
            });            
        }

        private refreshBoardFieldGroupHouses(focusedAssetGroupIndex: number, assetGroup?: Model.AssetGroup) {
            var fields: Array<Model.BoardField>;
            if (!assetGroup) {
                var firstFocusedBoardField = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
                fields = this.gameService.getGroupBoardFields(firstFocusedBoardField.asset.group);
            } else {
                fields = this.gameService.getGroupBoardFields(assetGroup);
            }

            var fieldIndexes = $.map(fields, f => f.index);
            var viewGroupBoardFields = this.boardFields.filter(viewBoardField => $.inArray(viewBoardField.index, fieldIndexes) >= 0);
            var that = this;
            viewGroupBoardFields.forEach(f => {
                var asset = fields.filter(field => f.index === field.index)[0].asset;
                that.drawingService.setBoardFieldHouses(f, asset.houses, asset.hotel, asset.uncommittedHouses, asset.uncommittedHotel, that.scene);
            });
            
        }

        private refreshBoardFieldMortgage() {
            var assetGroups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
            var that = this;
            assetGroups.forEach(assetGroup => {
                var fields = that.gameService.getGroupBoardFields(assetGroup);
                fields.forEach(field => {
                    var viewGroupBoardField = that.boardFields.filter(f => f.index === field.index)[0];
                    if (viewGroupBoardField.mortgageMesh) {
                        that.scene.removeMesh(viewGroupBoardField.mortgageMesh);
                        viewGroupBoardField.mortgageMesh.dispose();
                        viewGroupBoardField.mortgageMesh = undefined;
                    }
                    if (field.asset.mortgage) {
                        that.drawingService.setBoardFieldMortgage(viewGroupBoardField, field.asset, this.scene, false);
                    }
                });
            });

        }

        private commitHouses(data: any) {
            this.gameService.commitHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
            this.actionButtonsVisible = false;
            this.refreshBoardFieldGroupHouses(this.focusedAssetGroupIndex);
            this.updatePlayersForView();
            this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
        }

        private rollbackHouses(data: any) {
            this.gameService.rollbackHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
            this.actionButtonsVisible = false;
            this.refreshBoardFieldGroupHouses(this.focusedAssetGroupIndex);
            this.updatePlayersForView();
            this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
        }

        private updatePlayersForView() {
            var that = this;
            this.gameService.players.forEach(p => {
                var viewPlayer = that.playerModels.filter(model => model.name === p.playerName)[0];
                viewPlayer.active = p.active;
                that.animateAndSetPlayerMoney(viewPlayer, p.money);                
            });
        }

        private processCardField(position: Model.BoardField): JQueryDeferred<{}> {
            var d = $.Deferred();
            var card: Model.Card;
            if (position.type === Model.BoardFieldType.Treasure) {
                card = this.gameService.getNextTreasureCard();
            } else {
                card = this.gameService.getNextEventCard();
            }
            var that = this;
            $.when(this.showCard(card, position.type === Model.BoardFieldType.Treasure ? this.theme.communityChestTitle : this.theme.eventTitle)).done(() => {
                that.gameService.processCard(card);
                that.showMessage(that.getMessageForCard(card, position));
                var addAction = $.Deferred();
                if (card.cardType === Model.CardType.AdvanceToField) {
                    $.when(that.movePlayer(card.boardFieldIndex)).done(() => {
                        addAction.resolve();
                    });
                } else if (card.cardType === Model.CardType.AdvanceToRailway) {
                    var nextRailwayIndex = position.index >= 35 ? 5 : (position.index >= 25 ? 35 : (position.index >= 15 ? 25 : (position.index >= 5 ? 15 : 5)));
                    $.when(that.movePlayer(nextRailwayIndex, false, true)).done(() => {
                        addAction.resolve();
                    });
                } else if (card.cardType === Model.CardType.RetractNumFields) {
                    var newPositionIndex = that.gameService.getCurrentPlayerPosition().index - card.boardFieldCount;
                    if (newPositionIndex < 0) {
                        newPositionIndex = 40 + newPositionIndex;
                    }
                    $.when(that.movePlayer(newPositionIndex, true)).done(() => {
                        addAction.resolve();
                    });
                } else if (card.cardType === Model.CardType.JumpToField) {
                    if (card.boardFieldIndex === 10) {
                        $.when(this.processGoToPrisonField()).done(() => {
                            addAction.resolve();
                        });
                    }
                } else {
                    addAction.resolve();
                }

                $.when(addAction).done(() => {
                    d.resolve();
                    that.timeoutService(() => {
                        that.scope.$apply(() => {
                            that.updatePlayersForView();
                        });
                    });
                });
            });
            return d;
        }

        private processTaxField(boardFieldType: Model.BoardFieldType): JQueryDeferred<{}> {
            var d = $.Deferred();
            var paid = this.gameService.processTax(boardFieldType);
            this.updatePlayersForView();
            this.showMessage(this.currentPlayer + " paid " + this.theme.moneySymbol + paid + " of " +  (boardFieldType === Model.BoardFieldType.TaxIncome ? "ecology tax." : "energy tax."));
            if (this.gameService.isComputerMove) {
                // give time to other players to catch up with computer's actions
                this.timeoutService(() => {
                    d.resolve();
                }, 3000);
            } else {
                d.resolve();
            }
            return d;
        }

        private processGoToPrisonField(): JQueryDeferred<{}> {
            var d = $.Deferred();
            var newPosition = this.gameService.moveCurrentPlayer(10);
            var playerModel = this.players.filter(p => p.name === this.gameService.getCurrentPlayer())[0];
            var moveToPrison = this.drawingService.animatePlayerPrisonMove(newPosition, playerModel, this.scene, this.gameCamera);
            var that = this;
            $.when(moveToPrison).done(() => {
                that.showMessage(that.currentPlayer + " landed in " + this.theme.prison + ".");
                that.gameService.processPrison(true);
                if (that.gameService.isComputerMove) {
                    // give time to other players to catch up with computer's actions
                    that.timeoutService(() => {
                        d.resolve();
                    }, 3000);
                } else {
                    d.resolve();
                }
            }); 
            return d;           
        }

        private processPrisonField() {
            if (this.gameService.processPrison(false)) {
                this.showMessage(this.currentPlayer + " remains in " + this.theme.prison + ".");
            }
        }

        private showCard(card: Model.Card, title: string): JQueryDeferred<{}> {
            var d = $.Deferred();
            this.currentCard.title = title;
            this.currentCard.message = card.message;
            $("#card").show("clip", { }, 500, () => {
                this.timeoutService(4000).then(() => {
                    $("#card").hide("clip", { }, 500, () => {
                        d.resolve();                        
                    });
                });
            });
            return d;
        }

        private getMessageForCard(card: Model.Card, position: Model.BoardField) {
            var type = position.type === Model.BoardFieldType.Treasure ? this.theme.communityChestTitle : this.theme.eventTitle;
            if (card.cardType === Model.CardType.ReceiveMoney) {
                return this.gameService.getCurrentPlayer() + " received " + this.theme.moneySymbol + card.money + " from " + type + ".";
            } else if (card.cardType === Model.CardType.PayMoney) {
                return this.gameService.getCurrentPlayer() + " paid " + this.theme.moneySymbol + card.money + ".";
            } else if (card.cardType === Model.CardType.AdvanceToField) {
                return this.gameService.getCurrentPlayer() + " is advancing to " + this.getBoardFieldName(card.boardFieldIndex) + ".";
            } else if (card.cardType === Model.CardType.RetractNumFields) {
                return this.gameService.getCurrentPlayer() + " is moving back " + card.boardFieldCount + " fields.";
            } else if (card.cardType === Model.CardType.ReceiveMoneyFromPlayers) {
                return this.gameService.getCurrentPlayer() + " received " + this.theme.moneySymbol + card.money + " from each player.";
            } else if (card.cardType === Model.CardType.PayMoneyToPlayers) {
                return this.gameService.getCurrentPlayer() + " paid " + this.theme.moneySymbol + card.money + " to each player.";
            } else if (card.cardType === Model.CardType.Maintenance || card.cardType === Model.CardType.OwnMaintenance) {
                return this.gameService.getCurrentPlayer() + " paid " + this.theme.moneySymbol + card.money + " for maintenance.";
            } else if (card.cardType === Model.CardType.AdvanceToRailway) {
                return this.gameService.getCurrentPlayer() + " is advancing to the next " + this.theme.railroad + ".";
            }
            return this.gameService.getCurrentPlayer() + " landed on " + type + ".";
        }

        private getBoardFieldName(boardFieldIndex: number) {
            if (boardFieldIndex === 0) {
                return "START";
            }

            var group = this.gameService.getBoardFieldGroup(boardFieldIndex);
            if (group) {
                var fields = this.gameService.getGroupBoardFields(group);
                if (fields && fields.length > 0) {
                    var field = fields.filter(f => f.index === boardFieldIndex)[0];
                    return field.asset.name;
                }
            }

            return "";
        }

        private highlightCommandButtons(coords) {
            var elem = $(document.elementFromPoint(coords.x, coords.y));
            this.unhighlightCommandButton($(".highlightedButton"));
            //$(".highlightedButton").addClass("unhighlightedButton").removeClass("highlightedButton");
            if (elem.hasClass("commandButton")) {
                this.highlightCommandButton(elem);
                //elem.addClass("highlightedButton").removeClass("unhighlightedButton");
            }
        }

        private highlightCommandButton(button: JQuery) {
            button.addClass("highlightedButton").removeClass("unhighlightedButton");
            button.parent().children().children(".commandButtonOverlayText").show();
        }

        private unhighlightCommandButton(button: JQuery) {
            button.addClass("unhighlightedButton").removeClass("highlightedButton");
            button.parent().children().children(".commandButtonOverlayText").hide();
        }

        private highlightTradeButtons(coords) {
            var elem = $(document.elementFromPoint(coords.x, coords.y));
            this.unhighlightTradeButton($(".highlightedTradeButton"));
            if (elem.hasClass("tradeButton")) {
                this.highlightTradeButton(elem);
            }
        }

        private highlightTradeButton(button: JQuery) {
            button.addClass("highlightedTradeButton").removeClass("unhighlightedTradeButton");
            button.parent().children().children(".tradeButtonOverlayText").show();
        }

        private unhighlightTradeButton(button: JQuery) {
            button.addClass("unhighlightedTradeButton").removeClass("highlightedTradeButton");
            button.parent().children().children(".tradeButtonOverlayText").hide();
        }


        private bindInputEvents() {
            //$(window).on("click", null, this, this.handleClickEvent);
            var isTouch = (("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0));
            if (!isTouch) {
                $("#renderCanvas").on("click", null, this, this.handleClickEvent);
                $("#tutorialMessage").on("click", null, this, this.handleClickEvent);
            } else {
                if (window.navigator && window.navigator.pointerEnabled) {
                    //$("#renderCanvas").bind("MSPointerDown", this, this.handleClickEvent);
                    //$("#renderCanvas").bind("pointerdown", this, this.handleClickEvent);
                    $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
                    $("#tutorialMessage").bind("touchend", this, this.handleClickEvent);
                } else {
                    $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
                    $("#tutorialMessage").bind("touchend", this, this.handleClickEvent);
                }
            }
            this.swipeService.bind($("#renderCanvas"), {
                'move': (coords) => { this.swipeMove(coords); },
                'end': (coords, event) => { this.swipeEnd(coords, event); },
                'cancel': (event) => { this.swipeCancel(event); }
            });

            $("#commandPanel").mousedown(e => {
                this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
            });
            $("#tradeCommandPanel").mousedown(e => {
                this.highlightTradeButtons({ x: e.clientX, y: e.clientY });
            });
            $("#tradeCommandPanel").bind("touchstart", this, e => {
                var mouseEventObject: TouchEvent = <TouchEvent>e.originalEvent;
                if (mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0) {
                    var thisInstance = <GameController>e.data;
                    thisInstance.highlightTradeButtons({ x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY });
                }
            });
            $("#manageCommandPanel").mousedown(e => {
                this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
            });
            $("#manageCommandPanel").bind("touchstart", this, e => {
                var mouseEventObject: TouchEvent = <TouchEvent>e.originalEvent;
                if (mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0) {
                    var thisInstance = <GameController>e.data;
                    thisInstance.highlightCommandButtons({ x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY });
                }
            });
            $("#commandPanel").mouseup(e => {
                if (!this.swipeInProgress) {
                    this.unhighlightCommandButton($(".commandButton"));
                }
            });
            $("#manageCommandPanel").mouseup(e => {
                if (!this.swipeInProgress) {
                    this.unhighlightCommandButton($("#buttonReturnFromManage"));
                }
            });
            $("#tradeCommandPanel").mouseup(e => {
                if (!this.swipeInProgress) {
                    this.unhighlightTradeButton($("#buttonReturnFromTrade"));
                }
            });

            this.swipeService.bind($("#commandPanel, #tradeCommandPanel"), {
                'move': (coords) => {
                    if (!this.manageMode) {
                        this.swipeInProgress = true;
                        if (this.tradeMode) {
                            this.highlightTradeButtons(coords);
                        } else {
                            this.highlightCommandButtons(coords);
                        }
                    }
                },
                'end': (coords, event) => {
                    if (!this.manageMode) {
                        if (!this.swipeInProgress) {
                            return;
                        }
                        var elem = $(document.elementFromPoint(coords.x, coords.y));
                        if (elem.hasClass("commandButton")) {
                            this.unhighlightCommandButton(elem);
                            elem.click();
                        }
                        if (elem.hasClass("tradeButton")) {
                            this.unhighlightTradeButton(elem);
                            elem.click();
                        }
                        this.timeoutService(() => this.swipeInProgress = false, 100, false);
                    }
                },
                'cancel': (event) => {
                    if (!this.manageMode) {
                        this.swipeInProgress = false;
                    }
                }
            });
        }

        private unbindInputEvents() {
            //$(window).on("click", null, this, this.handleClickEvent);
            var isTouch = (("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0));
            if (!isTouch) {
                $("#renderCanvas").off("click", this.handleClickEvent);
                $("#tutorialMessage").off("click", this.handleClickEvent);
            } else {
                if (window.navigator && window.navigator.pointerEnabled) {
                    //$("#renderCanvas").bind("MSPointerDown", this, this.handleClickEvent);
                    //$("#renderCanvas").bind("pointerdown", this, this.handleClickEvent);
                    $("#renderCanvas").unbind("touchend", this.handleClickEvent);
                    $("#tutorialMessage").unbind("touchend", this.handleClickEvent);
                } else {
                    $("#renderCanvas").unbind("touchend", this.handleClickEvent);
                    $("#tutorialMessage").unbind("touchend", this.handleClickEvent);
                }
            }
            $("#renderCanvas").unbind('mousedown');
            $("#renderCanvas").unbind('mousemove');
            $("#renderCanvas").unbind('mouseup');
            $("#renderCanvas").unbind('touchstart');
            $("#renderCanvas").unbind('touchmove');
            $("#renderCanvas").unbind('touchend');
            $("#renderCanvas").unbind('touchcancel');

            $("#commandPanel").unbind('mousedown');
            $("#tradeCommandPanel").unbind('mousedown');
            $("#tradeCommandPanel").unbind('touchstart');
            $("#manageCommandPanel").unbind('mousedown');
            $("#manageCommandPanel").unbind('touchstart');
            $("#commandPanel").unbind('mouseup');
            $("#manageCommandPanel").unbind('mouseup');
            $("#tradeCommandPanel").unbind('mouseup');

            $("#commandPanel").unbind('mousedown');
            $("#commandPanel").unbind('mousemove');
            $("#commandPanel").unbind('mouseup');
            $("#commandPanel").unbind('touchstart');
            $("#commandPanel").unbind('touchmove');
            $("#commandPanel").unbind('touchend');
            $("#commandPanel").unbind('touchcancel');

            $("#tradeCommandPanel").unbind('mousedown');
            $("#tradeCommandPanel").unbind('mousemove');
            $("#tradeCommandPanel").unbind('mouseup');
            $("#tradeCommandPanel").unbind('touchstart');
            $("#tradeCommandPanel").unbind('touchmove');
            $("#tradeCommandPanel").unbind('touchend');
            $("#tradeCommandPanel").unbind('touchcancel');
        }

        private resetOverboardDice(diceLocation: BABYLON.Vector3) {
            if (diceLocation.y < (this.drawingService.diceHeight / 2) * 0.4) {
                diceLocation.y = (this.drawingService.diceHeight / 2) * 2.2;
                diceLocation.x = 0;
                diceLocation.z = 0;
                this.drawingService.moveDiceToPosition(diceLocation, this.scene);
            }            
        }

        private refreshMessageHistory() {
            $("#messageHistory").empty();
            var lastMessages = this.messages.length > 5 ? this.messages.slice(this.messages.length - 5) : this.messages;
            $.each(lastMessages, (i, message) => {
                if (i === lastMessages.length - 1) {
                    $("#messageHistory").append("<option value='" + i + "' selected>" + message + "</option>");
                } else {
                    $("#messageHistory").append("<option value='" + i + "' disabled>" + message + "</option>");                    
                }
            });
            var messageHistory: any = $("#messageHistory");
            messageHistory.selectmenu("refresh");
        }

        private initMessageHistory() {
            this.messages = [];
            var messageHistory: any = $("#messageHistory");
            messageHistory.selectmenu();
            messageHistory.selectmenu("instance")._renderItem = function (ul, item) {
                var li = $("<li>");
                if (item.disabled) {
                    li.addClass("ui-state-disabled");
                }
                li.addClass("messageHistoryItem");
                this._setText(li, item.label);
                return li.appendTo(ul);
            };
            if (this.gameService.gameState === Model.GameState.BeginTurn) {
                this.messages.push(this.currentPlayer + " is starting his turn.");
                this.refreshMessageHistory();
            }            
        }

        private isBlockedByTutorial(action: string) {
            return this.tutorialService.isActive && !this.tutorialService.canExecuteAction(action);
        }

        private executeTutorialCallback(action: string) {
            if (this.tutorialService.isActive) {
                this.tutorialService.executeActionCallback(action);
            }
        }

        private initTutorial(loadGame: boolean) {
            this.tutorialData = new Model.TutorialData();
            if (!loadGame) {
                this.tutorial = this.settingsService.options.tutorial;
                var that = this;
                this.timeoutService(() => {
                    $("#loadingBar").hide();
                    if (that.tutorial) {
                        that.scope.$apply(() => {
                            that.tutorialService.initialize(that.tutorialData);
                            that.tutorialService.advanceToNextStep();
                        });
                    }
                }, 3000);
            } else {
                this.tutorial = false;
                this.timeoutService(() => {
                    $("#loadingBar").hide();
                }, 3000);                
            }            
        }

        animateAndSetPlayerMoney(viewPlayer: MonopolyApp.Viewmodels.Player, money: number) {
            var that = this;
            if (viewPlayer.money !== money) {
                $("#player" + (viewPlayer.index + 1) + "Properties").animate({
                    width: "115px",
                    height: "60px"
                }, 500);
                $("#player" + (viewPlayer.index + 1) + "Money").animate({
                    color: money >= viewPlayer.money ? "#20C020" : "#ff1463",
                    fontSize: "22px"
                }, 500, function () {
                    $({ countNum: viewPlayer.money }).animate({ countNum: money }, {
                        duration: 2000,
                        easing: 'linear',
                        step: function () {
                            var count = this.countNum;
                            that.timeoutService(() => {
                                that.scope.$apply(() => {
                                    viewPlayer.money = Math.floor(count);
                                });
                                that.playTickSound();
                            });
                        },
                        complete: function () {
                            var count = this.countNum;
                            that.timeoutService(() => {
                                that.scope.$apply(() => {
                                    viewPlayer.money = count;
                                });
                                $("#player" + (viewPlayer.index + 1) + "Properties").animate({
                                    width: "100px",
                                    height: "40px"
                                }, 500);
                                $("#player" + (viewPlayer.index + 1) + "Money").animate({
                                    color: "#DDDDDD",
                                    fontSize: "14px"
                                }, 500);
                            });
                        }
                    });
                });
            }
        }

        private playTickSound() {
            //var audio: any = document.getElementById("audio_tick");
            //audio.play();
            if (this.settingsService.options.sound) {
                // find first one available
                var availableAudio = $(".audio_tick.stopped");
                if (availableAudio.length === 0) {
                    availableAudio = $(".audio_tick").first();
                } else {
                    availableAudio = availableAudio.first();
                }
                availableAudio.removeClass("stopped").addClass("playing");
                var selectedAudio: any = availableAudio[0];
                selectedAudio.play();
            }
        }

        private playBounceSound() {
            if (this.settingsService.options.sound) {
                // find first one available
                var availableAudio = $(".audio_bounce.stopped");
                if (availableAudio.length === 0) {
                    availableAudio = $(".audio_bounce").first();
                } else {
                    availableAudio = availableAudio.first();
                }
                availableAudio.removeClass("stopped").addClass("playing");
                var selectedAudio: any = availableAudio[0];
                selectedAudio.play();
            }
        }

        private playRocketSound(fadeOut?: boolean) {
            if (this.settingsService.options.sound) {
                var rocketAudio: any = $(".audio_rocket")[0];
                if (!fadeOut) {
                    rocketAudio.volume = 1;
                    rocketAudio.play();
                }
                if (fadeOut && rocketAudio.volume > 0) {
                    $({ volume: 100 }).animate({ volume: 0 }, {
                        duration: 4000,
                        easing: 'linear',
                        step: function() {
                            var vol = this.volume;
                            rocketAudio.volume = vol/100;
                        },
                        complete: function() {
                        }
                    });
                }
            }
        }

        private initAudio() {
            $(".audio_tick").each((i, el) => {
                var elem: any = el;
                elem.preload = "auto";
                elem.volume = 0.7;
            });
            $(".audio_tick").off("ended");
            $(".audio_tick").on("ended", e => {
                $(e.currentTarget).removeClass("playing").addClass("stopped");
            });
            $(".audio_bounce").off("ended");
            $(".audio_bounce").on("ended", e => {
                $(e.currentTarget).removeClass("playing").addClass("stopped");
            });
            $(".audio_bounce").each((i, el) => {
                var elem: any = el;
                elem.preload = "auto";
            });
            var that = this;
            $(".audio_rocket").off("ended");
            $(".audio_rocket").on("ended", e => {
                if (that.playerMoving) {
                    that.playRocketSound();
                }
            });
            $(".audio_rocket").each((i, el) => {
                var elem: any = el;
                elem.preload = "auto";
            });
            $(".backgroundMusic").off("ended");
        }

        private stopMusic() {
            if (this.settingsService.options.music) {
                var musicToStop = $(".backgroundMusic.playing");
                if (musicToStop.length > 0) {
                    musicToStop.removeClass("playing").addClass("stopped");
                    var musicElement: any = musicToStop.first()[0];
                    musicElement.pause();
                    musicElement.currentTime = 0;
                }
            }
        }

        private clearCurrentPlayerFromBoard() {
            var assetGroups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
            var player = this.players.filter(p => p.name === this.currentPlayer)[0];
            this.scene.removeMesh(player.mesh);
            player.mesh.dispose();
            player.mesh = undefined;
            player.color = "#808080";
            var that = this;
            assetGroups.forEach(assetGroup => {
                var boardFields = that.gameService.getGroupBoardFields(assetGroup);
                boardFields.forEach(boardField => {
                    if (!boardField.asset.unowned && boardField.asset.owner === that.currentPlayer) {
                        var viewBoardField = that.boardFields.filter(f => f.index === boardField.index);
                        if (viewBoardField.length > 0) {
                            that.drawingService.clearBoardField(viewBoardField[0], that.scene);
                        }
                    }
                });
            });
        }

        private onActivateTradeNode(e: JQueryEventObject, data: any) {
            var thisInstance = <GameController>e.data;
            if (data && data.node && data.node.children && data.node.children.length === 0) {
                // leaf node
                thisInstance.scope.$apply(() => {
                    thisInstance.tradeService.switchSelection(data.node.text);
                });                
            }
            if (!data.instance.is_leaf(data.node)) {
                data.instance.toggle_node(data.node);
            }
        }

        private showTradeMessage(tradeState: Model.TradeState) {
            var player1MoneyMsg = tradeState.firstPlayerMoney ? (" and " + this.themeService.theme.moneySymbol + tradeState.firstPlayerMoney) : "";
            var player2MoneyMsg = tradeState.secondPlayerMoney ? (" and " + this.themeService.theme.moneySymbol + tradeState.secondPlayerMoney) : "";
            if (tradeState.firstPlayerSelectedAssets.length === 1 && tradeState.secondPlayerSelectedAssets.length === 1) {
                this.showMessage(tradeState.firstPlayer.playerName + " traded " + tradeState.firstPlayerSelectedAssets[0].name + player1MoneyMsg + " for " + tradeState.secondPlayerSelectedAssets[0].name + player2MoneyMsg + " with " + tradeState.secondPlayer.playerName + ".");
            } else {
                this.showMessage(tradeState.firstPlayer.playerName + " traded " + tradeState.firstPlayerSelectedAssets.length + " assets" + player1MoneyMsg + " for " + tradeState.secondPlayerSelectedAssets.length + player2MoneyMsg + " with " + tradeState.secondPlayer.playerName + ".");
            }            
        }
    }

    monopolyApp.controller("gameCtrl", GameController);
} 