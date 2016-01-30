/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/game.ts" />
module MonopolyApp.controllers {
    export class GameController {
        scope: angular.IScope;
        stateService: angular.ui.IStateService;
        timeoutService: angular.ITimeoutService;
        gameService: Interfaces.IGameService;
        drawingService: Interfaces.IDrawingService;
        swipeService: any;
        static $inject = ["$state", "$swipe", "$scope", "$timeout", "gameService", "drawingService"];

        private players: Array<Viewmodels.Player>;
        private boardFields: Array<Viewmodels.BoardField>;
        private currentCard: Viewmodels.Card; // card currently being displayed
        private scene: BABYLON.Scene;
        private gameCamera: BABYLON.FreeCamera;
        private manageCamera: BABYLON.ArcRotateCamera;
        private manageMode: boolean;
        private focusedAssetGroup: Model.AssetGroup; // currently focused asset group in manage mode
        private swipeInProgress: boolean;
        private confirmButtonCallback: (data: any) => void; // callbacks currently assigned to action buttons
        private cancelButtonCallback: (data: any) => void;
        private diceThrowCompleted: JQueryDeferred<{}>;

        availableActions: Viewmodels.AvailableActions;
        assetToBuy: Model.Asset; // asset currently available for purchase
        assetToManage: Model.Asset; // asset currently being managed
        messages: Array<string>;
        actionButtonsVisible: boolean;

        get currentPlayer(): string {
            return this.gameService.getCurrentPlayer();
        }

        get playerModels(): Array<Viewmodels.Player> {
            return this.players;
        }

        constructor(stateService: angular.ui.IStateService, swipeService: any, scope: angular.IScope, timeoutService: angular.ITimeoutService ,gameService: Interfaces.IGameService, drawingService: Interfaces.IDrawingService) {
            this.scope = scope;
            this.stateService = stateService;
            this.timeoutService = timeoutService;
            this.gameService = gameService;
            this.drawingService = drawingService;
            this.swipeService = swipeService;
            this.initGame();
            this.createScene();
            this.availableActions = new Viewmodels.AvailableActions();
            this.setAvailableActions();
            this.messages = [];
            this.currentCard = new Viewmodels.Card();
            $(window).on("click", null, this, this.handleClickEvent);
            this.swipeService.bind($("#renderCanvas"), {
                'move': (coords) => { this.swipeMove(coords); },
                'end': (coords, event) => { this.swipeEnd(coords, event); },
                'cancel': (event) => { this.swipeCancel(event); }
            });

            $("#commandPanel").mousedown(e => {
                this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
            });
            $("#commandPanel").mouseup(e => {
                if (!this.swipeInProgress) {
                    this.unhighlightCommandButton("buttonThrowDice");
                    this.unhighlightCommandButton("buttonBuy");
                    this.unhighlightCommandButton("buttonManage");
                    this.unhighlightCommandButton("buttonEndTurn");
                }
            });

            this.swipeService.bind($("#commandPanel"), {
                'move': (coords) => {
                    if (!this.manageMode) {
                        this.swipeInProgress = true;
                        this.highlightCommandButtons(coords);
                    }
                },
                'end': (coords, event) => {
                    if (!this.manageMode) {
                        if (!this.swipeInProgress) {
                            return;
                        }
                        var elem = $(document.elementFromPoint(coords.x, coords.y));
                        if (elem.attr("id") === "buttonThrowDice") {
                            $("#buttonThrowDice").height(50);
                            $("#buttonThrowDice").width(50);
                            $("#buttonThrowDice").click();
                        }
                        if (elem.attr("id") === "buttonBuy") {
                            $("#buttonBuy").height(50);
                            $("#buttonBuy").width(50);
                            $("#buttonBuy").click();
                        }
                        if (elem.attr("id") === "buttonManage") {
                            $("#buttonManage").height(50);
                            $("#buttonManage").width(50);
                            $("#buttonManage").click();
                        }
                        if (elem.attr("id") === "buttonEndTurn") {
                            $("#buttonEndTurn").height(50);
                            $("#buttonEndTurn").width(50);
                            $("#buttonEndTurn").click();
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

        initGame() {
            this.gameService.initGame();
        }

        setupThrowDice() {
            if (this.gameService.canThrowDice) {
                this.gameService.throwDice();
                this.drawingService.setupDiceForThrow(this.scene);
                this.drawingService.moveCameraForDiceThrow(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition());
            }
        }

        throwDice(impulsePoint?: BABYLON.Vector3) {
            if (this.gameService.gameState === Model.GameState.ThrowDice) {
                this.diceThrowCompleted = $.Deferred();
                this.drawingService.animateDiceThrow(impulsePoint, this.scene);
                var that = this;
                $.when(this.diceThrowCompleted).done(() => {
                    that.diceThrowCompleted = undefined;
                    that.gameService.setDiceResult(that.drawingService.getDiceResult());
                    that.movePlayer();
                });
            }
        }

        // move player to a destination defined by last dice throw or by explicit parameter value (as requested by an event card, for instance)
        movePlayer(newPositionIndex?: number): JQueryDeferred<{}> {
            var d = $.Deferred();
            var oldPosition = this.gameService.getCurrentPlayerPosition();
            var newPosition = this.gameService.moveCurrentPlayer(newPositionIndex);
            var cameraMovementCompleted = this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, oldPosition.index);
            var that = this;
            $.when(cameraMovementCompleted).done(() => {
                var animateMoveCompleted = that.animateMove(oldPosition, newPosition, newPositionIndex !== undefined);
                //that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, newPosition.index, that.drawingService.framesToMoveOneBoardField * that.gameService.lastDiceResult);
                var positionsToMove = oldPosition.index < newPosition.index ? newPosition.index - oldPosition.index : (40 - oldPosition.index) + newPosition.index;
                that.followBoardFields(oldPosition.index, positionsToMove, that.drawingService, that.scene, that.gameCamera, that, newPositionIndex !== undefined);
                $.when(animateMoveCompleted).done(() => {
                    that.scope.$apply(() => {
                        that.setAvailableActions();
                        that.processDestinationField();
                        d.resolve();
                    });
                });
            });
            return d;
        }

        // animate game camera by following board fields from player current field to its movement destination field; this animation occurs at the same time that the player is moving
        followBoardFields(positionIndex: number, positionsLeftToMove: number, drawingService: Interfaces.IDrawingService, scene: BABYLON.Scene, camera: BABYLON.FreeCamera, gameController: GameController, fast?: boolean) {
            if (positionsLeftToMove > 0) {
                positionIndex = (positionIndex + 1) % 40;
                positionsLeftToMove--;
                var numFrames = positionIndex % 10 === 0 ? drawingService.framesToMoveOneBoardField * 2 : drawingService.framesToMoveOneBoardField;
                if (fast) {
                    numFrames = Math.floor(numFrames / 2);
                }
                var cameraMoveCompleted = drawingService.returnCameraToMainPosition(scene, camera, positionIndex, numFrames);
                $.when(cameraMoveCompleted).done(() => {
                    var processedEvent = gameController.gameService.processFlyBy(positionIndex);
                    if (processedEvent !== Model.ProcessingEvent.None) {
                        gameController.timeoutService(() => {
                            gameController.scope.$apply(() => {
                                gameController.updatePlayersForView();
                            });
                        });
                    }
                    gameController.showMessageForEvent(processedEvent);
                    gameController.followBoardFields(positionIndex, positionsLeftToMove, drawingService, scene, camera, gameController, fast);
                });
            }
        }

        buy() {
            var bought = this.gameService.buy();
            if (bought) {
                var boardField = this.gameService.getCurrentPlayerPosition();
                this.drawingService.setBoardFieldOwner(this.boardFields.filter(f => f.index === boardField.index)[0], boardField.asset, this.scene);
                this.updatePlayersForView();
            }
            this.setAvailableActions();
        }

        manage() {
            if (!this.manageMode) {
                this.manageMode = true;
                this.focusedAssetGroup = this.gameService.manage();
                this.setupManageHighlight();
                this.scene.activeCamera = this.manageCamera;
                //var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
                //this.manageCamera.attachControl(canvas, true);
                this.setAvailableActions();
                $("#commandPanel").hide();
                $("#manageCommandPanel").show();
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
            this.scene.activeCamera = this.gameCamera;
            this.gameService.returnFromManage();
            this.drawingService.returnFromManage(this.scene);
            //var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
            //this.manageCamera.detachControl(canvas);            
            this.setAvailableActions();
            this.actionButtonsVisible = false;
            $("#manageCommandPanel").hide();
            $("#commandPanel").show();            
        }

        endTurn() {
            if (this.gameService.canEndTurn) {
                this.gameService.endTurn();
                this.setAvailableActions();
            }
        }

        closeAssetManagementWindow() {
            $("#assetManagement").hide();
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
                this.showMessage(this.gameService.getCurrentPlayer() + " passed GO and received M200.");
            }
        }

        private createScene() {
            var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
            var engine = new BABYLON.Engine(canvas, true);
            var theScene = this.createBoard(engine, canvas);
            var that = this;
            engine.runRenderLoop(() => {
                if (that.gameService.gameState === Model.GameState.ThrowDice && that.diceThrowCompleted) {
                    // if the game is at the dice throw state and the dice throw has been triggered, verify if it is done, otherwise just follow with the camera
                    if (that.drawingService.isDiceAtRestAfterThrowing(theScene)) {
                        that.diceThrowCompleted.resolve();
                    } else {
                        var dicePhysicsLocation = that.drawingService.getDiceLocation(that.scene);
                        if (dicePhysicsLocation) {
                            that.gameCamera.setTarget(new BABYLON.Vector3(dicePhysicsLocation.x, dicePhysicsLocation.y, dicePhysicsLocation.z));
                        }
                    }
                }
                theScene.render();
            });
            window.addEventListener("resize", function () {
                engine.resize();
            });

            // Watch for browser/canvas resize events
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }

        private createBoard(engine, canvas) {
            // This creates a basic Babylon Scene object (non-mesh)
            this.scene = new BABYLON.Scene(engine);
            this.scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
            this.scene.setGravity(new BABYLON.Vector3(0, -10, 0));

            // This creates and positions a free camera (non-mesh)
            this.gameCamera = new BABYLON.FreeCamera("camera1", BABYLON.Vector3.Zero(), this.scene);
            this.drawingService.setGameCameraPosition(this.gameCamera);
            this.manageCamera = new BABYLON.ArcRotateCamera("camera2", 0,0,0,BABYLON.Vector3.Zero(), this.scene);
            this.scene.activeCamera = this.gameCamera;

            // This attaches the camera to the canvas
            //this.gameCamera.attachControl(canvas, true);

            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);

            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 1;

            // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
            this.drawingService.createBoard(this.scene);

            this.initPlayers();            
            var meshLoads = this.drawingService.loadMeshes(this.players, this.scene, this);
            $.when.apply($, meshLoads).done(this.setupPlayerPositions);
            this.setupBoardFields();
            return this.scene;
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
                that.playerModels.push(playerModel);
                index++;
            });
        }

        private setupBoardFields() {
            this.boardFields = [];
            for (var i = 0; i < 40; i++) {
                var boardField = new Viewmodels.BoardField();
                boardField.index = i;
                this.boardFields.push(boardField);
            }
            for (var assetGroup = Model.AssetGroup.First; assetGroup <= Model.AssetGroup.Eighth; assetGroup++) {
                var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                groupBoardFields.forEach(groupBoardField => {
                    if (!groupBoardField.asset.unowned) {
                        this.drawingService.setBoardFieldOwner(this.boardFields.filter(f => f.index === groupBoardField.index)[0], groupBoardField.asset, this.scene);
                    }
                });
            }
        }

        private setupPlayerPositions(that: GameController) {
            that.players.forEach((playerModel) => {
                that.drawingService.positionPlayer(playerModel);
            });
        }

        private setAvailableActions() {
            this.availableActions.endTurn = this.gameService.canEndTurn;
            this.availableActions.throwDice = this.gameService.canThrowDice;
            this.availableActions.buy = this.gameService.canBuy;
            this.availableActions.manage = this.gameService.canManage;
        }

        private animateMove(oldPosition: Model.BoardField, newPosition: Model.BoardField, fast?: boolean): JQueryDeferred<{}> {
            var playerModel = this.players.filter(p => p.name === this.gameService.getCurrentPlayer())[0];
            return this.drawingService.animatePlayerMove(oldPosition, newPosition, playerModel, this.scene, fast);
        }

        private showDeed() {
            this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
        }

        private processDestinationField() {
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Asset) {
                this.processAssetField(this.gameService.getCurrentPlayerPosition());
            }
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Treasure || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Event) {
                this.processCardField(this.gameService.getCurrentPlayerPosition());
            }
        }

        private processAssetField(position: Model.BoardField) {
            if (this.availableActions.buy) {
                this.showDeed();
            } else if (!position.asset.unowned && position.asset.owner !== this.gameService.getCurrentPlayer()) {
                var result = this.gameService.processOwnedFieldVisit();
                if (result.message) {
                    this.showMessage(result.message);
                }
                this.updatePlayersForView();
            }
        }

        private showMessage(message: string) {
            var overlayOffset = Math.floor(jQuery(window).height() * 0.15);
            $("#messageOverlay").html(message).show().animate({
                top: `-=${overlayOffset}px`,
                opacity: 0
            }, 5000, () => {
                $("#messageOverlay").hide();
                $("#messageOverlay").css({ opacity: 1, top: 0 });
                this.messages.push(message);
            });
        }

        private handleSwipe(left: boolean) {
            if (this.manageMode) {
                this.focusedAssetGroup = this.gameService.manageFocusChange(left);
                this.setupManageHighlight();
                this.drawingService.setManageCameraPosition(this.manageCamera, this.focusedAssetGroup, this.scene);
                if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroup)) {
                    this.drawingService.showHouseButtons(this.focusedAssetGroup, this.scene);
                }
            }
        }

        private setupManageHighlight() {
            this.drawingService.setManageCameraPosition(this.manageCamera, this.focusedAssetGroup, this.scene);
            if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroup)) {
                this.drawingService.showHouseButtons(this.focusedAssetGroup, this.scene);
            }            
        }

        private handleClickEvent(eventObject: JQueryEventObject, ...data: any[]) {
            var thisInstance = <GameController>eventObject.data;
            if (thisInstance.manageMode && !thisInstance.swipeInProgress) {
                var pickedObject = thisInstance.drawingService.pickBoardElement(thisInstance.scene);
                if (pickedObject && pickedObject.pickedObjectType === Viewmodels.PickedObjectType.BoardField) {
                    var groupFields = thisInstance.gameService.getGroupBoardFields(thisInstance.focusedAssetGroup);
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

            if (thisInstance.gameService.gameState === Model.GameState.ThrowDice && !thisInstance.swipeInProgress) {
                var pickedObject2 = thisInstance.drawingService.pickBoardElement(thisInstance.scene);
                if (pickedObject2 && pickedObject2.pickedObjectType === Viewmodels.PickedObjectType.Dice) {
                    thisInstance.throwDice(pickedObject2.pickedPoint);
                }
            }
        }

        private manageField(asset: Model.Asset) {
            this.assetToManage = asset;
            $("#assetManagement").show();
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
            }
        }

        private removeHousePreview(position: number) {
            if (this.gameService.removeHousePreview(this.gameService.getCurrentPlayer(), position)) {
                this.setupActionButtonsForHousePreview(position);
            }
        }

        private setupActionButtonsForHousePreview(position: number) {
            var assetGroup = this.gameService.getBoardFieldGroup(position);
            var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
            var hasUncommittedUpgrades = false;
            groupBoardFields.forEach(field => {
                hasUncommittedUpgrades = hasUncommittedUpgrades || field.asset.hasUncommittedUpgrades();
            });
            this.refreshBoardFieldGroupHouses(assetGroup);
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

        private refreshBoardFieldGroupHouses(assetGroup: Model.AssetGroup) {
            var fields = this.gameService.getGroupBoardFields(assetGroup);

            var fieldIndexes = $.map(fields, f => f.index);
            var viewGroupBoardFields = this.boardFields.filter(viewBoardField => $.inArray(viewBoardField.index, fieldIndexes) >= 0);
            var that = this;
            viewGroupBoardFields.forEach(f => {
                var asset = fields.filter(field => f.index === field.index)[0].asset;
                that.drawingService.setBoardFieldHouses(f, asset.houses, asset.hotel, that.scene);
            });
            
        }

        private commitHouses(data: any) {
            this.gameService.commitHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroup);
            this.actionButtonsVisible = false;
            this.updatePlayersForView();
        }

        private rollbackHouses(data: any) {
            this.gameService.rollbackHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroup);
            this.actionButtonsVisible = false;
            this.refreshBoardFieldGroupHouses(this.focusedAssetGroup);
            this.updatePlayersForView();
        }

        private updatePlayersForView() {
            var that = this;
            this.gameService.players.forEach(p => {
                var viewPlayer = that.playerModels.filter(model => model.name === p.playerName)[0];
                viewPlayer.money = p.money;
            });
        }

        private processCardField(position: Model.BoardField) {
            var card: Model.Card;
            if (position.type === Model.BoardFieldType.Treasure) {
                card = this.gameService.getNextTreasureCard();
            } else {
                card = this.gameService.getNextEventCard();
            }
            var that = this;
            $.when(this.showCard(card, position.type === Model.BoardFieldType.Treasure ? "COMMUNITY CHEST" : "EVENT")).done(() => {
                that.gameService.processCard(card);
                that.showMessage(that.getMessageForCard(card, position));
                var addAction = $.Deferred();
                if (card.cardType === Model.CardType.AdvanceToField) {
                    $.when(that.movePlayer(card.boardFieldIndex)).done(() => {
                        addAction.resolve();
                    });
                } else {
                    addAction.resolve();
                }

                $.when(addAction).done(() => {
                    that.timeoutService(() => {
                        that.scope.$apply(() => {
                            that.updatePlayersForView();
                        });
                    });
                });
            });
        }

        private showCard(card: Model.Card, title: string): JQueryDeferred<{}> {
            var d = $.Deferred();
            this.currentCard.title = title;
            this.currentCard.message = card.message;
            $("#card").show("fold", { size: "30%" }, 800, () => {
                this.timeoutService(4000).then(() => {
                    $("#card").hide("fold", { size: "30%" }, 800, () => {
                        d.resolve();                        
                    });
                });
            });
            return d;
        }

        private getMessageForCard(card: Model.Card, position: Model.BoardField) {
            var type = position.type === Model.BoardFieldType.Treasure ? "community chest" : "event";
            if (card.cardType === Model.CardType.ReceiveMoney) {
                return this.gameService.getCurrentPlayer() + " received M" + card.money + " from " + type + ".";
            } else if (card.cardType === Model.CardType.PayMoney) {
                return this.gameService.getCurrentPlayer() + " paid M" + card.money + (position.type === Model.BoardFieldType.Treasure ? " to " : " for ") + type + ".";
            } else if (card.cardType === Model.CardType.AdvanceToField) {
                return this.gameService.getCurrentPlayer() + " is advancing to " + this.getBoardFieldName(card.boardFieldIndex) + ".";
            }

            return this.gameService.getCurrentPlayer() + " landed on " + type + ".";
        }

        private getBoardFieldName(boardFieldIndex: number) {
            if (boardFieldIndex === 0) {
                return "GO";
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
            if (elem.attr("id") === "buttonThrowDice") {
                this.highlightCommandButton("buttonThrowDice");
            } else {
                this.unhighlightCommandButton("buttonThrowDice");
            }
            if (elem.attr("id") === "buttonBuy") {
                this.highlightCommandButton("buttonBuy");
            } else {
                this.unhighlightCommandButton("buttonBuy");
            }
            if (elem.attr("id") === "buttonManage") {
                this.highlightCommandButton("buttonManage");
            } else {
                this.unhighlightCommandButton("buttonManage");
            }
            if (elem.attr("id") === "buttonEndTurn") {
                this.highlightCommandButton("buttonEndTurn");
            } else {
                this.unhighlightCommandButton("buttonEndTurn");
            }            
        }

        private highlightCommandButton(buttonId: string) {
            $(`#${buttonId}`).height(80);
            $(`#${buttonId}`).width(80);

        }

        private unhighlightCommandButton(buttonId: string) {
            $(`#${buttonId}`).height(50);
            $(`#${buttonId}`).width(50);                    

        }
    }

    monopolyApp.controller("gameCtrl", GameController);
} 