/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/game.ts" />
module MonopolyApp.controllers {
    export class GameController {
        stateService: angular.ui.IStateService;
        gameService: Interfaces.IGameService;
        drawingService: Interfaces.IDrawingService;
        static $inject = ["$state", "$swipe", "gameService", "drawingService"];

        private players: Array<Viewmodels.Player>;
        private scene: BABYLON.Scene;
        private gameCamera: BABYLON.FreeCamera;
        private manageCamera: BABYLON.ArcRotateCamera;
        private manageMode : boolean;

        availableActions: Viewmodels.AvailableActions;
        assetToBuy: Model.Asset; // asset currently available for purchase
        messages: Array<string>;

        get currentPlayer(): string {
            return this.gameService.getCurrentPlayer();
        }

        get playerModels(): Array<Viewmodels.Player> {
            return this.players;
        }

        constructor(stateService: angular.ui.IStateService, swipeService: any, gameService: Interfaces.IGameService, drawingService: Interfaces.IDrawingService) {
            this.stateService = stateService;
            this.gameService = gameService;
            this.drawingService = drawingService;
            this.initGame();
            this.createScene();
            this.availableActions = new Viewmodels.AvailableActions();
            this.setAvailableActions();
            this.messages = [];
            //$("#renderCanvas").on("swipeleft", () => this.handleSwipe(true));
            //$("#renderCanvas").on("swiperight", () => this.handleSwipe(false));
        }

        initGame() {
            this.gameService.initGame();
        }

        throwDice() {
            if (this.gameService.canThrowDice) {
                this.gameService.throwDice();
                var oldPosition = this.gameService.getCurrentPlayerPosition();
                var newPosition = this.gameService.moveCurrentPlayer();
                this.animateMove(oldPosition, newPosition);
                this.setAvailableActions();
                this.processDestinationField();                
            }
        }

        buy() {
            this.gameService.buy();
            this.setAvailableActions();
        }

        manage() {
            this.manageMode = true;
            var focusedAssetGroup = this.gameService.manage();
            this.drawingService.setManageCameraPosition(this.manageCamera, focusedAssetGroup);
            this.scene.activeCamera = this.manageCamera;
            this.setAvailableActions();
            $("#commandPanel").hide();
            $("#manageCommandPanel").show();
        }

        returnFromManage() {
            this.manageMode = false;
            this.scene.activeCamera = this.gameCamera;
            this.gameService.returnFromManage();
            this.setAvailableActions();
            $("#manageCommandPanel").hide();
            $("#commandPanel").show();            
        }

        endTurn() {
            if (this.gameService.canEndTurn) {
                this.gameService.endTurn();
                this.setAvailableActions();
            }
        }

        private createScene() {
            var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
            var engine = new BABYLON.Engine(canvas, true);
            var theScene = this.createBoard(engine, canvas);
            engine.runRenderLoop(function () {
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
            var board = BABYLON.Mesh.CreateGround("ground1", this.drawingService.boardSize, this.drawingService.boardSize, 2, this.scene);
            var boardMaterial = new BABYLON.StandardMaterial("boardTexture", this.scene);
            boardMaterial.emissiveTexture = new BABYLON.Texture("images/Gameboard.png", this.scene);
            boardMaterial.diffuseTexture = new BABYLON.Texture("images/Gameboard.png", this.scene);
            board.material = boardMaterial;

            this.players = [];
            var meshLoads = [];
            this.gameService.players.forEach((player) => {
                var playerModel = new Viewmodels.Player();
                playerModel.name = player.playerName;
                var d = $.Deferred();
                meshLoads.push(d);
                var that = this;
                BABYLON.SceneLoader.ImportMesh(null, "meshes/", "character.babylon", this.scene, function (newMeshes, particleSystems) {
                    if (newMeshes != null) {
                        var mesh = newMeshes[0];
                        playerModel.mesh = mesh;
                        d.resolve(that);
                    }
                });
                this.players.push(playerModel);
            });
            $.when.apply($, meshLoads).done(this.setupPlayerPositions);
            return this.scene;
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

        private animateMove(oldPosition: Model.BoardField, newPosition: Model.BoardField) {
            var playerModel = this.players.filter(p => p.name === this.gameService.getCurrentPlayer())[0];
            this.drawingService.animatePlayerMove(oldPosition, newPosition, playerModel);
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
                var focusedAssetGroup = this.gameService.manageFocusChange(left);
                this.drawingService.setManageCameraPosition(this.manageCamera, focusedAssetGroup);
            }
        }
    }

    monopolyApp.controller("gameCtrl", GameController);
} 