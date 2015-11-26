/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
module MonopolyApp.controllers {
    export class MainMenuController {

        stateService: angular.ui.IStateService;
        static $inject = ["$state"];
        constructor(stateService: angular.ui.IStateService) {

            this.stateService = stateService;
            this.title = "POZDRAVLJEN";
        }
        title: string;

        startNewGame = () => {
            this.stateService.go("newgame");
        }

        settings() {
            this.stateService.go("settings");
        }
    }

    monopolyApp.controller("mainMenuCtrl", MainMenuController);
} 