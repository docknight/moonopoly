﻿/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
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
            $(window).on("click", null, this, this.handleClickEvent);
            this.swipeService.bind($("#renderCanvas"), {
                'move': (coords) => { this.swipeMove(coords); },
                'end': (coords, event) => { this.swipeEnd(coords, event); },
                'cancel': (event) => { this.swipeCancel(event); }
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
                    var oldPosition = that.gameService.getCurrentPlayerPosition();
                    var newPosition = that.gameService.moveCurrentPlayer();
                    var cameraMovementCompleted = that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, oldPosition.index);
                    $.when(cameraMovementCompleted).done(() => {
                        var animateMoveCompleted = that.animateMove(oldPosition, newPosition);
                        //that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, newPosition.index, that.drawingService.framesToMoveOneBoardField * that.gameService.lastDiceResult);
                        var positionsToMove = oldPosition.index < newPosition.index ? newPosition.index - oldPosition.index : (40 - oldPosition.index) + newPosition.index;
                        that.followBoardFields(oldPosition.index, positionsToMove, that.drawingService, that.scene, that.gameCamera, that);
                        $.when(animateMoveCompleted).done(() => {
                            that.scope.$apply(() => {
                                that.setAvailableActions();
                                that.processDestinationField();
                            });
                        });
                    });
                });
            }
        }

        // animate game camera by following board fields from player current field to its movement destination field; this animation occurs at the same time that the player is moving
        followBoardFields(positionIndex: number, positionsLeftToMove: number, drawingService: Interfaces.IDrawingService, scene: BABYLON.Scene, camera: BABYLON.FreeCamera, gameController: GameController) {
            if (positionsLeftToMove > 0) {
                positionIndex = (positionIndex + 1) % 40;
                positionsLeftToMove--;
                var cameraMoveCompleted = drawingService.returnCameraToMainPosition(scene, camera, positionIndex, positionIndex % 10 === 0 ? drawingService.framesToMoveOneBoardField * 2 : drawingService.framesToMoveOneBoardField);
                $.when(cameraMoveCompleted).done(() => {
                    gameController.followBoardFields(positionIndex, positionsLeftToMove, drawingService, scene, camera, gameController);
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

        private animateMove(oldPosition: Model.BoardField, newPosition: Model.BoardField): JQueryDeferred<{}> {
            var playerModel = this.players.filter(p => p.name === this.gameService.getCurrentPlayer())[0];
            return this.drawingService.animatePlayerMove(oldPosition, newPosition, playerModel, this.scene);
        }

        private showDeed() {
            this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
        }

        private processDestinationField() {
            if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Asset) {
                this.processAssetField(this.gameService.getCurrentPlayerPosition());
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
    }

    monopolyApp.controller("gameCtrl", GameController);
} 