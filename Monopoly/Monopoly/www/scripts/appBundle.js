var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            if (typeof Fullscreen !== 'undefined') {
                Fullscreen.on();
            }
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
/// <reference path="../../typings/angularjs/angular.d.ts" />
//((): void=> {
//    var app = angular.module("angularWithTS", ['ngRoute']);
//    app.config(angularWithTS.Routes.configureRoutes);
//})() 
var monopolyApp = angular.module('monopolyApp', ['ui.router', 'ui.bootstrap', 'ngTouch', 'rzModule']);
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var AvailableActions = (function () {
            function AvailableActions() {
            }
            return AvailableActions;
        }());
        Viewmodels.AvailableActions = AvailableActions;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var BoardField = (function () {
            function BoardField() {
            }
            return BoardField;
        }());
        Viewmodels.BoardField = BoardField;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var Card = (function () {
            function Card() {
            }
            return Card;
        }());
        Viewmodels.Card = Card;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var Coordinate = (function () {
            function Coordinate(x, z) {
                if (x) {
                    this.x = x;
                }
                if (z) {
                    this.z = z;
                }
            }
            return Coordinate;
        }());
        Viewmodels.Coordinate = Coordinate;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        (function (PickedObjectType) {
            PickedObjectType[PickedObjectType["None"] = 0] = "None";
            PickedObjectType[PickedObjectType["BoardField"] = 1] = "BoardField";
            PickedObjectType[PickedObjectType["AddHouse"] = 2] = "AddHouse";
            PickedObjectType[PickedObjectType["RemoveHouse"] = 3] = "RemoveHouse";
            PickedObjectType[PickedObjectType["Dice1"] = 4] = "Dice1";
            PickedObjectType[PickedObjectType["Dice2"] = 5] = "Dice2";
        })(Viewmodels.PickedObjectType || (Viewmodels.PickedObjectType = {}));
        var PickedObjectType = Viewmodels.PickedObjectType;
        ;
        // represents an object that has been picked from the scene either via click/tap or via swipe
        var PickedObject = (function () {
            function PickedObject() {
            }
            return PickedObject;
        }());
        Viewmodels.PickedObject = PickedObject;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var Player = (function () {
            function Player() {
            }
            return Player;
        }());
        Viewmodels.Player = Player;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var Model;
(function (Model) {
    (function (GameState) {
        GameState[GameState["BeginTurn"] = 0] = "BeginTurn";
        GameState[GameState["ThrowDice"] = 1] = "ThrowDice";
        GameState[GameState["Move"] = 2] = "Move";
        GameState[GameState["Process"] = 3] = "Process";
        GameState[GameState["ProcessingDone"] = 4] = "ProcessingDone";
        GameState[GameState["Manage"] = 5] = "Manage";
        GameState[GameState["EndOfGame"] = 6] = "EndOfGame";
        GameState[GameState["Trade"] = 7] = "Trade"; // the game is paused and the player has initiated a trade
    })(Model.GameState || (Model.GameState = {}));
    var GameState = Model.GameState;
    ;
    var Game = (function () {
        function Game(theme) {
            this._currentPlayer = "";
            this.players = new Array();
            this._board = new Model.Board(theme);
            this._treasureCards = new Array();
            this._eventCards = new Array();
            this._moveContext = new Model.MoveContext();
            this.state = GameState.BeginTurn;
            this._gameParams = new Model.GameParams();
        }
        Object.defineProperty(Game.prototype, "currentPlayer", {
            get: function () {
                return this._currentPlayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "treasureCards", {
            get: function () {
                return this._treasureCards;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "eventCards", {
            get: function () {
                return this._eventCards;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "board", {
            get: function () {
                return this._board;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "moveContext", {
            get: function () {
                return this._moveContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "gameParams", {
            get: function () {
                return this._gameParams;
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.getState = function () {
            return this.state;
        };
        Game.prototype.setState = function (state) {
            this.previousState = this.state;
            this.state = state;
        };
        Game.prototype.advanceToNextPlayer = function () {
            var _this = this;
            var isActive;
            if (this._currentPlayer === "") {
                if (this.players.length > 0) {
                    this._currentPlayer = this.players[0].playerName;
                    if (!this.players[0].active) {
                        this.advanceToNextPlayer();
                    }
                }
                return;
            }
            var currentPlayerIndex = this.players.indexOf(this.players.filter(function (p) { return p.playerName === _this.currentPlayer; })[0]);
            if (currentPlayerIndex < this.players.length - 1) {
                this._currentPlayer = this.players[currentPlayerIndex + 1].playerName;
                isActive = this.players[currentPlayerIndex + 1].active;
            }
            else {
                this._currentPlayer = this.players[0].playerName;
                isActive = this.players[0].active;
            }
            if (!isActive) {
                var anyActive = this.players.filter(function (p) { return p.active; }).length > 0;
                if (anyActive) {
                    this.advanceToNextPlayer();
                }
            }
        };
        Game.prototype.setPreviousState = function () {
            if (this.previousState !== undefined) {
                this.state = this.previousState;
                this.previousState = undefined;
            }
        };
        Game.prototype.loadDataFrom = function (savedGame, theme) {
            var _this = this;
            this._currentPlayer = savedGame._currentPlayer;
            this._board = new Model.Board(theme);
            this._board.loadDataFrom(savedGame._board);
            this._treasureCards = savedGame._treasureCards;
            this._eventCards = savedGame._eventCards;
            this.currentEventCardIndex = savedGame.currentEventCardIndex;
            this.currentTreasureCardIndex = savedGame.currentTreasureCardIndex;
            this.previousState = savedGame.previousState;
            this.state = savedGame.state;
            this._moveContext = new Model.MoveContext();
            this._moveContext.skipGoAward = savedGame._moveContext.skipGoAward;
            this._moveContext.doubleRent = savedGame._moveContext.doubleRent;
            this._moveContext.flyByEvents = savedGame._moveContext.flyByEvents;
            this._gameParams = new Model.GameParams();
            this._gameParams.loadDataFrom(savedGame._gameParams);
            this.players = [];
            this.lastDiceResult1 = savedGame.lastDiceResult1;
            this.lastDiceResult2 = savedGame.lastDiceResult2;
            savedGame.players.forEach(function (savedPlayer) {
                var player = new Model.Player(savedPlayer.playerName, savedPlayer.human);
                player.loadDataFrom(savedPlayer, _this.board);
                _this.players.push(player);
            });
        };
        Game.prototype.performTrade = function (tradeState) {
            var _this = this;
            tradeState.firstPlayerSelectedAssets.forEach(function (firstPlayerAsset) {
                var asset = _this.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.name === firstPlayerAsset.name; })[0].asset;
                asset.setOwner(tradeState.secondPlayer.playerName);
            });
            tradeState.secondPlayerSelectedAssets.forEach(function (secondPlayerAsset) {
                var asset = _this.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.name === secondPlayerAsset.name; })[0].asset;
                asset.setOwner(tradeState.firstPlayer.playerName);
            });
        };
        Game.version = "game_v0_01";
        return Game;
    }());
    Model.Game = Game;
})(Model || (Model = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/game.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var GameController = (function () {
            function GameController(stateService, stateParamsService, swipeService, scope, rootScope, timeoutService, compileService, gameService, drawingService, aiService, themeService, settingsService, tutorialService, tradeService) {
                var _this = this;
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
                var spService = this.stateParamsService;
                var loadGame = eval(spService.loadGame);
                this.initGame(loadGame);
                var sceneCreated = this.createScene();
                this.availableActions = new MonopolyApp.Viewmodels.AvailableActions();
                this.setAvailableActions();
                this.initMessageHistory();
                this.currentCard = new MonopolyApp.Viewmodels.Card();
                this.bindInputEvents();
                this.commandPanelBottomOffset = this.settingsService.options.staticCamera ? 20 : 2;
                this.tutorialInitialized = false;
                var that = this;
                this.scope.$on("$destroy", function () {
                    window.removeEventListener("resize", that.resizeEventListener);
                    var windowAny = window;
                    windowAny.gameEngine = undefined;
                    that.unbindInputEvents();
                    that.gameEngine.dispose();
                    that.scene = undefined;
                    delete that.gameEngine;
                    console.log("Scene destroyed!");
                });
                this.timeoutService(function () {
                    that.initAudio();
                    that.stopMusic();
                    //that.playMusic();
                });
                $.when(sceneCreated).done(function () {
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
                    if (_this.gameService.isComputerMove) {
                        that.timeoutService(function () {
                            that.setupThrowDice();
                        }, 3000);
                    }
                });
            }
            Object.defineProperty(GameController.prototype, "currentPlayer", {
                get: function () {
                    return this.gameService.getCurrentPlayer();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameController.prototype, "playerModels", {
                get: function () {
                    return this.players;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameController.prototype, "theme", {
                get: function () {
                    return this.themeService.theme;
                },
                enumerable: true,
                configurable: true
            });
            GameController.prototype.initGame = function (loadGame) {
                this.tradeMode = false;
                this.gameService.initGame(loadGame);
                this.drawingService.initGame();
                if (loadGame) {
                    this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
                }
            };
            GameController.prototype.setupThrowDice = function () {
                var _this = this;
                if (this.isBlockedByTutorial("setupthrow")) {
                    return;
                }
                if (this.gameService.canThrowDice) {
                    this.executeTutorialCallback("setupthrow");
                    this.gameService.throwDice();
                    this.setAvailableActions();
                    this.commandPanelBottomOffset = 2;
                    this.drawingService.setupDiceForThrow(this.scene);
                    $.when(this.drawingService.moveCameraForDiceThrow(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition())).done(function () {
                        var that = _this;
                        _this.scope.$apply(function () {
                            _this.executeTutorialCallback("throw");
                        });
                        if (_this.gameService.isComputerMove) {
                            _this.throwDice([_this.drawingService.getRandomPointOnDice(0), _this.drawingService.getRandomPointOnDice(1)]);
                        }
                    });
                }
            };
            GameController.prototype.throwDice = function (impulsePoint) {
                if (this.gameService.gameState === Model.GameState.ThrowDice) {
                    this.diceThrowCompleted = $.Deferred();
                    this.drawingService.animateDiceThrow(this.scene, impulsePoint);
                    var that = this;
                    $.when(this.diceThrowCompleted).done(function () {
                        that.diceThrowCompleted = undefined;
                        var diceResult1 = that.drawingService.getDiceResult(0);
                        var diceResult2 = undefined;
                        if (diceResult1 && diceResult1 > 0) {
                            diceResult2 = that.drawingService.getDiceResult(1);
                        }
                        if (diceResult2 && diceResult2 > 0) {
                            that.gameService.setDiceResult([diceResult1, diceResult2]);
                            that.drawingService.unregisterPhysicsMeshes(that.scene);
                            that.movePlayer();
                        }
                        else {
                            // something went wrong - unable to determine dice orientation; just drop it again from a height
                            if (!diceResult1 || diceResult1 === 0) {
                                that.resetOverboardDice(0, new BABYLON.Vector3(-0.3, -1, 0));
                            }
                            if (!diceResult2 || diceResult2 === 0) {
                                that.resetOverboardDice(1, new BABYLON.Vector3(0.3, -1, 0));
                            }
                            that.drawingService.unregisterPhysicsMeshes(that.scene);
                            that.throwDice();
                        }
                    });
                }
            };
            // move player to a destination defined by last dice throw or by explicit parameter value (as requested by an event card, for instance)
            GameController.prototype.movePlayer = function (newPositionIndex, backwards, doubleRent) {
                var d = $.Deferred();
                var oldPosition = this.gameService.getCurrentPlayerPosition();
                var newPosition = this.gameService.moveCurrentPlayer(newPositionIndex, doubleRent);
                var cameraMovementCompleted = this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, oldPosition.index);
                var that = this;
                $.when(cameraMovementCompleted).done(function () {
                    cameraMovementCompleted = that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, oldPosition.index, 30, true);
                    $.when(cameraMovementCompleted).done(function () {
                        var animateMoveCompleted;
                        var followBoardAnimation = $.Deferred();
                        if (newPosition) {
                            that.playerMoving = true;
                            that.playRocketSound();
                            animateMoveCompleted = that.animateMove(oldPosition, newPosition, newPositionIndex !== undefined, backwards);
                            //var positionsToMove = oldPosition.index < newPosition.index ? newPosition.index - oldPosition.index : (40 - oldPosition.index) + newPosition.index;
                            var positionsToMove = backwards ? (newPosition.index <= oldPosition.index ? oldPosition.index - newPosition.index : 40 - newPosition.index + oldPosition.index) :
                                newPosition.index >= oldPosition.index ? newPosition.index - oldPosition.index : 40 - oldPosition.index + newPosition.index;
                            that.followBoardFields(oldPosition.index, positionsToMove, that.drawingService, that.scene, that.gameCamera, that, followBoardAnimation, newPositionIndex !== undefined, backwards);
                        }
                        else {
                            animateMoveCompleted = $.Deferred().resolve();
                            followBoardAnimation = $.Deferred().resolve();
                        }
                        $.when.apply($, [animateMoveCompleted, followBoardAnimation]).done(function () {
                            that.playerMoving = false;
                            that.playRocketSound(true);
                            if (!that.gameService.isComputerMove) {
                                that.gameService.saveGame();
                            }
                            that.scope.$apply(function () {
                                that.setAvailableActions();
                                $.when(that.processDestinationField()).done(function () {
                                    that.gameService.moveProcessingDone();
                                    if (that.gameService.isComputerMove && (that.gameService.canEndTurn || that.gameService.canSurrender || that.gameService.canGetOutOfJail)) {
                                        // since movePlayer() can be executed several times during a single move, we must ensure this block only runs once
                                        var computerActions = $.Deferred();
                                        that.processComputerActions(computerActions);
                                        $.when(computerActions).done(function (anotherMove) {
                                            if (!anotherMove) {
                                                // end the turn after processing, unless one of the computer actions resulted in another move 
                                                // (for instance, if computer bailed out of jail)
                                                that.endTurn();
                                            }
                                            that.updatePlayersForView();
                                            that.setAvailableActions();
                                            d.resolve();
                                        });
                                    }
                                    else {
                                        that.timeoutService(function () {
                                            that.scope.$apply(function () {
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
            };
            GameController.prototype.processComputerActions = function (allActionsProcessed, skipBuyingHouses) {
                var _this = this;
                var actions = this.aiService.afterMoveProcessing(skipBuyingHouses);
                var computerActions = $.Deferred();
                var tradeActions = $.Deferred();
                if (actions.length === 0 || actions.filter(function (a) { return a.actionType === Model.AIActionType.Trade; }).length === 0) {
                    tradeActions.resolve();
                }
                if (actions.length > 0) {
                    var tradingAlreadyProcessed = false; // allow at most one trading action per processing sequence
                    var tradeSkipped = false;
                    actions.forEach(function (action) {
                        if (action.actionType === Model.AIActionType.Buy) {
                            _this.buy();
                        }
                        if (action.actionType === Model.AIActionType.Mortgage || action.actionType === Model.AIActionType.Unmortgage) {
                            _this.toggleMortgageAsset(action.asset);
                        }
                        if (action.actionType === Model.AIActionType.SellHouse || action.actionType === Model.AIActionType.SellHotel) {
                            _this.gameService.removeHousePreview(_this.currentPlayer, action.position);
                            if (_this.gameService.commitHouseOrHotel(_this.currentPlayer, 0, action.asset.group)) {
                                var viewBoardField = _this.boardFields.filter(function (f) { return f.index === action.position; })[0];
                                _this.drawingService.setBoardFieldHouses(viewBoardField, action.asset.houses, action.asset.hotel, undefined, undefined, _this.scene);
                                _this.showMessage(_this.currentPlayer + " sold " + (action.actionType === Model.AIActionType.SellHouse ? "a " + _this.theme.house : _this.theme.hotel) + " on " + action.asset.name + ".");
                            }
                        }
                        if (action.actionType === Model.AIActionType.BuyHouse || action.actionType === Model.AIActionType.BuyHotel) {
                            for (var i = 0; i < action.numHousesOrHotels; i++) {
                                _this.gameService.addHousePreviewForGroup(_this.currentPlayer, action.assetGroup);
                                if (!_this.gameService.commitHouseOrHotel(_this.currentPlayer, 0, action.assetGroup)) {
                                }
                            }
                            var groupFields = _this.gameService.getGroupBoardFields(action.assetGroup);
                            groupFields.forEach(function (groupField) {
                                var viewBoardFieldWithHouse = _this.boardFields.filter(function (f) { return f.index === groupField.index; })[0];
                                _this.drawingService.setBoardFieldHouses(viewBoardFieldWithHouse, groupField.asset.houses, groupField.asset.hotel, undefined, undefined, _this.scene);
                            });
                            _this.showMessage(_this.currentPlayer + " bought " + action.numHousesOrHotels + " " + (action.actionType === Model.AIActionType.BuyHouse ? _this.theme.house : _this.theme.hotel) + "s.");
                        }
                        if (action.actionType === Model.AIActionType.Surrender) {
                            _this.doSurrender();
                        }
                        if (action.actionType === Model.AIActionType.GetOutOfJail) {
                            _this.getOutOfJail();
                        }
                        if (action.actionType === Model.AIActionType.Trade && !tradingAlreadyProcessed) {
                            tradingAlreadyProcessed = true;
                            if (!action.tradeState.secondPlayer.human) {
                                _this.tradeService.executeTrade(action.tradeState);
                                // redraw board field owner boxes
                                _this.redrawTradeBoardFields(action.tradeState);
                                _this.updatePlayersForView();
                                _this.showTradeMessage(action.tradeState);
                                tradeActions.resolve();
                            }
                            else {
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
                                var viewPlayer = _this.players.filter(function (p) { return p.name === action.tradeState.secondPlayer.playerName; })[0];
                                if (!viewPlayer.numTurnsToWaitBeforeTrade || viewPlayer.numTurnsToWaitBeforeTrade === 0) {
                                    var that = _this;
                                    sweetAlert({
                                        title: "Trade message for " + action.tradeState.secondPlayer.playerName,
                                        text: action.tradeState.secondPlayer.playerName + ", " + action.tradeState.firstPlayer.playerName + " has a trade offer for you.",
                                        type: "info",
                                        showCancelButton: true,
                                        confirmButtonText: "Let me see",
                                        cancelButtonText: "Not now"
                                    }, function (isConfirm) {
                                        if (isConfirm) {
                                            $("#commandPanel").hide();
                                            that.tradeWith(action.tradeState.secondPlayer.playerName, tradeActions);
                                            var tradeState = that.tradeService.getTradeState();
                                            tradeState.initializeFrom(action.tradeState);
                                            that.makeTradeOffer();
                                        }
                                        else {
                                            // trade, initiated by the computer, has been rejected by the human player - set the counter to avoid the player being flooded by trade offers
                                            viewPlayer.numTurnsToWaitBeforeTrade = 5;
                                            tradeActions.resolve();
                                        }
                                    });
                                }
                                else {
                                    tradeSkipped = true;
                                    tradeActions.resolve();
                                }
                            }
                        }
                    });
                    // give other players time to catch up with computer's actions
                    this.timeoutService(function () {
                        computerActions.resolve();
                    }, !tradeSkipped || actions.length > 1 ? 3000 : 0);
                }
                else {
                    if (this.gameService.anyFlyByEvents) {
                        // give other players time to catch up with computer's actions
                        this.timeoutService(function () {
                            computerActions.resolve();
                        }, 3000);
                    }
                    else {
                        computerActions.resolve();
                    }
                }
                var that = this;
                $.when.apply($, [computerActions, tradeActions]).done(function () {
                    if (actions.length > 0 && actions.every(function (a) { return a.actionType !== Model.AIActionType.GetOutOfJail && a.actionType !== Model.AIActionType.Surrender; })) {
                        // if any action, beside getting out of jail or surrendering, has been processed, repeat until there are no more actions for the computer to perform
                        that.processComputerActions(allActionsProcessed);
                    }
                    else {
                        allActionsProcessed.resolve(actions.length > 0 && actions.some(function (a) { return a.actionType === Model.AIActionType.GetOutOfJail; }));
                    }
                });
            };
            // animate game camera by following board fields from player current field to its movement destination field; this animation occurs at the same time that the player is moving
            GameController.prototype.followBoardFields = function (positionIndex, positionsLeftToMove, drawingService, scene, camera, gameController, followBoardAnimation, fast, backwards) {
                if (positionsLeftToMove > 0) {
                    var numFrames = 0;
                    var processedEvent;
                    do {
                        if (backwards) {
                            positionIndex--;
                            if (positionIndex < 0) {
                                positionIndex = 40 + positionIndex;
                            }
                        }
                        else {
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
                    $.when(cameraMoveCompleted).done(function () {
                        if (processedEvent !== Model.ProcessingEvent.None) {
                            gameController.timeoutService(function () {
                                gameController.scope.$apply(function () {
                                    gameController.updatePlayersForView();
                                });
                            });
                        }
                        gameController.showMessageForEvent(processedEvent);
                        gameController.followBoardFields(positionIndex, positionsLeftToMove, drawingService, scene, camera, gameController, followBoardAnimation, fast, backwards);
                    });
                }
                else {
                    followBoardAnimation.resolve();
                }
            };
            GameController.prototype.buy = function () {
                var bought = this.gameService.buy();
                if (bought) {
                    var boardField = this.gameService.getCurrentPlayerPosition();
                    this.drawingService.setBoardFieldOwner(this.boardFields.filter(function (f) { return f.index === boardField.index; })[0], boardField.asset, this.scene, true);
                    this.showMessage(this.currentPlayer + " bought " + boardField.asset.name + " for " + this.theme.moneySymbol + boardField.asset.price + ".");
                    this.updatePlayersForView();
                }
                this.setAvailableActions();
            };
            GameController.prototype.manage = function () {
                if (!this.manageMode) {
                    if (this.isBlockedByTutorial("manage")) {
                        return;
                    }
                    this.manageMode = true;
                    this.actionButtonsVisible = false;
                    this.focusedAssetGroupIndex = this.gameService.manage();
                    this.gameCameraPosition = new BABYLON.Vector3(this.gameCamera.position.x, this.gameCamera.position.y, this.gameCamera.position.z);
                    this.gameCameraRotation = new BABYLON.Vector3(this.gameCamera.rotation.x, this.gameCamera.rotation.y, this.gameCamera.rotation.z);
                    var d = this.setupManageHighlight(true);
                    this.setAvailableActions();
                    var that = this;
                    $("#commandPanel").hide();
                    $("#manageCommandPanel").addClass("panelShown");
                    $("#manageCommandPanel").show();
                    if (this.tutorial) {
                        $.when(d).done(function () {
                            that.tutorialService.initManageModeTutorial(that.scope);
                            that.manageModeLoaded = true;
                        });
                    }
                    else {
                        that.manageModeLoaded = true;
                    }
                }
            };
            GameController.prototype.returnFromManage = function () {
                if (!this.manageModeLoaded || this.isBlockedByTutorial("returnfrommanage")) {
                    return;
                }
                this.manageMode = false;
                this.manageModeLoaded = false;
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
                this.timeoutService(function () {
                    $("#commandPanel").show();
                });
            };
            GameController.prototype.trade = function () {
                var _this = this;
                if (this.gameService.canTrade) {
                    if (this.isBlockedByTutorial("trade")) {
                        return;
                    }
                    $("#commandPanel").hide();
                    var players = this.gameService.getPlayersForTrade();
                    var that = this;
                    if (players.length === 2) {
                        var secondPlayer = this.gameService.players.filter(function (p) { return p.playerName !== _this.currentPlayer; })[0];
                        this.tradeWith(secondPlayer.playerName, undefined);
                    }
                    else {
                        $("[name|='tradeButtonPlayer']").hide();
                        this.gameService.players.forEach(function (p, i) {
                            if (p.playerName !== that.currentPlayer && players.filter(function (playerForTrade) { return playerForTrade.playerName === p.playerName; }).length > 0) {
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
                        }, function (isConfirm) {
                            $("#commandPanel").show();
                        });
                        // finally, inject the compiled elements into the DOM
                        $(".sweet-alert [name='playersForTradeTable']").replaceWith(compiledHtml);
                    }
                }
            };
            GameController.prototype.tradeWith = function (playerToTradeWith, tradeActions) {
                var _this = this;
                sweetAlert.close();
                var firstPlayer = this.gameService.players.filter(function (p) { return p.playerName === _this.currentPlayer; })[0];
                var secondPlayer = this.gameService.players.filter(function (p) { return p.playerName === playerToTradeWith; })[0];
                if (!firstPlayer || !secondPlayer) {
                    return;
                }
                this.gameService.trade();
                this.tradeMode = true;
                var treeContainer = $("#leftTree");
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
            };
            GameController.prototype.returnFromTrade = function (execute) {
                var _this = this;
                if (this.tradeMode) {
                    this.gameService.returnFromTrade();
                    this.tradeMode = false;
                    var treeContainer = $("#leftTree");
                    treeContainer.jstree("destroy");
                    treeContainer = $("#rightTree");
                    treeContainer.jstree("destroy");
                    //$("#player1TradeMoney").slider("destroy");
                    //$("#player2TradeMoney").slider("destroy");
                    var that = this;
                    // show command panel in the next event loop iteration to avoid its mouse event handler to process this event by highlighting one of its buttons
                    this.timeoutService(function () {
                        $("#commandPanel").show();
                        var tradeState = _this.tradeService.getTradeState();
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
            };
            GameController.prototype.endTurn = function () {
                var _this = this;
                if (this.gameService.canEndTurn) {
                    var viewPlayer = this.players.filter(function (p) { return p.name === _this.currentPlayer; })[0];
                    if (viewPlayer.numTurnsToWaitBeforeTrade && viewPlayer.numTurnsToWaitBeforeTrade > 0) {
                        viewPlayer.numTurnsToWaitBeforeTrade--;
                    }
                    var activePlayer = this.currentPlayer;
                    this.gameService.endTurn();
                    this.gameService.saveGame();
                    var that = this;
                    if (activePlayer === this.currentPlayer) {
                        this.showMessage(this.currentPlayer + " has been granted another turn.");
                    }
                    else {
                        this.showMessage(this.currentPlayer + " is starting his turn.");
                    }
                    this.timeoutService(function () {
                        that.scope.$apply(function () {
                            _this.commandPanelBottomOffset = _this.settingsService.options.staticCamera ? 20 : 2;
                            that.setAvailableActions();
                        });
                    });
                    $.when(this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition().index)).done(function () {
                        if (that.gameService.isComputerMove) {
                            var computerActions = $.Deferred();
                            that.processComputerActions(computerActions);
                            $.when(computerActions).done(function () {
                                that.updatePlayersForView();
                                that.timeoutService(function () {
                                    that.setupThrowDice();
                                }, 700);
                            });
                        }
                    });
                }
            };
            GameController.prototype.pause = function () {
                if (this.isBlockedByTutorial("pause")) {
                    return;
                }
                this.gameService.saveGame();
                //this.drawingService.cleanup(this.scene);
                //this.scene = undefined;
                this.stateService.go("pause");
            };
            GameController.prototype.closeAssetManagementWindow = function () {
                $("#assetManagement").removeClass("assetManagementShown");
                $("#assetManagement").hide();
                this.showManageCommandPanel();
            };
            GameController.prototype.executeConfirmAction = function (data) {
                this.confirmButtonCallback(data);
            };
            GameController.prototype.executeCancelAction = function (data) {
                this.cancelButtonCallback(data);
            };
            GameController.prototype.showMessageForEvent = function (processingEvent) {
                if (processingEvent === Model.ProcessingEvent.None) {
                    return;
                }
                else if (processingEvent === Model.ProcessingEvent.PassGoAward) {
                    this.showMessage(this.gameService.getCurrentPlayer() + " passed START and received " + this.themeService.theme.moneySymbol + this.settingsService.settings.rules.passStartAward + ".");
                }
            };
            GameController.prototype.makeTradeOffer = function () {
                var _this = this;
                this.timeoutService(function () {
                    _this.unhighlightTradeButton($(".highlightedTradeButton"));
                });
                if (this.tradeService.makeTradeOffer()) {
                    var that = this;
                    sweetAlert({
                        title: "Trade confirmation",
                        text: "Your trade offer has been accepted!",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonText: "Ok"
                    }, function (isConfirm) {
                        that.returnFromTrade(true);
                    });
                }
            };
            GameController.prototype.acceptTradeOffer = function () {
                this.tradeService.acceptTradeOffer();
                this.returnFromTrade(true);
                //this.unhighlightTradeButton($(".highlightedTradeButton"));
            };
            GameController.prototype.toggleMortgageConfirm = function () {
                var _this = this;
                if (this.gameService.canMortgage(this.assetToManage)) {
                    var that = this;
                    var dialogText;
                    if (!this.assetToManage.mortgage) {
                        dialogText = "Do you wish to mortgage " + this.assetToManage.name + " for " + this.themeService.theme.moneySymbol + this.assetToManage.valueMortgage + "?";
                    }
                    else {
                        dialogText = "Do you wish to pay off mortgage " + this.assetToManage.name + " for " + this.themeService.theme.moneySymbol + (Math.floor(this.assetToManage.valueMortgage * 1.1)) + "?";
                    }
                    sweetAlert({
                        title: "Mortgage confirmation",
                        text: dialogText,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No"
                    }, function (isConfirm) {
                        if (isConfirm) {
                            if (!_this.toggleMortgageAsset(_this.assetToManage)) {
                                _this.showConfirmationPopup("Sorry, you do not have enough money!", true, false);
                            }
                            _this.scope.$apply(function () {
                                _this.updatePlayersForView();
                            });
                        }
                    });
                }
            };
            GameController.prototype.toggleMortgageAsset = function (asset) {
                var success = this.gameService.toggleMortgageAsset(asset);
                if (success) {
                    var viewBoardField = this.boardFields.filter(function (boardField) { return boardField.assetName && boardField.assetName === asset.name; })[0];
                    this.drawingService.setBoardFieldMortgage(viewBoardField, asset, this.scene, true);
                    if (asset.mortgage) {
                        this.showMessage(this.currentPlayer + " mortgaged " + asset.name + ".");
                    }
                    else {
                        this.showMessage(this.currentPlayer + " released mortgage on " + asset.name + ".");
                    }
                }
                return success;
            };
            GameController.prototype.showConfirmationPopup = function (text, isError, isSuccess) {
                sweetAlert({
                    title: isError ? "Error" : "Moonopoly message",
                    text: text,
                    type: isError ? "error" : (isSuccess ? "success" : "info"),
                    confirmButtonText: "Ok",
                    allowOutsideClick: true
                });
            };
            GameController.prototype.showActionPopup = function (text, onConfirm, onCancel) {
                sweetAlert({
                    title: "Moonopoly message",
                    text: text,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"
                }, function (isConfirm) {
                    if (isConfirm) {
                        onConfirm();
                    }
                    else {
                        onCancel();
                    }
                });
            };
            GameController.prototype.canMortgageSelected = function () {
                return this.gameService.canMortgage(this.assetToManage);
            };
            GameController.prototype.getOutOfJail = function () {
                this.gameService.getOutOfJail();
                this.showMessage(this.currentPlayer + " paid " + this.themeService.theme.moneySymbol + this.gameService.gameParams.jailBail + " to end his quarantine.");
                this.setAvailableActions();
                if (this.gameService.lastDiceResult) {
                    this.movePlayer();
                }
            };
            GameController.prototype.surrender = function () {
                var that = this;
                if (this.gameService.canSurrender) {
                    this.showActionPopup("Are you sure you wish to surrender?", function () {
                        that.doSurrender();
                        that.endTurn();
                    }, function () { });
                }
            };
            GameController.prototype.redrawTradeBoardFields = function (tradeState) {
                // redraw board field owner boxes
                var that = this;
                tradeState.firstPlayerSelectedAssets.forEach(function (firstPlayerAsset) {
                    var boardField = that.boardFields.filter(function (f) { return f.assetName === firstPlayerAsset.name; })[0];
                    that.drawingService.setBoardFieldOwner(boardField, firstPlayerAsset, that.scene, true);
                });
                tradeState.secondPlayerSelectedAssets.forEach(function (secondPlayerAsset) {
                    var boardField = that.boardFields.filter(function (f) { return f.assetName === secondPlayerAsset.name; })[0];
                    that.drawingService.setBoardFieldOwner(boardField, secondPlayerAsset, that.scene, true);
                });
            };
            GameController.prototype.doSurrender = function () {
                if (this.gameService.canSurrender) {
                    this.clearCurrentPlayerFromBoard();
                    this.gameService.surrender();
                    this.showMessage(this.currentPlayer + " has surrendered!");
                    this.setAvailableActions();
                    if (this.gameService.gameState === Model.GameState.EndOfGame) {
                        this.showConfirmationPopup(this.gameService.winner + " has won the game!", false, true);
                    }
                }
            };
            GameController.prototype.createScene = function () {
                var canvas = document.getElementById("renderCanvas");
                this.gameEngine = new BABYLON.Engine(canvas, true);
                var d = this.createBoard(this.gameEngine, canvas);
                //BABYLON.Scene.MaxDeltaTime = 30.0;
                var that = this;
                this.gameEngine.runRenderLoop(function () {
                    if (that.scene) {
                        if (that.gameService.gameState === Model.GameState.Move || that.gameService.gameState === Model.GameState.Process) {
                            that.scene.render();
                        }
                        else {
                            // not sure why, but the input handlers starve unless the render loop is re-inserted in the queue using a timeout service
                            that.timeoutService(function () {
                                if (that.scene) {
                                    if (that.gameService.gameState === Model.GameState.ThrowDice && that.diceThrowCompleted) {
                                        // if the game is at the dice throw state and the dice throw has been triggered, verify if it is done, otherwise just follow with the camera
                                        if (that.drawingService.isDiceAtRestAfterThrowing(that.scene)) {
                                            that.diceThrowCompleted.resolve();
                                        }
                                        else {
                                            var dicePhysicsLocation1 = that.drawingService.getDiceLocation(that.scene, 0);
                                            var dicePhysicsLocation2 = that.drawingService.getDiceLocation(that.scene, 1);
                                            if (dicePhysicsLocation1 && dicePhysicsLocation2) {
                                                that.resetOverboardDice(0, dicePhysicsLocation1);
                                                that.resetOverboardDice(1, dicePhysicsLocation2);
                                                var diceMidpoint = new BABYLON.Vector3((dicePhysicsLocation1.x + dicePhysicsLocation2.x) / 2, (dicePhysicsLocation1.y + dicePhysicsLocation2.y) / 2, (dicePhysicsLocation1.z + dicePhysicsLocation2.z) / 2);
                                                that.gameCamera.setTarget(diceMidpoint);
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
            };
            GameController.prototype.resizeEventListener = function () {
                //this.gameEngine.resize();
                var windowAny = window;
                var gameEngine = windowAny.gameEngine;
                if (gameEngine) {
                    gameEngine.resize();
                }
            };
            GameController.prototype.createBoard = function (engine, canvas) {
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
                var shadowGenerator = undefined;
                if (this.settingsService.options.shadows) {
                    shadowGenerator = new BABYLON.ShadowGenerator(1024, light3);
                    shadowGenerator.bias = 0.00001;
                    //shadowGenerator.usePoissonSampling = true;
                    shadowGenerator.useVarianceShadowMap = true;
                }
                this.drawingService.createBoard(this.scene, []);
                this.initPlayers();
                var meshLoads = this.drawingService.loadMeshes(this.players, this.scene, shadowGenerator, this);
                var that = this;
                $.when.apply($, meshLoads).done(function () {
                    that.setupPlayerPositions(that);
                    that.setupBoardFields();
                    d.resolve();
                });
                return d;
            };
            GameController.prototype.initPlayers = function () {
                var _this = this;
                this.players = [];
                var that = this;
                var index = 0;
                this.gameService.players.forEach(function (player) {
                    var playerModel = new MonopolyApp.Viewmodels.Player();
                    playerModel.name = player.playerName;
                    playerModel.money = player.money;
                    playerModel.index = index;
                    playerModel.color = _this.getColor(player.color);
                    playerModel.active = player.active;
                    that.playerModels.push(playerModel);
                    index++;
                });
            };
            GameController.prototype.getColor = function (playerColor) {
                if (playerColor === Model.PlayerColor.Blue) {
                    return "#4C4CFF";
                }
                else if (playerColor === Model.PlayerColor.Red) {
                    return "#FF4C4C";
                }
                else if (playerColor === Model.PlayerColor.Green) {
                    return "#4CFF4C";
                }
                else if (playerColor === Model.PlayerColor.Yellow) {
                    return "#FFFF4C";
                }
                return "#000000";
            };
            GameController.prototype.setupBoardFields = function () {
                var _this = this;
                this.boardFields = [];
                for (var i = 0; i < 40; i++) {
                    var boardField = new MonopolyApp.Viewmodels.BoardField();
                    boardField.index = i;
                    this.boardFields.push(boardField);
                }
                for (var assetGroup = Model.AssetGroup.First; assetGroup <= Model.AssetGroup.Railway; assetGroup++) {
                    var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                    groupBoardFields.forEach(function (groupBoardField) {
                        var viewBoardField = _this.boardFields.filter(function (f) { return f.index === groupBoardField.index; })[0];
                        viewBoardField.assetName = groupBoardField.asset.name;
                        if (!groupBoardField.asset.unowned) {
                            _this.drawingService.setBoardFieldOwner(viewBoardField, groupBoardField.asset, _this.scene, false);
                        }
                    });
                }
            };
            GameController.prototype.setupPlayerPositions = function (that) {
                that.players.forEach(function (playerModel) {
                    if (playerModel.active) {
                        that.drawingService.positionPlayer(playerModel);
                    }
                });
            };
            GameController.prototype.setAvailableActions = function () {
                this.availableActions.endTurn = !this.gameService.isComputerMove && this.gameService.canEndTurn;
                this.availableActions.throwDice = !this.gameService.isComputerMove && this.gameService.canThrowDice;
                this.availableActions.buy = !this.gameService.isComputerMove && this.gameService.canBuy;
                this.availableActions.manage = !this.gameService.isComputerMove && this.gameService.canManage;
                this.availableActions.trade = !this.gameService.isComputerMove && this.gameService.canTrade;
                this.availableActions.getOutOfJail = !this.gameService.isComputerMove && this.gameService.canGetOutOfJail;
                this.availableActions.surrender = !this.gameService.isComputerMove && this.gameService.canSurrender;
                this.availableActions.pause = (!this.gameService.isComputerMove || this.gameService.players.filter(function (p) { return p.active && p.human; }).length === 0) && this.gameService.canPause;
            };
            GameController.prototype.animateMove = function (oldPosition, newPosition, fast, backwards) {
                var _this = this;
                var playerModel = this.players.filter(function (p) { return p.name === _this.gameService.getCurrentPlayer(); })[0];
                return this.drawingService.animatePlayerMove(oldPosition, newPosition, playerModel, this.scene, fast, backwards);
            };
            GameController.prototype.processDestinationField = function () {
                var d = $.Deferred();
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Asset) {
                    $.when(this.processAssetField(this.gameService.getCurrentPlayerPosition())).done(function () { d.resolve(); });
                }
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Treasure || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Event) {
                    $.when(this.processCardField(this.gameService.getCurrentPlayerPosition())).done(function () {
                        d.resolve();
                    });
                }
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Tax || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.TaxIncome) {
                    $.when(this.processTaxField(this.gameService.getCurrentPlayerPosition().type)).done(function () {
                        d.resolve();
                    });
                }
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.GoToPrison) {
                    $.when(this.processGoToPrisonField()).done(function () {
                        d.resolve();
                    });
                }
                else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.PrisonAndVisit) {
                    this.processPrisonField();
                    d.resolve();
                }
                else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.FreeParking) {
                    d.resolve();
                }
                else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Start) {
                    d.resolve();
                }
                return d;
            };
            GameController.prototype.processAssetField = function (position) {
                var d = $.Deferred();
                this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
                if (!position.asset.unowned && position.asset.owner !== this.gameService.getCurrentPlayer()) {
                    var result = this.gameService.processOwnedFieldVisit();
                    if (result.message) {
                        this.showMessage(result.message);
                        if (this.gameService.isComputerMove) {
                            // give other players time to catch up with computer's actions
                            this.timeoutService(function () {
                                d.resolve();
                            }, 3000);
                        }
                        else {
                            d.resolve();
                        }
                    }
                    else {
                        d.resolve();
                    }
                    this.updatePlayersForView();
                }
                else {
                    d.resolve();
                }
                return d;
            };
            GameController.prototype.showMessage = function (message) {
                $("#messageOverlay").stop();
                $("#messageOverlay").css({ opacity: 1, top: 0 });
                var overlayOffset = Math.floor(jQuery(window).height() * 0.15);
                $("#messageOverlay").html(message).show().animate({
                    top: "-=" + overlayOffset + "px",
                    opacity: 0
                }, 5000, function () {
                    $("#messageOverlay").hide();
                    $("#messageOverlay").css({ opacity: 1, top: 0 });
                });
                this.messages.push(message);
                this.refreshMessageHistory();
            };
            GameController.prototype.handleSwipe = function (left) {
                if (this.manageMode) {
                    if (!this.tutorialService.isActive) {
                        this.focusedAssetGroupIndex = this.gameService.manageFocusChange(left);
                        this.setupManageHighlight(true);
                    }
                }
            };
            GameController.prototype.setupManageHighlight = function (animate) {
                var d = this.drawingService.setManageCameraPosition(this.gameCamera, this.focusedAssetGroupIndex, this.scene, animate);
                if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex)) {
                    this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
                }
                return d;
            };
            GameController.prototype.handleClickEvent = function (eventObject) {
                var data = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    data[_i - 1] = arguments[_i];
                }
                var thisInstance = eventObject.data;
                var mouseEventObject;
                if (thisInstance.tutorialService.isActive && thisInstance.tutorialService.canAdvanceByClick && $("#tutorialMessage:visible").length > 0) {
                    thisInstance.scope.$apply(function () {
                        thisInstance.tutorialService.advanceToNextStep();
                    });
                    if (!thisInstance.tutorialService.canProcessClick) {
                        return;
                    }
                }
                if (thisInstance.manageMode && !thisInstance.swipeInProgress) {
                    mouseEventObject = eventObject.originalEvent;
                    var pickedObject = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                    if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.BoardField) {
                        if ($("#assetManagement").hasClass("assetManagementShown")) {
                            return;
                        }
                        var groupFields = thisInstance.gameService.getBoardFieldsInGroup(thisInstance.focusedAssetGroupIndex);
                        var clickedFields = groupFields.filter(function (f) { return f.index === pickedObject.position; });
                        if (clickedFields.length > 0) {
                            // user clicked a field that is currently focused - show its details
                            thisInstance.scope.$apply(function () {
                                thisInstance.manageField(clickedFields[0].asset);
                            });
                        }
                    }
                    else if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                        thisInstance.addHousePreview(pickedObject.position);
                    }
                    else if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.RemoveHouse) {
                        thisInstance.removeHousePreview(pickedObject.position);
                    }
                }
                if (thisInstance.gameService.gameState === Model.GameState.ThrowDice && !thisInstance.swipeInProgress && !thisInstance.gameService.isComputerMove) {
                    mouseEventObject = eventObject.originalEvent;
                    var pickedObject2 = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                    if (pickedObject2 && pickedObject2.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.Dice1) {
                        thisInstance.throwDice([pickedObject2.pickedPoint, thisInstance.drawingService.getRandomPointOnDice(1)]);
                    }
                    else if (pickedObject2 && pickedObject2.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.Dice2) {
                        thisInstance.throwDice([thisInstance.drawingService.getRandomPointOnDice(0), pickedObject2.pickedPoint]);
                    }
                }
            };
            GameController.prototype.manageField = function (asset) {
                this.assetToManage = asset;
                $("#assetManagement").addClass("assetManagementShown");
                this.toggleManageCommandPanel();
                $("#assetManagement").show();
            };
            GameController.prototype.toggleManageCommandPanel = function (hide) {
                if (hide) {
                    $("#manageCommandPanel").removeClass("panelShown").addClass("panelHidden");
                    $("#manageCommandPanel").hide();
                    return;
                }
                if ($("#manageCommandPanel").hasClass("panelShown")) {
                    $("#manageCommandPanel").removeClass("panelShown").addClass("panelHidden");
                    $("#manageCommandPanel").hide();
                }
                else {
                    $("#manageCommandPanel").removeClass("panelHidden").addClass("panelShown");
                    $("#manageCommandPanel").show();
                }
            };
            GameController.prototype.showManageCommandPanel = function () {
                $("#manageCommandPanel").removeClass("panelHidden").addClass("panelShown");
                $("#manageCommandPanel").show();
            };
            GameController.prototype.swipeMove = function (coords) {
                this.swipeInProgress = true;
                if (this.manageMode) {
                    this.drawingService.onSwipeMove(this.scene, coords);
                }
            };
            GameController.prototype.swipeEnd = function (coords, event) {
                var _this = this;
                if (!this.swipeInProgress) {
                    return;
                }
                if (this.manageMode) {
                    var pickedObject = this.drawingService.onSwipeEnd(this.scene, coords);
                    if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                    }
                }
                this.timeoutService(function () { return _this.swipeInProgress = false; }, 100, false);
            };
            GameController.prototype.swipeCancel = function (event) {
                this.swipeInProgress = false;
            };
            GameController.prototype.addHousePreview = function (position) {
                if (this.gameService.addHousePreview(this.gameService.getCurrentPlayer(), position)) {
                    this.setupActionButtonsForHousePreview(position);
                    this.drawingService.showHouseButtons(0, this.scene, this.gameService.getAssetGroup(position));
                }
            };
            GameController.prototype.removeHousePreview = function (position) {
                if (this.gameService.removeHousePreview(this.gameService.getCurrentPlayer(), position)) {
                    this.setupActionButtonsForHousePreview(position);
                    this.drawingService.showHouseButtons(0, this.scene, this.gameService.getAssetGroup(position));
                }
            };
            GameController.prototype.setupActionButtonsForHousePreview = function (position) {
                var assetGroup = this.gameService.getBoardFieldGroup(position);
                var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                var hasUncommittedUpgrades = false;
                groupBoardFields.forEach(function (field) {
                    hasUncommittedUpgrades = hasUncommittedUpgrades || field.asset.hasUncommittedUpgrades();
                });
                this.refreshBoardFieldGroupHouses(0, assetGroup);
                if (hasUncommittedUpgrades) {
                    this.setupActionButtons(this.commitHouses, this.rollbackHouses);
                }
                else {
                    var that = this;
                    this.scope.$apply(function () {
                        that.actionButtonsVisible = false;
                    });
                }
            };
            GameController.prototype.setupActionButtons = function (confirmCallback, cancelCallback) {
                this.confirmButtonCallback = confirmCallback;
                this.cancelButtonCallback = cancelCallback;
                this.drawingService.showActionButtons();
                var that = this;
                this.scope.$apply(function () {
                    that.actionButtonsVisible = true;
                });
            };
            GameController.prototype.refreshBoardFieldGroupHouses = function (focusedAssetGroupIndex, assetGroup) {
                var fields;
                if (!assetGroup) {
                    var firstFocusedBoardField = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
                    fields = this.gameService.getGroupBoardFields(firstFocusedBoardField.asset.group);
                }
                else {
                    fields = this.gameService.getGroupBoardFields(assetGroup);
                }
                var fieldIndexes = $.map(fields, function (f) { return f.index; });
                var viewGroupBoardFields = this.boardFields.filter(function (viewBoardField) { return $.inArray(viewBoardField.index, fieldIndexes) >= 0; });
                var that = this;
                viewGroupBoardFields.forEach(function (f) {
                    var asset = fields.filter(function (field) { return f.index === field.index; })[0].asset;
                    that.drawingService.setBoardFieldHouses(f, asset.houses, asset.hotel, asset.uncommittedHouses, asset.uncommittedHotel, that.scene);
                });
            };
            GameController.prototype.refreshBoardFieldMortgage = function () {
                var _this = this;
                var assetGroups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
                var that = this;
                assetGroups.forEach(function (assetGroup) {
                    var fields = that.gameService.getGroupBoardFields(assetGroup);
                    fields.forEach(function (field) {
                        var viewGroupBoardField = that.boardFields.filter(function (f) { return f.index === field.index; })[0];
                        if (viewGroupBoardField.mortgageMesh) {
                            that.scene.removeMesh(viewGroupBoardField.mortgageMesh);
                            viewGroupBoardField.mortgageMesh.dispose();
                            viewGroupBoardField.mortgageMesh = undefined;
                        }
                        if (field.asset.mortgage) {
                            that.drawingService.setBoardFieldMortgage(viewGroupBoardField, field.asset, _this.scene, false);
                        }
                    });
                });
            };
            GameController.prototype.commitHouses = function (data) {
                this.gameService.commitHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
                this.actionButtonsVisible = false;
                this.refreshBoardFieldGroupHouses(this.focusedAssetGroupIndex);
                this.updatePlayersForView();
                this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
            };
            GameController.prototype.rollbackHouses = function (data) {
                this.gameService.rollbackHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
                this.actionButtonsVisible = false;
                this.refreshBoardFieldGroupHouses(this.focusedAssetGroupIndex);
                this.updatePlayersForView();
                this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
            };
            GameController.prototype.updatePlayersForView = function () {
                var that = this;
                this.gameService.players.forEach(function (p) {
                    var viewPlayer = that.playerModels.filter(function (model) { return model.name === p.playerName; })[0];
                    viewPlayer.active = p.active;
                    that.animateAndSetPlayerMoney(viewPlayer, p.money);
                });
            };
            GameController.prototype.processCardField = function (position) {
                var _this = this;
                var d = $.Deferred();
                var card;
                if (position.type === Model.BoardFieldType.Treasure) {
                    card = this.gameService.getNextTreasureCard();
                }
                else {
                    card = this.gameService.getNextEventCard();
                }
                var that = this;
                $.when(this.showCard(card, position.type === Model.BoardFieldType.Treasure ? this.theme.communityChestTitle : this.theme.eventTitle)).done(function () {
                    that.gameService.processCard(card);
                    that.showMessage(that.getMessageForCard(card, position));
                    var addAction = $.Deferred();
                    if (card.cardType === Model.CardType.AdvanceToField) {
                        $.when(that.movePlayer(card.boardFieldIndex)).done(function () {
                            addAction.resolve();
                        });
                    }
                    else if (card.cardType === Model.CardType.AdvanceToRailway) {
                        var nextRailwayIndex = position.index >= 35 ? 5 : (position.index >= 25 ? 35 : (position.index >= 15 ? 25 : (position.index >= 5 ? 15 : 5)));
                        $.when(that.movePlayer(nextRailwayIndex, false, true)).done(function () {
                            addAction.resolve();
                        });
                    }
                    else if (card.cardType === Model.CardType.RetractNumFields) {
                        var newPositionIndex = that.gameService.getCurrentPlayerPosition().index - card.boardFieldCount;
                        if (newPositionIndex < 0) {
                            newPositionIndex = 40 + newPositionIndex;
                        }
                        $.when(that.movePlayer(newPositionIndex, true)).done(function () {
                            addAction.resolve();
                        });
                    }
                    else if (card.cardType === Model.CardType.JumpToField) {
                        if (card.boardFieldIndex === 10) {
                            $.when(_this.processGoToPrisonField()).done(function () {
                                addAction.resolve();
                            });
                        }
                    }
                    else {
                        addAction.resolve();
                    }
                    $.when(addAction).done(function () {
                        d.resolve();
                        that.timeoutService(function () {
                            that.scope.$apply(function () {
                                that.updatePlayersForView();
                            });
                        });
                    });
                });
                return d;
            };
            GameController.prototype.processTaxField = function (boardFieldType) {
                var d = $.Deferred();
                var paid = this.gameService.processTax(boardFieldType);
                this.updatePlayersForView();
                this.showMessage(this.currentPlayer + " paid " + this.theme.moneySymbol + paid + " of " + (boardFieldType === Model.BoardFieldType.TaxIncome ? "ecology tax." : "energy tax."));
                if (this.gameService.isComputerMove) {
                    // give time to other players to catch up with computer's actions
                    this.timeoutService(function () {
                        d.resolve();
                    }, 3000);
                }
                else {
                    d.resolve();
                }
                return d;
            };
            GameController.prototype.processGoToPrisonField = function () {
                var _this = this;
                var d = $.Deferred();
                var newPosition = this.gameService.moveCurrentPlayer(10);
                var playerModel = this.players.filter(function (p) { return p.name === _this.gameService.getCurrentPlayer(); })[0];
                var moveToPrison = this.drawingService.animatePlayerPrisonMove(newPosition, playerModel, this.scene, this.gameCamera);
                var that = this;
                $.when(moveToPrison).done(function () {
                    that.showMessage(that.currentPlayer + " landed in " + _this.theme.prison + ".");
                    that.gameService.processPrison(true);
                    if (that.gameService.isComputerMove) {
                        // give time to other players to catch up with computer's actions
                        that.timeoutService(function () {
                            d.resolve();
                        }, 3000);
                    }
                    else {
                        d.resolve();
                    }
                });
                return d;
            };
            GameController.prototype.processPrisonField = function () {
                if (this.gameService.processPrison(false)) {
                    this.showMessage(this.currentPlayer + " remains in " + this.theme.prison + ".");
                }
            };
            GameController.prototype.showCard = function (card, title) {
                var _this = this;
                var d = $.Deferred();
                this.currentCard.title = title;
                this.currentCard.message = card.message;
                $("#card").show("clip", {}, 500, function () {
                    _this.timeoutService(4000).then(function () {
                        $("#card").hide("clip", {}, 500, function () {
                            d.resolve();
                        });
                    });
                });
                return d;
            };
            GameController.prototype.getMessageForCard = function (card, position) {
                var type = position.type === Model.BoardFieldType.Treasure ? this.theme.communityChestTitle : this.theme.eventTitle;
                if (card.cardType === Model.CardType.ReceiveMoney) {
                    return this.gameService.getCurrentPlayer() + " received " + this.theme.moneySymbol + card.money + " from " + type + ".";
                }
                else if (card.cardType === Model.CardType.PayMoney) {
                    return this.gameService.getCurrentPlayer() + " paid " + this.theme.moneySymbol + card.money + ".";
                }
                else if (card.cardType === Model.CardType.AdvanceToField) {
                    return this.gameService.getCurrentPlayer() + " is advancing to " + this.getBoardFieldName(card.boardFieldIndex) + ".";
                }
                else if (card.cardType === Model.CardType.RetractNumFields) {
                    return this.gameService.getCurrentPlayer() + " is moving back " + card.boardFieldCount + " fields.";
                }
                else if (card.cardType === Model.CardType.ReceiveMoneyFromPlayers) {
                    return this.gameService.getCurrentPlayer() + " received " + this.theme.moneySymbol + card.money + " from each player.";
                }
                else if (card.cardType === Model.CardType.PayMoneyToPlayers) {
                    return this.gameService.getCurrentPlayer() + " paid " + this.theme.moneySymbol + card.money + " to each player.";
                }
                else if (card.cardType === Model.CardType.Maintenance || card.cardType === Model.CardType.OwnMaintenance) {
                    return this.gameService.getCurrentPlayer() + " paid " + this.theme.moneySymbol + card.money + " for maintenance.";
                }
                else if (card.cardType === Model.CardType.AdvanceToRailway) {
                    return this.gameService.getCurrentPlayer() + " is advancing to the next " + this.theme.railroad + ".";
                }
                return this.gameService.getCurrentPlayer() + " landed on " + type + ".";
            };
            GameController.prototype.getBoardFieldName = function (boardFieldIndex) {
                if (boardFieldIndex === 0) {
                    return "START";
                }
                var group = this.gameService.getBoardFieldGroup(boardFieldIndex);
                if (group) {
                    var fields = this.gameService.getGroupBoardFields(group);
                    if (fields && fields.length > 0) {
                        var field = fields.filter(function (f) { return f.index === boardFieldIndex; })[0];
                        return field.asset.name;
                    }
                }
                return "";
            };
            GameController.prototype.highlightCommandButtons = function (coords) {
                var elem = $(document.elementFromPoint(coords.x, coords.y));
                this.unhighlightCommandButton($(".highlightedButton"));
                //$(".highlightedButton").addClass("unhighlightedButton").removeClass("highlightedButton");
                if (elem.hasClass("commandButton")) {
                    this.highlightCommandButton(elem);
                }
            };
            GameController.prototype.highlightCommandButton = function (button) {
                button.addClass("highlightedButton").removeClass("unhighlightedButton");
                button.parent().children().children(".commandButtonOverlayText").show();
            };
            GameController.prototype.unhighlightCommandButton = function (button) {
                button.addClass("unhighlightedButton").removeClass("highlightedButton");
                button.parent().children().children(".commandButtonOverlayText").hide();
            };
            GameController.prototype.highlightTradeButtons = function (coords) {
                var elem = $(document.elementFromPoint(coords.x, coords.y));
                this.unhighlightTradeButton($(".highlightedTradeButton"));
                if (elem.hasClass("tradeButton")) {
                    this.highlightTradeButton(elem);
                }
            };
            GameController.prototype.highlightTradeButton = function (button) {
                button.addClass("highlightedTradeButton").removeClass("unhighlightedTradeButton");
                button.parent().children().children(".tradeButtonOverlayText").show();
            };
            GameController.prototype.unhighlightTradeButton = function (button) {
                button.addClass("unhighlightedTradeButton").removeClass("highlightedTradeButton");
                button.parent().children().children(".tradeButtonOverlayText").hide();
            };
            GameController.prototype.bindInputEvents = function () {
                var _this = this;
                //$(window).on("click", null, this, this.handleClickEvent);
                var isTouch = (("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0));
                if (!isTouch) {
                    $("#renderCanvas").on("click", null, this, this.handleClickEvent);
                    $("#tutorialMessage").on("click", null, this, this.handleClickEvent);
                }
                else {
                    if (window.navigator && window.navigator.pointerEnabled) {
                        //$("#renderCanvas").bind("MSPointerDown", this, this.handleClickEvent);
                        //$("#renderCanvas").bind("pointerdown", this, this.handleClickEvent);
                        $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
                        $("#tutorialMessage").bind("touchend", this, this.handleClickEvent);
                    }
                    else {
                        $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
                        $("#tutorialMessage").bind("touchend", this, this.handleClickEvent);
                    }
                }
                this.swipeService.bind($("#renderCanvas"), {
                    'move': function (coords) { _this.swipeMove(coords); },
                    'end': function (coords, event) { _this.swipeEnd(coords, event); },
                    'cancel': function (event) { _this.swipeCancel(event); }
                });
                $("#commandPanel").mousedown(function (e) {
                    _this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
                });
                $("#tradeCommandPanel").mousedown(function (e) {
                    _this.highlightTradeButtons({ x: e.clientX, y: e.clientY });
                });
                $("#tradeCommandPanel").bind("touchstart", this, function (e) {
                    var mouseEventObject = e.originalEvent;
                    if (mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0) {
                        var thisInstance = e.data;
                        thisInstance.highlightTradeButtons({ x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY });
                    }
                });
                $("#manageCommandPanel").mousedown(function (e) {
                    _this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
                });
                $("#manageCommandPanel").bind("touchstart", this, function (e) {
                    var mouseEventObject = e.originalEvent;
                    if (mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0) {
                        var thisInstance = e.data;
                        thisInstance.highlightCommandButtons({ x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY });
                    }
                });
                $("#commandPanel").mouseup(function (e) {
                    if (!_this.swipeInProgress) {
                        _this.unhighlightCommandButton($(".commandButton"));
                    }
                });
                $("#manageCommandPanel").mouseup(function (e) {
                    if (!_this.swipeInProgress) {
                        _this.unhighlightCommandButton($("#buttonReturnFromManage"));
                    }
                });
                $("#tradeCommandPanel").mouseup(function (e) {
                    if (!_this.swipeInProgress) {
                        _this.unhighlightTradeButton($("#buttonReturnFromTrade"));
                    }
                });
                this.swipeService.bind($("#commandPanel, #tradeCommandPanel"), {
                    'move': function (coords) {
                        if (!_this.manageMode) {
                            _this.swipeInProgress = true;
                            if (_this.tradeMode) {
                                _this.highlightTradeButtons(coords);
                            }
                            else {
                                _this.highlightCommandButtons(coords);
                            }
                        }
                    },
                    'end': function (coords, event) {
                        if (!_this.manageMode) {
                            if (!_this.swipeInProgress) {
                                return;
                            }
                            var elem = $(document.elementFromPoint(coords.x, coords.y));
                            if (elem.hasClass("commandButton")) {
                                _this.unhighlightCommandButton(elem);
                                elem.click();
                            }
                            if (elem.hasClass("tradeButton")) {
                                _this.unhighlightTradeButton(elem);
                                elem.click();
                            }
                            _this.timeoutService(function () { return _this.swipeInProgress = false; }, 100, false);
                        }
                    },
                    'cancel': function (event) {
                        if (!_this.manageMode) {
                            _this.swipeInProgress = false;
                        }
                    }
                });
            };
            GameController.prototype.unbindInputEvents = function () {
                //$(window).on("click", null, this, this.handleClickEvent);
                var isTouch = (("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0));
                if (!isTouch) {
                    $("#renderCanvas").off("click", this.handleClickEvent);
                    $("#tutorialMessage").off("click", this.handleClickEvent);
                }
                else {
                    if (window.navigator && window.navigator.pointerEnabled) {
                        //$("#renderCanvas").bind("MSPointerDown", this, this.handleClickEvent);
                        //$("#renderCanvas").bind("pointerdown", this, this.handleClickEvent);
                        $("#renderCanvas").unbind("touchend", this.handleClickEvent);
                        $("#tutorialMessage").unbind("touchend", this.handleClickEvent);
                    }
                    else {
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
            };
            GameController.prototype.resetOverboardDice = function (diceIndex, diceLocation) {
                if (diceLocation.y < (this.drawingService.diceHeight / 2) * 0.4) {
                    diceLocation.y = (this.drawingService.diceHeight / 2) * 2.2;
                    diceLocation.x = diceIndex === 0 ? -0.3 : 0.3;
                    diceLocation.z = 0;
                    this.drawingService.moveDiceToPosition(diceIndex, diceLocation, this.scene);
                }
            };
            GameController.prototype.refreshMessageHistory = function () {
                $("#messageHistory").empty();
                var lastMessages = this.messages.length > 5 ? this.messages.slice(this.messages.length - 5) : this.messages;
                $.each(lastMessages, function (i, message) {
                    if (i === lastMessages.length - 1) {
                        $("#messageHistory").append("<option value='" + i + "' selected>" + message + "</option>");
                    }
                    else {
                        $("#messageHistory").append("<option value='" + i + "' disabled>" + message + "</option>");
                    }
                });
                var messageHistory = $("#messageHistory");
                messageHistory.selectmenu("refresh");
            };
            GameController.prototype.initMessageHistory = function () {
                this.messages = [];
                var messageHistory = $("#messageHistory");
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
            };
            GameController.prototype.isBlockedByTutorial = function (action) {
                return !this.tutorialInitialized || (this.tutorialService.isActive && !this.tutorialService.canExecuteAction(action));
            };
            GameController.prototype.executeTutorialCallback = function (action) {
                if (this.tutorialService.isActive) {
                    this.tutorialService.executeActionCallback(action);
                }
            };
            GameController.prototype.initTutorial = function (loadGame) {
                var _this = this;
                this.tutorialData = new Model.TutorialData();
                if (!loadGame) {
                    this.tutorial = this.settingsService.options.tutorial;
                    var that = this;
                    this.timeoutService(function () {
                        $("#loadingBar").hide();
                        if (that.tutorial) {
                            that.scope.$apply(function () {
                                that.tutorialService.initialize(that.tutorialData);
                                that.tutorialService.advanceToNextStep();
                                that.tutorialInitialized = true;
                            });
                        }
                        else {
                            _this.tutorialInitialized = true;
                        }
                    }, 3000);
                }
                else {
                    this.tutorial = false;
                    this.tutorialInitialized = true;
                    this.timeoutService(function () {
                        $("#loadingBar").hide();
                    }, 3000);
                }
            };
            GameController.prototype.animateAndSetPlayerMoney = function (viewPlayer, money) {
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
                                that.timeoutService(function () {
                                    that.scope.$apply(function () {
                                        viewPlayer.money = Math.floor(count);
                                    });
                                    that.playTickSound();
                                });
                            },
                            complete: function () {
                                var count = this.countNum;
                                that.timeoutService(function () {
                                    that.scope.$apply(function () {
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
            };
            GameController.prototype.playTickSound = function () {
                //var audio: any = document.getElementById("audio_tick");
                //audio.play();
                if (this.settingsService.options.sound) {
                    // find first one available
                    var availableAudio = $(".audio_tick.stopped");
                    if (availableAudio.length === 0) {
                        availableAudio = $(".audio_tick").first();
                    }
                    else {
                        availableAudio = availableAudio.first();
                    }
                    availableAudio.removeClass("stopped").addClass("playing");
                    var selectedAudio = availableAudio[0];
                    selectedAudio.play();
                }
            };
            GameController.prototype.playBounceSound = function () {
                if (this.settingsService.options.sound) {
                    // find first one available
                    var availableAudio = $(".audio_bounce.stopped");
                    if (availableAudio.length === 0) {
                        availableAudio = $(".audio_bounce").first();
                    }
                    else {
                        availableAudio = availableAudio.first();
                    }
                    availableAudio.removeClass("stopped").addClass("playing");
                    var selectedAudio = availableAudio[0];
                    selectedAudio.play();
                }
            };
            GameController.prototype.playRocketSound = function (fadeOut) {
                if (this.settingsService.options.sound) {
                    var rocketAudio = $(".audio_rocket")[0];
                    if (!fadeOut) {
                        rocketAudio.volume = 1;
                        rocketAudio.play();
                    }
                    if (fadeOut && rocketAudio.volume > 0) {
                        $({ volume: 100 }).animate({ volume: 0 }, {
                            duration: 4000,
                            easing: 'linear',
                            step: function () {
                                var vol = this.volume;
                                rocketAudio.volume = vol / 100;
                            },
                            complete: function () {
                            }
                        });
                    }
                }
            };
            GameController.prototype.initAudio = function () {
                $(".audio_tick").each(function (i, el) {
                    var elem = el;
                    elem.preload = "auto";
                    elem.volume = 0.7;
                });
                $(".audio_tick").off("ended");
                $(".audio_tick").on("ended", function (e) {
                    $(e.currentTarget).removeClass("playing").addClass("stopped");
                });
                $(".audio_bounce").off("ended");
                $(".audio_bounce").on("ended", function (e) {
                    $(e.currentTarget).removeClass("playing").addClass("stopped");
                });
                $(".audio_bounce").each(function (i, el) {
                    var elem = el;
                    elem.preload = "auto";
                });
                var that = this;
                $(".audio_rocket").off("ended");
                $(".audio_rocket").on("ended", function (e) {
                    if (that.playerMoving) {
                        that.playRocketSound();
                    }
                });
                $(".audio_rocket").each(function (i, el) {
                    var elem = el;
                    elem.preload = "auto";
                });
                $(".backgroundMusic").off("ended");
            };
            GameController.prototype.stopMusic = function () {
                if (this.settingsService.options.music) {
                    var musicToStop = $(".backgroundMusic.playing");
                    if (musicToStop.length > 0) {
                        musicToStop.removeClass("playing").addClass("stopped");
                        var musicElement = musicToStop.first()[0];
                        musicElement.pause();
                        musicElement.currentTime = 0;
                    }
                }
            };
            GameController.prototype.clearCurrentPlayerFromBoard = function () {
                var _this = this;
                var assetGroups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
                var player = this.players.filter(function (p) { return p.name === _this.currentPlayer; })[0];
                this.scene.removeMesh(player.mesh);
                player.mesh.dispose();
                player.mesh = undefined;
                player.color = "#808080";
                var that = this;
                assetGroups.forEach(function (assetGroup) {
                    var boardFields = that.gameService.getGroupBoardFields(assetGroup);
                    boardFields.forEach(function (boardField) {
                        if (!boardField.asset.unowned && boardField.asset.owner === that.currentPlayer) {
                            var viewBoardField = that.boardFields.filter(function (f) { return f.index === boardField.index; });
                            if (viewBoardField.length > 0) {
                                that.drawingService.clearBoardField(viewBoardField[0], that.scene);
                            }
                        }
                    });
                });
            };
            GameController.prototype.onActivateTradeNode = function (e, data) {
                var thisInstance = e.data;
                if (data && data.node && data.node.children && data.node.children.length === 0) {
                    // leaf node
                    thisInstance.scope.$apply(function () {
                        thisInstance.tradeService.switchSelection(data.node.text);
                    });
                }
                if (!data.instance.is_leaf(data.node)) {
                    data.instance.toggle_node(data.node);
                }
            };
            GameController.prototype.showTradeMessage = function (tradeState) {
                var player1MoneyMsg = tradeState.firstPlayerMoney ? (" and " + this.themeService.theme.moneySymbol + tradeState.firstPlayerMoney) : "";
                var player2MoneyMsg = tradeState.secondPlayerMoney ? (" and " + this.themeService.theme.moneySymbol + tradeState.secondPlayerMoney) : "";
                if (tradeState.firstPlayerSelectedAssets.length === 1 && tradeState.secondPlayerSelectedAssets.length === 1) {
                    this.showMessage(tradeState.firstPlayer.playerName + " traded " + tradeState.firstPlayerSelectedAssets[0].name + player1MoneyMsg + " for " + tradeState.secondPlayerSelectedAssets[0].name + player2MoneyMsg + " with " + tradeState.secondPlayer.playerName + ".");
                }
                else {
                    this.showMessage(tradeState.firstPlayer.playerName + " traded " + tradeState.firstPlayerSelectedAssets.length + " assets" + player1MoneyMsg + " for " + tradeState.secondPlayerSelectedAssets.length + player2MoneyMsg + " with " + tradeState.secondPlayer.playerName + ".");
                }
            };
            GameController.$inject = ["$state", "$stateParams", "$swipe", "$scope", "$rootScope", "$timeout", "$compile", "gameService", "drawingService", "aiService", "themeService", "settingsService", "tutorialService", "tradeService"];
            return GameController;
        }());
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
        var HelpController = (function () {
            function HelpController(stateService, stateParamsService, scope, timeoutService, themeService) {
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.themeService = themeService;
                $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gameHelpImage);
            }
            HelpController.prototype.goBack = function () {
                this.stateService.go("mainmenu");
            };
            HelpController.$inject = ["$state", "$stateParams", "$scope", "$timeout", "themeService"];
            return HelpController;
        }());
        controllers.HelpController = HelpController;
        monopolyApp.controller("helpCtrl", HelpController);
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
            function MainMenuController(stateService, scope, timeoutService, themeService, drawingService, settingsService) {
                var _this = this;
                this.ratingCounterTrigger = 3;
                this.startNewGame = function () {
                    //var x: any = navigator;
                    //x.app.exitApp();
                    _this.stateService.go("settings");
                };
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.themeService = themeService;
                this.stateService = stateService;
                this.drawingService = drawingService;
                this.settingsService = settingsService;
                this.title = "Knight MONOPOLY";
                this.chooseGameInitialization = false;
                //var windowWidth = Math.min(window.screen.width, 575);
                //if (windowWidth < 575) {
                //    $("#buttonContainer").css("width", windowWidth + "px");
                //}
                $("#mainMenuTitleImage").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.mainMenuTitleImage);
                $("#mainMenuExitImage").attr("src", "images/ReturnToEarth2.png");
                $("#earthImage").attr("src", "images/Earth.png");
                $("#earthImage").hover(function () {
                    $("#earthImage").attr("src", "images/EarthHighlight.png");
                }, function () {
                    $("#earthImage").attr("src", "images/Earth.png");
                });
                var that = this;
                this.timeoutService(function () {
                    that.initAudio();
                    if (that.settingsService.options.music) {
                        that.playMusic();
                    }
                    else {
                        that.stopMusic();
                    }
                });
                this.createScene();
                this.rotateAnimation("earthImage", 30, 0);
                this.scope.$on("$destroy", function () {
                    window.removeEventListener("resize", that.resizeEventListener);
                    var windowAny = window;
                    windowAny.menuEngine = undefined;
                    that.scene.stopAnimation(that.menuCamera);
                    that.menuEngine.stopRenderLoop();
                    that.menuEngine.dispose();
                });
            }
            Object.defineProperty(MainMenuController.prototype, "canLoadGame", {
                get: function () {
                    var localStorageAny = localStorage;
                    return localStorage.length > 0 && localStorageAny[Model.Game.version];
                },
                enumerable: true,
                configurable: true
            });
            MainMenuController.prototype.settings = function () {
                if (this.canLoadGame) {
                    this.chooseGameInitialization = true;
                    $("#buttonContainer").css("width", "340px");
                }
                else {
                    this.startNewGame();
                }
            };
            MainMenuController.prototype.options = function () {
                this.stateService.go("options");
            };
            MainMenuController.prototype.help = function () {
                this.stateService.go("help");
            };
            MainMenuController.prototype.stats = function () {
                this.stateService.go("stats");
            };
            MainMenuController.prototype.loadGame = function () {
                this.stateService.go("newgame", { loadGame: true });
            };
            MainMenuController.prototype.goBack = function () {
                this.chooseGameInitialization = false;
                $("#buttonContainer").css("width", "575px");
            };
            MainMenuController.prototype.exit = function () {
                var _this = this;
                sweetAlert({
                    title: "Leaving MOONopoly",
                    text: "Are you sure you wish to exit?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"
                }, function (isConfirm) {
                    if (isConfirm) {
                        _this.notifyRatingAndClose();
                    }
                });
            };
            MainMenuController.prototype.createScene = function () {
                var canvas = document.getElementById("renderCanvas");
                this.menuEngine = new BABYLON.Engine(canvas, true);
                var windowAny = window;
                windowAny.menuEngine = this.menuEngine;
                this.scene = new BABYLON.Scene(this.menuEngine);
                this.menuCamera = new BABYLON.FreeCamera("menuCamera", BABYLON.Vector3.Zero(), this.scene);
                this.scene.activeCamera = this.menuCamera;
                var light = new BABYLON.HemisphericLight("menuLight", new BABYLON.Vector3(0, 1, 0), this.scene);
                light.intensity = 1;
                var tableMaterial = new BABYLON.StandardMaterial("boardTexture", this.scene);
                if (this.themeService.theme.skyboxFolder) {
                    var skybox = BABYLON.Mesh.CreateBox("menuSkyBox", 1000, this.scene);
                    tableMaterial.backFaceCulling = false;
                    tableMaterial.reflectionTexture = new BABYLON.CubeTexture(this.themeService.theme.imagesFolder + this.themeService.theme.skyboxFolder, this.scene);
                    tableMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                    tableMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                    tableMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                    skybox.material = tableMaterial;
                    var animationCameraRotation = new BABYLON.Animation("cameraMenuRotateAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    var keysRotation = [];
                    this.menuCamera.position = new BABYLON.Vector3(0, 2, 0);
                    this.menuCamera.setTarget(new BABYLON.Vector3(0, 0, 3));
                    keysRotation.push({
                        frame: 0,
                        value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(0.01, 0.01, 3), this.menuCamera)
                    });
                    this.menuCamera.setTarget(new BABYLON.Vector3(0, 0, -3));
                    keysRotation.push({
                        frame: 300,
                        value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(0.01, 0.01, -3), this.menuCamera)
                    });
                    keysRotation.push({
                        frame: 450,
                        value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(-3, 0.01, 0.01), this.menuCamera)
                    });
                    this.menuCamera.setTarget(new BABYLON.Vector3(0, 0, 3));
                    keysRotation.push({
                        frame: 600,
                        value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(0.01, 0.01, 3), this.menuCamera)
                    });
                    keysRotation[2].value.y = keysRotation[1].value.y * 1.5;
                    keysRotation[3].value.y = keysRotation[1].value.y * 2;
                    animationCameraRotation.setKeys(keysRotation);
                    this.menuCamera.animations = [];
                    this.menuCamera.animations.push(animationCameraRotation);
                    this.scene.beginAnimation(this.menuCamera, 0, 600, true, undefined, function () { });
                    this.initRocketMesh();
                }
                var that = this;
                this.menuEngine.runRenderLoop(function () {
                    {
                        // not sure why, but the input handlers starve unless the render loop is re-inserted in the queue using a timeout service
                        that.timeoutService(function () {
                            that.scene.render();
                        }, 1, false);
                    }
                });
                // Watch for browser/canvas resize events
                window.addEventListener("resize", this.resizeEventListener);
            };
            MainMenuController.prototype.resizeEventListener = function () {
                //this.menuEngine.resize();
                var windowAny = window;
                var menuEngine = windowAny.menuEngine;
                if (menuEngine) {
                    menuEngine.resize();
                }
            };
            MainMenuController.prototype.initRocketMesh = function () {
                var that = this;
                BABYLON.SceneLoader.ImportMesh(null, this.themeService.theme.meshFolder, this.themeService.theme.playerMesh, this.scene, function (newMeshes, particleSystems) {
                    if (newMeshes != null) {
                        var rocketMesh = newMeshes[that.themeService.theme.playerSubmeshIndex];
                        var mat = new BABYLON.StandardMaterial("menu_rocket_material", that.scene);
                        mat.diffuseColor = BABYLON.Color3.Yellow();
                        mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                        that.themeService.theme.playerColoredSubmeshIndices.forEach(function (i) {
                            newMeshes[i].material = mat;
                        });
                        var mat2 = new BABYLON.StandardMaterial("menu_rocket_material2", that.scene);
                        mat2.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                        mat2.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                        newMeshes[1].material = mat2;
                        newMeshes[2].material = mat2;
                        newMeshes[3].material = mat2;
                        newMeshes[7].material = mat2;
                        newMeshes[8].material = mat2;
                        rocketMesh.visibility = 0;
                        mat2.alpha = 0;
                        mat.alpha = 0;
                        rocketMesh.position = new BABYLON.Vector3(0, 0.6, 1);
                        that.timeoutService(function () {
                            rocketMesh.position = new BABYLON.Vector3(3, 0.6, 0);
                            mat2.alpha = 1;
                            mat.alpha = 1;
                            rocketMesh.visibility = 1;
                            var animationplayerPosition = new BABYLON.Animation("menuplayerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                            var animationplayerRotation = new BABYLON.Animation("menuplayerRotationAnimation", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                            var keysPosition = [];
                            var keysRotation = [];
                            for (var i = 0; i <= 40; i++) {
                                var frame = Math.floor((i / 40) * 620);
                                //var x = Math.cos((i / 40) * 360 * (3.14 / 180)) * 3;
                                //var z = Math.sin((i / 40) * 360 * (3.14 / 180)) * 3;
                                var x = Math.cos((-90 + (i / 40) * 360) * (3.14 / 180)) * 3;
                                var z = Math.sin((-90 + (i / 40) * 360) * (3.14 / 180)) * 3;
                                keysPosition.push({
                                    frame: frame,
                                    value: new BABYLON.Vector3(x, 0.6, z)
                                });
                            }
                            var theme = that.themeService.theme;
                            keysRotation.push({
                                frame: 0,
                                value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[2][0], theme.playerMeshRotationQuaternion[2][1], theme.playerMeshRotationQuaternion[2][2], theme.playerMeshRotationQuaternion[2][3])
                            });
                            keysRotation.push({
                                frame: 150,
                                value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[1][0], theme.playerMeshRotationQuaternion[1][1], theme.playerMeshRotationQuaternion[1][2], theme.playerMeshRotationQuaternion[1][3])
                            });
                            keysRotation.push({
                                frame: 300,
                                value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[0][0], theme.playerMeshRotationQuaternion[0][1], theme.playerMeshRotationQuaternion[0][2], theme.playerMeshRotationQuaternion[0][3])
                            });
                            keysRotation.push({
                                frame: 450,
                                value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[3][0], theme.playerMeshRotationQuaternion[3][1], theme.playerMeshRotationQuaternion[3][2], theme.playerMeshRotationQuaternion[3][3])
                            });
                            keysRotation.push({
                                frame: 620,
                                value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[2][0], theme.playerMeshRotationQuaternion[2][1], theme.playerMeshRotationQuaternion[2][2], theme.playerMeshRotationQuaternion[2][3])
                            });
                            animationplayerPosition.setKeys(keysPosition);
                            animationplayerRotation.setKeys(keysRotation);
                            rocketMesh.animations = [];
                            rocketMesh.animations.push(animationplayerPosition);
                            rocketMesh.animations.push(animationplayerRotation);
                            var particleSystem = that.drawingService.addParticle(rocketMesh, that.scene);
                            particleSystem.targetStopDuration = undefined;
                            that.scene.beginAnimation(rocketMesh, 0, 620, true, undefined, function () { });
                            particleSystem.start();
                        }, 4000);
                    }
                });
            };
            MainMenuController.prototype.initAudio = function () {
                var that = this;
                $(".backgroundMusic").off("ended");
                $(".backgroundMusic").on("ended", function (e) {
                    var next = $(e.currentTarget).nextAll(".backgroundMusic.stopped");
                    if (next.length === 0) {
                        next = $(".backgroundMusic.stopped").first();
                    }
                    else {
                        next = next.first();
                    }
                    $(e.currentTarget).removeClass("playing").addClass("stopped");
                    next.removeClass("stopped").addClass("playing");
                    that.playMusic();
                });
            };
            MainMenuController.prototype.playMusic = function () {
                if (this.settingsService.options.music) {
                    var musicToPlay = $(".backgroundMusic.playing");
                    if (musicToPlay.length === 0) {
                        musicToPlay = $(".backgroundMusic");
                    }
                    musicToPlay = musicToPlay.first();
                    musicToPlay.removeClass("stopped").addClass("playing");
                    var musicElementToPlay = musicToPlay[0];
                    musicElementToPlay.play();
                }
            };
            MainMenuController.prototype.stopMusic = function () {
                var musicPlaying = $(".backgroundMusic.playing");
                if (musicPlaying.length > 0) {
                    var musicElement = musicPlaying.first()[0];
                    musicElement.pause();
                    musicElement.currentTime = 0;
                    musicPlaying.removeClass("playing").addClass("stopped");
                }
            };
            MainMenuController.prototype.rotateAnimation = function (el, speed, degrees) {
                var elem = document.getElementById(el);
                if (elem) {
                    var elemStyle = elem.style;
                    elemStyle.WebkitTransform = "rotate(" + degrees + "deg)";
                    elemStyle.MozTransform = "rotate(" + degrees + "deg)";
                    elemStyle.msTransform = "rotate(" + degrees + "deg)";
                    elemStyle.OTransform = "rotate(" + degrees + "deg)";
                    elemStyle.transform = "rotate(" + degrees + "deg)";
                    degrees++;
                    if (degrees > 360) {
                        degrees = 1;
                    }
                    var that = this;
                    this.timeoutService(function (elName, sp, deg) {
                        that.rotateAnimation(elName, sp, deg);
                    }, speed, false, el, speed, degrees);
                }
            };
            MainMenuController.prototype.notifyRatingAndClose = function () {
                var localStorageAny = localStorage;
                var ratingNotificationCounter = this.ratingCounterTrigger;
                if (localStorage.getItem("ratingNotificationCounter")) {
                    ratingNotificationCounter = JSON.parse(localStorageAny.ratingNotificationCounter) + 1;
                }
                if (ratingNotificationCounter >= this.ratingCounterTrigger) {
                    ratingNotificationCounter = 0;
                    sweetAlert.close();
                    this.timeoutService(function () {
                        sweetAlert({
                            title: "Leaving MOONopoly",
                            text: "Please rate this game to help improve it in the future. Thanks!",
                            type: "info",
                            showCancelButton: false,
                            confirmButtonText: "Ok"
                        }, function (isConfirm) {
                            if (isConfirm) {
                                localStorageAny.ratingNotificationCounter = ratingNotificationCounter;
                                window.close();
                            }
                        });
                    }, 100);
                }
                else {
                    localStorageAny.ratingNotificationCounter = ratingNotificationCounter;
                    window.close();
                }
            };
            MainMenuController.$inject = ["$state", "$scope", "$timeout", "themeService", "drawingService", "settingsService"];
            return MainMenuController;
        }());
        controllers.MainMenuController = MainMenuController;
        monopolyApp.controller("mainMenuCtrl", MainMenuController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
var Model;
(function (Model) {
    var Settings = (function () {
        function Settings() {
            this.numPlayers = 2;
            this.players = [new Model.Player("Player 1", true), new Model.Player("Apollo", false)];
            this.rules = new Model.Rules();
        }
        return Settings;
    }());
    Model.Settings = Settings;
})(Model || (Model = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var OptionsController = (function () {
            function OptionsController(stateService, stateParamsService, scope, timeoutService, settingsService, themeService) {
                var _this = this;
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.settingsService = settingsService;
                this.themeService = themeService;
                $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gameOptionsImage);
                this.loadOptions();
                this.timeoutService(function () {
                    var toggles = $('[id|="optiontoggle"]');
                    toggles.bootstrapToggle({
                        on: "On",
                        off: "Off"
                    });
                    var that = _this;
                    toggles.on("change", function (event) {
                        var toggle = $(event.currentTarget);
                        that.scope.$apply(function () {
                            var option = toggle.prop("id").split("-")[1];
                            that.options[option] = toggle.prop("checked") === true;
                        });
                    });
                }, 1);
            }
            OptionsController.prototype.goBack = function () {
                this.saveOptions();
                this.stateService.go("mainmenu");
            };
            OptionsController.prototype.loadOptions = function () {
                this.options = this.settingsService.loadOptions();
            };
            OptionsController.prototype.saveOptions = function () {
                this.settingsService.saveOptions(this.options);
            };
            OptionsController.$inject = ["$state", "$stateParams", "$scope", "$timeout", "settingsService", "themeService"];
            return OptionsController;
        }());
        controllers.OptionsController = OptionsController;
        monopolyApp.controller("optionsCtrl", OptionsController);
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
        var PauseController = (function () {
            function PauseController(stateService, stateParamsService, scope, timeoutService, themeService, settingsService) {
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.themeService = themeService;
                this.settingsService = settingsService;
                $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gamePauseImage);
                var that = this;
                this.timeoutService(function () {
                    that.initAudio();
                    that.playMusic();
                });
            }
            PauseController.prototype.goBack = function () {
                this.stateService.go("newgame", { loadGame: true });
            };
            PauseController.prototype.goToGameRules = function () {
                this.stateService.go("rules", { inGame: true });
            };
            PauseController.prototype.saveAndExit = function () {
                this.stateService.go("mainmenu");
            };
            PauseController.prototype.initAudio = function () {
                var that = this;
                $(".backgroundMusic").off("ended");
                $(".backgroundMusic").on("ended", function (e) {
                    var next = $(e.currentTarget).nextAll(".backgroundMusic.stopped");
                    if (next.length === 0) {
                        next = $(".backgroundMusic.stopped").first();
                    }
                    else {
                        next = next.first();
                    }
                    $(e.currentTarget).removeClass("playing").addClass("stopped");
                    next.removeClass("stopped").addClass("playing");
                    that.playMusic();
                });
            };
            PauseController.prototype.playMusic = function () {
                if (this.settingsService.options.music) {
                    var musicToPlay = $(".backgroundMusic.playing");
                    if (musicToPlay.length === 0) {
                        musicToPlay = $(".backgroundMusic");
                    }
                    musicToPlay = musicToPlay.first();
                    musicToPlay.removeClass("stopped").addClass("playing");
                    var musicElementToPlay = musicToPlay[0];
                    musicElementToPlay.play();
                }
            };
            PauseController.$inject = ["$state", "$stateParams", "$scope", "$timeout", "themeService", "settingsService"];
            return PauseController;
        }());
        controllers.PauseController = PauseController;
        monopolyApp.controller("pauseCtrl", PauseController);
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
        var RulesController = (function () {
            function RulesController(stateService, stateParamsService, scope, timeoutService, settingsService, themeService) {
                var _this = this;
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.settingsService = settingsService;
                this.themeService = themeService;
                $(".background").attr("src", this.theme.imagesFolder + this.theme.gameRulesImage);
                this.loadSettings();
                var spService = this.stateParamsService;
                this.inGame = eval(spService.inGame);
                if (this.settings.rules) {
                    this.setInitialCash(this.settings.rules.initialCash);
                    this.setPassStartAward(this.settings.rules.passStartAward);
                }
                $('[id|="initialCash"]').click(function (e) {
                    _this.onButtonClick(e);
                });
                $('[id|="passStart"]').click(function (e) {
                    _this.onButtonClick(e);
                });
            }
            Object.defineProperty(RulesController.prototype, "theme", {
                get: function () {
                    return this.themeService.theme;
                },
                enumerable: true,
                configurable: true
            });
            RulesController.prototype.goBack = function () {
                if (this.inGame) {
                    this.stateService.go("pause");
                }
                else {
                    this.saveSettings();
                    this.stateService.go("settings");
                }
            };
            RulesController.prototype.setInitialCash = function (cash) {
                this.settings.rules.initialCash = cash;
                $('[id|="initialCash"]').removeClass("btn-primary").addClass("btn-default");
                if (cash === 1000) {
                    $("#initialCash-1000").removeClass("btn-default").addClass("btn-primary");
                }
                if (cash === 1500) {
                    $("#initialCash-1500").removeClass("btn-default").addClass("btn-primary");
                }
                if (cash === 2000) {
                    $("#initialCash-2000").removeClass("btn-default").addClass("btn-primary");
                }
            };
            RulesController.prototype.setPassStartAward = function (award) {
                this.settings.rules.passStartAward = award;
                $('[id|="passStart"]').removeClass("btn-primary").addClass("btn-default");
                if (award === 0) {
                    $("#passStart-0").removeClass("btn-default").addClass("btn-primary");
                }
                if (award === 100) {
                    $("#passStart-100").removeClass("btn-default").addClass("btn-primary");
                }
                if (award === 200) {
                    $("#passStart-200").removeClass("btn-default").addClass("btn-primary");
                }
                if (award === 300) {
                    $("#passStart-300").removeClass("btn-default").addClass("btn-primary");
                }
            };
            RulesController.prototype.loadSettings = function () {
                this.settings = this.settingsService.loadSettings();
            };
            RulesController.prototype.saveSettings = function () {
                this.settingsService.saveSettings(this.settings);
            };
            RulesController.prototype.onButtonClick = function (jQueryEventObject) {
                var target = $(jQueryEventObject.currentTarget);
                var targetId = target.attr("id");
                var idTokens = targetId.split("-");
                var targetValue = idTokens[1];
                var targetRule = idTokens[0];
                if (targetRule === "initialCash") {
                    this.setInitialCash(parseInt(targetValue));
                }
                if (targetRule === "passStart") {
                    this.setPassStartAward(parseInt(targetValue));
                }
            };
            RulesController.$inject = ["$state", "$stateParams", "$scope", "$timeout", "settingsService", "themeService"];
            return RulesController;
        }());
        controllers.RulesController = RulesController;
        monopolyApp.controller("rulesCtrl", RulesController);
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
            function SettingsController(stateService, scope, rootScope, timeoutService, settingsService, themeService) {
                var _this = this;
                this.stateService = stateService;
                this.scope = scope;
                this.rootScope = rootScope;
                this.timeoutService = timeoutService;
                this.settingsService = settingsService;
                this.themeService = themeService;
                this.playButtonText = 'Play';
                this.playButtonDisabled = false;
                $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gameSetupImage);
                this.loadSettings();
                var that = this;
                this.numPlayersSlider = {
                    value: this.settings.numPlayers,
                    options: {
                        floor: 2,
                        ceil: 4,
                        showSelectionBar: false,
                        hidePointerLabels: true,
                        hideLimitLabels: true,
                        onEnd: function (id) {
                            $("#numPlayers").val(that.numPlayersSlider.value);
                            that.adjustNumPlayers(that.numPlayersSlider.value);
                        }
                    }
                };
                that.timeoutService(function () {
                    var playerTypeToggle = $('[id|="playerType"]');
                    playerTypeToggle.bootstrapToggle({
                        on: "Human",
                        off: "Computer"
                    });
                    playerTypeToggle.on("change", function (event) {
                        var toggle = $(event.currentTarget);
                        that.scope.$apply(function () {
                            var i = parseInt(toggle.attr("id").substr(11));
                            that.settings.players[i].human = toggle.prop("checked") === true;
                            if (that.settings.players[i].human) {
                                that.settings.players[i].playerName = "";
                            }
                            that.reassignComputerNames();
                        });
                    });
                    _this.rootScope.$broadcast('rzSliderForceRender');
                }, 1);
            }
            SettingsController.prototype.saveAndClose = function () {
                if (this.checkData()) {
                    this.playButtonText = 'Please wait...';
                    this.playButtonDisabled = true;
                    this.saveSettings();
                    this.stateService.go("newgame", { loadGame: false });
                }
            };
            SettingsController.prototype.goToGameRules = function () {
                this.saveSettings();
                this.stateService.go("rules", { inGame: false });
            };
            SettingsController.prototype.goBack = function () {
                this.stateService.go("mainmenu");
            };
            SettingsController.prototype.loadSettings = function () {
                this.settings = this.settingsService.loadSettings();
            };
            SettingsController.prototype.saveSettings = function () {
                this.settingsService.saveSettings(this.settings);
            };
            SettingsController.prototype.adjustNumPlayers = function (numPlayers) {
                var that = this;
                //this.scope.$apply(() => {
                while (numPlayers < that.settings.numPlayers) {
                    var playerTypeToggle = $("#playerType-" + (that.settings.players.length - 1));
                    playerTypeToggle.off();
                    playerTypeToggle.bootstrapToggle('destroy');
                    that.settings.players.pop();
                    that.settings.numPlayers--;
                }
                while (numPlayers > that.settings.numPlayers) {
                    var numComputers = that.settings.players.filter(function (p) { return !p.human; }).length;
                    that.settings.players.push(new Model.Player("Computer " + (numComputers + 1), false));
                    that.settings.numPlayers++;
                    that.reassignComputerNames();
                    that.timeoutService(function (i) {
                        var playerTypeToggle = $("#playerType-" + i);
                        playerTypeToggle.bootstrapToggle({
                            on: "Human",
                            off: "Computer"
                        });
                        playerTypeToggle.on("change", function () {
                            that.scope.$apply(function () {
                                var i = parseInt(playerTypeToggle.attr("id").substr(11));
                                that.settings.players[i].human = playerTypeToggle.prop("checked") === true;
                                that.reassignComputerNames();
                            });
                        });
                    }, 1, false, that.settings.numPlayers - 1);
                }
                //});
            };
            SettingsController.prototype.reassignComputerNames = function () {
                var computerNames = ["Apollo", "Gemini", "Voshkod", "Altair"];
                var i = 0;
                this.settings.players.forEach(function (p) {
                    if (!p.human) {
                        p.playerName = computerNames[i];
                        i++;
                    }
                });
            };
            SettingsController.prototype.checkData = function () {
                var unique = true;
                var empty = false;
                var that = this;
                this.settings.players.forEach(function (p) {
                    if (that.settings.players.filter(function (p2) { return p.playerName === p2.playerName; }).length >= 2) {
                        unique = false;
                    }
                    if (!p.playerName || p.playerName.length === 0) {
                        empty = true;
                    }
                });
                if (!unique) {
                    sweetAlert({
                        title: "Data entry error",
                        text: "Please enter unique player names.",
                        type: "error",
                        confirmButtonText: "Ok",
                        allowOutsideClick: true
                    });
                }
                else {
                    if (empty) {
                        sweetAlert({
                            title: "Data entry error",
                            text: "Please enter missing player names.",
                            type: "error",
                            confirmButtonText: "Ok",
                            allowOutsideClick: true
                        });
                    }
                }
                return unique && !empty;
            };
            SettingsController.$inject = ["$state", "$scope", "$rootScope", "$timeout", "settingsService", "themeService"];
            return SettingsController;
        }());
        controllers.SettingsController = SettingsController;
        monopolyApp.controller("settingsCtrl", SettingsController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var StatsController = (function () {
            function StatsController(stateService, stateParamsService, scope, timeoutService, themeService) {
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.themeService = themeService;
                $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gameStatsImage);
            }
            StatsController.prototype.goBack = function () {
                this.stateService.go("mainmenu");
            };
            StatsController.$inject = ["$state", "$stateParams", "$scope", "$timeout", "themeService"];
            return StatsController;
        }());
        controllers.StatsController = StatsController;
        monopolyApp.controller("statsCtrl", StatsController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
var Services;
(function (Services) {
    var SettingsService = (function () {
        function SettingsService($http) {
            var _this = this;
            this.loadSettings = function () {
                var settings = new Model.Settings();
                var localStorageAny = localStorage;
                if (localStorage.getItem("settings_v1_01")) {
                    var savedSettings = JSON.parse(localStorageAny.settings_v1_01);
                    settings.numPlayers = savedSettings.numPlayers;
                    settings.players = savedSettings.players;
                    if (savedSettings.rules) {
                        settings.rules = savedSettings.rules;
                    }
                }
                _this._settings = settings;
                return settings;
            };
            this.loadOptions = function () {
                var options = new Model.Options();
                var localStorageAny = localStorage;
                var savedOptions;
                if (localStorage.getItem("options_v0_02")) {
                    savedOptions = JSON.parse(localStorageAny.options_v0_02);
                    options.tutorial = savedOptions.tutorial;
                    options.sound = savedOptions.sound;
                    options.music = savedOptions.music;
                    options.staticCamera = savedOptions.staticCamera;
                    options.shadows = savedOptions.shadows;
                }
                else if (localStorage.getItem("options_v0_01")) {
                    savedOptions = JSON.parse(localStorageAny.options_v0_01);
                    options.tutorial = savedOptions.tutorial;
                    options.sound = savedOptions.sound;
                    options.music = savedOptions.music;
                    options.staticCamera = false;
                    options.shadows = false;
                }
                else {
                    options.tutorial = true;
                    options.sound = false;
                    options.music = true;
                    options.staticCamera = false;
                    options.shadows = false;
                }
                _this._options = options;
                return options;
            };
            this.httpService = $http;
        }
        Object.defineProperty(SettingsService.prototype, "settings", {
            get: function () {
                if (!this._settings) {
                    this.loadSettings();
                }
                return this._settings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsService.prototype, "options", {
            get: function () {
                if (!this._options) {
                    this.loadOptions();
                }
                return this._options;
            },
            enumerable: true,
            configurable: true
        });
        SettingsService.prototype.saveSettings = function (settings) {
            var localStorageAny = localStorage;
            localStorageAny.settings_v1_01 = JSON.stringify(settings);
        };
        SettingsService.prototype.saveOptions = function (options) {
            var localStorageAny = localStorage;
            localStorageAny.options_v0_02 = JSON.stringify(options);
        };
        SettingsService.$inject = ["$http"];
        return SettingsService;
    }());
    Services.SettingsService = SettingsService;
    monopolyApp.service("settingsService", SettingsService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
var Services;
(function (Services) {
    var AIService = (function () {
        function AIService(gameService, themeService) {
            this.gameService = gameService;
        }
        Object.defineProperty(AIService.prototype, "ownedGroupTradeMultiplier", {
            get: function () {
                return 4;
            },
            enumerable: true,
            configurable: true
        });
        // process computer managing his properties or trading
        AIService.prototype.afterMoveProcessing = function (skipBuyingHouses) {
            var _this = this;
            var actions = new Array();
            var player = this.gameService.players.filter(function (p) { return p.playerName === _this.gameService.getCurrentPlayer(); })[0];
            if (this.gameService.canBuy) {
                var asset = this.gameService.getCurrentPlayerPosition().asset;
                if (this.shouldBuy(asset)) {
                    var buyAction = new Model.AIAction();
                    buyAction.actionType = Model.AIActionType.Buy;
                    actions.push(buyAction);
                }
            }
            else {
                var playerMoney = player.money;
                if (player.turnsInPrison === 0 && this.gameService.lastDiceResult !== 6) {
                    playerMoney -= this.gameService.gameParams.jailBail;
                }
                if (playerMoney < 0) {
                    var moneyToGain = Math.abs(playerMoney);
                    moneyToGain = this.mortgageAssets(moneyToGain, player.playerName, actions);
                    if (moneyToGain > 0 && actions.length === 0) {
                        // unable to raise enough money
                        var surrenderAction = new Model.AIAction();
                        surrenderAction.actionType = Model.AIActionType.Surrender;
                        actions.push(surrenderAction);
                    }
                }
            }
            if (player.money > 0) {
                if (player.turnsInPrison === 0 && this.gameService.canGetOutOfJail) {
                    var outOfJailAction = new Model.AIAction();
                    outOfJailAction.actionType = Model.AIActionType.GetOutOfJail;
                    actions.push(outOfJailAction);
                    return actions; // getting out of jail is the last thing we are doing while being on the current field
                }
                var moneyAvailable = player.money;
                if (!skipBuyingHouses) {
                    this.buyHouses(moneyAvailable, player.playerName, actions);
                }
            }
            this.unmortgageAssets(player.money, player.playerName, actions);
            this.tradeAssets(player, actions);
            return actions;
        };
        // determine whether the computer should buy current property he has landed on
        AIService.prototype.shouldBuy = function (asset) {
            var _this = this;
            var player = this.gameService.players.filter(function (p) { return p.playerName === _this.gameService.getCurrentPlayer(); })[0];
            var severalOwners = this.severalOwners(asset.group);
            var assetGroupsToGain = undefined;
            if (player.money < 1200 && severalOwners) {
                assetGroupsToGain = this.numAssetGroupsToGain(player.playerName);
                if (assetGroupsToGain > 0 || player.money < asset.price + 250) {
                    return false;
                }
            }
            assetGroupsToGain = assetGroupsToGain === undefined ? this.numAssetGroupsToGain(player.playerName) : assetGroupsToGain;
            if (assetGroupsToGain <= 3 && player.money >= asset.price + 250) {
                return true;
            }
            var canOwnGroup = undefined;
            if (assetGroupsToGain > 3) {
                if (player.money > asset.price + 700) {
                    return true;
                }
                if (player.money > asset.price + 250) {
                    canOwnGroup = this.canOwnGroup(asset, player);
                    if (canOwnGroup) {
                        if (player.money > asset.price + 350) {
                            return true;
                        }
                        var group_assets = this.gameService.getGroupBoardFields(asset.group);
                        if (group_assets.filter(function (b) { return !b.asset.unowned; }).length > 0) {
                            // if we already own at least one property in the group, let's risk more to get additional one
                            return true;
                        }
                    }
                }
            }
            canOwnGroup = canOwnGroup === undefined ? this.canOwnGroup(asset, player) : canOwnGroup;
            if (player.money > asset.price + 150 && asset.price >= 300 && canOwnGroup) {
                // for higher valued properties AI is prepared to risk a bit more
                return true;
            }
            if (player.money > asset.price && !severalOwners && !canOwnGroup) {
                var groupAssets = this.gameService.getGroupBoardFields(asset.group);
                var numOwned = groupAssets.filter(function (b) { return !b.asset.unowned; }).length;
                var numUnowned = groupAssets.filter(function (b) { return b.asset.unowned; }).length;
                if (numOwned > 0) {
                    // another player has a chance to own entire group; try to thwart him from that
                    if (numUnowned === 1 && player.money > asset.price + 100) {
                        return true;
                    }
                    if (numUnowned > 1 && player.money > asset.price + 300) {
                        return true;
                    }
                }
            }
            return false;
        };
        AIService.prototype.acceptTradeOffer = function (player, tradeState) {
            var myMoney = tradeState.firstPlayer.playerName === player.playerName ? tradeState.firstPlayerMoney : tradeState.secondPlayerMoney;
            var otherMoney = tradeState.firstPlayer.playerName === player.playerName ? tradeState.secondPlayerMoney : tradeState.firstPlayerMoney;
            var moneyBalance = otherMoney - myMoney; // how much money am I getting (if +) or losing (if -)
            var gameBeforeTrade = this.gameService.cloneGame();
            var scoreBeforeTrade = this.evaluate(player, gameBeforeTrade);
            gameBeforeTrade.performTrade(tradeState);
            var scoreAfterTrade = this.evaluate(player, gameBeforeTrade);
            var accept = scoreAfterTrade - scoreBeforeTrade + moneyBalance >= 0;
            return accept;
        };
        // evaluate board from the player's view; score is expressed in money units
        AIService.prototype.evaluate = function (player, game) {
            var _this = this;
            var myValue = this.evaluatePlayerWorth(player, game);
            game.players.forEach(function (p) {
                if (p.playerName !== player.playerName && p.active) {
                    myValue = myValue - _this.evaluatePlayerWorth(p, game);
                }
            });
            return myValue;
        };
        // used by trading to decide whether the player's position improves after trade
        AIService.prototype.evaluatePlayerWorth = function (player, game) {
            var _this = this;
            var score = 0;
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            var ownedGroups = this.getPlayerAssetGroups(player.playerName, game);
            groups.forEach(function (group) {
                var fieldsInGroup = _this.getGroupBoardFields(group, game);
                if (ownedGroups.filter(function (gr) { return gr === group; }).length > 0) {
                    score += fieldsInGroup[0].asset.price * _this.ownedGroupTradeMultiplier * fieldsInGroup.length;
                }
                else {
                    // group not entirely owned by player...
                    if (_this.canOwnGroup(fieldsInGroup[0].asset, player, game)) {
                        // ..but it could be, so it is still worth something
                        score += fieldsInGroup[0].asset.price * 3 * fieldsInGroup.filter(function (f) { return !f.asset.unowned && f.asset.owner === player.playerName; }).length;
                    }
                    else {
                        score += fieldsInGroup[0].asset.price * 2 * fieldsInGroup.filter(function (f) { return !f.asset.unowned && f.asset.owner === player.playerName; }).length;
                    }
                }
                // deduct mortgaged assets
                fieldsInGroup.forEach(function (field) {
                    if (!field.asset.unowned && field.asset.owner === player.playerName && field.asset.mortgage) {
                        score -= Math.floor(field.asset.valueMortgage * 1.1);
                    }
                });
            });
            // count the railways and utilities
            var railways = this.getGroupBoardFields(Model.AssetGroup.Railway, game);
            var railwaysOwned = railways.filter(function (r) { return !r.asset.unowned && r.asset.owner === player.playerName; }).length;
            if (railwaysOwned > 0) {
                score += railways[0].asset.priceRent[railwaysOwned - 1] * 15;
            }
            var utilities = this.getGroupBoardFields(Model.AssetGroup.Utility, game);
            var utilitiesOwned = utilities.filter(function (r) { return !r.asset.unowned && r.asset.owner === player.playerName; }).length;
            if (utilitiesOwned > 0) {
                score += utilities[0].asset.priceMultiplierUtility[utilitiesOwned - 1] * 30;
            }
            return score;
        };
        // get asset groups entirely owned by given player
        AIService.prototype.getPlayerAssetGroups = function (playerName, game) {
            var _this = this;
            var playerGroups = [];
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            groups.forEach(function (group) {
                var groupFields = _this.getGroupBoardFields(group, game);
                if (groupFields.every(function (field) { return !field.asset.unowned && field.asset.owner === playerName; })) {
                    playerGroups.push(group);
                }
            });
            return playerGroups;
        };
        // mortgage assets to gain required money
        AIService.prototype.mortgageAssets = function (moneyToGain, player, actions) {
            var _this = this;
            if (moneyToGain <= 0) {
                return 0;
            }
            // first, try finding an asset where not an entire group is owned
            var ownedAssets = this.gameService.getPlayerAssets(player);
            if (ownedAssets.length === 0) {
                return moneyToGain;
            }
            var action = new Model.AIAction();
            var individualAssets = new Array();
            ownedAssets.forEach(function (asset) {
                var groupAssets = _this.gameService.getGroupBoardFields(asset.group);
                var unownedGroupAssets = groupAssets.filter(function (groupAsset) { return groupAsset.asset.unowned || groupAsset.asset.owner !== player || groupAsset.asset.mortgage; });
                if (unownedGroupAssets.length > 0 && !asset.mortgage) {
                    if (actions.filter(function (a) { return a.actionType === Model.AIActionType.Mortgage && a.asset.name === asset.name; }).length === 0) {
                        individualAssets.push(asset);
                    }
                }
            });
            // mortgage individual assets one by one
            if (individualAssets.length > 0) {
                var sortedIndividualAssets = individualAssets.sort(function (a, b) { return a.valueMortgage > b.valueMortgage ? 1 : (a.valueMortgage < b.valueMortgage ? -1 : 0); });
                var selectedIndividualAsset = sortedIndividualAssets.reduce(function (previous, current) {
                    if (current.valueMortgage >= moneyToGain) {
                        return current;
                    }
                    else {
                        if (!previous) {
                            return current;
                        }
                        else {
                            return previous;
                        }
                    }
                });
                if (selectedIndividualAsset) {
                    action.actionType = Model.AIActionType.Mortgage;
                    action.asset = selectedIndividualAsset;
                    actions.push(action);
                    // continue mortgaging until enough money is raised
                    return this.mortgageAssets(Math.max(moneyToGain - selectedIndividualAsset.valueMortgage, 0), player, actions);
                }
            }
            else {
                // time to sell assets from an owned group and utilities
                var utilities = ownedAssets.filter(function (asset) { return asset.group === Model.AssetGroup.Utility && !asset.mortgage; });
                if (utilities.length > 0) {
                    var utilityMortgaged = false;
                    utilities.forEach(function (utility) {
                        if (actions.filter(function (a) { return a.actionType === Model.AIActionType.Mortgage && a.asset.name === utility.name; }).length === 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.Mortgage;
                            action.asset = utility;
                            actions.push(action);
                            moneyToGain -= utility.valueMortgage;
                            utilityMortgaged = true;
                        }
                    });
                    if (utilityMortgaged) {
                        return this.mortgageAssets(Math.max(moneyToGain, 0), player, actions);
                    }
                }
                var railways = ownedAssets.filter(function (asset) { return asset.group === Model.AssetGroup.Railway && !asset.mortgage; });
                if (railways.length > 0) {
                    var railwayMortgaged = false;
                    railways.forEach(function (railway) {
                        if (actions.filter(function (a) { return a.actionType === Model.AIActionType.Mortgage && a.asset.name === railway.name; }).length === 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.Mortgage;
                            action.asset = railway;
                            actions.push(action);
                            moneyToGain -= railway.valueMortgage;
                            railwayMortgaged = true;
                        }
                    });
                    if (railwayMortgaged) {
                        return this.mortgageAssets(Math.max(moneyToGain, 0), player, actions);
                    }
                }
                // lastly, sell houses and mortgage assets of an owned group
                var ownedGroups = this.gameService.getPlayerAssetGroups(player);
                if (ownedGroups.length > 0) {
                    var groupFields = this.gameService.getGroupBoardFields(ownedGroups[0]);
                    var fieldsWithHotel = groupFields.filter(function (field) { return field.asset.hotel; });
                    if (fieldsWithHotel.length > 0) {
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.SellHotel;
                        action.asset = fieldsWithHotel[0].asset;
                        action.position = fieldsWithHotel[0].index;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - fieldsWithHotel[0].asset.priceHotel / 2, 0), player, actions);                        
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - fieldsWithHotel[0].asset.priceHotel / 2, 0);
                    }
                    var fieldsWithHouses = groupFields.filter(function (field) { return field.asset.houses && field.asset.houses > 0; });
                    if (fieldsWithHouses.length > 0) {
                        var fieldWithMostHouses = fieldsWithHouses.sort(function (a, b) { return a.asset.houses > b.asset.houses ? -1 : (a.asset.houses < b.asset.houses ? 1 : 0); })[0];
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.SellHouse;
                        action.asset = fieldWithMostHouses.asset;
                        action.position = fieldWithMostHouses.index;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - fieldWithMostHouses.asset.priceHouse / 2, 0), player, actions);                        
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - fieldWithMostHouses.asset.priceHouse / 2, 0);
                    }
                    // if no houses and hotels, just mortgage one of the assets in a group
                    var unmortgagedFields = groupFields.filter(function (f) { return !(f.asset.mortgage); });
                    if (unmortgagedFields.length > 0) {
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Mortgage;
                        action.asset = unmortgagedFields[0].asset;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - unmortgagedFields[0].asset.valueMortgage, 0), player, actions);
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - unmortgagedFields[0].asset.valueMortgage, 0);
                    }
                }
            }
            return moneyToGain;
        };
        AIService.prototype.getGroupBoardFields = function (assetGroup, game) {
            return game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === assetGroup; });
        };
        // buy houses or hotels if available
        AIService.prototype.buyHouses = function (moneyAvailable, player, actions) {
            var _this = this;
            moneyAvailable -= 200;
            if (moneyAvailable < 0) {
                return;
            }
            var assetGroupsToGain = this.numAssetGroupsToGain(player);
            var ownedAssets = this.gameService.getPlayerAssets(player);
            if (ownedAssets.length === 0) {
                return;
            }
            var action;
            var ownedGroups = this.gameService.getPlayerAssetGroups(player);
            // try buying houses first
            ownedGroups.forEach(function (group) {
                // only process one asset group in a single iteration
                if (actions.filter(function (a) { return a.actionType === Model.AIActionType.BuyHouse; }).length === 0) {
                    var groupFields = _this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(function (f) { return !f.asset.mortgage; })) {
                        var housesLeftToBuy = 0;
                        var housesPerAsset = 0;
                        groupFields.forEach(function (f) {
                            if (!f.asset.mortgage) {
                                if (!f.asset.hotel) {
                                    housesLeftToBuy += !f.asset.houses ? 4 : 4 - f.asset.houses;
                                    housesPerAsset += f.asset.houses ? f.asset.houses : 0;
                                }
                                else {
                                    housesPerAsset += 5;
                                }
                            }
                        });
                        housesPerAsset = Math.floor(housesPerAsset / groupFields.length);
                        var moneyAvailableForHouses = moneyAvailable;
                        // don't spend to much on houses if there already are some and there are still asset groups available
                        if (assetGroupsToGain > 0 && housesPerAsset >= 2) {
                            moneyAvailableForHouses -= 200;
                        }
                        if (assetGroupsToGain >= 3 && housesPerAsset >= 2) {
                            moneyAvailableForHouses -= 2000;
                        }
                        var affordableHouses = Math.floor(moneyAvailableForHouses / groupFields[0].asset.priceHouse);
                        var housesToBuy = Math.min(housesLeftToBuy, affordableHouses);
                        if (housesToBuy > 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.BuyHouse;
                            // never buy more than 3 houses at once
                            action.numHousesOrHotels = Math.min(housesToBuy, 3);
                            action.assetGroup = group;
                            actions.push(action);
                        }
                    }
                }
            });
            if (actions.filter(function (a) { return a.actionType === Model.AIActionType.BuyHouse; }).length > 0) {
                return;
            }
            ownedGroups.forEach(function (group) {
                // only process one asset group in a single iteration
                if (actions.filter(function (a) { return a.actionType === Model.AIActionType.BuyHotel; }).length === 0) {
                    var groupFields = _this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(function (f) { return (f.asset.houses && f.asset.houses === 4) || f.asset.hotel; })) {
                        var hotelsLeftToBuy = 0;
                        groupFields.forEach(function (f) {
                            hotelsLeftToBuy += f.asset.hotel ? 0 : 1;
                        });
                        var moneyAvailableForHotels = moneyAvailable;
                        // don't spend to much on hotels if there are still asset groups available
                        if (assetGroupsToGain > 0) {
                            moneyAvailableForHotels -= 300;
                        }
                        if (assetGroupsToGain >= 3) {
                            moneyAvailableForHotels -= 400;
                        }
                        var affordableHotels = Math.floor(moneyAvailableForHotels / groupFields[0].asset.priceHotel);
                        var hotelsToBuy = Math.min(hotelsLeftToBuy, affordableHotels);
                        if (hotelsToBuy > 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.BuyHotel;
                            action.numHousesOrHotels = hotelsToBuy;
                            action.assetGroup = group;
                            actions.push(action);
                        }
                    }
                }
            });
        };
        // unmortgage mortgaged assets if having enough money
        AIService.prototype.unmortgageAssets = function (money, player, actions) {
            var _this = this;
            var actionAdded = false; // only one action in a single iteration so that other users can follow computer actions
            if (money <= 100) {
                return;
            }
            // first, try finding any mortgaged assets where an entire group is owned
            var ownedGroups = this.gameService.getPlayerAssetGroups(player);
            ownedGroups.forEach(function (ownedGroup) {
                var groupFields = _this.gameService.getGroupBoardFields(ownedGroup);
                groupFields.forEach(function (groupField) {
                    if (!actionAdded && groupField.asset.mortgage && money - (Math.floor(groupField.asset.price * 1.1)) > 50) {
                        var action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Unmortgage;
                        action.asset = groupField.asset;
                        action.position = groupField.index;
                        actions.push(action);
                        money -= Math.floor(groupField.asset.price * 1.1);
                        actionAdded = true;
                    }
                });
            });
            // next, release mortgage on railways and utilities
            var railwayFields = this.gameService.getGroupBoardFields(Model.AssetGroup.Railway);
            railwayFields.forEach(function (groupField) {
                if (!actionAdded && groupField.asset.mortgage && groupField.asset.owner === player && money - (Math.floor(groupField.asset.price * 1.1)) > 50) {
                    var action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Unmortgage;
                    action.asset = groupField.asset;
                    action.position = groupField.index;
                    actions.push(action);
                    money -= Math.floor(groupField.asset.price * 1.1);
                    actionAdded = true;
                }
            });
            var utilityFields = this.gameService.getGroupBoardFields(Model.AssetGroup.Utility);
            utilityFields.forEach(function (groupField) {
                if (!actionAdded && groupField.asset.mortgage && groupField.asset.owner === player && money - (Math.floor(groupField.asset.price * 1.1)) > 150) {
                    var action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Unmortgage;
                    action.asset = groupField.asset;
                    actions.push(action);
                    money -= Math.floor(groupField.asset.price * 1.1);
                    actionAdded = true;
                }
            });
            // finally, release mortgage on the rest of the assets if money is in abundance
            var ownedAssets = this.gameService.getPlayerAssets(player);
            ownedAssets.forEach(function (ownedAsset) {
                if (ownedGroups.filter(function (ownedGroup) { return ownedGroup === ownedAsset.group; }).length === 0) {
                    if (!actionAdded && ownedAsset.mortgage && money - (Math.floor(ownedAsset.price * 1.1)) > 500) {
                        var action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Unmortgage;
                        action.asset = ownedAsset;
                        actions.push(action);
                        money -= Math.floor(ownedAsset.price * 1.1);
                        actionAdded = true;
                    }
                }
            });
        };
        // gets the number of groups that are not entirely owned by the player but have a chance to be
        AIService.prototype.numAssetGroupsToGain = function (player) {
            var _this = this;
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
            var groupsToGain = 0;
            var playerGroups = this.gameService.getPlayerAssetGroups(player); // don't count groups already owned by the player
            groups.forEach(function (group) {
                if (playerGroups.filter(function (g) { return g === group; }).length === 0) {
                    var groupFields = _this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(function (f) { return f.asset.unowned || f.asset.owner === player; })) {
                        groupsToGain++;
                    }
                }
            });
            return groupsToGain;
        };
        // whether the group that the asset belongs to is still available
        AIService.prototype.canOwnGroup = function (asset, player, game) {
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            if (groups.filter(function (g) { return g === asset.group; }).length === 0) {
                // not applicable to railroads and utilities
                return true;
            }
            var groupFields = game ? this.getGroupBoardFields(asset.group, game) : this.gameService.getGroupBoardFields(asset.group);
            var ownedByAnotherPlayer = false;
            groupFields.forEach(function (f) {
                ownedByAnotherPlayer = ownedByAnotherPlayer || (!f.asset.unowned && f.asset.owner !== player.playerName);
            });
            return !ownedByAnotherPlayer;
        };
        AIService.prototype.severalOwners = function (group) {
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            var owners = [];
            if (groups.filter(function (g) { return g === group; }).length === 0) {
                // not applicable to railroads and utilities
                return false;
            }
            var groupFields = this.gameService.getGroupBoardFields(group);
            groupFields.forEach(function (f) {
                if (!f.asset.unowned) {
                    if (owners.filter(function (o) { return o === f.asset.owner; }).length === 0) {
                        owners.push(f.asset.owner);
                    }
                }
            });
            return owners.length > 1;
        };
        AIService.prototype.tradeAssets = function (player, actions) {
            if (actions.length > 0) {
                // let's investigate trading opportunities only if there are no pending actions already selected which might change the state of the game
                return;
            }
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            var that = this;
            groups.forEach(function (group) {
                if (actions.length === 0) {
                    var groupFields = that.gameService.getGroupBoardFields(group);
                    var numOtherPlayer = 0;
                    var otherPlayerName = "";
                    var numMyAssets = 0;
                    var secondPlayerAsset;
                    groupFields.forEach(function (f) {
                        if (!f.asset.unowned && f.asset.owner !== player.playerName) {
                            numOtherPlayer += 1;
                            otherPlayerName = f.asset.owner;
                            secondPlayerAsset = f.asset;
                        }
                        if (!f.asset.unowned && f.asset.owner === player.playerName) {
                            numMyAssets += 1;
                        }
                    });
                    if (numOtherPlayer === 1 && numMyAssets + numOtherPlayer === groupFields.length) {
                        // I only have one asset missing; let's check if I've got anything to offer to the other player in exchange
                        groups.forEach(function (otherGroup) {
                            if (otherGroup !== group) {
                                var otherGroupFields = that.gameService.getGroupBoardFields(otherGroup);
                                numOtherPlayer = 0;
                                numMyAssets = 0;
                                var firstPlayerAsset;
                                otherGroupFields.forEach(function (f) {
                                    if (!f.asset.unowned && f.asset.owner === player.playerName) {
                                        numOtherPlayer += 1;
                                        firstPlayerAsset = f.asset;
                                    }
                                    if (!f.asset.unowned && f.asset.owner === otherPlayerName) {
                                        numMyAssets += 1;
                                    }
                                });
                                if (numOtherPlayer === 1 && numMyAssets + numOtherPlayer === otherGroupFields.length && actions.length === 0) {
                                    // found a candidate; let's check if both players have enough money to compensate for the asset different values
                                    var priceDiff = (groupFields[0].asset.price - otherGroupFields[0].asset.price) * that.ownedGroupTradeMultiplier * Math.max(groupFields.length, otherGroupFields.length);
                                    // deduct mortgaged assets
                                    groupFields.forEach(function (field) {
                                        if (!field.asset.unowned && field.asset.owner !== player.playerName && field.asset.mortgage) {
                                            priceDiff -= Math.floor(field.asset.valueMortgage * 1.1);
                                        }
                                    });
                                    otherGroupFields.forEach(function (field) {
                                        if (!field.asset.unowned && field.asset.owner === player.playerName && field.asset.mortgage) {
                                            priceDiff += Math.floor(field.asset.valueMortgage * 1.1);
                                        }
                                    });
                                    var otherPlayer = that.gameService.players.filter(function (p) { return p.playerName === otherPlayerName; })[0];
                                    if ((priceDiff > 0 && player.money >= priceDiff + 50) || (priceDiff < 0 && otherPlayer.money > -priceDiff + 50) || priceDiff === 0) {
                                        // a valid trade option has been found
                                        // if the other player is a computer, add it immediately, otherwise let's randomize the offer
                                        if (Math.floor(Math.random() * 4) === 0) {
                                            var tradeState = new Model.TradeState();
                                            tradeState.firstPlayer = player;
                                            tradeState.secondPlayer = otherPlayer;
                                            tradeState.firstPlayerSelectedAssets.push(firstPlayerAsset);
                                            tradeState.secondPlayerSelectedAssets.push(secondPlayerAsset);
                                            if (priceDiff >= 0) {
                                                tradeState.firstPlayerMoney = priceDiff;
                                                tradeState.secondPlayerMoney = 0;
                                            }
                                            else {
                                                tradeState.firstPlayerMoney = 0;
                                                tradeState.secondPlayerMoney = -priceDiff;
                                            }
                                            var action = new Model.AIAction();
                                            action.actionType = Model.AIActionType.Trade;
                                            action.tradeState = tradeState;
                                            actions.push(action);
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        };
        AIService.$inject = ["gameService"];
        return AIService;
    }());
    Services.AIService = AIService;
    monopolyApp.service("aiService", AIService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
var Services;
(function (Services) {
    var DrawingService = (function () {
        function DrawingService($http, gameService, themeService, settingsService, timeoutService) {
            this.boardFieldsInQuadrant = 11;
            this.groundMeshName = "board";
            this.httpService = $http;
            this.gameService = gameService;
            this.themeService = themeService;
            this.settingsService = settingsService;
            this.timeoutService = timeoutService;
            this.boardFieldWidth = this.boardSize / (this.boardFieldsInQuadrant + 2); // assuming the corner fields are double the width of the rest of the fields
            this.boardFieldHeight = this.boardFieldWidth * 2;
            this.boardFieldEdgeWidth = this.boardFieldWidth * 2;
            this.initQuadrantStartingCoordinates();
            this.dicePosition = [new BABYLON.Vector3(-0.3, 3, 0), new BABYLON.Vector3(0.3, 3, 0)];
            this.diceColliding = false;
            this.manageModeInitialization = true;
        }
        Object.defineProperty(DrawingService.prototype, "boardSize", {
            /// board dimenzion in both, X and Z directions
            get: function () {
                return 10;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingService.prototype, "diceHeight", {
            get: function () {
                return 0.36;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingService.prototype, "framesToMoveOneBoardField", {
            // number of frames to animate player move between two neighbouring fields
            get: function () {
                return 10;
            },
            enumerable: true,
            configurable: true
        });
        DrawingService.prototype.initGame = function () {
            this.options = this.settingsService.loadOptions();
            this.manageModeInitialization = true;
            this.numFramesDiceIsAtRest = [];
            this.numFramesDiceIsAtRest.push(0);
            this.numFramesDiceIsAtRest.push(0);
        };
        DrawingService.prototype.cleanup = function (scene) {
            var allMeshes = scene.meshes.slice(0);
            allMeshes.forEach(function (m) {
                scene.removeMesh(m);
                m.dispose();
            });
            var allLights = scene.lights.slice(0);
            allLights.forEach(function (l) {
                scene.removeLight(l);
                l.dispose();
            });
            var allCameras = scene.cameras.slice(0);
            allCameras.forEach(function (c) {
                scene.removeCamera(c);
                c.dispose();
            });
            scene.dispose();
        };
        DrawingService.prototype.positionPlayer = function (playerModel) {
            if (playerModel.mesh) {
                var player = this.gameService.players.filter(function (player, index) { return player.playerName === playerModel.name; })[0];
                var playerCoordinate = this.getPlayerPositionOnBoardField(playerModel, player.position.index);
                playerModel.mesh.position.x = playerCoordinate.x;
                playerModel.mesh.position.z = playerCoordinate.z;
                playerModel.mesh.rotationQuaternion = this.getPlayerRotationOnBoardField(playerModel, player.position.index);
            }
        };
        DrawingService.prototype.animatePlayerMove = function (oldPosition, newPosition, playerModel, scene, fast, backwards) {
            var positionKeys = [];
            var rotationKeys = [];
            var framesForField = this.framesToMoveOneBoardField;
            var framesForRotation = this.framesToMoveOneBoardField * 2;
            if (fast) {
                framesForField = Math.floor(framesForField / 2);
                framesForRotation = framesForRotation / 2;
            }
            var runningFrame = 0;
            var runningField = 0;
            var fieldsToTravel = backwards ? (newPosition.index <= oldPosition.index ? oldPosition.index - newPosition.index : 40 - newPosition.index + oldPosition.index) :
                newPosition.index >= oldPosition.index ? newPosition.index - oldPosition.index : 40 - oldPosition.index + newPosition.index;
            while (runningField <= fieldsToTravel) {
                var runningPosition = (oldPosition.index + runningField) % 40;
                if (backwards) {
                    runningPosition = oldPosition.index - runningField;
                    if (runningPosition < 0) {
                        runningPosition = 40 + runningPosition;
                    }
                }
                if (runningField > 0) {
                    if (backwards) {
                        if (runningPosition % 10 === 0) {
                            runningFrame += framesForRotation;
                        }
                        else {
                            runningFrame += framesForField;
                        }
                    }
                    else {
                        if ((oldPosition.index + runningField) % 10 === 0) {
                            runningFrame += framesForRotation;
                        }
                        else {
                            runningFrame += framesForField;
                        }
                    }
                }
                var coordinate = this.getPlayerPositionOnBoardField(playerModel, runningPosition);
                var playerPosition = new BABYLON.Vector3(coordinate.x, playerModel.mesh.position.y, coordinate.z);
                positionKeys.push({ frame: runningFrame, value: playerPosition });
                rotationKeys.push({ frame: runningFrame, value: this.getPlayerRotationOnBoardField(playerModel, runningPosition) });
                runningField++;
            }
            var animationplayerPosition = new BABYLON.Animation("playerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var animationplayerRotation = new BABYLON.Animation("playerRotationAnimation", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            animationplayerPosition.setKeys(positionKeys);
            animationplayerRotation.setKeys(rotationKeys);
            playerModel.mesh.animations = [];
            playerModel.mesh.animations.push(animationplayerPosition);
            playerModel.mesh.animations.push(animationplayerRotation);
            var d = $.Deferred();
            var particleSystem = this.addParticle(playerModel.mesh, scene);
            scene.beginAnimation(playerModel.mesh, 0, runningFrame, false, undefined, function () { d.resolve(); });
            particleSystem.start();
            return d;
        };
        DrawingService.prototype.animatePlayerPrisonMove = function (newPosition, playerModel, scene, camera) {
            var _this = this;
            var positionKeys = [];
            var playerPosition = new BABYLON.Vector3(playerModel.mesh.position.x, playerModel.mesh.position.y, playerModel.mesh.position.z);
            positionKeys.push({ frame: 0, value: playerPosition });
            var playerTopPosition = new BABYLON.Vector3(playerModel.mesh.position.x, playerModel.mesh.position.y + 10, playerModel.mesh.position.z);
            positionKeys.push({ frame: 30, value: playerTopPosition });
            var animationplayerPosition = new BABYLON.Animation("playerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            animationplayerPosition.setKeys(positionKeys);
            playerModel.mesh.animations = [];
            playerModel.mesh.animations.push(animationplayerPosition);
            var firstAnim = $.Deferred();
            var secondAnim = $.Deferred();
            scene.beginAnimation(playerModel.mesh, 0, 30, false, undefined, function () { firstAnim.resolve(); });
            var that = this;
            $.when(firstAnim).done(function () {
                var cameraMovement = that.returnCameraToMainPosition(scene, camera, newPosition.index);
                $.when(cameraMovement).done(function () {
                    var finalPosition = that.getPlayerPositionOnBoardField(playerModel, newPosition.index);
                    playerTopPosition = new BABYLON.Vector3(finalPosition.x, playerTopPosition.y, finalPosition.z);
                    playerPosition = new BABYLON.Vector3(finalPosition.x, playerTopPosition.y - 10, finalPosition.z);
                    positionKeys = [];
                    var rotationKeys = [];
                    positionKeys.push({ frame: 0, value: playerTopPosition });
                    positionKeys.push({ frame: 30, value: playerPosition });
                    rotationKeys.push({ frame: 0, value: playerModel.mesh.rotationQuaternion });
                    rotationKeys.push({ frame: 30, value: _this.getPlayerRotationOnBoardField(playerModel, newPosition.index) });
                    animationplayerPosition = new BABYLON.Animation("playerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animationplayerPosition.setKeys(positionKeys);
                    var animationplayerRotation = new BABYLON.Animation("playerRotationAnimation", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animationplayerRotation.setKeys(rotationKeys);
                    playerModel.mesh.animations = [];
                    playerModel.mesh.animations.push(animationplayerPosition);
                    playerModel.mesh.animations.push(animationplayerRotation);
                    scene.beginAnimation(playerModel.mesh, 0, 30, false, undefined, function () { secondAnim.resolve(); });
                });
            });
            return secondAnim;
        };
        DrawingService.prototype.setupDiceForThrow = function (scene) {
            this.diceMesh[0].position.x = this.dicePosition[0].x;
            this.diceMesh[0].position.y = this.dicePosition[0].y;
            this.diceMesh[0].position.z = this.dicePosition[0].z;
            this.diceMesh[1].position.x = this.dicePosition[1].x;
            this.diceMesh[1].position.y = this.dicePosition[1].y;
            this.diceMesh[1].position.z = this.dicePosition[1].z;
            this.unregisterPhysicsMeshes(scene);
        };
        DrawingService.prototype.unregisterPhysicsMeshes = function (scene) {
            var physicsEngine = scene.getPhysicsEngine();
            //physicsEngine._unregisterMesh(this.diceMesh);
            var physicsEngineAny = physicsEngine;
            var diceImpostor = this.diceMesh[0].getPhysicsImpostor();
            if (diceImpostor) {
                //diceImpostor.unregisterOnPhysicsCollide(this.boardMesh.getPhysicsImpostor(), this.onDiceCollide);
                physicsEngineAny.removeImpostor(diceImpostor);
            }
            diceImpostor = this.diceMesh[1].getPhysicsImpostor();
            if (diceImpostor) {
                //diceImpostor.unregisterOnPhysicsCollide(this.boardMesh.getPhysicsImpostor(), this.onDiceCollide);
                physicsEngineAny.removeImpostor(diceImpostor);
            }
        };
        DrawingService.prototype.moveDiceToPosition = function (diceIndex, position, scene) {
            this.diceMesh[diceIndex].position.x = position.x;
            this.diceMesh[diceIndex].position.y = position.y;
            this.diceMesh[diceIndex].position.z = position.z;
            // not required in new version of Physics engine
            //var physicsEngine = scene.getPhysicsEngine();
            //var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
            //if (body) {
            //    body.position.x = position.x;
            //    body.position.y = position.y;
            //    body.position.z = position.z;
            //}
        };
        DrawingService.prototype.moveCameraForDiceThrow = function (scene, camera, currentPlayerPosition) {
            var d = $.Deferred();
            var animationCameraPosition = new BABYLON.Animation("cameraDiceThrowMoveAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var animationCameraRotation = new BABYLON.Animation("cameraDiceThrowRotateAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var topCenter = this.getPositionCoordinate(currentPlayerPosition.index);
            var diceMidpoint = new BABYLON.Vector3((this.dicePosition[0].x + this.dicePosition[1].x) / 2, (this.dicePosition[0].y + this.dicePosition[1].y) / 2, (this.dicePosition[0].z + this.dicePosition[1].z) / 2);
            var cameraDirection = new BABYLON.Vector3(topCenter.x, 6, topCenter.z).subtract(diceMidpoint).normalize();
            if (this.options.staticCamera) {
                cameraDirection.x = -cameraDirection.x;
                cameraDirection.z = -cameraDirection.z;
            }
            var finalCameraPosition = diceMidpoint.add(new BABYLON.Vector3(cameraDirection.x * 1.5, cameraDirection.y * 1.5, cameraDirection.z * 1.5));
            var keys = [];
            keys.push({
                frame: 0,
                value: camera.position
            });
            keys.push({
                frame: 30,
                value: finalCameraPosition
            });
            var keysRotation = [];
            keysRotation.push({
                frame: 0,
                value: camera.rotation
            });
            keysRotation.push({
                frame: 30,
                value: this.getCameraRotationForTarget(diceMidpoint, camera, finalCameraPosition)
            });
            // make sure the starting and ending rotation angle are at the same side of the numeric scale; Math.Pi and -Math.Pi are the same in terms of object rotation, but for
            // computer animation, this is a 360 degree spin, which is undesirable...
            if (keysRotation[0].value.y < 0 && keysRotation[1].value.y >= 0 && keysRotation[1].value.y + Math.abs(keysRotation[0].value.y) > Math.PI) {
                keysRotation[0].value.y = Math.PI + Math.PI + keysRotation[0].value.y;
            }
            if (keysRotation[0].value.y >= 0 && keysRotation[1].value.y < 0 && keysRotation[0].value.y + Math.abs(keysRotation[1].value.y) > Math.PI) {
                keysRotation[0].value.y = -Math.PI - Math.PI + keysRotation[0].value.y;
            }
            animationCameraPosition.setKeys(keys);
            animationCameraRotation.setKeys(keysRotation);
            camera.animations = [];
            camera.animations.push(animationCameraPosition);
            camera.animations.push(animationCameraRotation);
            scene.beginAnimation(camera, 0, 30, false, undefined, function () { d.resolve(); });
            return d;
        };
        DrawingService.prototype.animateDiceThrow = function (scene, impulsePoint) {
            var _this = this;
            this.diceMesh.forEach(function (mesh, i) {
                _this.numFramesDiceIsAtRest[i] = 0;
                _this.dicePhysicsImpostor = _this.diceMesh[i].setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0.2, friction: 0.35 /*0.35*/, restitution: 0.7 });
                var diceImpostor = _this.diceMesh[i].getPhysicsImpostor();
                var that = _this;
                diceImpostor.registerOnPhysicsCollide(_this.boardMesh.getPhysicsImpostor(), function () {
                    that.diceColliding = true;
                });
                _this.diceMesh[i].checkCollisions = true;
                if (impulsePoint && impulsePoint[i]) {
                    var dir = impulsePoint[i].subtract(scene.activeCamera.position);
                    dir.normalize();
                    diceImpostor = _this.diceMesh[i].getPhysicsImpostor();
                    diceImpostor.setLinearVelocity(new BABYLON.Vector3(dir.x * 0.3, dir.y * 0.3, dir.z * 0.3));
                    _this.diceMesh[i].applyImpulse(dir.scale(0.55 /*0.05*/), impulsePoint[i]);
                }
            });
            this.throwingDice = true;
        };
        DrawingService.prototype.getRandomPointOnDice = function (diceIndex) {
            var point = new BABYLON.Vector3(this.diceMesh[diceIndex].position.x, this.diceMesh[diceIndex].position.y, this.diceMesh[diceIndex].position.z);
            point.x = point.x - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            point.y = point.y - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            point.z = point.z - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            return point;
        };
        // animates camera back to the base viewing position; returns the deferred object that will be resolved when the animation finishes
        DrawingService.prototype.returnCameraToMainPosition = function (scene, camera, currentPlayerPositionIndex, numFrames, closer) {
            var d = $.Deferred();
            var animationCameraPosition = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var animationCameraRotation = new BABYLON.Animation("myAnimation2", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var finalCameraPosition = this.getGameCameraPosition(currentPlayerPositionIndex, false, closer);
            var keys = [];
            keys.push({
                frame: 0,
                value: camera.position
            });
            keys.push({
                frame: numFrames ? numFrames : 30,
                value: finalCameraPosition
            });
            var keysRotation = [];
            keysRotation.push({
                frame: 0,
                value: camera.rotation
            });
            var targetCoordinate = this.getPositionCoordinate(currentPlayerPositionIndex);
            /*var currentTarget = camera.getTarget();
            var currentRotation = new BABYLON.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z);
            var currentPosition = new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z);
            camera.position = new BABYLON.Vector3(finalCameraPosition.x, finalCameraPosition.y, finalCameraPosition.z);
            camera.setTarget(new BABYLON.Vector3(targetCoordinate.x, 0, targetCoordinate.z));
            var targetRotation = new BABYLON.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z);
            camera.setTarget(currentTarget);
            camera.rotation.x = currentRotation.x;
            camera.rotation.y = currentRotation.y;
            camera.rotation.z = currentRotation.z;
            camera.position.x = currentPosition.x;
            camera.position.y = currentPosition.y;
            camera.position.z = currentPosition.z;*/
            keysRotation.push({
                frame: numFrames ? numFrames : 30,
                value: this.getCameraRotationForTarget(new BABYLON.Vector3(closer ? targetCoordinate.x + 0.01 : 0, 0, closer ? targetCoordinate.z + 0.01 : 0), camera, finalCameraPosition)
            });
            if (this.options.staticCamera && !closer) {
                var fieldQuadrant = Math.floor(currentPlayerPositionIndex / (this.boardFieldsInQuadrant - 1));
                if (!keysRotation[1].value.y) {
                    if (fieldQuadrant === 0) {
                        keysRotation[1].value.y = 3.14;
                    }
                    else if (fieldQuadrant === 1) {
                        keysRotation[1].value.y = -1.56;
                    }
                    else if (fieldQuadrant === 3) {
                        keysRotation[1].value.y = 1.56;
                    }
                }
            }
            // make sure the starting and ending rotation angle are at the same side of the numeric scale; Math.Pi and -Math.Pi are the same in terms of object rotation, but for
            // computer animation, this is a 360 degree spin, which is undesirable...
            if (keysRotation[0].value.y < 0 && keysRotation[1].value.y >= 0 && keysRotation[1].value.y + Math.abs(keysRotation[0].value.y) > Math.PI) {
                keysRotation[0].value.y = Math.PI + Math.PI + keysRotation[0].value.y;
            }
            if (keysRotation[0].value.y >= 0 && keysRotation[1].value.y < 0 && keysRotation[0].value.y + Math.abs(keysRotation[1].value.y) > Math.PI) {
                keysRotation[0].value.y = -Math.PI - Math.PI + keysRotation[0].value.y;
            }
            animationCameraPosition.setKeys(keys);
            animationCameraRotation.setKeys(keysRotation);
            camera.animations.splice(0, camera.animations.length);
            camera.animations = [];
            camera.animations.push(animationCameraPosition);
            camera.animations.push(animationCameraRotation);
            var speedRatio = 1;
            scene.beginAnimation(camera, 0, numFrames ? numFrames : 30, false, speedRatio, function () {
                d.resolve();
            });
            return d;
        };
        DrawingService.prototype.isDiceAtRestAfterThrowing = function (scene) {
            if (this.throwingDice) {
                var dicesAtRest = true;
                var that = this;
                var fps = scene.getEngine().getFps();
                this.diceMesh.forEach(function (mesh, i) {
                    //var physicsEngine = scene.getPhysicsEngine();
                    //var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
                    var impostor = that.diceMesh[i].getPhysicsImpostor();
                    var velocityVector = impostor.getLinearVelocity(); //body.velocity;
                    var angularVelocityVector = impostor.getAngularVelocity();
                    //$("#debugMessage").html("Y=" + body.velocity.y.toPrecision(5));
                    if (Math.abs(velocityVector.x) > BABYLON.Engine.Epsilon || Math.abs(velocityVector.y) > BABYLON.Engine.Epsilon || Math.abs(velocityVector.z) > BABYLON.Engine.Epsilon ||
                        Math.abs(angularVelocityVector.x) > BABYLON.Engine.Epsilon || Math.abs(angularVelocityVector.y) > BABYLON.Engine.Epsilon || Math.abs(angularVelocityVector.z) > BABYLON.Engine.Epsilon
                        || Math.abs(that.diceMesh[i].position.y - that.boardMesh.position.y) > that.diceHeight * 0.6) {
                        that.numFramesDiceIsAtRest[i] -= 5;
                        if (that.numFramesDiceIsAtRest[i] < 0) {
                            that.numFramesDiceIsAtRest[i] = 0;
                        }
                        dicesAtRest = false;
                    }
                    that.numFramesDiceIsAtRest[i]++;
                    if (that.numFramesDiceIsAtRest[i] < fps * 2 /*3*/) {
                        dicesAtRest = false;
                    }
                    var diceResult = that.getDiceResult(i);
                    if (diceResult === 0 && that.numFramesDiceIsAtRest[i] < fps * 5 /*8*/) {
                        dicesAtRest = false;
                    }
                });
                if (this.numFramesDiceIsAtRest[0] > fps * 12 || this.numFramesDiceIsAtRest[1] > fps * 12) {
                    // one of the dices probably got stuck
                    dicesAtRest = true;
                }
                if (dicesAtRest) {
                    this.throwingDice = false;
                    return true;
                }
            }
            return false;
        };
        DrawingService.prototype.diceIsColliding = function () {
            var collision = this.diceColliding;
            this.diceColliding = false;
            return collision; //this.boardMesh.intersectsMesh(this.diceMesh, true);
        };
        DrawingService.prototype.getDiceLocation = function (scene, diceIndex) {
            //var physicsEngine = scene.getPhysicsEngine();
            //var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
            //if (body) {
            //    return <BABYLON.Vector3>body.position;
            //}
            return this.diceMesh[diceIndex].position;
        };
        DrawingService.prototype.setGameCameraInitialPosition = function (camera) {
            camera.position = this.getGameCameraPosition(this.gameService.getCurrentPlayerPosition().index, true);
            camera.setTarget(BABYLON.Vector3.Zero());
        };
        DrawingService.prototype.setManageCameraPosition = function (camera, focusedAssetGroupIndex, scene, animate) {
            var d = $.Deferred();
            var firstFocusedBoardField = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            if (!this.boardGroupLeftCoordinate) {
                this.initBoardGroupCoordinates();
            }
            var group = firstFocusedBoardField.asset.group;
            var centerVector;
            if (group !== Model.AssetGroup.Railway) {
                var groupLeftCoordinate = this.boardGroupLeftCoordinate[group];
                var groupRightCoordinate = this.boardGroupRightCoordinate[group];
                centerVector = BABYLON.Vector3.Center(new BABYLON.Vector3(groupLeftCoordinate.x, 0, groupLeftCoordinate.z), new BABYLON.Vector3(groupRightCoordinate.x, 0, groupRightCoordinate.z));
            }
            else {
                var centerCoordinate = this.getPositionCoordinate(firstFocusedBoardField.index);
                centerVector = new BABYLON.Vector3(centerCoordinate.x, 0, centerCoordinate.z);
            }
            var groupQuadrant = group === Model.AssetGroup.Railway ? Math.floor(firstFocusedBoardField.index / 10) : Math.floor((group - 1) / 2);
            var currentRotation = new BABYLON.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z);
            var newPosition;
            if (groupQuadrant === 0) {
                newPosition = new BABYLON.Vector3(centerVector.x, 2, -7);
            }
            if (groupQuadrant === 1) {
                newPosition = new BABYLON.Vector3(-7, 2, centerVector.z);
            }
            if (groupQuadrant === 2) {
                newPosition = new BABYLON.Vector3(centerVector.x, 2, 7);
            }
            if (groupQuadrant === 3) {
                newPosition = new BABYLON.Vector3(7, 2, centerVector.z);
            }
            var newRotation = this.getCameraRotationForTarget(new BABYLON.Vector3(centerVector.x + 0.01, 0, centerVector.z + 0.01), camera, newPosition);
            if (!animate) {
                camera.rotation = newRotation;
            }
            if (animate) {
                var animationCameraPosition = new BABYLON.Animation("cameraManageMoveAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                var animationCameraRotation = new BABYLON.Animation("cameraManageRotateAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                var keys = [];
                keys.push({
                    frame: 0,
                    value: new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z)
                });
                keys.push({
                    frame: 15,
                    value: newPosition
                });
                var keysRotation = [];
                keysRotation.push({
                    frame: 0,
                    value: new BABYLON.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z)
                });
                keysRotation.push({
                    frame: 15,
                    value: newRotation
                });
                // make sure the starting and ending rotation angle are at the same side of the numeric scale; Math.Pi and -Math.Pi are the same in terms of object rotation, but for
                // computer animation, this is a 360 degree spin, which is undesirable...
                if (keysRotation[0].value.y < 0 && keysRotation[1].value.y >= 0 && keysRotation[1].value.y + Math.abs(keysRotation[0].value.y) > Math.PI) {
                    keysRotation[0].value.y = Math.PI + Math.PI + keysRotation[0].value.y;
                }
                if (keysRotation[0].value.y >= 0 && keysRotation[1].value.y < 0 && keysRotation[0].value.y + Math.abs(keysRotation[1].value.y) > Math.PI) {
                    keysRotation[0].value.y = -Math.PI - Math.PI + keysRotation[0].value.y;
                }
                animationCameraPosition.setKeys(keys);
                animationCameraRotation.setKeys(keysRotation);
                camera.animations = [];
                camera.animations.push(animationCameraPosition);
                camera.animations.push(animationCameraRotation);
                var that = this;
                scene.beginAnimation(camera, 0, 15, false, undefined, function () {
                    if (that.manageModeInitialization) {
                        $("#loadingBar").show();
                    }
                    that.highlightGroupFields(focusedAssetGroupIndex, groupQuadrant, centerVector, scene);
                    if (that.manageModeInitialization) {
                        that.manageModeInitialization = false;
                        that.timeoutService(function () {
                            $("#loadingBar").hide();
                            d.resolve();
                        }, 3000);
                    }
                    else {
                        d.resolve();
                    }
                });
            }
            else {
                camera.position = newPosition;
                this.highlightGroupFields(focusedAssetGroupIndex, groupQuadrant, centerVector, scene);
                d.resolve();
            }
            this.cleanupHouseButtons(scene);
            return d;
        };
        DrawingService.prototype.returnFromManage = function (scene) {
            this.cleanupHighlights(scene);
            this.cleanupHouseButtons(scene);
        };
        DrawingService.prototype.pickBoardElement = function (scene, coords) {
            var pickResult = scene.pick(coords ? coords.x : scene.pointerX, coords ? coords.y : scene.pointerY);
            if (pickResult.hit) {
                var pickedObject = new MonopolyApp.Viewmodels.PickedObject();
                pickedObject.pickedMesh = pickResult.pickedMesh;
                if (pickResult.pickedMesh && pickResult.pickedMesh.name === this.groundMeshName) {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.BoardField;
                    pickedObject.position = this.getBoardElementAt(pickResult.pickedPoint);
                }
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 9) === "mortgage_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.BoardField;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(9));
                }
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 12) === "houseButton_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.AddHouse;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(12));
                }
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 18) === "houseRemoveButton_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.RemoveHouse;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(18));
                }
                if (pickResult.pickedMesh && (pickResult.pickedMesh.name.substring(0, 8) === "0_Boole_" || pickResult.pickedMesh.name === "0_Dice_obj")) {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.Dice1;
                    pickedObject.pickedPoint = pickResult.pickedPoint;
                }
                if (pickResult.pickedMesh && (pickResult.pickedMesh.name.substring(0, 8) === "1_Boole_" || pickResult.pickedMesh.name === "1_Dice_obj")) {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.Dice2;
                    pickedObject.pickedPoint = pickResult.pickedPoint;
                }
                return pickedObject;
            }
            return undefined;
        };
        DrawingService.prototype.createBoard = function (scene, excludedLights) {
            var boardMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            var board = BABYLON.Mesh.CreateGround(this.groundMeshName, this.boardSize, this.boardSize, 2, scene);
            this.boardMesh = board;
            board.receiveShadows = true;
            //boardMaterial.emissiveTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.gameboardImage, scene);
            boardMaterial.diffuseTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.gameboardImage, scene);
            boardMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            board.material = boardMaterial;
            board.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.25 /*0.25*/, restitution: 0.75 });
            board.checkCollisions = true;
            if (excludedLights) {
                excludedLights.forEach(function (l) {
                    //l.excludedMeshes = [board];
                });
            }
            var tableMaterial = new BABYLON.StandardMaterial("tableTexture", scene);
            if (this.themeService.theme.skyboxFolder) {
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000, scene);
                tableMaterial.backFaceCulling = false;
                tableMaterial.reflectionTexture = new BABYLON.CubeTexture(this.themeService.theme.imagesFolder + this.themeService.theme.skyboxFolder, scene);
                tableMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                tableMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                tableMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skybox.material = tableMaterial;
            }
            else {
                var table = BABYLON.Mesh.CreateGround("tableMesh", this.themeService.theme.backgroundSize[0], this.themeService.theme.backgroundSize[1], 2, scene);
                tableMaterial.emissiveTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.backgroundImage, scene);
                tableMaterial.diffuseTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.backgroundImage, scene);
                table.material = tableMaterial;
                table.position.y = -0.01;
                table.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.5 });
                table.checkCollisions = true;
            }
            var wallMaterial = new BABYLON.StandardMaterial("wallTexture", scene);
            wallMaterial.alpha = 0;
            var wall1 = BABYLON.Mesh.CreateGround("wall1", 10, 10, 2, scene);
            wall1.position = new BABYLON.Vector3(0, 5.01, 3.78 + 0.4);
            wall1.material = wallMaterial;
            wall1.rotation = new BABYLON.Vector3(-1.41, 0, 0);
            wall1.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.4, restitution: 0.8 });
            wall1.checkCollisions = true;
            wall1.isPickable = false;
            var wall2 = BABYLON.Mesh.CreateGround("wall2", 10, 10, 2, scene);
            wall2.position = new BABYLON.Vector3(-3.78 - 0.4, 5.01, 0);
            wall2.material = wallMaterial;
            wall2.rotation = new BABYLON.Vector3(0, 0, -1.41);
            wall2.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.4, restitution: 0.8 });
            wall2.checkCollisions = true;
            wall2.isPickable = false;
            var wall3 = BABYLON.Mesh.CreateGround("wall3", 10, 10, 2, scene);
            wall3.position = new BABYLON.Vector3(3.78 + 0.4, 5.01, 0);
            wall3.material = wallMaterial;
            wall3.rotation = new BABYLON.Vector3(0, 0, 1.41);
            wall3.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.4, restitution: 0.8 });
            wall3.checkCollisions = true;
            wall3.isPickable = false;
            var wall4 = BABYLON.Mesh.CreateGround("wall4", 10, 10, 2, scene);
            wall4.position = new BABYLON.Vector3(0, 5.01, -3.78 - 0.4);
            wall4.material = wallMaterial;
            wall4.rotation = new BABYLON.Vector3(1.41, 0, 0);
            wall4.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.4, restitution: 0.8 });
            wall4.checkCollisions = true;
            wall4.isPickable = false;
        };
        DrawingService.prototype.setBoardFieldOwner = function (boardField, asset, scene, shootParticles) {
            if (boardField.ownerMesh) {
                scene.removeMesh(boardField.ownerMesh);
                boardField.ownerMesh.dispose();
            }
            var fieldQuadrant = Math.floor(boardField.index / (this.boardFieldsInQuadrant - 1));
            var playerColor = this.gameService.players.filter(function (p) { return p.playerName === asset.owner; })[0].color;
            var topCenter = this.getPositionCoordinate(boardField.index);
            var heightCoordinate = this.getQuadrantRunningCoordinate(fieldQuadrant) === "x" ? "z" : "x";
            var heightDirection = fieldQuadrant === 0 || fieldQuadrant === 1 ? -1 : 1;
            var bottomCenter = new MonopolyApp.Viewmodels.Coordinate(topCenter.x, topCenter.z);
            bottomCenter[heightCoordinate] += this.boardFieldHeight * 1.2 * heightDirection;
            boardField.ownerMesh = BABYLON.Mesh.CreateBox("ownerbox_" + boardField.index, this.boardFieldWidth * 0.8, scene);
            var mat = new BABYLON.StandardMaterial("ownerboxmaterial_" + boardField.index, scene);
            mat.alpha = 1.0;
            mat.diffuseColor = this.getColor(playerColor, true);
            mat.emissiveColor = this.getColor(playerColor, false);
            mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
            boardField.ownerMesh.material = mat;
            boardField.ownerMesh.position.x = bottomCenter.x;
            boardField.ownerMesh.position.z = bottomCenter.z;
            boardField.ownerMesh.scaling.y = 0.2;
            boardField.ownerMesh.scaling.z = 0.2;
            if (fieldQuadrant === 1) {
                boardField.ownerMesh.rotation.y = Math.PI / 2;
            }
            else if (fieldQuadrant === 2) {
                boardField.ownerMesh.rotation.y = Math.PI;
            }
            else if (fieldQuadrant === 3) {
                boardField.ownerMesh.rotation.y = Math.PI * 3 / 2;
            }
            if (shootParticles) {
                var ownerBoxParticle = this.addOwnerBoxParticle(boardField.ownerMesh, scene);
                ownerBoxParticle.start();
            }
        };
        DrawingService.prototype.setBoardFieldHouses = function (viewBoardField, houses, hotel, uncommittedHouses, uncommittedHotel, scene) {
            if (viewBoardField.hotelMesh) {
                scene.removeMesh(viewBoardField.hotelMesh);
                viewBoardField.hotelMesh.dispose();
            }
            if (viewBoardField.houseMeshes && viewBoardField.houseMeshes.length > 0) {
                viewBoardField.houseMeshes.forEach(function (h) {
                    scene.removeMesh(h);
                    h.dispose();
                });
            }
            var topLeftCorner = this.getPositionCoordinate(viewBoardField.index, hotel ? false : true);
            var houseSize = 0.165;
            var boardFieldQuadrant = Math.floor(viewBoardField.index / (this.boardFieldsInQuadrant - 1));
            var runningCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant);
            var heightCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
            var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
            if (!hotel) {
                topLeftCorner[runningCoordinate] += (houseSize / 2) * 1.15 * this.getQuadrantRunningDirection(boardFieldQuadrant) * -1;
            }
            topLeftCorner[heightCoordinate] += (houseSize / 2) * 1.3 * heightDirection;
            var housesPlaced = 0;
            if ((houses && houses > 0) || hotel) {
                viewBoardField.houseMeshes = [];
                while ((houses > 0) || hotel) {
                    var houseMesh = BABYLON.Mesh.CreateBox(hotel ? "hotel_" + viewBoardField.index : "house_" + viewBoardField.index + "_" + houses, houseSize, scene);
                    houseMesh.scaling = new BABYLON.Vector3(1, 0.5, 1);
                    if (hotel) {
                        houseMesh.scaling[runningCoordinate] = 2;
                        if (uncommittedHotel) {
                            var uncommittedHotelMaterial = new BABYLON.StandardMaterial("uncommittedHotelMaterial_" + viewBoardField.index, scene);
                            uncommittedHotelMaterial.alpha = 1.0;
                            uncommittedHotelMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.0, 0.1);
                            houseMesh.material = uncommittedHotelMaterial;
                        }
                    }
                    houseMesh.position = new BABYLON.Vector3(topLeftCorner.x, 0, topLeftCorner.z);
                    if (!hotel) {
                        housesPlaced++;
                        houseMesh.position[runningCoordinate] += (houses - 1) * houseSize * 1.15 * this.getQuadrantRunningDirection(boardFieldQuadrant) * -1;
                        if (uncommittedHouses && housesPlaced <= uncommittedHouses) {
                            var uncommittedHouseMaterial = new BABYLON.StandardMaterial("uncommittedHouseMaterial" + houses + "_" + viewBoardField.index, scene);
                            uncommittedHouseMaterial.alpha = 1.0;
                            uncommittedHouseMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.0, 0.1);
                            houseMesh.material = uncommittedHouseMaterial;
                        }
                    }
                    viewBoardField.houseMeshes.push(houseMesh);
                    if (hotel) {
                        hotel = false;
                        houses = 0;
                    }
                    else {
                        houses--;
                    }
                }
            }
        };
        DrawingService.prototype.setBoardFieldMortgage = function (boardField, asset, scene, particles) {
            var mortgageParticles;
            if (boardField.mortgageMesh) {
                mortgageParticles = this.addOwnerBoxParticle(boardField.mortgageMesh, scene);
                mortgageParticles.start();
                if (particles) {
                    this.timeoutService(function () {
                        scene.removeMesh(boardField.mortgageMesh);
                        boardField.mortgageMesh.dispose();
                    }, 3000);
                }
                else {
                    scene.removeMesh(boardField.mortgageMesh);
                    boardField.mortgageMesh.dispose();
                }
            }
            if (asset.mortgage) {
                var fieldQuadrant = Math.floor(boardField.index / (this.boardFieldsInQuadrant - 1));
                var topCenter = this.getPositionCoordinate(boardField.index);
                var heightCoordinate = this.getQuadrantRunningCoordinate(fieldQuadrant) === "x" ? "z" : "x";
                var heightDirection = fieldQuadrant === 0 || fieldQuadrant === 1 ? -1 : 1;
                var bottomCenter = new MonopolyApp.Viewmodels.Coordinate(topCenter.x, topCenter.z);
                bottomCenter[heightCoordinate] += this.boardFieldHeight * 0.7 * heightDirection;
                boardField.mortgageMesh = BABYLON.Mesh.CreateGround("mortgage_" + boardField.index, this.boardFieldWidth * 0.8, this.boardFieldWidth * 0.8, 2, scene);
                boardField.mortgageMesh.material = this.mortgageMaterial;
                boardField.mortgageMesh.position.x = bottomCenter.x;
                boardField.mortgageMesh.position.z = bottomCenter.z;
                boardField.mortgageMesh.position.y = 0.05;
                if (fieldQuadrant === 1) {
                    boardField.mortgageMesh.rotation.y = Math.PI / 2;
                }
                else if (fieldQuadrant === 2) {
                    boardField.mortgageMesh.rotation.y = Math.PI;
                }
                else if (fieldQuadrant === 3) {
                    boardField.mortgageMesh.rotation.y = Math.PI * 3 / 2;
                }
                if (particles) {
                    mortgageParticles = this.addOwnerBoxParticle(boardField.mortgageMesh, scene);
                    mortgageParticles.start();
                }
            }
        };
        DrawingService.prototype.clearBoardField = function (boardField, scene) {
            if (boardField.ownerMesh) {
                scene.removeMesh(boardField.ownerMesh);
                boardField.ownerMesh.dispose();
                boardField.ownerMesh = undefined;
            }
            if (boardField.mortgageMesh) {
                scene.removeMesh(boardField.mortgageMesh);
                boardField.mortgageMesh.dispose();
                boardField.mortgageMesh = undefined;
            }
            if (boardField.hotelMesh) {
                scene.removeMesh(boardField.hotelMesh);
                boardField.hotelMesh.dispose();
                boardField.hotelMesh = undefined;
            }
            if (boardField.houseMeshes && boardField.houseMeshes.length > 0) {
                boardField.houseMeshes.forEach(function (hm) {
                    scene.removeMesh(hm);
                    hm.dispose();
                });
                boardField.houseMeshes = undefined;
            }
        };
        DrawingService.prototype.loadMeshes = function (players, scene, shadowGenerator, gameController) {
            var _this = this;
            var meshLoads = [];
            this.gameService.players.forEach(function (player) {
                var playerModel = players.filter(function (p) { return p.name === player.playerName; })[0];
                playerModel.name = player.playerName;
                if (player.active) {
                    var d = $.Deferred();
                    meshLoads.push(d);
                    var that = _this;
                    //var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(-0.1, -1, 0), scene);
                    //light0.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
                    //light0.specular = new BABYLON.Color3(1, 1, 1);
                    BABYLON.SceneLoader.ImportMesh(null, _this.themeService.theme.meshFolder, _this.themeService.theme.playerMesh, scene, function (newMeshes, particleSystems) {
                        if (newMeshes != null) {
                            var mesh = newMeshes[that.themeService.theme.playerSubmeshIndex];
                            playerModel.mesh = mesh;
                            var mat = new BABYLON.StandardMaterial("player_" + player.color + "_material", scene);
                            mat.diffuseColor = that.getColor(player.color, true);
                            //mat.emissiveColor = that.getColor(player.color, false);
                            mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                            that.themeService.theme.playerColoredSubmeshIndices.forEach(function (i) {
                                newMeshes[i].material = mat;
                            });
                            var mat2 = new BABYLON.StandardMaterial("player_" + player.color + "_material2", scene);
                            //mat2.bumpTexture = new BABYLON.Texture("images/Moonopoly/metal.jpg", scene);
                            mat2.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                            mat2.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                            //mat2.diffuseTexture = new BABYLON.Texture("images/Moonopoly/metal.png", scene);
                            //mat2.ambientTexture = new BABYLON.Texture("images/Moonopoly/metal.png", scene);
                            //mat2.backFaceCulling = false;
                            //mat2.diffuseTexture.scale(5);
                            var mat3 = new BABYLON.StandardMaterial("player_" + player.color + "_material3", scene);
                            mat3.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                            mat3.ambientColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                            mat3.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                            newMeshes[1].material = mat2;
                            newMeshes[2].material = mat2;
                            newMeshes[3].material = mat2;
                            newMeshes[7].material = mat2;
                            newMeshes[8].material = mat2;
                            newMeshes.forEach(function (meshPart) {
                                if (shadowGenerator) {
                                    shadowGenerator.getShadowMap().renderList.push(meshPart);
                                }
                            });
                            d.resolve(gameController);
                        }
                    });
                }
                else {
                    playerModel.color = "#808080";
                }
            });
            var d = $.Deferred();
            meshLoads.push(d);
            var that = this;
            BABYLON.SceneLoader.ImportMesh(null, "meshes/", "house2.babylon", scene, function (newMeshes, particleSystems) {
                if (newMeshes != null) {
                    var mesh = newMeshes[0];
                    var mat = new BABYLON.StandardMaterial("house", scene);
                    //mat.alpha = 0;
                    mat.ambientColor = new BABYLON.Color3(0.1098, 0.6392, 0.102);
                    mat.diffuseColor = new BABYLON.Color3(0.1098, 0.6392, 0.102);
                    mat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                    mesh.material = mat;
                    mesh.position.x = 5;
                    mesh.position.z = -5;
                    mesh.visibility = 0;
                    that.houseMeshTemplate = mesh;
                    d.resolve(gameController);
                }
            });
            var d1 = $.Deferred();
            meshLoads.push(d1);
            that.diceMesh = [];
            BABYLON.SceneLoader.ImportMesh(null, "meshes/", "dice.babylon", scene, function (newMeshes, particleSystems) {
                if (newMeshes != null) {
                    newMeshes.forEach(function (m) {
                        m.name = "0_" + m.name;
                    });
                    var mesh = newMeshes[0];
                    mesh.position.x = -0.3;
                    mesh.position.z = 0;
                    mesh.position.y = _this.diceHeight / 2;
                    //// DEBUGGING
                    ////var vector = new BABYLON.Vector3(1.57, 0.21, 0);
                    ////var quaternion = new BABYLON.Quaternion(0, 0, 0, 0);
                    ////mesh.rotationQuaternion = quaternion; //vector.toQuaternion(); //new BABYLON.Quaternion(-0.75, 0, 0, -0.75);
                    ////var rotationMatrix = new BABYLON.Matrix();
                    ////quaternion.toRotationMatrix(rotationMatrix);
                    ////vector = new BABYLON.Vector3(0, 0, 1);
                    ////var x = 2;
                    ////if (x > 1) {
                    ////    mesh.rotate(vector, 0.3);
                    ////}
                    that.diceMesh.push(mesh);
                    /*
                    since the dice mesh has no bounding box assigned (required by the physics calculations), we borrow it from a temporary box object;
                    the size of the impostor box is determined by the bounding box of the dice shell mesh (newMeshes[1].getBoundingInfo().boundingBox.minimum & maximum), divided
                    by the dice mesh scaling factor (defined in the .babylon file)
                    */
                    var diceMeshImpostor = BABYLON.Mesh.CreateBox("dice", 120, scene);
                    diceMeshImpostor.position.x = 5;
                    //diceMeshImpostor.scaling = new BABYLON.Vector3(0.003, 0.003, 0.003);
                    that.diceMesh[0].getBoundingInfo().boundingBox = diceMeshImpostor.getBoundingInfo().boundingBox;
                    scene.removeMesh(diceMeshImpostor);
                    that.diceMesh[0].checkCollisions = true;
                    newMeshes.forEach(function (meshPart) {
                        if (shadowGenerator) {
                            shadowGenerator.getShadowMap().renderList.push(meshPart);
                        }
                        meshPart.receiveShadows = false;
                    });
                    //that.diceMesh.onPhysicsCollide = (mesh, contact) => {
                    //    that.diceColliding = true;
                    //};
                    d1.resolve(gameController);
                }
            });
            var d2 = $.Deferred();
            meshLoads.push(d2);
            $.when(d1).done(function () {
                BABYLON.SceneLoader.ImportMesh(null, "meshes/", "dice.babylon", scene, function (newMeshes, particleSystems) {
                    if (newMeshes != null) {
                        newMeshes.forEach(function (m) {
                            m.name = "1_" + m.name;
                        });
                        var mesh = newMeshes[0];
                        mesh.position.x = 0.3;
                        mesh.position.z = 0;
                        mesh.position.y = _this.diceHeight / 2;
                        that.diceMesh.push(mesh);
                        /*
                        since the dice mesh has no bounding box assigned (required by the physics calculations), we borrow it from a temporary box object;
                        the size of the impostor box is determined by the bounding box of the dice shell mesh (newMeshes[1].getBoundingInfo().boundingBox.minimum & maximum), divided
                        by the dice mesh scaling factor (defined in the .babylon file)
                        */
                        var diceMeshImpostor = BABYLON.Mesh.CreateBox("dice", 120, scene);
                        diceMeshImpostor.position.x = 5;
                        that.diceMesh[1].getBoundingInfo().boundingBox = diceMeshImpostor.getBoundingInfo().boundingBox;
                        scene.removeMesh(diceMeshImpostor);
                        that.diceMesh[1].checkCollisions = true;
                        newMeshes.forEach(function (meshPart) {
                            if (shadowGenerator) {
                                shadowGenerator.getShadowMap().renderList.push(meshPart);
                            }
                            meshPart.receiveShadows = false;
                        });
                        d2.resolve(gameController);
                    }
                });
            });
            this.houseButtonMeshTemplate = BABYLON.Mesh.CreateGround("houseButton", 0.3, 0.3, 2, scene, true);
            this.houseButtonMaterial = new BABYLON.StandardMaterial("houseButtonTexture", scene);
            this.houseButtonMaterial.diffuseTexture = new BABYLON.Texture("images/House3.png", scene);
            this.houseButtonMaterial.diffuseTexture.hasAlpha = true;
            this.houseButtonMaterial.useAlphaFromDiffuseTexture = true;
            this.houseButtonMaterial.opacityTexture = this.houseButtonMaterial.diffuseTexture;
            var houseButtonMeshTemplateMaterial = new BABYLON.StandardMaterial("houseButtonTemplateTexture", scene);
            houseButtonMeshTemplateMaterial.alpha = 0;
            this.houseButtonMeshTemplate.material = houseButtonMeshTemplateMaterial;
            this.houseButtonMeshTemplate.position.y = 0.01;
            //this.houseButtonMeshTemplate.visibility = 0;
            scene.removeMesh(this.houseButtonMeshTemplate);
            this.houseRemoveButtonMeshTemplate = BABYLON.Mesh.CreateGround("houseRemoveButton", 0.3, 0.3, 2, scene);
            this.houseRemoveButtonMaterial = new BABYLON.StandardMaterial("houseRemoveButtonTexture", scene);
            this.houseRemoveButtonMaterial.diffuseTexture = new BABYLON.Texture("images/House-remove.png", scene);
            this.houseRemoveButtonMaterial.diffuseTexture.hasAlpha = true;
            this.houseRemoveButtonMaterial.useAlphaFromDiffuseTexture = true;
            this.houseRemoveButtonMaterial.opacityTexture = this.houseRemoveButtonMaterial.diffuseTexture;
            var houseRemoveButtonMeshTemplateMaterial = new BABYLON.StandardMaterial("houseRemoveButtonTemplateTexture", scene);
            houseRemoveButtonMeshTemplateMaterial.alpha = 0;
            this.houseRemoveButtonMeshTemplate.material = houseRemoveButtonMeshTemplateMaterial;
            this.houseRemoveButtonMeshTemplate.position.y = 0.01;
            //this.houseButtonMeshTemplate.visibility = 0;
            scene.removeMesh(this.houseRemoveButtonMeshTemplate);
            this.mortgageMaterial = new BABYLON.StandardMaterial("mortgagematerial", scene);
            this.mortgageMaterial.diffuseTexture = new BABYLON.Texture("images/Mortgage.png", scene);
            this.mortgageMaterial.diffuseTexture.hasAlpha = true;
            this.mortgageMaterial.useAlphaFromDiffuseTexture = true;
            this.mortgageMaterial.opacityTexture = this.mortgageMaterial.diffuseTexture;
            return meshLoads;
        };
        DrawingService.prototype.showHouseButtons = function (focusedAssetGroupIndex, scene, focusedAssetGroup) {
            var _this = this;
            if (!focusedAssetGroup) {
                var focusedFields = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex);
                focusedAssetGroup = focusedFields[0].asset.group;
            }
            this.cleanupHouseButtons(scene);
            var groupBoardFields = this.gameService.getGroupBoardFields(focusedAssetGroup);
            var that = this;
            groupBoardFields.forEach(function (field) {
                var topLeft = that.getPositionCoordinate(field.index, true);
                var boardFieldQuadrant = Math.floor(field.index / (that.boardFieldsInQuadrant - 1));
                var runningCoordinate = that.getQuadrantRunningCoordinate(boardFieldQuadrant);
                var heightCoordinate = that.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
                var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
                if (that.gameService.canUpgradeAsset(field.asset, that.gameService.getCurrentPlayer())) {
                    var houseButtonMesh = that.houseButtonMeshTemplate.clone("houseButton_" + field.index);
                    houseButtonMesh.material = that.houseButtonMaterial;
                    scene.addMesh(houseButtonMesh);
                    houseButtonMesh.position[runningCoordinate] = topLeft[runningCoordinate] + (0.5 * _this.getQuadrantRunningDirection(boardFieldQuadrant) * -1);
                    houseButtonMesh.position[heightCoordinate] = topLeft[heightCoordinate] + (that.boardFieldHeight - 0.2) * heightDirection;
                    if (boardFieldQuadrant === 1) {
                        houseButtonMesh.rotation.y = Math.PI / 2;
                    }
                    else if (boardFieldQuadrant === 2) {
                        houseButtonMesh.rotation.y = Math.PI;
                    }
                    else if (boardFieldQuadrant === 3) {
                        houseButtonMesh.rotation.y = Math.PI * 3 / 2;
                    }
                    //houseButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1.5, 1, 1.5), 100));
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1, 1, 1), 100));
                    that.houseButtonMeshes.push(houseButtonMesh);
                }
                if (that.gameService.canDowngradeAsset(field.asset, that.gameService.getCurrentPlayer())) {
                    var houseRemoveButtonMesh = that.houseRemoveButtonMeshTemplate.clone("houseRemoveButton_" + field.index);
                    houseRemoveButtonMesh.material = that.houseRemoveButtonMaterial;
                    scene.addMesh(houseRemoveButtonMesh);
                    houseRemoveButtonMesh.position[runningCoordinate] = topLeft[runningCoordinate] + (0.2 * that.getQuadrantRunningDirection(boardFieldQuadrant) * -1);
                    houseRemoveButtonMesh.position[heightCoordinate] = topLeft[heightCoordinate] + (that.boardFieldHeight - 0.2) * heightDirection;
                    houseRemoveButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                    that.houseRemoveButtonMeshes.push(houseRemoveButtonMesh);
                    if (boardFieldQuadrant === 1) {
                        houseRemoveButtonMesh.rotation.y = Math.PI / 2;
                    }
                    else if (boardFieldQuadrant === 2) {
                        houseRemoveButtonMesh.rotation.y = Math.PI;
                    }
                    else if (boardFieldQuadrant === 3) {
                        houseRemoveButtonMesh.rotation.y = Math.PI * 3 / 2;
                    }
                }
            });
        };
        DrawingService.prototype.onSwipeMove = function (scene, coords) {
            if (this.houseButtonMeshes && this.houseButtonMeshes.length > 0) {
                var pickedObject = this.pickBoardElement(scene, coords);
                if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                    pickedObject.pickedMesh.scaling = new BABYLON.Vector3(1.5, 1, 1.5);
                }
                else {
                    this.houseButtonMeshes.forEach(function (m) {
                        if (m.scaling.x > 1) {
                            m.scaling = new BABYLON.Vector3(1, 1, 1);
                        }
                    });
                }
            }
        };
        DrawingService.prototype.onSwipeEnd = function (scene, coords) {
            var pickedObject = this.pickBoardElement(scene, coords);
            if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                pickedObject.pickedMesh.scaling = new BABYLON.Vector3(1, 1, 1);
            }
            return pickedObject;
        };
        DrawingService.prototype.showActionButtons = function () {
        };
        DrawingService.prototype.addParticle = function (abstractMesh, scene) {
            var particleSystem = new BABYLON.ParticleSystem("particles", 500, scene);
            particleSystem.particleTexture = new BABYLON.Texture("images/Moonopoly/Flare.png", scene);
            particleSystem.emitter = abstractMesh;
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.2;
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 0.5;
            particleSystem.emitRate = 300;
            particleSystem.direction1 = new BABYLON.Vector3(1, 0, 0);
            particleSystem.direction2 = new BABYLON.Vector3(1, 0, 0);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 4;
            particleSystem.updateSpeed = 0.005;
            particleSystem.targetStopDuration = 3;
            particleSystem.disposeOnStop = true;
            particleSystem.minEmitBox = new BABYLON.Vector3(0, -2.2, -0.4); // Starting all From
            particleSystem.maxEmitBox = new BABYLON.Vector3(0, -2.7, -0);
            return particleSystem;
        };
        DrawingService.prototype.addOwnerBoxParticle = function (abstractMesh, scene, offset) {
            var particleSystem = new BABYLON.ParticleSystem("particles", 200, scene);
            particleSystem.particleTexture = new BABYLON.Texture("images/Moonopoly/Flare.png", scene);
            particleSystem.emitter = abstractMesh;
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.2;
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 2;
            particleSystem.emitRate = 150;
            particleSystem.direction1 = new BABYLON.Vector3(-0.2, 1, 0);
            particleSystem.direction2 = new BABYLON.Vector3(0.2, 1, 0);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.minEmitPower = 3;
            particleSystem.maxEmitPower = 6;
            particleSystem.updateSpeed = 0.005;
            particleSystem.targetStopDuration = 0.7;
            particleSystem.gravity = new BABYLON.Vector3(0, 9.81, 0);
            particleSystem.disposeOnStop = true;
            if (offset) {
            }
            return particleSystem;
        };
        DrawingService.prototype.initQuadrantStartingCoordinates = function () {
            this.quadrantStartingCoordinate = [];
            var firstQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            firstQuadrantStartingCoordinate.x = (this.boardSize / 2) - this.boardFieldEdgeWidth;
            firstQuadrantStartingCoordinate.z = -(this.boardSize / 2) + this.boardFieldHeight;
            this.quadrantStartingCoordinate.push(firstQuadrantStartingCoordinate);
            var secondQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            secondQuadrantStartingCoordinate.x = -(this.boardSize / 2) + this.boardFieldHeight;
            secondQuadrantStartingCoordinate.z = -(this.boardSize / 2) + this.boardFieldEdgeWidth;
            this.quadrantStartingCoordinate.push(secondQuadrantStartingCoordinate);
            var thirdQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            thirdQuadrantStartingCoordinate.x = -(this.boardSize / 2) + this.boardFieldEdgeWidth;
            thirdQuadrantStartingCoordinate.z = (this.boardSize / 2) - this.boardFieldHeight;
            this.quadrantStartingCoordinate.push(thirdQuadrantStartingCoordinate);
            var fourthQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            fourthQuadrantStartingCoordinate.x = (this.boardSize / 2) - this.boardFieldHeight;
            fourthQuadrantStartingCoordinate.z = (this.boardSize / 2) - this.boardFieldEdgeWidth;
            this.quadrantStartingCoordinate.push(fourthQuadrantStartingCoordinate);
        };
        DrawingService.prototype.getQuadrantRunningCoordinate = function (quadrantIndex) {
            if (quadrantIndex === 0) {
                return "x";
            }
            else if (quadrantIndex === 1) {
                return "z";
            }
            else if (quadrantIndex === 2) {
                return "x";
            }
            else {
                return "z";
            }
        };
        DrawingService.prototype.getQuadrantRunningDirection = function (quadrantIndex) {
            if (quadrantIndex === 0) {
                return -1;
            }
            else if (quadrantIndex === 1) {
                return 1;
            }
            else if (quadrantIndex === 2) {
                return 1;
            }
            else {
                return -1;
            }
        };
        DrawingService.prototype.initBoardGroupCoordinates = function () {
            this.boardGroupLeftCoordinate = [];
            this.boardGroupRightCoordinate = [];
            var group;
            for (group = Model.AssetGroup.First; group <= Model.AssetGroup.Eighth; group++) {
                var groupBoardFields = this.gameService.getGroupBoardFields(group);
                var groupBoardPositions = $.map(groupBoardFields, function (f, i) { return f.index; });
                var position = Math.max.apply(this, groupBoardPositions);
                var leftCoordinate = this.getPositionCoordinate(position);
                position = Math.min.apply(this, groupBoardPositions);
                var rightCoordinate = this.getPositionCoordinate(position);
                this.boardGroupLeftCoordinate[group] = leftCoordinate;
                this.boardGroupRightCoordinate[group] = rightCoordinate;
            }
        };
        // returns the coordinate of top center of the board field with a given index
        DrawingService.prototype.getPositionCoordinate = function (position, returnTopLeftCorner) {
            var fieldQuadrant = Math.floor(position / (this.boardFieldsInQuadrant - 1));
            var fieldQuadrantOffset = position % (this.boardFieldsInQuadrant - 1);
            var coordinate = new MonopolyApp.Viewmodels.Coordinate();
            coordinate.x = this.quadrantStartingCoordinate[fieldQuadrant].x;
            coordinate.z = this.quadrantStartingCoordinate[fieldQuadrant].z;
            coordinate[this.getQuadrantRunningCoordinate(fieldQuadrant)] += fieldQuadrantOffset * this.boardFieldWidth * this.getQuadrantRunningDirection(fieldQuadrant);
            if (!returnTopLeftCorner) {
                coordinate[this.getQuadrantRunningCoordinate(fieldQuadrant)] += (fieldQuadrantOffset === 0 ? this.boardFieldWidth : this.boardFieldWidth / 2) * -this.getQuadrantRunningDirection(fieldQuadrant);
            }
            return coordinate;
        };
        DrawingService.prototype.onDiceCollide = function () {
            this.diceColliding = true;
        };
        DrawingService.prototype.highlightGroupFields = function (focusedAssetGroupIndex, groupQuadrantIndex, groupCenter, scene) {
            var _this = this;
            this.cleanupHighlights(scene);
            var meshes = [];
            var mat = new BABYLON.StandardMaterial("mat1", scene);
            mat.alpha = 1.0;
            mat.diffuseColor = new BABYLON.Color3(0.5, 0.1, 0);
            mat.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0);
            this.highlightLight = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(groupCenter.x, 10, groupCenter.z), new BABYLON.Vector3(0, -1, 0), 0.8, 2, scene);
            this.highlightLight.diffuse = new BABYLON.Color3(1, 0, 0);
            this.highlightLight.specular = new BABYLON.Color3(1, 1, 1);
            var groupBoardFields = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex);
            groupBoardFields = groupBoardFields.filter(function (f) { return Math.floor(f.index / 10) === groupQuadrantIndex; });
            var groupBoardPositions = $.map(groupBoardFields, function (f, i) { return f.index; });
            var highlightBoxWidth = 0.03;
            var cornerLength = 0.05;
            var that = this;
            groupBoardPositions.forEach(function (position) {
                var arcPath = [];
                for (var i = 0; i <= 180; i++) {
                    var radian = i * 0.0174532925;
                    arcPath.push(new BABYLON.Vector3(Math.cos(radian) * highlightBoxWidth, Math.sin(radian) * highlightBoxWidth, 0));
                }
                arcPath[arcPath.length - 1].y = 0;
                var path2 = [];
                path2.push(new BABYLON.Vector3(0, 0, -cornerLength));
                path2.push(new BABYLON.Vector3(0, 0, -that.boardFieldHeight + cornerLength));
                path2.push(new BABYLON.Vector3(0 + cornerLength, 0, -that.boardFieldHeight));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth - cornerLength, 0, -that.boardFieldHeight));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth, 0, -that.boardFieldHeight + cornerLength));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth, 0, -cornerLength));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth - cornerLength, 0, 0));
                path2.push(new BABYLON.Vector3(cornerLength, 0, 0));
                path2.push(new BABYLON.Vector3(0, 0, -cornerLength));
                path2.push(new BABYLON.Vector3(0, 0, -cornerLength * 3));
                var extruded = BABYLON.Mesh.ExtrudeShape("extruded", arcPath, path2, 1, 0, 0, scene);
                if (groupQuadrantIndex === 1) {
                    extruded.rotation.y = Math.PI / 2;
                }
                else if (groupQuadrantIndex === 2) {
                    extruded.rotation.y = Math.PI;
                }
                else if (groupQuadrantIndex === 3) {
                    extruded.rotation.y = Math.PI * 3 / 2;
                }
                var topLeft = _this.getPositionCoordinate(position, true);
                extruded.position.x = topLeft.x;
                extruded.position.z = topLeft.z;
                extruded.material = mat;
                meshes.push(extruded);
            });
            this.highlightMeshes = meshes;
        };
        DrawingService.prototype.cleanupHighlights = function (scene) {
            if (this.highlightMeshes) {
                this.highlightMeshes.forEach(function (mesh) {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
                this.highlightMeshes = undefined;
            }
            if (this.highlightLight) {
                scene.removeLight(this.highlightLight);
                this.highlightLight.dispose();
                this.highlightLight = undefined;
            }
        };
        DrawingService.prototype.getBoardElementAt = function (pickedPoint) {
            var _this = this;
            var boardFieldIndex;
            this.quadrantStartingCoordinate.forEach(function (quadrant, index) {
                var topRightCorner = quadrant[_this.getQuadrantRunningCoordinate(index)] + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) * -1;
                var topLeftCorner = topRightCorner + (_this.boardSize - _this.boardFieldEdgeWidth) * _this.getQuadrantRunningDirection(index);
                var upperBound = topRightCorner >= topLeftCorner ? topRightCorner : topLeftCorner;
                var lowerBound = topRightCorner >= topLeftCorner ? topLeftCorner : topRightCorner;
                var heightCoordinate = _this.getQuadrantRunningCoordinate(index) === "x" ? "z" : "x";
                var heightDirection = index === 0 || index === 1 ? -1 : 1;
                var heightTop = quadrant[heightCoordinate];
                var heightBottom = quadrant[heightCoordinate] + _this.boardFieldHeight * heightDirection;
                if (heightTop < heightBottom) {
                    var temp = heightTop;
                    heightTop = heightBottom;
                    heightBottom = temp;
                }
                if (pickedPoint[_this.getQuadrantRunningCoordinate(index)] < upperBound && pickedPoint[_this.getQuadrantRunningCoordinate(index)] > lowerBound &&
                    pickedPoint[heightCoordinate] < heightTop && pickedPoint[heightCoordinate] > heightBottom) {
                    var quadrantOffset = 0;
                    if (index === 0 || index === 3) {
                        quadrantOffset = pickedPoint[_this.getQuadrantRunningCoordinate(index)] > topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[_this.getQuadrantRunningCoordinate(index)] - (topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index))) / _this.boardFieldWidth));
                    }
                    else if (index === 1) {
                        quadrantOffset = pickedPoint[_this.getQuadrantRunningCoordinate(index)] < topRightCorner - _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[_this.getQuadrantRunningCoordinate(index)] - (topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index))) / _this.boardFieldWidth));
                    }
                    else if (index === 2) {
                        quadrantOffset = pickedPoint[_this.getQuadrantRunningCoordinate(index)] < topRightCorner - _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[_this.getQuadrantRunningCoordinate(index)] - (topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index))) / _this.boardFieldWidth));
                    }
                    boardFieldIndex = index * (_this.boardFieldsInQuadrant - 1) + quadrantOffset;
                }
            }, this);
            return boardFieldIndex;
        };
        DrawingService.prototype.getColor = function (playerColor, diffuse) {
            if (playerColor === Model.PlayerColor.Blue) {
                return diffuse ? new BABYLON.Color3(0.3, 0.3, 1) : new BABYLON.Color3(0.1, 0, 0.7);
            }
            else if (playerColor === Model.PlayerColor.Red) {
                return diffuse ? new BABYLON.Color3(1, 0.3, 0.3) : new BABYLON.Color3(0.7, 0, 0.1);
            }
            else if (playerColor === Model.PlayerColor.Green) {
                return diffuse ? new BABYLON.Color3(0.3, 1, 0.3) : new BABYLON.Color3(0.1, 0.7, 0);
            }
            else if (playerColor === Model.PlayerColor.Yellow) {
                return diffuse ? new BABYLON.Color3(1, 1, 0.3) : new BABYLON.Color3(0.7, 0.7, 0.1);
            }
            return BABYLON.Color3.White();
        };
        DrawingService.prototype.cleanupHouseButtons = function (scene) {
            if (this.houseButtonMeshes && this.houseButtonMeshes.length > 0) {
                this.houseButtonMeshes.forEach(function (mesh) {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
            }
            this.houseButtonMeshes = [];
            if (this.houseRemoveButtonMeshes && this.houseRemoveButtonMeshes.length > 0) {
                this.houseRemoveButtonMeshes.forEach(function (mesh) {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
            }
            this.houseRemoveButtonMeshes = [];
        };
        DrawingService.prototype.getPlayerPositionOnBoardField = function (playerModel, positionIndex) {
            var playerQuadrant = Math.floor(positionIndex / (this.boardFieldsInQuadrant - 1));
            var playerQuadrantOffset = positionIndex % (this.boardFieldsInQuadrant - 1);
            var playerCoordinate = this.getPositionCoordinate(positionIndex);
            var heightCoordinate = this.getQuadrantRunningCoordinate(playerQuadrant) === "x" ? "z" : "x";
            var heightDirection = playerQuadrant === 0 || playerQuadrant === 1 ? -1 : 1;
            playerCoordinate[heightCoordinate] += this.boardFieldHeight / 5 * (playerModel.index + 1) * heightDirection;
            return playerCoordinate;
        };
        DrawingService.prototype.getPlayerRotationOnBoardField = function (playerModel, positionIndex) {
            var playerQuadrant = Math.floor(positionIndex / (this.boardFieldsInQuadrant - 1));
            var theme = this.themeService.theme;
            var rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[0][0], theme.playerMeshRotationQuaternion[0][1], theme.playerMeshRotationQuaternion[0][2], theme.playerMeshRotationQuaternion[0][3]);
            if (playerQuadrant === 1) {
                rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[1][0], theme.playerMeshRotationQuaternion[1][1], theme.playerMeshRotationQuaternion[1][2], theme.playerMeshRotationQuaternion[1][3]);
            }
            else if (playerQuadrant === 2) {
                rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[2][0], theme.playerMeshRotationQuaternion[2][1], theme.playerMeshRotationQuaternion[2][2], theme.playerMeshRotationQuaternion[2][3]);
            }
            else if (playerQuadrant === 3) {
                rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[3][0], theme.playerMeshRotationQuaternion[3][1], theme.playerMeshRotationQuaternion[3][2], theme.playerMeshRotationQuaternion[3][3]);
            }
            return rotationQuaternion;
        };
        /*
        This has been coded with the help of http://www.euclideanspace.com/maths/discrete/groups/categorise/finite/cube/
        */
        DrawingService.prototype.getDiceResult = function (diceIndex) {
            var rotationMatrix = new BABYLON.Matrix();
            this.diceMesh[diceIndex].rotationQuaternion.toRotationMatrix(rotationMatrix);
            if (this.epsilonCompare(rotationMatrix.m[0], 0) && this.epsilonCompare(rotationMatrix.m[1], 1) && this.epsilonCompare(rotationMatrix.m[2], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 1;
            }
            if (this.epsilonCompare(rotationMatrix.m[0], 0) && this.epsilonCompare(rotationMatrix.m[1], -1) && this.epsilonCompare(rotationMatrix.m[2], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 2;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[4], 0) && this.epsilonCompare(rotationMatrix.m[5], -1) && this.epsilonCompare(rotationMatrix.m[6], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 3;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[4], 0) && this.epsilonCompare(rotationMatrix.m[5], 1) && this.epsilonCompare(rotationMatrix.m[6], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 4;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[8], 0) && this.epsilonCompare(rotationMatrix.m[9], -1) && this.epsilonCompare(rotationMatrix.m[10], 0)) {
                return 5;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[8], 0) && this.epsilonCompare(rotationMatrix.m[9], 1) && this.epsilonCompare(rotationMatrix.m[10], 0)) {
                return 6;
            }
            return 0;
        };
        // get the rotation required for the camera to face the target; position determines the camera position, if it is not equal to its current position
        DrawingService.prototype.getCameraRotationForTarget = function (target, camera, position) {
            var rotation = new BABYLON.Vector3(0, 0, 0);
            camera.upVector.normalize();
            BABYLON.Matrix.LookAtLHToRef(position ? position : camera.position, target, camera.upVector, camera._camMatrix);
            var invertedCamMatrix = camera._camMatrix.invert();
            rotation.x = Math.atan(invertedCamMatrix.m[6] / invertedCamMatrix.m[10]);
            var vDir = target.subtract(position ? position : camera.position);
            if (vDir.x >= 0.0) {
                rotation.y = (-Math.atan(vDir.z / vDir.x) + Math.PI / 2.0);
            }
            else {
                rotation.y = (-Math.atan(vDir.z / vDir.x) - Math.PI / 2.0);
            }
            rotation.z = -Math.acos(BABYLON.Vector3.Dot(new BABYLON.Vector3(0, 1.0, 0), camera.upVector));
            if (isNaN(rotation.x)) {
                rotation.x = 0;
            }
            if (isNaN(rotation.y)) {
                rotation.y = 0;
            }
            if (isNaN(rotation.z)) {
                rotation.z = 0;
            }
            return rotation;
        };
        DrawingService.prototype.epsilonCompare = function (v1, v2) {
            if (Math.abs(v1 - v2) < 0.02) {
                return true;
            }
            return false;
        };
        DrawingService.prototype.getGameCameraPosition = function (currentPlayerPositionIndex, center, closer) {
            var boardFieldQuadrant = Math.floor(currentPlayerPositionIndex / (this.boardFieldsInQuadrant - 1));
            var runningCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant);
            var heightCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
            var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
            var position = new BABYLON.Vector3(0, closer ? 2.65 : 5, -10);
            if (this.options.staticCamera) {
                position = new BABYLON.Vector3(0, closer ? 3 : 13, 0);
                position[heightCoordinate] = (closer ? 1.2 : 0) * heightDirection;
                position[runningCoordinate] = closer ? (center ? 0 : this.getPositionCoordinate(currentPlayerPositionIndex)[runningCoordinate]) : 0;
                return position;
            }
            else {
                position[heightCoordinate] = (closer ? 6.85 : 10) * heightDirection;
                position[runningCoordinate] = center ? 0 : this.getPositionCoordinate(currentPlayerPositionIndex)[runningCoordinate];
                return position;
            }
        };
        DrawingService.$inject = ["$http", "gameService", "themeService", "settingsService", "$timeout"];
        return DrawingService;
    }());
    Services.DrawingService = DrawingService;
    monopolyApp.service("drawingService", DrawingService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
var Services;
(function (Services) {
    var GameService = (function () {
        function GameService($http, settingsService, themeService) {
            this.httpService = $http;
            this.settingsService = settingsService;
            this.themeService = themeService;
        }
        GameService.prototype.initGame = function (loadGame) {
            this.game = new Model.Game(this.themeService.theme);
            if (loadGame) {
                this.loadGame();
            }
            else {
                var settings = this.settingsService.loadSettings();
                this.initPlayers(settings);
                this.initCards(settings);
                this.game.gameParams.rules.loadDataFrom(settings.rules);
            }
            this.initManageGroups();
            if (!loadGame) {
                this.game.advanceToNextPlayer();
            }
            this.uncommittedHousesPrice = 0;
            //this.setupTestData();
        };
        GameService.prototype.saveGame = function () {
            var gameString = JSON.stringify(this.game);
            localStorage.setItem(Model.Game.version, gameString);
            gameString = localStorage.getItem(Model.Game.version);
        };
        GameService.prototype.loadGame = function () {
            var gameString = localStorage.getItem(Model.Game.version);
            if (gameString) {
                this.game = new Model.Game(this.themeService.theme);
                var savedGame = JSON.parse(gameString);
                this.game.loadDataFrom(savedGame, this.themeService.theme);
            }
        };
        GameService.prototype.cloneGame = function () {
            var gameString = JSON.stringify(this.game);
            var clonedGame = new Model.Game(this.themeService.theme);
            var savedGame = JSON.parse(gameString);
            clonedGame.loadDataFrom(savedGame, this.themeService.theme);
            return clonedGame;
        };
        GameService.prototype.endTurn = function () {
            if (this.canEndTurn) {
                if ((this.lastDiceResult1 && this.lastDiceResult1 !== this.lastDiceResult2) || this.hasBeenLetOutOfPrison) {
                    this.game.advanceToNextPlayer();
                }
                this.game.setState(Model.GameState.BeginTurn);
                this.lastDiceResult1 = undefined;
                this.lastDiceResult2 = undefined;
            }
        };
        GameService.prototype.getCurrentPlayer = function () {
            return this.game.currentPlayer;
        };
        Object.defineProperty(GameService.prototype, "players", {
            get: function () {
                return this.game.players;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "gameParams", {
            get: function () {
                return this.game ? this.game.gameParams : undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "lastDiceResult", {
            get: function () {
                if (!this.lastDiceResult1 || !this.lastDiceResult2) {
                    return undefined;
                }
                return this.lastDiceResult1 + this.lastDiceResult2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "anyFlyByEvents", {
            get: function () {
                return this.game.moveContext && this.game.moveContext.flyByEvents.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canThrowDice", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.BeginTurn) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    if (player.money >= 0) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canEndTurn", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.ProcessingDone || this.game.getState() === Model.GameState.Manage) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    if (player.turnsInPrison === 0 && player.active) {
                        // must pay off bail before leaving prison
                        return false;
                    }
                    if (player.money < 0 && player.active) {
                        return false;
                    }
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canBuy", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.ProcessingDone) {
                    var currentPosition = this.getCurrentPlayerPosition();
                    if (currentPosition.type === Model.BoardFieldType.Asset) {
                        if (currentPosition.asset.unowned) {
                            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                            if (player.money >= currentPosition.asset.price) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canManage", {
            get: function () {
                if (this.game.getState() === Model.GameState.Move || this.game.getState() === Model.GameState.Process || this.game.getState() === Model.GameState.ThrowDice) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canTrade", {
            get: function () {
                if (this.game.getState() === Model.GameState.Move || this.game.getState() === Model.GameState.Process || this.game.getState() === Model.GameState.ThrowDice) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canGetOutOfJail", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.ProcessingDone) {
                    var currentPosition = this.getCurrentPlayerPosition();
                    if (currentPosition.type === Model.BoardFieldType.PrisonAndVisit) {
                        var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                        if (player.turnsInPrison !== undefined && player.money >= this.gameParams.jailBail) {
                            if (this.game.getState() === Model.GameState.BeginTurn) {
                                return true;
                            }
                            if (this.game.getState() === Model.GameState.ProcessingDone && player.turnsInPrison === 0 && this.lastDiceResult1 !== this.lastDiceResult2) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canSurrender", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.ProcessingDone) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    if (player.money < 0 && player.active) {
                        return true;
                    }
                    if (player.money < this.gameParams.jailBail && player.turnsInPrison === 0 && this.lastDiceResult1 !== this.lastDiceResult2) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canPause", {
            get: function () {
                if (this.game.getState() === Model.GameState.Process || this.game.getState() === Model.GameState.Move || this.game.getState() === Model.GameState.ThrowDice) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "gameState", {
            get: function () {
                return this.game.getState();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "winner", {
            get: function () {
                var activePlayers = this.game.players.filter(function (p) { return p.active; });
                if (activePlayers && activePlayers.length === 1) {
                    return activePlayers[0].playerName;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "isComputerMove", {
            get: function () {
                var _this = this;
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                return !player.human;
            },
            enumerable: true,
            configurable: true
        });
        GameService.prototype.setPlayerPosition = function (player, boardFieldIndex) {
            player.position = this.game.board.fields[boardFieldIndex];
            var previousFields = this.game.board.fields.filter(function (b) { return b.occupiedBy != null && b.occupiedBy.filter(function (ocb) { return ocb === player.playerName; }).length > 0; });
            if (previousFields && previousFields.length > 0) {
                var previousField = previousFields[0];
                previousField.occupiedBy.splice(previousField.occupiedBy.indexOf(player.playerName));
            }
            player.position.occupiedBy.push(player.playerName);
        };
        GameService.prototype.throwDice = function () {
            this.game.setState(Model.GameState.ThrowDice);
        };
        GameService.prototype.buy = function () {
            var _this = this;
            if (this.canBuy) {
                var asset = this.getCurrentPlayerPosition().asset;
                if (asset) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    player.money -= asset.price;
                    asset.setOwner(this.getCurrentPlayer());
                    return true;
                }
            }
            return false;
        };
        GameService.prototype.manage = function () {
            if (this.canManage) {
                this.game.setState(Model.GameState.Manage);
                this.currentManageGroupIndex = 0;
            }
            else {
                this.currentManageGroupIndex = undefined;
            }
            return this.currentManageGroupIndex;
        };
        GameService.prototype.manageFocusChange = function (left) {
            if (this.game.getState() === Model.GameState.Manage) {
                if (left) {
                    this.currentManageGroupIndex -= 1;
                    if (this.currentManageGroupIndex < 0) {
                        this.currentManageGroupIndex = this.manageGroups.length - 1;
                    }
                }
                else {
                    this.currentManageGroupIndex += 1;
                    if (this.currentManageGroupIndex >= this.manageGroups.length) {
                        this.currentManageGroupIndex = 0;
                    }
                }
            }
            return this.currentManageGroupIndex;
        };
        GameService.prototype.returnFromManage = function () {
            if (this.game.getState() === Model.GameState.Manage) {
                this.game.setPreviousState();
            }
        };
        GameService.prototype.trade = function () {
            if (this.canTrade) {
                this.game.setState(Model.GameState.Trade);
            }
        };
        GameService.prototype.returnFromTrade = function () {
            if (this.game.getState() === Model.GameState.Trade) {
                this.game.setPreviousState();
            }
        };
        GameService.prototype.getOutOfJail = function () {
            var _this = this;
            if (this.canGetOutOfJail) {
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                player.money -= this.gameParams.jailBail;
                player.turnsInPrison = undefined;
            }
        };
        GameService.prototype.surrender = function () {
            var _this = this;
            if (this.canSurrender) {
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                player.active = false;
                this.game.board.fields.forEach(function (f) {
                    if (f.type === Model.BoardFieldType.Asset) {
                        if (!f.asset.unowned && f.asset.owner === player.playerName) {
                            f.asset.releaseOwnership();
                        }
                    }
                });
                var activePlayers = this.game.players.filter(function (p) { return p.active; });
                if (activePlayers && activePlayers.length === 1) {
                    this.game.setState(Model.GameState.EndOfGame);
                }
            }
        };
        GameService.prototype.getCurrentPlayerPosition = function () {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            return player.position;
        };
        GameService.prototype.getPlayerAssets = function (playerName) {
            return this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.owner === playerName; }).map(function (f) { return f.asset; });
        };
        // get asset groups entirely owned by given player
        GameService.prototype.getPlayerAssetGroups = function (playerName) {
            var _this = this;
            var playerGroups = [];
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            groups.forEach(function (group) {
                var groupFields = _this.getGroupBoardFields(group);
                if (groupFields.every(function (field) { return !field.asset.unowned && field.asset.owner === playerName; })) {
                    playerGroups.push(group);
                }
            });
            return playerGroups;
        };
        GameService.prototype.moveCurrentPlayer = function (newPositionIndex, doubleRent) {
            var _this = this;
            this.game.setState(Model.GameState.Move);
            this.game.moveContext.reset();
            if (doubleRent) {
                this.game.moveContext.doubleRent = doubleRent;
            }
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            var currentPositionIndex = player.position.index;
            this.hasBeenLetOutOfPrison = false;
            if (player.turnsInPrison === undefined || this.letOutOfPrison(player)) {
                newPositionIndex = newPositionIndex !== undefined ? newPositionIndex : Math.floor((currentPositionIndex + this.lastDiceResult1 + this.lastDiceResult2) % 40);
                player.position = this.game.board.fields[newPositionIndex];
                this.game.board.fields[currentPositionIndex].occupiedBy.splice(this.game.board.fields[currentPositionIndex].occupiedBy.indexOf(player.playerName), 1);
                player.position.occupiedBy.push(player.playerName);
            }
            else {
                if (player.turnsInPrison !== undefined) {
                    this.game.setState(Model.GameState.Process);
                    return null;
                }
            }
            this.game.setState(Model.GameState.Process);
            this.game.lastDiceResult1 = this.lastDiceResult1;
            this.game.lastDiceResult2 = this.lastDiceResult2;
            return player.position;
        };
        // process visit of a field owned by another player
        GameService.prototype.processOwnedFieldVisit = function () {
            var _this = this;
            var result = new Model.ProcessResult();
            var asset = this.getCurrentPlayerPosition().asset;
            var priceToPay = 0;
            if (!asset.mortgage) {
                if (asset.hotel) {
                    priceToPay = asset.priceRentHotel;
                }
                else if (asset.houses && asset.houses > 0) {
                    priceToPay = asset.priceRentHouse[asset.houses - 1];
                }
                else {
                    // for the rest of the scenarios, we need to find out the number of owned assets in a group
                    var numOwnedInGroup = this.game.board.fields.filter(function (f) {
                        return f.type === Model.BoardFieldType.Asset && f.asset.group === asset.group && !f.asset.unowned && f.asset.owner === asset.owner;
                    }).length;
                    if (asset.group === Model.AssetGroup.Railway) {
                        priceToPay = asset.priceRent[numOwnedInGroup - 1];
                    }
                    else if (asset.group === Model.AssetGroup.Utility) {
                        priceToPay = asset.priceMultiplierUtility[numOwnedInGroup - 1] * (this.lastDiceResult1 + this.lastDiceResult2);
                    }
                    else if (asset.group !== Model.AssetGroup.None) {
                        priceToPay = asset.priceRent[numOwnedInGroup - 1];
                    }
                }
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                if (this.game.moveContext.doubleRent) {
                    priceToPay *= 2;
                }
                player.money -= priceToPay;
                var ownerPlayer = this.game.players.filter(function (p) { return p.playerName === asset.owner; })[0];
                ownerPlayer.money += priceToPay;
                result.message = this.getCurrentPlayer() + " paid rent of " + priceToPay + " to " + ownerPlayer.playerName + ".";
            }
            return result;
        };
        GameService.prototype.moveProcessingDone = function () {
            if (this.game.getState() === Model.GameState.Process) {
                this.game.setState(Model.GameState.ProcessingDone);
            }
        };
        GameService.prototype.getGroupBoardFields = function (assetGroup) {
            return this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === assetGroup; });
        };
        GameService.prototype.getBoardFieldGroup = function (boardFieldIndex) {
            var fields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.index == boardFieldIndex; });
            if (fields && fields.length > 0) {
                return fields[0].asset.group;
            }
            else {
                return undefined;
            }
        };
        GameService.prototype.hasMonopoly = function (player, focusedAssetGroupIndex, assetGroup) {
            var _this = this;
            var monopoly = true;
            if (!assetGroup) {
                var firstAssetIndex = this.manageGroups[focusedAssetGroupIndex][0];
                assetGroup = this.getBoardFieldGroup(firstAssetIndex);
            }
            if (assetGroup < Model.AssetGroup.First || assetGroup > Model.AssetGroup.Eighth) {
                return false;
            }
            var groupFields = this.getGroupBoardFields(assetGroup);
            groupFields.forEach(function (field) {
                if (field.asset.unowned || field.asset.owner !== _this.getCurrentPlayer()) {
                    monopoly = false;
                }
            });
            return monopoly;
        };
        // determine the first asset that is eligible for upgrade in a group and then perform the upgrade
        GameService.prototype.addHousePreviewForGroup = function (playerName, group) {
            var groupFields = this.getGroupBoardFields(group);
            var sortedFields = groupFields.sort(function (a, b) {
                if (a.asset.hotel && b.asset.hotel) {
                    return 0;
                }
                if (a.asset.hotel) {
                    return 1;
                }
                if (b.asset.hotel) {
                    return -1;
                }
                if (!a.asset.houses && !b.asset.houses) {
                    return 0;
                }
                if (!a.asset.houses && b.asset.houses) {
                    return -1;
                }
                if (a.asset.houses && !b.asset.houses) {
                    return 1;
                }
                return a.asset.houses > b.asset.houses ? 1 : -1;
            });
            return this.addHousePreview(playerName, sortedFields[0].index);
        };
        GameService.prototype.addHousePreview = function (playerName, position) {
            var boardField = this.game.board.fields.filter(function (f) { return f.index === position; })[0];
            if (!this.canUpgradeAsset(boardField.asset, playerName)) {
                return false;
            }
            // first, check if the player has the money to afford the upgrade
            var groupBoardFields = this.getGroupBoardFields(boardField.asset.group);
            var requiredMoney = 0;
            var houseCount = boardField.asset.houses + 1;
            requiredMoney += houseCount === 5 ? boardField.asset.getPriceForHotelDuringManage(false) : boardField.asset.getPriceForHouseDuringManage(false);
            groupBoardFields.forEach(function (field) {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.hotel ? 5 : field.asset.houses;
                    while (neighbourHouseCount < houseCount - 1) {
                        neighbourHouseCount++;
                        requiredMoney += field.asset.getPriceForHouseDuringManage(false);
                    }
                }
            });
            var player = this.game.players.filter(function (p) { return p.playerName === playerName; })[0];
            if (requiredMoney > player.money) {
                return false;
            }
            // next, perform the upgrade
            if (houseCount <= 4) {
                boardField.asset.addHouse();
            }
            else {
                boardField.asset.addHotel();
            }
            groupBoardFields.forEach(function (field) {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.hotel ? 5 : field.asset.houses;
                    while (neighbourHouseCount < houseCount - 1) {
                        neighbourHouseCount++;
                        field.asset.addHouse();
                    }
                }
            });
            return true;
        };
        GameService.prototype.removeHousePreview = function (playerName, position) {
            var boardField = this.game.board.fields.filter(function (f) { return f.index === position; })[0];
            if (!boardField.asset || !this.hasMonopoly(playerName, 0, boardField.asset.group) || (!boardField.asset.houses && !boardField.asset.hotel)) {
                return false;
            }
            var groupBoardFields = this.getGroupBoardFields(boardField.asset.group);
            var sellPrice = 0;
            var houseCount = boardField.asset.houses - 1;
            var player = this.game.players.filter(function (p) { return p.playerName === playerName; })[0];
            // next, perform the upgrade
            if (houseCount < 0) {
                boardField.asset.removeHotel();
                sellPrice += boardField.asset.getPriceForHotelDuringManage(true);
                houseCount = 4;
            }
            else {
                boardField.asset.removeHouse();
                sellPrice += boardField.asset.getPriceForHouseDuringManage(true);
            }
            groupBoardFields.forEach(function (field) {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.hotel ? 5 : field.asset.houses;
                    while (neighbourHouseCount > houseCount + 1) {
                        if (neighbourHouseCount === 5) {
                            field.asset.removeHotel();
                            sellPrice += boardField.asset.getPriceForHotelDuringManage(true);
                        }
                        else {
                            field.asset.removeHouse();
                            sellPrice += boardField.asset.getPriceForHouseDuringManage(true);
                        }
                        neighbourHouseCount--;
                    }
                }
            });
            this.uncommittedHousesPrice -= sellPrice;
            return true;
        };
        GameService.prototype.commitHouseOrHotel = function (playerName, focusedAssetGroupIndex, assetGroup) {
            if (!this.hasMonopoly(playerName, focusedAssetGroupIndex, assetGroup)) {
                return false;
            }
            var firstFocusedBoardField = assetGroup ? this.getGroupBoardFields(assetGroup)[0] : this.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            var boardFields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === firstFocusedBoardField.asset.group; });
            var totalPrice = 0;
            var that = this;
            boardFields.forEach(function (boardField) {
                totalPrice += boardField.asset.uncommittedPrice();
                boardField.asset.commitHouseOrHotel();
            });
            var player = that.game.players.filter(function (p) { return p.playerName === playerName; })[0];
            player.money -= totalPrice;
            return true;
        };
        GameService.prototype.rollbackHouseOrHotel = function (playerName, focusedAssetGroupIndex) {
            if (!this.hasMonopoly(playerName, focusedAssetGroupIndex)) {
                return false;
            }
            var firstFocusedBoardField = this.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            var boardFields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === firstFocusedBoardField.asset.group; });
            boardFields.forEach(function (boardField) {
                boardField.asset.rollbackHouseOrHotel();
            });
            return true;
        };
        // check if the asset can be upgraded
        // all currently uncommitted houses and hotels are taken into account; 
        // also, a purchase of a house/ hotel might require simultaneous purchase of a house on the neighbouring assets
        GameService.prototype.canUpgradeAsset = function (asset, playerName) {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, 0, asset.group)) {
                return false;
            }
            if (asset.hotel) {
                return false;
            }
            var groupAssets = this.getGroupBoardFields(asset.group).map(function (f) { return f.asset; });
            if (groupAssets.filter(function (a) { return a.mortgage; }).length > 0) {
                return false;
            }
            var player = this.players.filter(function (p) { return p.playerName === playerName; })[0];
            var requiredPrice = !asset.houses || asset.houses <= 3 ? asset.getPriceForHouseDuringManage(false) : asset.getPriceForHotelDuringManage(false);
            groupAssets.forEach(function (groupAsset) {
                requiredPrice += groupAsset.uncommittedPrice();
                if (groupAsset.name !== asset.name) {
                    if (groupAsset.houses < asset.houses && !groupAsset.hotel) {
                        requiredPrice += (asset.houses - groupAsset.houses) * groupAsset.getPriceForHouseDuringManage(false);
                    }
                }
            });
            return player.money >= requiredPrice;
        };
        GameService.prototype.canDowngradeAsset = function (asset, playerName) {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, 0, asset.group)) {
                return false;
            }
            if ((!asset.houses || asset.houses === 0) && !asset.hotel) {
                return false;
            }
            return true;
        };
        GameService.prototype.getAssetGroup = function (position) {
            return this.game.board.fields.filter(function (f) { return f.index === position; }).map(function (f) { return f.type === Model.BoardFieldType.Asset ? f.asset.group : undefined; })[0];
        };
        GameService.prototype.setDiceResult = function (diceResult) {
            this.lastDiceResult1 = diceResult[0];
            this.lastDiceResult2 = diceResult[1];
        };
        GameService.prototype.getNextTreasureCard = function () {
            var _this = this;
            var card = this.game.treasureCards.filter(function (c) { return c.index === _this.game.currentTreasureCardIndex; });
            if (!card || card.length === 0) {
                this.game.currentTreasureCardIndex = 0;
                card = this.game.treasureCards.filter(function (c) { return c.index === _this.game.currentTreasureCardIndex; });
            }
            this.game.currentTreasureCardIndex++;
            return card[0];
        };
        GameService.prototype.getNextEventCard = function () {
            var _this = this;
            var card = this.game.eventCards.filter(function (c) { return c.index === _this.game.currentEventCardIndex; });
            if (!card || card.length === 0) {
                this.game.currentEventCardIndex = 0;
                card = this.game.eventCards.filter(function (c) { return c.index === _this.game.currentEventCardIndex; });
            }
            this.game.currentEventCardIndex++;
            return card[0];
        };
        GameService.prototype.processCard = function (card) {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            if (card.cardType === Model.CardType.ReceiveMoney) {
                player.money += card.money;
            }
            if (card.cardType === Model.CardType.PayMoney) {
                player.money -= card.money;
            }
            if (card.cardType === Model.CardType.ReceiveMoneyFromPlayers) {
                this.game.players.forEach(function (p) {
                    if (p.playerName !== player.playerName && p.active) {
                        player.money += card.money;
                        p.money -= card.money;
                    }
                });
            }
            if (card.cardType === Model.CardType.PayMoneyToPlayers) {
                this.game.players.forEach(function (p) {
                    if (p.playerName !== player.playerName && p.active) {
                        player.money -= card.money;
                        p.money += card.money;
                    }
                });
            }
            if (card.cardType === Model.CardType.AdvanceToField) {
                if (card.boardFieldIndex === 0 && card.skipGoAward) {
                    this.game.moveContext.skipGoAward = true;
                }
            }
            if (card.cardType === Model.CardType.JumpToField) {
                if (card.boardFieldIndex !== 10) {
                    this.moveCurrentPlayer(card.boardFieldIndex);
                }
            }
            if (card.cardType === Model.CardType.Maintenance || card.cardType === Model.CardType.OwnMaintenance) {
                card.money = 0;
                this.game.board.fields.forEach(function (f) {
                    if (f.type === Model.BoardFieldType.Asset && !f.asset.unowned) {
                        if (f.asset.owner === _this.getCurrentPlayer() || card.cardType === Model.CardType.Maintenance) {
                            var money = 0;
                            if (f.asset.hotel) {
                                money = card.pricePerHotel;
                            }
                            else if (f.asset.houses) {
                                money += f.asset.houses * card.pricePerHouse;
                            }
                            player.money -= money;
                            card.money += money;
                        }
                    }
                });
            }
        };
        GameService.prototype.processTax = function (boardFieldType) {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            if (boardFieldType === Model.BoardFieldType.Tax) {
                player.money -= 100;
                return 100;
            }
            if (boardFieldType === Model.BoardFieldType.TaxIncome) {
                player.money -= 200;
                return 200;
            }
            return 0;
        };
        GameService.prototype.processPrison = function (wasSentToPrison) {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            if (player.turnsInPrison === undefined) {
                if (wasSentToPrison) {
                    player.turnsInPrison = 3;
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (player.turnsInPrison > 0) {
                    player.turnsInPrison--;
                }
                return true;
            }
        };
        // process intermediate board fields while moving a player to its destination field
        GameService.prototype.processFlyBy = function (positionIndex, backwards) {
            var _this = this;
            var processedEvent = Model.ProcessingEvent.None;
            if (positionIndex === 0 && !backwards) {
                if (this.game.moveContext.skipGoAward === false) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    player.money += this.game.gameParams.rules.passStartAward;
                    processedEvent = Model.ProcessingEvent.PassGoAward;
                    this.game.moveContext.flyByEvents.push(processedEvent);
                }
            }
            return processedEvent;
        };
        GameService.prototype.toggleMortgageAsset = function (asset) {
            var owner = this.players.filter(function (p) { return p.playerName === asset.owner; })[0];
            if (asset.mortgage) {
                if (owner.money >= Math.floor(asset.valueMortgage * 1.1)) {
                    owner.money -= Math.floor(asset.valueMortgage * 1.1);
                    asset.releaseMortgage();
                }
                else {
                    return false;
                }
            }
            else {
                owner.money += asset.valueMortgage;
                asset.putUnderMortgage();
            }
            return true;
        };
        // get fields in management group, identified by its index in the manage group array
        GameService.prototype.getBoardFieldsInGroup = function (focusedAssetGroupIndex) {
            var groupFieldIndexes = this.manageGroups[focusedAssetGroupIndex];
            return this.game.board.fields.filter(function (f) { return groupFieldIndexes.filter(function (g) { return g === f.index; }).length > 0; });
        };
        GameService.prototype.canMortgage = function (asset) {
            if (!asset) {
                return false;
            }
            var canMortgage = !asset.unowned && asset.owner === this.getCurrentPlayer();
            if (asset.group === Model.AssetGroup.Railway || asset.group === Model.AssetGroup.Utility) {
                return canMortgage;
            }
            if (canMortgage) {
                var groupAssets = this.getGroupBoardFields(asset.group).map(function (f) { return f.asset; });
                groupAssets.forEach(function (a) {
                    if ((a.houses && a.houses > 0) || a.hotel) {
                        canMortgage = false;
                    }
                });
            }
            return canMortgage;
        };
        GameService.prototype.getPlayersForTrade = function () {
            return this.players.filter(function (p) { return p.active; });
        };
        GameService.prototype.canSellAsset = function (asset) {
            if (asset.unowned) {
                return false;
            }
            if (this.hasMonopoly(asset.owner, 0, asset.group)) {
                // if any houses or hotels on group, the asset can not be sold
                var fields = this.getGroupBoardFields(asset.group);
                var hasUpgrades = false;
                fields.forEach(function (f) {
                    if (f.asset.hotel || (f.asset.houses && f.asset.houses > 0)) {
                        hasUpgrades = true;
                    }
                });
                if (hasUpgrades) {
                    return false;
                }
            }
            return true;
        };
        GameService.prototype.getAssetByName = function (assetName) {
            var fields = this.game.board.fields.filter(function (f) { return f.asset && f.asset.name === assetName; });
            if (fields && fields.length > 0) {
                return fields[0].asset;
            }
            return undefined;
        };
        GameService.prototype.setupTestData = function () {
            var player = this.game.players[1];
            this.game.board.fields[1].asset.setOwner(player.playerName);
            this.game.board.fields[3].asset.setOwner(player.playerName);
            //this.toggleMortgageAsset(this.game.board.fields[1].asset);
            //this.toggleMortgageAsset(this.game.board.fields[3].asset);
            this.game.board.fields[1].asset.addHouse();
            this.game.board.fields[1].asset.commitHouseOrHotel();
            this.game.board.fields[3].asset.addHouse();
            this.game.board.fields[3].asset.addHouse();
            this.game.board.fields[3].asset.commitHouseOrHotel();
            player.money = 0;
        };
        GameService.prototype.initPlayers = function (settings) {
            var colors = ["Red", "Green", "Yellow", "Blue"];
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player(settings.players[i].playerName, settings.players[i].human);
                player.money = settings.rules.initialCash;
                player.color = i;
                player.active = true;
                this.game.players.push(player);
                this.setPlayerPosition(player, 0);
            }
        };
        GameService.prototype.initCards = function (settings) {
            this.game.currentEventCardIndex = 0;
            this.game.currentTreasureCardIndex = 0;
            var treasureCardIndex = 0;
            var eventCardIndex = 0;
            var treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Lunar bank error. You receive " + this.themeService.theme.moneySymbol + "200.";
            treasureCard.money = 200;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You have won a bet at the planetary party lounge. You receive " + this.themeService.theme.moneySymbol + "10.";
            treasureCard.money = 10;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.AdvanceToField;
            treasureCard.message = "Go to START. You receive " + this.themeService.theme.moneySymbol + settings.rules.passStartAward + ".";
            treasureCard.boardFieldIndex = 0;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Pay " + this.themeService.theme.moneySymbol + "100 for exterior casing upgrade.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Lunar legal office fee. Pay " + this.themeService.theme.moneySymbol + "50.";
            treasureCard.money = 50;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Yearly bonus. You receive " + this.themeService.theme.moneySymbol + "100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Life insurance payoff. You receive " + this.themeService.theme.moneySymbol + "100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Your ship's thrusters need maintenance. Pay " + this.themeService.theme.moneySymbol + "50.";
            treasureCard.money = 50;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Personal income tax return. You receive " + this.themeService.theme.moneySymbol + "20.";
            treasureCard.money = 20;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.JumpToField;
            treasureCard.message = "Go directly to quarantine, without passing START.";
            treasureCard.boardFieldIndex = 10;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Space tourist donation. You receive " + this.themeService.theme.moneySymbol + "25.";
            treasureCard.money = 25;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoneyFromPlayers;
            treasureCard.message = "It's your birthday. You receive " + this.themeService.theme.moneySymbol + "15 from each player.";
            treasureCard.money = 15;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Personal income tax return. You receive " + this.themeService.theme.moneySymbol + "20.";
            treasureCard.money = 20;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.Maintenance;
            treasureCard.message = "Pay for docking bay maintenance. " + this.themeService.theme.moneySymbol + "40 for each " + this.themeService.theme.house + " and " + this.themeService.theme.moneySymbol + "115 for each " + this.themeService.theme.hotel + ".";
            treasureCard.pricePerHouse = 40;
            treasureCard.pricePerHotel = 115;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You have extracted large quantity of energy minerals from space debris. You receive " + this.themeService.theme.moneySymbol + "100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            var eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.PayMoney;
            eventCard.message = "You need a new spacesuit. Pay " + this.themeService.theme.moneySymbol + "35.";
            eventCard.money = 35;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.RetractNumFields;
            eventCard.message = "Go three fields backwards.";
            eventCard.boardFieldCount = 3;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.ReceiveMoney;
            eventCard.message = "You receive a donation from private investor worth of " + this.themeService.theme.moneySymbol + "50.";
            eventCard.money = 50;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to " + this.themeService.theme.boardFieldName[11] + ". If you pass START, you receive " + this.themeService.theme.moneySymbol + settings.rules.passStartAward + ".";
            eventCard.boardFieldIndex = 11;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.OwnMaintenance;
            eventCard.message = "Your " + this.themeService.theme.house + "s are in need of renovation. Pay " + this.themeService.theme.moneySymbol + "25 for each " + this.themeService.theme.house + " and " + this.themeService.theme.moneySymbol + "100 for each " + this.themeService.theme.hotel + ".";
            eventCard.pricePerHouse = 25;
            eventCard.pricePerHotel = 100;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.PayMoneyToPlayers;
            eventCard.message = "You've damaged a communication satellite. Pay each player " + this.themeService.theme.moneySymbol + "50.";
            eventCard.money = 50;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToRailway;
            eventCard.message = "Go to the next " + this.themeService.theme.railroad + ". If unowned, you may purchase it from the bank. Otherwise, pay double rent to the owner.";
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to " + this.themeService.theme.boardFieldName[24] + ". If you pass START, you receive " + this.themeService.theme.moneySymbol + settings.rules.passStartAward + ".";
            eventCard.boardFieldIndex = 24;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.ReceiveMoney;
            eventCard.message = "Fuel cell loan payment. You receive " + this.themeService.theme.moneySymbol + "150.";
            eventCard.money = 150;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToRailway;
            eventCard.message = "Go to the next " + this.themeService.theme.railroad + ". If unowned, you may purchase it from the bank. Otherwise, pay double rent to the owner.";
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Take a trip to " + this.themeService.theme.boardFieldName[5] + ". If you pass START, you receive " + this.themeService.theme.moneySymbol + settings.rules.passStartAward + ".";
            eventCard.boardFieldIndex = 5;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to " + this.themeService.theme.boardFieldName[39] + ".";
            eventCard.boardFieldIndex = 39;
            this.game.eventCards.push(eventCard);
            this.shuffle(this.game.treasureCards);
            this.shuffle(this.game.eventCards);
        };
        GameService.prototype.shuffle = function (array) {
            var currentIndex = array.length;
            var temporaryValue;
            var randomIndex;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[currentIndex].index = currentIndex;
                array[randomIndex] = temporaryValue;
                array[randomIndex].index = randomIndex;
            }
            return array;
        };
        GameService.prototype.initManageGroups = function () {
            this.manageGroups = new Array();
            var manageGroup = this.getGroupBoardFields(Model.AssetGroup.First).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = [5];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Second).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Third).map(function (f) { return f.index; });
            manageGroup.push(12);
            this.manageGroups.push(manageGroup);
            manageGroup = [15];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Fourth).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Fifth).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = [25];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Sixth).map(function (f) { return f.index; });
            manageGroup.push(28);
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Seventh).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = [35];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Eighth).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
        };
        GameService.prototype.letOutOfPrison = function (player) {
            if (player.turnsInPrison === undefined) {
                return true;
            }
            if (this.lastDiceResult1 === this.lastDiceResult2) {
                player.turnsInPrison = undefined;
                this.hasBeenLetOutOfPrison = true;
                return true;
            }
            if (player.turnsInPrison && player.turnsInPrison > 0) {
                return false;
            }
            return false;
        };
        GameService.$inject = ["$http", "settingsService", "themeService"];
        return GameService;
    }());
    Services.GameService = GameService;
    monopolyApp.service("gameService", GameService);
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ThemeService = (function () {
        function ThemeService() {
            if (ThemeService.theme === Model.Themes.Monopoly) {
                this.themeInstance = new Model.MonopolyTheme();
            }
            else if (ThemeService.theme === Model.Themes.Moonopoly) {
                this.themeInstance = new Model.MoonopolyTheme();
            }
        }
        Object.defineProperty(ThemeService.prototype, "theme", {
            get: function () {
                return this.themeInstance;
            },
            enumerable: true,
            configurable: true
        });
        // TODO: move this to build-time variable
        ThemeService.theme = 1 /*Model.Themes.Moonopoly*/;
        return ThemeService;
    }());
    Services.ThemeService = ThemeService;
})(Services || (Services = {}));
monopolyApp.service("themeService", Services.ThemeService);
var Services;
(function (Services) {
    var TradeService = (function () {
        function TradeService(gameService, aiService, timeoutService) {
            this.gameService = gameService;
            this.aiService = aiService;
            this.timeoutService = timeoutService;
        }
        TradeService.prototype.start = function (firstPlayer, secondPlayer, scope, tradeActions) {
            this.scope = scope;
            this.currentPlayer = firstPlayer;
            this.isCounterOffer = false;
            this.tradeState = new Model.TradeState();
            this.tradeState.firstPlayer = firstPlayer;
            this.tradeState.secondPlayer = secondPlayer;
            this.tradeState.tradeActions = tradeActions;
            this.player1Assets = this.buildPlayerAssetList(firstPlayer);
            this.player2Assets = this.buildPlayerAssetList(secondPlayer);
        };
        TradeService.prototype.getTradeState = function () {
            return this.tradeState;
        };
        TradeService.prototype.buildPlayerAssetList = function (player) {
            var _this = this;
            var assetGroups = [];
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
            groups.forEach(function (group) {
                var groupFields = _this.gameService.getGroupBoardFields(group);
                var assetsToSell = [];
                groupFields.forEach(function (f) {
                    if (!f.asset.unowned && f.asset.owner === player.playerName && _this.gameService.canSellAsset(f.asset)) {
                        assetsToSell.push(f.asset);
                    }
                });
                if (assetsToSell.length > 0) {
                    var groupToSell = new Model.TradeGroup();
                    groupToSell.assets = assetsToSell;
                    groupToSell.assetGroup = group;
                    groupToSell.name = _this.mapGroupName(group);
                    assetGroups.push(groupToSell);
                }
            });
            return assetGroups;
        };
        TradeService.prototype.buildAssetTree = function (playerAssets) {
            var _this = this;
            var data = [];
            playerAssets.forEach(function (tradeGroup) {
                data.push({
                    'text': tradeGroup.name,
                    'state': {
                        'opened': false,
                        'selected': false
                    },
                    children: _this.buildAssetGroupChildren(tradeGroup.assets)
                });
            });
            return data;
        };
        TradeService.prototype.switchSelection = function (assetName) {
            var selectedAsset = this.gameService.getAssetByName(assetName);
            if (selectedAsset) {
                var playerSelectedAssets = selectedAsset.owner === this.tradeState.firstPlayer.playerName ? this.tradeState.firstPlayerSelectedAssets : this.tradeState.secondPlayerSelectedAssets;
                var currentlySelectedAsset = playerSelectedAssets.filter(function (a) { return a.name === assetName; });
                if (currentlySelectedAsset.length > 0) {
                    var index = playerSelectedAssets.indexOf(selectedAsset);
                    if (index >= 0) {
                        playerSelectedAssets.splice(index, 1);
                    }
                }
                else {
                    playerSelectedAssets.push(selectedAsset);
                }
                this.setCounterOffer();
            }
        };
        TradeService.prototype.setCounterOffer = function () {
            this.isCounterOffer = true; // any selection is starting a new offer and the previous one doesn't need a confirmation
            this.setAllowedActions();
        };
        TradeService.prototype.makeTradeOffer = function () {
            if (!this.tradeState.canMakeTradeOffer) {
                return false;
            }
            if (this.tradeState.firstPlayerMoney && this.tradeState.firstPlayerMoney > this.tradeState.firstPlayer.money) {
                return false;
            }
            if (this.tradeState.secondPlayerMoney && this.tradeState.secondPlayerMoney > this.tradeState.secondPlayer.money) {
                return false;
            }
            var offerAccepted = false;
            var otherPlayer = this.tradeState.firstPlayer.playerName === this.currentPlayer.playerName ? this.tradeState.secondPlayer : this.tradeState.firstPlayer;
            if (!otherPlayer.human) {
                offerAccepted = this.aiService.acceptTradeOffer(otherPlayer, this.tradeState);
                if (offerAccepted) {
                    this.executeTrade(this.tradeState);
                }
                else {
                    sweetAlert({
                        title: "Trade message",
                        text: otherPlayer.playerName + " rejected your trade offer.",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonText: "Ok"
                    }, function (isConfirm) {
                    });
                }
            }
            else {
                var that = this;
                if (this.gameService.players.filter(function (p) { return p.human; }).length > 1) {
                    sweetAlert.close();
                    this.timeoutService(function () {
                        sweetAlert({
                            title: "Trade message",
                            text: "Please hand the device to " + otherPlayer.playerName + ".",
                            type: "info",
                            showCancelButton: false,
                            confirmButtonText: "Ok"
                        }, function (isConfirm) {
                            that.scope.$apply(function () {
                                that.switchToPlayer(otherPlayer);
                            });
                        });
                    }, 100);
                }
                else {
                    that.scope.$apply(function () {
                        that.switchToPlayer(otherPlayer);
                    });
                }
            }
            return offerAccepted;
        };
        TradeService.prototype.acceptTradeOffer = function () {
            this.executeTrade(this.tradeState);
        };
        TradeService.prototype.executeTrade = function (tradeState) {
            var firstPlayerMoney = tradeState.firstPlayerMoney;
            var secondPlayerMoney = tradeState.secondPlayerMoney;
            firstPlayerMoney = parseInt(firstPlayerMoney);
            secondPlayerMoney = parseInt(secondPlayerMoney);
            tradeState.firstPlayer.money -= firstPlayerMoney;
            tradeState.firstPlayer.money += secondPlayerMoney;
            tradeState.secondPlayer.money -= secondPlayerMoney;
            tradeState.secondPlayer.money += firstPlayerMoney;
            var that = this;
            tradeState.firstPlayerSelectedAssets.forEach(function (firstPlayerAsset) {
                firstPlayerAsset.setOwner(tradeState.secondPlayer.playerName);
            });
            tradeState.secondPlayerSelectedAssets.forEach(function (secondPlayerAsset) {
                secondPlayerAsset.setOwner(tradeState.firstPlayer.playerName);
            });
        };
        TradeService.prototype.buildAssetGroupChildren = function (assets) {
            var data = [];
            assets.forEach(function (a) { return data.push({ text: a.name, "icon": "jstree-file" }); });
            return data;
        };
        TradeService.prototype.setAllowedActions = function () {
            if (this.tradeState.firstPlayerSelectedAssets.length > 0 || this.tradeState.secondPlayerSelectedAssets.length > 0) {
                this.tradeState.canMakeTradeOffer = this.isCounterOffer;
                this.tradeState.canAcceptTradeOffer = this.isCounterOffer === false;
            }
            else {
                this.tradeState.canMakeTradeOffer = false;
                this.tradeState.canAcceptTradeOffer = false;
            }
        };
        TradeService.prototype.switchToPlayer = function (player) {
            this.currentPlayer = player;
            this.isCounterOffer = false;
            this.setAllowedActions();
        };
        TradeService.prototype.mapGroupName = function (assetGroup) {
            if (assetGroup === Model.AssetGroup.First) {
                return "Rimas";
            }
            else if (assetGroup === Model.AssetGroup.Second) {
                return "Mountains";
            }
            else if (assetGroup === Model.AssetGroup.Third) {
                return "Valleys";
            }
            else if (assetGroup === Model.AssetGroup.Fourth) {
                return "Cliffs";
            }
            else if (assetGroup === Model.AssetGroup.Fifth) {
                return "Terras";
            }
            else if (assetGroup === Model.AssetGroup.Sixth) {
                return "Seas";
            }
            else if (assetGroup === Model.AssetGroup.Seventh) {
                return "Oceans";
            }
            else if (assetGroup === Model.AssetGroup.Eighth) {
                return "Craters";
            }
            else if (assetGroup === Model.AssetGroup.Railway) {
                return "Iron mines";
            }
            else if (assetGroup === Model.AssetGroup.Utility) {
                return "Oil rigs";
            }
            return "";
        };
        TradeService.$inject = ["gameService", "aiService", "$timeout"];
        return TradeService;
    }());
    Services.TradeService = TradeService;
})(Services || (Services = {}));
monopolyApp.service("tradeService", Services.TradeService);
var Services;
(function (Services) {
    var TutorialService = (function () {
        function TutorialService(swipeService, timeoutService, gameService) {
            this.numStepsGame = 6;
            this.numStepsManage = 9;
            this.numSteps = this.numStepsGame;
            this.timeoutService = timeoutService;
            this.gameService = gameService;
            this.swipeService = swipeService;
        }
        TutorialService.prototype.initialize = function (data) {
            this.data = data;
            this.numSteps = this.numStepsGame;
            this.currentStep = undefined;
        };
        TutorialService.prototype.advanceToNextStep = function () {
            var hasAdvanced = false;
            if (!this.currentStep) {
                this.currentStep = 1;
                hasAdvanced = true;
            }
            else {
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
        };
        TutorialService.prototype.endCurrentSection = function () {
            if (this.currentStep <= this.numStepsGame) {
                this.currentStep = this.numStepsGame + 1;
            }
            else if (this.currentStep <= this.numStepsManage) {
                this.currentStep = this.numStepsManage + 1;
            }
        };
        Object.defineProperty(TutorialService.prototype, "canAdvance", {
            get: function () {
                if (!this.currentStep || this.currentStep > this.numSteps) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TutorialService.prototype, "canAdvanceByClick", {
            get: function () {
                return this.canAdvance && !this.data.disableClickForward;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TutorialService.prototype, "canProcessClick", {
            get: function () {
                return !this.data.disableClickForward && this.data.processClick;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TutorialService.prototype, "isActive", {
            get: function () {
                return this.currentStep && this.currentStep <= this.numSteps;
            },
            enumerable: true,
            configurable: true
        });
        TutorialService.prototype.canExecuteAction = function (action) {
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
        };
        TutorialService.prototype.executeActionCallback = function (action) {
            if (this.data.executeOnAction) {
                this.data.executeOnAction(action, this, this.data);
            }
        };
        TutorialService.prototype.initManageModeTutorial = function (scope) {
            if (this.numSteps === this.numStepsGame) {
                this.numSteps = this.numStepsManage;
                var that = this;
                // delay showing the tutorial message before the new camera position is loaded
                this.timeoutService(function () {
                    scope.$apply(function () {
                        that.advanceToNextStep();
                    });
                }, 100);
            }
        };
        TutorialService.prototype.setupCurrentStep = function () {
            if (this.currentStep === 1) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Welcome to MOONopoly! A historical moment has been reached where the Moon is now available to the wealthiest explorers of the world.";
                this.data.messageDialogTop = 70;
                this.data.messagePaddingTop = 25;
            }
            else if (this.currentStep === 2) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "It is only fair for the Moon to be divided among them by chance and strategic skills.";
                this.data.messagePaddingTop = 50;
            }
            else if (this.currentStep === 3) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "In a turn based game you have a choice of THROWING the dices, MANAGING or TRADING your assets and ENDING current turn.";
                this.data.messagePaddingTop = 35;
            }
            else if (this.currentStep === 4) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "To select your action, swipe your finger over the buttons at the bottom of the screen.";
                this.data.messagePaddingTop = 50;
                this.data.customFunction = function (tutorialService, stepData, backwards) {
                    // this custom function will iterate over visible buttons and highlight them one at a time
                    var highlighted = $("#commandPanel img.highlightedButton");
                    var nextHighlighted;
                    if (highlighted.length === 0) {
                        nextHighlighted = $("#commandPanel a:visible img.unhighlightedButton").first();
                        var position = nextHighlighted[0].getBoundingClientRect();
                        $("#handCursor").css("top", position.top - 90);
                        $("#handCursor").css("left", position.left);
                        $("#handCursor").show();
                    }
                    else {
                        highlighted.removeClass("highlightedButton").addClass("unhighlightedButton");
                        highlighted.parent().children().children(".commandButtonOverlayText").hide();
                        if (tutorialService.currentStep === 4) {
                            highlighted = highlighted.first().parent();
                            nextHighlighted = backwards ? highlighted.prevAll("a:visible") : highlighted.nextAll("a:visible");
                            if (nextHighlighted.length === 0) {
                                // change direction if the end has been reached
                                if (backwards) {
                                    backwards = false;
                                }
                                else {
                                    backwards = true;
                                }
                                nextHighlighted = backwards ? highlighted.prevAll("a:visible").first().children("img") : highlighted.nextAll("a:visible").first().children("img"); //$("#commandPanel a:visible img").first();
                            }
                            else {
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
                        tutorialService.timeoutService(function () {
                            if (stepData.customFunction && tutorialService.currentStep === 4) {
                                stepData.customFunction(tutorialService, stepData, backwards);
                            }
                            else {
                                highlighted = $("#commandPanel img.highlightedButton");
                                highlighted.removeClass("highlightedButton").addClass("unhighlightedButton");
                                highlighted.parent().children().children(".commandButtonOverlayText").hide();
                                $("#handCursor").hide();
                            }
                        }, 1000);
                    }
                };
            }
            else if (this.currentStep === 5) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Try THROWING the dices for your first move.";
                this.data.messagePaddingTop = 55;
                this.data.disableClickForward = true;
                this.data.customFunction = undefined;
                this.data.executeOnAction = function (action, tutorialService, stepData) {
                    if (action === "setupthrow") {
                        stepData.messageDialogVisible = false;
                    }
                    if (action === "throw") {
                        tutorialService.advanceToNextStep();
                    }
                };
            }
            else if (this.currentStep === 6) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Tap anywhere on any of the dices to drop them to the Moon surface.";
                this.data.messageDialogTop = 180;
                this.data.messagePaddingTop = 55;
                this.data.disableClickForward = false;
                this.data.processClick = true;
                this.data.customFunction = undefined;
            }
            else if (this.currentStep === 8) {
                this.data.messageDialogVisible = true;
                this.data.processClick = false;
                this.data.messageDialogText = "On this screen you can view properties and manage those owned by you.";
                this.data.messageDialogTop = 70;
                this.data.messagePaddingTop = 50;
            }
            else if (this.currentStep === 9) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Swipe your finger left or right to highlight another group, then tap anywhere on a chosen property to select it.";
                this.data.messageDialogTop = 70;
                this.data.messagePaddingTop = 35;
            }
            else {
                this.data.messageDialogVisible = false;
                this.data.customFunction = undefined;
            }
        };
        TutorialService.$inject = ["$swipe", "$timeout", "gameService"];
        return TutorialService;
    }());
    Services.TutorialService = TutorialService;
    monopolyApp.service("tutorialService", TutorialService);
})(Services || (Services = {}));
var Model;
(function (Model) {
    (function (AIActionType) {
        AIActionType[AIActionType["Buy"] = 0] = "Buy";
        AIActionType[AIActionType["Mortgage"] = 1] = "Mortgage";
        AIActionType[AIActionType["Unmortgage"] = 2] = "Unmortgage";
        AIActionType[AIActionType["SellHotel"] = 3] = "SellHotel";
        AIActionType[AIActionType["SellHouse"] = 4] = "SellHouse";
        AIActionType[AIActionType["BuyHotel"] = 5] = "BuyHotel";
        AIActionType[AIActionType["BuyHouse"] = 6] = "BuyHouse";
        AIActionType[AIActionType["Surrender"] = 7] = "Surrender";
        AIActionType[AIActionType["GetOutOfJail"] = 8] = "GetOutOfJail";
        AIActionType[AIActionType["Trade"] = 9] = "Trade";
    })(Model.AIActionType || (Model.AIActionType = {}));
    var AIActionType = Model.AIActionType;
    ;
    var AIAction = (function () {
        function AIAction() {
        }
        return AIAction;
    }());
    Model.AIAction = AIAction;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (AssetGroup) {
        AssetGroup[AssetGroup["None"] = 0] = "None";
        AssetGroup[AssetGroup["First"] = 1] = "First";
        AssetGroup[AssetGroup["Second"] = 2] = "Second";
        AssetGroup[AssetGroup["Third"] = 3] = "Third";
        AssetGroup[AssetGroup["Fourth"] = 4] = "Fourth";
        AssetGroup[AssetGroup["Fifth"] = 5] = "Fifth";
        AssetGroup[AssetGroup["Sixth"] = 6] = "Sixth";
        AssetGroup[AssetGroup["Seventh"] = 7] = "Seventh";
        AssetGroup[AssetGroup["Eighth"] = 8] = "Eighth";
        AssetGroup[AssetGroup["Utility"] = 9] = "Utility";
        AssetGroup[AssetGroup["Railway"] = 10] = "Railway";
    })(Model.AssetGroup || (Model.AssetGroup = {}));
    var AssetGroup = Model.AssetGroup;
    ;
    var Asset = (function () {
        function Asset() {
            this._unowned = true;
            this._mortgage = false;
            this._houses = 0;
            this._uncommittedHouses = 0;
            this._hotel = false;
            this._uncommittedHotel = undefined;
            this.priceRent = [];
            this.priceRentHouse = [];
            this.priceMultiplierUtility = [];
        }
        Object.defineProperty(Asset.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "unowned", {
            get: function () {
                return this._unowned;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "houses", {
            get: function () {
                if (this.hotel || this._uncommittedHotel) {
                    return 0;
                }
                else if (this._uncommittedHotel === false) {
                    return 4 + this._uncommittedHouses;
                }
                return this._houses + this._uncommittedHouses;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "hotel", {
            get: function () {
                if (this._uncommittedHotel !== undefined) {
                    return this._uncommittedHotel;
                }
                return this._hotel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "uncommittedHouses", {
            get: function () {
                return this._uncommittedHouses;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "uncommittedHotel", {
            get: function () {
                return this._uncommittedHotel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "mortgage", {
            get: function () {
                return this._mortgage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "isUtility", {
            get: function () {
                return this.group === Model.AssetGroup.Utility;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "isRailway", {
            get: function () {
                return this.group === Model.AssetGroup.Railway;
            },
            enumerable: true,
            configurable: true
        });
        // add a house in a preview mode;
        Asset.prototype.addHouse = function () {
            this._uncommittedHouses++;
        };
        // add a hotel in a preview mode;
        Asset.prototype.addHotel = function () {
            this._uncommittedHotel = this._uncommittedHotel === false ? undefined : true;
        };
        // remove a house in a preview mode
        Asset.prototype.removeHouse = function () {
            this._uncommittedHouses--;
        };
        // remove a hotel in a preview mode
        Asset.prototype.removeHotel = function () {
            this._uncommittedHotel = this._uncommittedHotel ? undefined : false;
            //this._uncommittedHouses = 4;
        };
        Asset.prototype.commitHouseOrHotel = function () {
            if (this._uncommittedHotel !== undefined) {
                this._hotel = this._uncommittedHotel;
                if (this._uncommittedHotel === false) {
                    this._houses = 4;
                }
            }
            this._houses += this._uncommittedHouses;
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
            if (this.hotel) {
                this._houses = 0;
            }
        };
        Asset.prototype.rollbackHouseOrHotel = function () {
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
        };
        // gets the price to pay for all the uncommitted amenities of the asset (can be negative if the player is selling houses/hotel);
        Asset.prototype.uncommittedPrice = function () {
            var price = 0;
            if (this._uncommittedHotel) {
                price += this.priceHotel;
            }
            else if (this._uncommittedHotel === false) {
                price -= this.priceHotel / 2;
            }
            if (this._uncommittedHouses) {
                var priceHouses = this._uncommittedHouses * this.priceHouse;
                if (this._uncommittedHouses < 0) {
                    priceHouses = Math.floor(priceHouses / 2);
                }
                price += priceHouses;
            }
            return price;
        };
        Asset.prototype.hasUncommittedUpgrades = function () {
            return this._uncommittedHotel || this._uncommittedHotel === false || (this._uncommittedHouses && (this._uncommittedHouses > 0 || this._uncommittedHouses < 0));
        };
        // returns hotel price, taking into account that the hotel that has just been sold (at a half price) can be bought back at the same price, since the sell has not been
        // committed yet
        // the 'selling' parameter determines whether the hotel is being sold or bought
        Asset.prototype.getPriceForHotelDuringManage = function (selling) {
            if (!selling) {
                if (this._uncommittedHotel === false) {
                    return this.priceHotel / 2;
                }
                return this.priceHotel;
            }
            else {
                if (this._uncommittedHotel) {
                    return this.priceHotel;
                }
                return this.priceHotel / 2;
            }
        };
        // returns house price, taking into account that the house that has just been sold (at a half price) can be bought back at the same price, since the sell has not been
        // committed yet
        // the 'selling' parameter determines whether the house is being sold or bought
        Asset.prototype.getPriceForHouseDuringManage = function (selling) {
            if (!selling) {
                if (this._uncommittedHouses < 0) {
                    return this.priceHouse / 2;
                }
                return this.priceHouse;
            }
            else {
                if (this._uncommittedHouses && this._uncommittedHouses > 0) {
                    return this.priceHouse;
                }
                return this.priceHouse / 2;
            }
        };
        Asset.prototype.putUnderMortgage = function () {
            this._mortgage = true;
        };
        Asset.prototype.releaseMortgage = function () {
            this._mortgage = false;
        };
        Asset.prototype.setOwner = function (ownerName) {
            this._owner = ownerName;
            this._unowned = false;
        };
        Asset.prototype.loadDataFrom = function (savedAsset) {
            this._unowned = savedAsset._unowned;
            this._owner = savedAsset._owner;
            this._houses = savedAsset._houses;
            this._uncommittedHouses = savedAsset._uncommittedHouses;
            this._hotel = savedAsset._hotel;
            this._uncommittedHotel = savedAsset._uncommittedHotel;
            this._mortgage = savedAsset._mortgage;
            this.name = savedAsset.name;
            this.color = savedAsset.color;
            this.price = savedAsset.price;
            this.group = savedAsset.group;
            this.priceRent = savedAsset.priceRent;
            this.priceRentHouse = savedAsset.priceRentHouse;
            this.priceRentHotel = savedAsset.priceRentHotel;
            this.priceHouse = savedAsset.priceHouse;
            this.priceHotel = savedAsset.priceHotel;
            this.valueMortgage = savedAsset.valueMortgage;
            this.priceMultiplierUtility = savedAsset.priceMultiplierUtility;
        };
        Asset.prototype.releaseOwnership = function () {
            this.releaseMortgage();
            this._houses = 0;
            this._uncommittedHouses = 0;
            this._hotel = false;
            this._uncommittedHotel = undefined;
            this._unowned = true;
        };
        return Asset;
    }());
    Model.Asset = Asset;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Board = (function () {
        function Board(theme) {
            this.initBoard(theme);
        }
        Board.prototype.loadDataFrom = function (savedBoard) {
            this.fields = new Array();
            var that = this;
            savedBoard.fields.sort(function (f1, f2) {
                return f1.index > f2.index ? 1 : -1;
            }).forEach(function (f) {
                var savedBoardField = f;
                var asset = undefined;
                if (savedBoardField._asset) {
                    asset = new Model.Asset();
                    asset.loadDataFrom(savedBoardField._asset);
                }
                var boardField = new Model.BoardField(asset);
                boardField.loadDataFrom(f);
                that.fields.push(boardField);
            });
        };
        Board.prototype.initBoard = function (theme) {
            this.fields = new Array();
            var startField = new Model.BoardField(null);
            startField.index = 0;
            startField.type = Model.BoardFieldType.Start;
            this.fields.push(startField);
            var boardField = this.createAssetBoardField(theme.boardFieldName[1], this.fields.length, Model.AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.color = theme.boardFieldColor[1];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(2, 4);
            boardField.asset.priceRentHouse.push(10, 30, 90, 160);
            boardField.asset.priceRentHotel = 250;
            boardField.asset.valueMortgage = 30;
            this.fields.push(boardField);
            var treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField(theme.boardFieldName[3], this.fields.length, Model.AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.color = theme.boardFieldColor[3];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(4, 8);
            boardField.asset.priceRentHouse.push(20, 60, 180, 320);
            boardField.asset.priceRentHotel = 450;
            boardField.asset.valueMortgage = 30;
            this.fields.push(boardField);
            var taxField = new Model.BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = Model.BoardFieldType.TaxIncome;
            this.fields.push(taxField);
            boardField = this.createAssetBoardField(theme.boardFieldName[5], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[5];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[6], this.fields.length, Model.AssetGroup.Second);
            boardField.asset.price = 100;
            boardField.asset.color = theme.boardFieldColor[6];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
            boardField.asset.priceRentHotel = 550;
            boardField.asset.valueMortgage = 50;
            this.fields.push(boardField);
            var eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField(theme.boardFieldName[8], this.fields.length, Model.AssetGroup.Second);
            boardField.asset.color = theme.boardFieldColor[8];
            boardField.asset.price = 100;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
            boardField.asset.priceRentHotel = 550;
            boardField.asset.valueMortgage = 50;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[9], this.fields.length, Model.AssetGroup.Second);
            boardField.asset.price = 120;
            boardField.asset.color = theme.boardFieldColor[9];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(8, 8, 16);
            boardField.asset.priceRentHouse.push(40, 100, 300, 450);
            boardField.asset.priceRentHotel = 600;
            boardField.asset.valueMortgage = 60;
            this.fields.push(boardField);
            var prisonAndVisitField = new Model.BoardField(null);
            prisonAndVisitField.index = this.fields.length;
            prisonAndVisitField.type = Model.BoardFieldType.PrisonAndVisit;
            this.fields.push(prisonAndVisitField);
            boardField = this.createAssetBoardField(theme.boardFieldName[11], this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.color = theme.boardFieldColor[11];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.valueMortgage = 70;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[12], this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.color = theme.boardFieldColor[12];
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.valueMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[13], this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.color = theme.boardFieldColor[13];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.valueMortgage = 70;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[14], this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 160;
            boardField.asset.color = theme.boardFieldColor[14];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(12, 12, 24);
            boardField.asset.priceRentHouse.push(60, 180, 500, 700);
            boardField.asset.priceRentHotel = 900;
            boardField.asset.valueMortgage = 80;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[15], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[15];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[16], this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.color = theme.boardFieldColor[16];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
            boardField.asset.priceRentHotel = 950;
            boardField.asset.valueMortgage = 90;
            this.fields.push(boardField);
            treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField(theme.boardFieldName[18], this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.color = theme.boardFieldColor[18];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
            boardField.asset.priceRentHotel = 950;
            boardField.asset.valueMortgage = 90;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[19], this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[19];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(16, 16, 32);
            boardField.asset.priceRentHouse.push(80, 220, 600, 800);
            boardField.asset.priceRentHotel = 1000;
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            var freeParkingField = new Model.BoardField(null);
            freeParkingField.index = this.fields.length;
            freeParkingField.type = Model.BoardFieldType.FreeParking;
            this.fields.push(freeParkingField);
            boardField = this.createAssetBoardField(theme.boardFieldName[21], this.fields.length, Model.AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.color = theme.boardFieldColor[21];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.valueMortgage = 110;
            this.fields.push(boardField);
            eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField(theme.boardFieldName[23], this.fields.length, Model.AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.color = theme.boardFieldColor[23];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.valueMortgage = 110;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[24], this.fields.length, Model.AssetGroup.Fifth);
            boardField.asset.price = 240;
            boardField.asset.color = theme.boardFieldColor[24];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(20, 20, 40);
            boardField.asset.priceRentHouse.push(100, 300, 750, 925);
            boardField.asset.priceRentHotel = 1100;
            boardField.asset.valueMortgage = 120;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[25], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[25];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[26], this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.color = theme.boardFieldColor[26];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.valueMortgage = 130;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[27], this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.color = theme.boardFieldColor[27];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.valueMortgage = 130;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[28], this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.color = theme.boardFieldColor[28];
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.valueMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[29], this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 280;
            boardField.asset.color = theme.boardFieldColor[29];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(24, 24, 48);
            boardField.asset.priceRentHouse.push(120, 360, 850, 1025);
            boardField.asset.priceRentHotel = 1200;
            boardField.asset.valueMortgage = 140;
            this.fields.push(boardField);
            var goToPrisonField = new Model.BoardField(null);
            goToPrisonField.index = this.fields.length;
            goToPrisonField.type = Model.BoardFieldType.GoToPrison;
            this.fields.push(goToPrisonField);
            boardField = this.createAssetBoardField(theme.boardFieldName[31], this.fields.length, Model.AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.color = theme.boardFieldColor[31];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.valueMortgage = 150;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[32], this.fields.length, Model.AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.color = theme.boardFieldColor[32];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.valueMortgage = 150;
            this.fields.push(boardField);
            treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField(theme.boardFieldName[34], this.fields.length, Model.AssetGroup.Seventh);
            boardField.asset.price = 320;
            boardField.asset.color = theme.boardFieldColor[34];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(28, 28, 56);
            boardField.asset.priceRentHouse.push(150, 450, 1000, 1200);
            boardField.asset.priceRentHotel = 1400;
            boardField.asset.valueMortgage = 160;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[35], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[35];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField(theme.boardFieldName[37], this.fields.length, Model.AssetGroup.Eighth);
            boardField.asset.price = 350;
            boardField.asset.color = theme.boardFieldColor[37];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(35, 70);
            boardField.asset.priceRentHouse.push(175, 500, 1100, 1300);
            boardField.asset.priceRentHotel = 1500;
            boardField.asset.valueMortgage = 175;
            this.fields.push(boardField);
            taxField = new Model.BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = Model.BoardFieldType.Tax;
            this.fields.push(taxField);
            boardField = this.createAssetBoardField(theme.boardFieldName[39], this.fields.length, Model.AssetGroup.Eighth);
            boardField.asset.price = 400;
            boardField.asset.color = theme.boardFieldColor[39];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(50, 100);
            boardField.asset.priceRentHouse.push(200, 600, 1400, 1700);
            boardField.asset.priceRentHotel = 2000;
            boardField.asset.valueMortgage = 200;
            this.fields.push(boardField);
        };
        Board.prototype.createAssetBoardField = function (assetName, boardFieldIndex, assetGroup) {
            var asset = new Model.Asset();
            asset.name = assetName;
            asset.group = assetGroup;
            var boardField = new Model.BoardField(asset);
            boardField.index = boardFieldIndex;
            return boardField;
        };
        return Board;
    }());
    Model.Board = Board;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (BoardFieldType) {
        BoardFieldType[BoardFieldType["Asset"] = 0] = "Asset";
        BoardFieldType[BoardFieldType["Start"] = 1] = "Start";
        BoardFieldType[BoardFieldType["Tax"] = 2] = "Tax";
        BoardFieldType[BoardFieldType["TaxIncome"] = 3] = "TaxIncome";
        BoardFieldType[BoardFieldType["Event"] = 4] = "Event";
        BoardFieldType[BoardFieldType["Treasure"] = 5] = "Treasure";
        BoardFieldType[BoardFieldType["PrisonAndVisit"] = 6] = "PrisonAndVisit";
        BoardFieldType[BoardFieldType["FreeParking"] = 7] = "FreeParking";
        BoardFieldType[BoardFieldType["GoToPrison"] = 8] = "GoToPrison";
    })(Model.BoardFieldType || (Model.BoardFieldType = {}));
    var BoardFieldType = Model.BoardFieldType;
    ;
    var BoardField = (function () {
        function BoardField(asset) {
            this.occupiedBy = new Array();
            if (asset) {
                this._asset = asset;
                this.type = BoardFieldType.Asset;
            }
        }
        Object.defineProperty(BoardField.prototype, "asset", {
            get: function () {
                return this._asset;
            },
            enumerable: true,
            configurable: true
        });
        BoardField.prototype.loadDataFrom = function (savedBoardField) {
            this.index = savedBoardField.index;
            this.occupiedBy = savedBoardField.occupiedBy ? savedBoardField.occupiedBy : new Array();
            this.type = savedBoardField.type;
        };
        return BoardField;
    }());
    Model.BoardField = BoardField;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (CardType) {
        CardType[CardType["PayMoney"] = 0] = "PayMoney";
        CardType[CardType["PayMoneyToPlayers"] = 1] = "PayMoneyToPlayers";
        CardType[CardType["ReceiveMoney"] = 2] = "ReceiveMoney";
        CardType[CardType["ReceiveMoneyFromPlayers"] = 3] = "ReceiveMoneyFromPlayers";
        CardType[CardType["AdvanceToField"] = 4] = "AdvanceToField";
        CardType[CardType["AdvanceToRailway"] = 5] = "AdvanceToRailway";
        CardType[CardType["RetractNumFields"] = 6] = "RetractNumFields";
        CardType[CardType["JumpToField"] = 7] = "JumpToField";
        CardType[CardType["Maintenance"] = 8] = "Maintenance";
        CardType[CardType["OwnMaintenance"] = 9] = "OwnMaintenance";
    })(Model.CardType || (Model.CardType = {}));
    var CardType = Model.CardType;
    ;
    var Card = (function () {
        function Card() {
        }
        return Card;
    }());
    Model.Card = Card;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var EventCard = (function (_super) {
        __extends(EventCard, _super);
        function EventCard() {
            _super.call(this);
        }
        return EventCard;
    }(Model.Card));
    Model.EventCard = EventCard;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var GameParams = (function () {
        function GameParams() {
            this._jailBail = 50;
            this._rules = new Model.Rules();
        }
        Object.defineProperty(GameParams.prototype, "jailBail", {
            get: function () {
                return this._jailBail;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameParams.prototype, "rules", {
            get: function () {
                return this._rules;
            },
            enumerable: true,
            configurable: true
        });
        GameParams.prototype.loadDataFrom = function (savedGameParams) {
            this._jailBail = savedGameParams._jailBail;
            this._rules.loadDataFrom(savedGameParams._rules);
        };
        return GameParams;
    }());
    Model.GameParams = GameParams;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (ProcessingEvent) {
        ProcessingEvent[ProcessingEvent["None"] = 0] = "None";
        ProcessingEvent[ProcessingEvent["PassGoAward"] = 1] = "PassGoAward";
    })(Model.ProcessingEvent || (Model.ProcessingEvent = {}));
    var ProcessingEvent = Model.ProcessingEvent;
    ;
    // context data associated with the current player move
    var MoveContext = (function () {
        function MoveContext() {
            this.reset();
        }
        MoveContext.prototype.reset = function () {
            this.skipGoAward = false;
            this.doubleRent = false;
            this.flyByEvents = [];
        };
        return MoveContext;
    }());
    Model.MoveContext = MoveContext;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Options = (function () {
        function Options() {
            this.tutorial = true;
            this.sound = false;
        }
        return Options;
    }());
    Model.Options = Options;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (PlayerColor) {
        PlayerColor[PlayerColor["Red"] = 0] = "Red";
        PlayerColor[PlayerColor["Blue"] = 1] = "Blue";
        PlayerColor[PlayerColor["Green"] = 2] = "Green";
        PlayerColor[PlayerColor["Yellow"] = 3] = "Yellow";
    })(Model.PlayerColor || (Model.PlayerColor = {}));
    var PlayerColor = Model.PlayerColor;
    ;
    var Player = (function () {
        function Player(name, human) {
            this.playerName = name;
            this.human = human;
        }
        Player.prototype.loadDataFrom = function (savedPlayer, board) {
            this.playerName = savedPlayer.playerName;
            this.human = savedPlayer.human;
            this.color = savedPlayer.color;
            this.money = savedPlayer.money;
            this.turnsInPrison = savedPlayer.turnsInPrison;
            this.active = savedPlayer.active;
            var playerPositionIndex = savedPlayer.position.index;
            this.position = board.fields.filter(function (f) { return f.index === playerPositionIndex; })[0];
        };
        return Player;
    }());
    Model.Player = Player;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var ProcessResult = (function () {
        function ProcessResult() {
        }
        return ProcessResult;
    }());
    Model.ProcessResult = ProcessResult;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Rules = (function () {
        function Rules() {
            this.passStartAward = 200;
            this.initialCash = 1500;
        }
        Rules.prototype.loadDataFrom = function (savedRules) {
            this.passStartAward = savedRules.passStartAward;
            this.initialCash = savedRules.initialCash;
        };
        return Rules;
    }());
    Model.Rules = Rules;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var TradeGroup = (function () {
        function TradeGroup() {
            this.assets = [];
        }
        return TradeGroup;
    }());
    Model.TradeGroup = TradeGroup;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var TradeState = (function () {
        function TradeState() {
            this.canMakeTradeOffer = false;
            this.canAcceptTradeOffer = false;
            this.firstPlayerSelectedAssets = [];
            this.secondPlayerSelectedAssets = [];
            this.firstPlayerMoney = 0;
            this.secondPlayerMoney = 0;
        }
        TradeState.prototype.initializeFrom = function (tradeState) {
            this.firstPlayer = tradeState.firstPlayer;
            this.secondPlayer = tradeState.secondPlayer;
            this.firstPlayerSelectedAssets = tradeState.firstPlayerSelectedAssets;
            this.secondPlayerSelectedAssets = tradeState.secondPlayerSelectedAssets;
            this.firstPlayerMoney = tradeState.firstPlayerMoney;
            this.secondPlayerMoney = tradeState.secondPlayerMoney;
            this.canMakeTradeOffer = tradeState.firstPlayerSelectedAssets.length > 0 || tradeState.secondPlayerSelectedAssets.length > 0;
        };
        return TradeState;
    }());
    Model.TradeState = TradeState;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var TreasureCard = (function (_super) {
        __extends(TreasureCard, _super);
        function TreasureCard() {
            _super.call(this);
        }
        return TreasureCard;
    }(Model.Card));
    Model.TreasureCard = TreasureCard;
})(Model || (Model = {}));
var Model;
(function (Model) {
    // defines data for a single tutorial stage (or step)
    var TutorialData = (function () {
        function TutorialData() {
        }
        return TutorialData;
    }());
    Model.TutorialData = TutorialData;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var MonopolyTheme = (function () {
        function MonopolyTheme() {
        }
        Object.defineProperty(MonopolyTheme.prototype, "boardFieldName", {
            get: function () {
                return MonopolyTheme.boardFields;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "boardFieldColor", {
            get: function () {
                return MonopolyTheme.boardFieldColors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "imagesFolder", {
            get: function () {
                return "images/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameboardImage", {
            get: function () {
                return "Gameboard-Model.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "backgroundImage", {
            get: function () {
                return "wood_texture.jpg";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "backgroundSize", {
            get: function () {
                return [20, 13.33];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameSetupImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameRulesImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gamePauseImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameOptionsImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameHelpImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameStatsImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "mainMenuImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "mainMenuTitleImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "railroadImage", {
            get: function () {
                return "railroad.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "utility1Image", {
            get: function () {
                return "lightbulb.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "utility2Image", {
            get: function () {
                return "faucet.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "skyboxFolder", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "meshFolder", {
            get: function () {
                return "meshes/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerMesh", {
            get: function () {
                return "character.babylon";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerSubmeshIndex", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerColoredSubmeshIndices", {
            get: function () {
                return [1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerMeshRotationQuaternion", {
            get: function () {
                return MonopolyTheme.playerMeshRotation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "moneySymbol", {
            get: function () {
                return "M";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "house", {
            get: function () {
                return "house";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "hotel", {
            get: function () {
                return "house";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "railroad", {
            get: function () {
                return "railway station";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "utility", {
            get: function () {
                return "Utility";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "utilities", {
            get: function () {
                return "Utilities";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "communityChestTitle", {
            get: function () {
                return "COMMUNITY CHEST";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "eventTitle", {
            get: function () {
                return "EVENT";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "prison", {
            get: function () {
                return "prison";
            },
            enumerable: true,
            configurable: true
        });
        MonopolyTheme.playerMeshRotation = [[0, 0, 0, 1], [0, 0.7071, 0, 0.7071], [0, 1, 0, 0], [0, 0.7071, 0, -0.7071]];
        MonopolyTheme.boardFields = ["Start", "Goriška Brda", "Community chest", "Slovenske Gorice", "Income tax", "Železniška postaja Jesenice",
            "Bogenšperk", "Chance", "Predjamski grad", "Otočec", "Prison", "Terme Čatež", "Javna razsvetljava", "Dolenjske toplice",
            "Moravske toplice", "Glavni kolodvor Ljubljana", "Športni park Stožice", "Community chest", "Planica", "Mariborsko Pohorje",
            "Free parking", "Trenta", "Chance", "Rakov Škocjan", "Logarska dolina", "Železniška postaja Zidani most", "Lipica",
            "Volčji potok", "Mestni vodovod", "Postojnska jama", "Go to prison", "Cerkniško jezero", "Bohinj", "Community chest",
            "Bled", "Železniški terminal Koper", "Chance", "Piran", "Tax", "Portorož"];
        MonopolyTheme.boardFieldColors = ["", "#723E00", "", "#723E00", "", "#FFFFFF", "#69EEF6", "", "#69EEF6", "#69EEF6",
            "", "#FD23BD", "#FFFFFF", "#FD23BD", "#FD23BD", "#FFFFFF", "#F39D37", "", "#F39D37", "#F39D37",
            "", "#E50E13", "", "#E50E13", "#E50E13", "#FFFFFF", "#F4F10B", "#F4F10B", "#FFFFFF", "#F4F10B",
            "", "#09C123", "#09C123", "", "#09C123", "#FFFFFF", "", "#2231F8", "", "#2231F8"
        ];
        return MonopolyTheme;
    }());
    Model.MonopolyTheme = MonopolyTheme;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var MoonopolyTheme = (function () {
        function MoonopolyTheme() {
        }
        Object.defineProperty(MoonopolyTheme.prototype, "boardFieldName", {
            get: function () {
                return MoonopolyTheme.boardFields;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "boardFieldColor", {
            get: function () {
                return MoonopolyTheme.boardFieldColors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "imagesFolder", {
            get: function () {
                return "images/Moonopoly/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameboardImage", {
            get: function () {
                return "Gameboard4.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "backgroundImage", {
            get: function () {
                return "pl_stars_milky_way.jpg";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "backgroundSize", {
            get: function () {
                return [25, 25];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameSetupImage", {
            get: function () {
                return "GameSetup.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameRulesImage", {
            get: function () {
                return "GameRules.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gamePauseImage", {
            get: function () {
                return "GamePause.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameOptionsImage", {
            get: function () {
                return "GameOptions.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameHelpImage", {
            get: function () {
                return "GameHelp.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameStatsImage", {
            get: function () {
                return "GameStats.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "mainMenuImage", {
            get: function () {
                return "MainMenu.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "mainMenuTitleImage", {
            get: function () {
                return "MainMenuTitle.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "railroadImage", {
            get: function () {
                return "ironmine.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "utility1Image", {
            get: function () {
                return "oil_rig_platform.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "utility2Image", {
            get: function () {
                return "oil_rig_platform.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "skyboxFolder", {
            get: function () {
                return "skybox3/skybox";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "meshFolder", {
            get: function () {
                return "meshes/Moonopoly/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerMesh", {
            get: function () {
                return "rocket2.babylon";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerSubmeshIndex", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerColoredSubmeshIndices", {
            get: function () {
                return [4, 5, 6, 9];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerMeshRotationQuaternion", {
            get: function () {
                return MoonopolyTheme.playerMeshRotation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "moneySymbol", {
            get: function () {
                return "⌀";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "house", {
            get: function () {
                return "habitat";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "hotel", {
            get: function () {
                return "settlement dome";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "railroad", {
            get: function () {
                return "iron mine";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "utility", {
            get: function () {
                return "Oil Rig";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "utilities", {
            get: function () {
                return "Oil Rigs";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "communityChestTitle", {
            get: function () {
                return "SPACE DEBRIS";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "eventTitle", {
            get: function () {
                return "DUST CLOUD";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "prison", {
            get: function () {
                return "quarantine";
            },
            enumerable: true,
            configurable: true
        });
        MoonopolyTheme.playerMeshRotation = [
            [0, 0, -0.7071, -0.7071],
            [-0.5, -0.5, -0.5, -0.5],
            [0.7071, 0.7071, 0, 0],
            [0.5, 0.5, -0.5, -0.5]
        ];
        MoonopolyTheme.boardFields = ["Start", "Rima Bradley", "Space debris", "Rima Hadley", "Lunar ecology tax", "Montes Alpes iron mines",
            "Mons Huygens", "Dust cloud", "Mons Hadley", "Mons Penck", "Quarantine", "Vallis Bohr", "Southern sea oil rig", "Vallis Planck",
            "Vallis Alpes", "Montes Cordillera iron mines", "Altai Cliff", "Space debris", "Kelvin Cliff", "Mercator Cliff",
            "Free docking", "Terra Sanitatis", "Dust cloud", "Terra Vigoris", "Terra Vitae", "Montes Carpatus iron mines", "Mare Anguis",
            "Mare Vaporum", "Eastern sea oil rig", "Mare Imbrium", "Go to quarantine", "Mare Nubium", "Mare Serenitatis", "Space debris",
            "Oceanus Procellarum", "Montes Taurus iron mines", "Dust cloud", "Apollo crater", "Lunar energy tax", "Aitken basin"];
        MoonopolyTheme.boardFieldColors = ["", "#69EEF6", "", "#69EEF6", "", "#FFFFFF", "#723E00", "", "#723E00", "#723E00",
            "", "#FD23BD", "#FFFFFF", "#FD23BD", "#FD23BD", "#FFFFFF", "#F39D37", "", "#F39D37", "#F39D37",
            "", "#09C123", "", "#09C123", "#09C123", "#FFFFFF", "#F4F10B", "#F4F10B", "#FFFFFF", "#F4F10B",
            "", "#2231F8", "#2231F8", "", "#2231F8", "#FFFFFF", "", "#E50E13", "", "#E50E13"
        ];
        return MoonopolyTheme;
    }());
    Model.MoonopolyTheme = MoonopolyTheme;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (Themes) {
        Themes[Themes["Monopoly"] = 0] = "Monopoly";
        Themes[Themes["Moonopoly"] = 1] = "Moonopoly";
    })(Model.Themes || (Model.Themes = {}));
    var Themes = Model.Themes;
    ;
})(Model || (Model = {}));
//# sourceMappingURL=appBundle.js.map