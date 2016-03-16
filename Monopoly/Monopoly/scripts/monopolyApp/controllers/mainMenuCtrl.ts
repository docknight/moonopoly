/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
module MonopolyApp.controllers {
    export class MainMenuController {

        stateService: angular.ui.IStateService;
        static $inject = ["$state"];
        constructor(stateService: angular.ui.IStateService) {

            this.stateService = stateService;
            this.title = "Knight MONOPOLY";
        }
        title: string;

        get canLoadGame(): boolean {
            var localStorageAny: any = localStorage;
            return localStorage.length > 0 && localStorageAny.game;
        }

        startNewGame = () => {
            this.stateService.go("newgame", { loadGame: false });
        }

        public settings() {
            this.stateService.go("settings");
        }

        public loadGame() {
            this.stateService.go("newgame", { loadGame: true });
        }
    }

    monopolyApp.controller("mainMenuCtrl", MainMenuController);
} 