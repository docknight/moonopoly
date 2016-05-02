/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
module MonopolyApp.controllers {
    export class MainMenuController {

        stateService: angular.ui.IStateService;
        themeService: Interfaces.IThemeService;
        static $inject = ["$state", "themeService"];
        constructor(stateService: angular.ui.IStateService, themeService: Interfaces.IThemeService) {
            this.themeService = themeService;
            this.stateService = stateService;
            this.title = "Knight MONOPOLY";
            this.chooseGameInitialization = false;
        }
        title: string;
        chooseGameInitialization: boolean;

        get canLoadGame(): boolean {
            var localStorageAny: any = localStorage;
            return localStorage.length > 0 && localStorageAny[Model.Game.version];
        }

        startNewGame = () => {
            this.stateService.go("settings");
        }

        public settings() {
            if (this.canLoadGame) {
                this.chooseGameInitialization = true;
                $("#buttonContainer").css("width", "340px");
            } else {
                this.startNewGame();
            }
        }

        public loadGame() {
            this.stateService.go("newgame", { loadGame: true });
        }

        public goBack() {
            this.chooseGameInitialization = false;
            $("#buttonContainer").css("width", "575px");
        }
    }

    monopolyApp.controller("mainMenuCtrl", MainMenuController);
} 