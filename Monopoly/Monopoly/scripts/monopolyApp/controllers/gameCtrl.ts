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
        private focusedAssetGroupIndex: number; // currently focused asset group in manage mode
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
            this.bindInputEvents();
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
                var animateMoveCompleted: JQueryDeferred<{}>;
                if (newPosition) {
                    animateMoveCompleted = that.animateMove(oldPosition, newPosition, newPositionIndex !== undefined);
                    //that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, newPosition.index, that.drawingService.framesToMoveOneBoardField * that.gameService.lastDiceResult);
                    var positionsToMove = oldPosition.index < newPosition.index ? newPosition.index - oldPosition.index : (40 - oldPosition.index) + newPosition.index;
                    that.followBoardFields(oldPosition.index, positionsToMove, that.drawingService, that.scene, that.gameCamera, that, newPositionIndex !== undefined);
                } else {
                    animateMoveCompleted = $.Deferred().resolve();
                }
                $.when(animateMoveCompleted).done(() => {
                    that.scope.$apply(() => {
                        that.setAvailableActions();
                        that.processDestinationField();
                        that.setAvailableActions();
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
                this.focusedAssetGroupIndex = this.gameService.manage();
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
            this.toggleManageCommandPanel(true);
            // show command panel in the next event loop iteration to avoid its mouse event handler to process this event by highlighting one of its buttons
            this.timeoutService(() => {
                $("#commandPanel").show();
            });           
        }

        endTurn() {
            if (this.gameService.canEndTurn) {
                this.gameService.endTurn();
                this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition().index);
                this.setAvailableActions();
            }
        }

        closeAssetManagementWindow() {
            $("#assetManagement").hide();
            this.toggleManageCommandPanel();
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

        toggleMortgageConfirm() {
            if (this.gameService.canMortgage(this.assetToManage)) {
                var that = this;
                if (!this.assetToManage.mortgage) {
                    $("#mortgageConfirmText").text("Do you wish to mortgage " + this.assetToManage.name + " for M" + this.assetToManage.valueMortgage + "?");
                } else {
                    $("#mortgageConfirmText").text("Do you wish to pay off mortgage " + this.assetToManage.name + " for M" + (Math.floor(this.assetToManage.valueMortgage * 1.1)) + "?");
                }
                $("#mortgageConfirmDialog").dialog({
                    autoOpen: true,
                    dialogClass: "no-close",
                    width: 300,
                    buttons: [
                        {
                            text: "Yes",
                            click: function () {
                                $(this).dialog("close");
                                if (!that.toggleMortgageAsset(that.assetToManage)) {
                                    that.showConfirmationPopup("Sorry, you do not have enough money!");
                                }
                                that.scope.$apply(() => {
                                    that.updatePlayersForView();
                                });
                            }
                        },
                        {
                            text: "No",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    ]
                });
            }
        }

        toggleMortgageAsset(asset: Model.Asset): boolean {
            return this.gameService.toggleMortgageAsset(asset);
        }

        showConfirmationPopup(text: string) {
            $("#generalPopupDialog").text(text);
            $("#generalPopupDialog").dialog({
                autoOpen: true,
                dialogClass: "no-close",
                width: 300,
                buttons: [
                    {
                        text: "Ok",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });            
        }

        showActionPopup(text: string, onConfirm: () => any, onCancel: () => any) {
            $("#generalPopupDialog").text(text);
            $("#generalPopupDialog").dialog({
                autoOpen: true,
                dialogClass: "no-close",
                width: 300,
                buttons: [
                    {
                        text: "Yes",
                        click: function () {
                            $(this).dialog("close");
                            onConfirm();
                        }
                    },
                    {
                        text: "No",
                        click: function () {
                            $(this).dialog("close");
                            onCancel();
                        }
                    }
                ]
            });
        }

        canMortgageSelected(): boolean {
            return this.gameService.canMortgage(this.assetToManage);
        }

        getOutOfJail() {
            this.gameService.getOutOfJail();
            this.setAvailableActions();
            if (this.gameService.lastDiceResult) {
                this.movePlayer();
            }
        }

        surrender() {
            this.showActionPopup("Are you sure you wish to surrender?", () => {
                this.gameService.surrender();
                this.showMessage(this.currentPlayer + " has surrendered!");
                this.setAvailableActions();
                if (this.gameService.gameState === Model.GameState.EndOfGame) {
                    this.showConfirmationPopup(this.gameService.winner + " has won the game!");
                }
            }, () => {});
        }

        private createScene() {
            var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
            var engine = new BABYLON.Engine(canvas, true);
            var theScene = this.createBoard(engine, canvas);
            var that = this;
            engine.runRenderLoop(() => {
                that.timeoutService(() => {
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
                }, 1, false);
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
            this.drawingService.setGameCameraInitialPosition(this.gameCamera);
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
            this.availableActions.getOutOfJail = this.gameService.canGetOutOfJail;
            this.availableActions.surrender = this.gameService.canSurrender;
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
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Tax || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.TaxIncome) {
                this.processTaxField(this.gameService.getCurrentPlayerPosition().type);
            }
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.GoToPrison) {
                this.processGoToPrisonField();
            } else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.PrisonAndVisit) {
                this.processPrisonField();
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
                this.focusedAssetGroupIndex = this.gameService.manageFocusChange(left);
                this.setupManageHighlight();
            }
        }

        private setupManageHighlight() {
            this.drawingService.setManageCameraPosition(this.manageCamera, this.focusedAssetGroupIndex, this.scene);
            if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex)) {
                this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
            }            
        }

        private handleClickEvent(eventObject: JQueryEventObject, ...data: any[]) {
            var thisInstance = <GameController>eventObject.data;
            var mouseEventObject: TouchEvent;
            if (thisInstance.manageMode && !thisInstance.swipeInProgress) {
                mouseEventObject = </*JQueryMouseEventObject*/TouchEvent>eventObject.originalEvent;
                var pickedObject = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                if (pickedObject && pickedObject.pickedObjectType === Viewmodels.PickedObjectType.BoardField) {
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
            if (thisInstance.gameService.gameState === Model.GameState.ThrowDice && !thisInstance.swipeInProgress) {
                mouseEventObject = <TouchEvent>eventObject.originalEvent;
                var pickedObject2 = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                if (pickedObject2 && pickedObject2.pickedObjectType === Viewmodels.PickedObjectType.Dice) {
                    thisInstance.throwDice(pickedObject2.pickedPoint);
                }
            }
        }

        private manageField(asset: Model.Asset) {
            this.assetToManage = asset;
            this.toggleManageCommandPanel();
            $("#assetManagement").show();
        }

        private toggleManageCommandPanel(hide?: boolean) {
            if (hide) {
                $("#manageCommandPanel").hide();
                return;
            }
            $("#manageCommandPanel").toggle();
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

        private refreshBoardFieldGroupHouses(focusedAssetGroupIndex: number) {
            var firstFocusedBoardField = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            var fields = this.gameService.getGroupBoardFields(firstFocusedBoardField.asset.group);

            var fieldIndexes = $.map(fields, f => f.index);
            var viewGroupBoardFields = this.boardFields.filter(viewBoardField => $.inArray(viewBoardField.index, fieldIndexes) >= 0);
            var that = this;
            viewGroupBoardFields.forEach(f => {
                var asset = fields.filter(field => f.index === field.index)[0].asset;
                that.drawingService.setBoardFieldHouses(f, asset.houses, asset.hotel, that.scene);
            });
            
        }

        private commitHouses(data: any) {
            this.gameService.commitHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
            this.actionButtonsVisible = false;
            this.updatePlayersForView();
        }

        private rollbackHouses(data: any) {
            this.gameService.rollbackHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
            this.actionButtonsVisible = false;
            this.refreshBoardFieldGroupHouses(this.focusedAssetGroupIndex);
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

        private processTaxField(boardFieldType: Model.BoardFieldType) {
            var paid = this.gameService.processTax(boardFieldType);
            this.updatePlayersForView();
            this.showMessage(this.currentPlayer + " paid M" + paid + " of income tax.");
        }

        private processGoToPrisonField() {
            var newPosition = this.gameService.moveCurrentPlayer(10);
            var playerModel = this.players.filter(p => p.name === this.gameService.getCurrentPlayer())[0];
            var moveToPrison = this.drawingService.animatePlayerPrisonMove(newPosition, playerModel, this.scene, this.gameCamera);
            var that = this;
            $.when(moveToPrison).done(() => {
                that.showMessage(that.currentPlayer + " landed in prison.");
                that.gameService.processPrison(true);
            });            
        }

        private processPrisonField() {
            this.showMessage(this.currentPlayer + " remains in prison.");
            this.gameService.processPrison(false);
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

        private bindInputEvents() {
            //$(window).on("click", null, this, this.handleClickEvent);
            if (window.navigator && window.navigator.pointerEnabled) {
                //$("#renderCanvas").bind("MSPointerDown", this, this.handleClickEvent);
                //$("#renderCanvas").bind("pointerdown", this, this.handleClickEvent);
                $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
            } else {
                $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
            }
            this.swipeService.bind($("#renderCanvas"), {
                'move': (coords) => { this.swipeMove(coords); },
                'end': (coords, event) => { this.swipeEnd(coords, event); },
                'cancel': (event) => { this.swipeCancel(event); }
            });

            $("#commandPanel").mousedown(e => {
                this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
            });
            $("#commandPanel").bind("touchstart", this, e => {
                var mouseEventObject: TouchEvent = <TouchEvent>e.originalEvent;
                if (mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0) {
                    var thisInstance = <GameController>e.data;
                    thisInstance.highlightCommandButtons({ x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY });
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
                        if (elem.hasClass("commandButton")) {
                            this.unhighlightCommandButton(elem);
                            //elem.addClass("unhighlightedButton").removeClass("highlightedButton");
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
    }

    monopolyApp.controller("gameCtrl", GameController);
} 