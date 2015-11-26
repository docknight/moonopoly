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
        }

        initGame() {
            this.gameService.initGame();
        }
    }

    monopolyApp.controller("gameCtrl", GameController);
} 