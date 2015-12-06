/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/game.ts" />
module MonopolyApp.controllers {
    export class GameController {
        stateService: angular.ui.IStateService;
        gameService: Interfaces.IGameService;
        static $inject = ["$state", "gameService"];

        get currentPlayer(): string {
            return this.gameService.getCurrentPlayer();
        }

        constructor(stateService: angular.ui.IStateService, gameService: Interfaces.IGameService) {
            this.stateService = stateService;
            this.gameService = gameService;
            this.initGame();
            this.createScene();
        }

        initGame() {
            this.gameService.initGame();
        }

        private createScene() {
            var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
            var engine = new BABYLON.Engine(canvas, true);
            var scene = this.createBoard(engine, canvas);
            engine.runRenderLoop(function () {
                scene.render();
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
            var scene = new BABYLON.Scene(engine);

            // This creates and positions a free camera (non-mesh)
            var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

            // This targets the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());

            // This attaches the camera to the canvas
            camera.attachControl(canvas, true);

            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 1;

            // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
            var board = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
            var boardMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            boardMaterial.emissiveTexture = new BABYLON.Texture("images/Gameboard.png", scene);
            boardMaterial.diffuseTexture = new BABYLON.Texture("images/Gameboard.png", scene);
            board.material = boardMaterial;

            BABYLON.SceneLoader.ImportMesh(null, "meshes/", "character.babylon", scene, function (newMeshes, particleSystems) {
                if (newMeshes != null) {
                    var mesh = newMeshes[0];
                    mesh.position.x = -3;
                    mesh.position.z = -3;
                }
            });
            return scene;
        }

    }

    monopolyApp.controller("gameCtrl", GameController);
} 