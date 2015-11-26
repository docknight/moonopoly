// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var BlankCordovaApp3;
(function (BlankCordovaApp3) {
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        var createTestScene = function (engine, canvas) {
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
            light.intensity = 0.7;
            // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
            var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
            // Move the sphere upward 1/2 its height
            sphere.position.y = 1;
            // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
            var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
            return scene;
        };
        function naloziSceno() {
            var canvas = document.getElementById("renderCanvas");
            var engine = new BABYLON.Engine(canvas, true);
            var scene = createTestScene(engine, canvas);
            engine.runRenderLoop(function () {
                scene.render();
            });
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            //document.getElementById("naloziScenoButton").addEventListener("click", naloziSceno);
            //naloziSceno();
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = BlankCordovaApp3.Application || (BlankCordovaApp3.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(BlankCordovaApp3 || (BlankCordovaApp3 = {}));
var Model;
(function (Model) {
    var Game = (function () {
        function Game() {
            this._currentPlayer = "";
            this.players = new Array();
        }
        Object.defineProperty(Game.prototype, "currentPlayer", {
            get: function () {
                return this._currentPlayer;
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.advanceToNextPlayer = function () {
            var _this = this;
            if (this._currentPlayer === "") {
                if (this.players.length > 0) {
                    this._currentPlayer = this.players[0].playerName;
                }
                return;
            }
            var currentPlayerIndex = this.players.indexOf(this.players.filter(function (p) { return p.playerName === _this.currentPlayer; })[0]);
            if (currentPlayerIndex < this.players.length - 1) {
                this._currentPlayer = this.players[currentPlayerIndex + 1].playerName;
            }
            else {
                this._currentPlayer = this.players[0].playerName;
            }
        };
        return Game;
    })();
    Model.Game = Game;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Player = (function () {
        function Player() {
            this.playerName = "";
            this.human = false;
        }
        return Player;
    })();
    Model.Player = Player;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Settings = (function () {
        function Settings() {
            this.numPlayers = 2;
            this.playerName = "";
        }
        return Settings;
    })();
    Model.Settings = Settings;
})(Model || (Model = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
//((): void=> {
//    var app = angular.module("angularWithTS", ['ngRoute']);
//    app.config(angularWithTS.Routes.configureRoutes);
//})() 
var monopolyApp = angular.module('monopolyApp', ['ui.router', 'ui.bootstrap']);
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
var Services;
(function (Services) {
    var SettingsService = (function () {
        function SettingsService($http) {
            this.loadSettings = function () {
                //For the purpose of this demo I am returning the hard coded values, hoever in real world application
                //You would probably use "this.httpService.get" method to call backend REST apis to fetch the data from server.
                var settings = new Model.Settings();
                settings.numPlayers = 2;
                settings.playerName = "Enter name";
                return settings;
            };
            this.httpService = $http;
        }
        SettingsService.prototype.saveSettings = function (settings) {
        };
        SettingsService.$inject = ["$http"];
        return SettingsService;
    })();
    Services.SettingsService = SettingsService;
    monopolyApp.service("settingsService", SettingsService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
var Services;
(function (Services) {
    var GameService = (function () {
        function GameService($http, settingsService) {
            this.httpService = $http;
            this.settingsService = settingsService;
        }
        GameService.prototype.initGame = function () {
            this.game = new Model.Game();
            this.initPlayers();
            this.game.advanceToNextPlayer();
        };
        GameService.prototype.endTurn = function () {
            this.game.advanceToNextPlayer();
        };
        GameService.prototype.getCurrentPlayer = function () {
            return this.game.currentPlayer;
        };
        GameService.prototype.initPlayers = function () {
            var settings = this.settingsService.loadSettings();
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player();
                player.playerName = i === 0 ? settings.playerName : "Computer " + i;
                player.human = i === 0;
                this.game.players.push(player);
            }
        };
        GameService.$inject = ["$http", "settingsService"];
        return GameService;
    })();
    Services.GameService = GameService;
    monopolyApp.service("gameService", GameService);
})(Services || (Services = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/game.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var GameController = (function () {
            function GameController(stateService, gameService) {
                this.stateService = stateService;
                this.gameService = gameService;
                this.initGame();
            }
            Object.defineProperty(GameController.prototype, "currentPlayer", {
                get: function () {
                    return this.gameService.getCurrentPlayer();
                },
                enumerable: true,
                configurable: true
            });
            GameController.prototype.initGame = function () {
                this.gameService.initGame();
            };
            GameController.$inject = ["$state", "gameService"];
            return GameController;
        })();
        controllers.GameController = GameController;
        monopolyApp.controller("gameCtrl", GameController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var MainMenuController = (function () {
            function MainMenuController(stateService) {
                var _this = this;
                this.startNewGame = function () {
                    _this.stateService.go("newgame");
                };
                this.stateService = stateService;
                this.title = "POZDRAVLJEN";
            }
            MainMenuController.prototype.settings = function () {
                this.stateService.go("settings");
            };
            MainMenuController.$inject = ["$state"];
            return MainMenuController;
        })();
        controllers.MainMenuController = MainMenuController;
        monopolyApp.controller("mainMenuCtrl", MainMenuController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var SettingsController = (function () {
            function SettingsController(stateService, settingsService) {
                this.stateService = stateService;
                this.settingsService = settingsService;
                this.loadSettings();
            }
            SettingsController.prototype.saveAndClose = function () {
                this.saveSettings();
                this.stateService.go("mainmenu");
            };
            SettingsController.prototype.loadSettings = function () {
                this.settings = new Model.Settings();
                this.settings.playerName = "Noname";
                this.settings.numPlayers = 2;
                this.settings = this.settingsService.loadSettings();
            };
            SettingsController.prototype.saveSettings = function () {
                this.settingsService.saveSettings(this.settings);
            };
            SettingsController.$inject = ["$state", "settingsService"];
            return SettingsController;
        })();
        controllers.SettingsController = SettingsController;
        monopolyApp.controller("settingsCtrl", SettingsController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
//# sourceMappingURL=appBundle.js.map