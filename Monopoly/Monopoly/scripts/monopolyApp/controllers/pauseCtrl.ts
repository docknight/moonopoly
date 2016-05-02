/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
module MonopolyApp.controllers {
    export class PauseController {

        stateService: angular.ui.IStateService;
        stateParamsService: angular.ui.IStateParamsService;
        scope: angular.IScope;
        timeoutService: angular.ITimeoutService;
        themeService: Interfaces.IThemeService;
        static $inject = ["$state", "$stateParams", "$scope", "$timeout", "themeService"];

        constructor(stateService: angular.ui.IStateService, stateParamsService: angular.ui.IStateParamsService, scope: angular.IScope, timeoutService: angular.ITimeoutService, themeService: Interfaces.IThemeService) {
            this.stateService = stateService;
            this.stateParamsService = stateParamsService;
            this.scope = scope;
            this.timeoutService = timeoutService;
            this.themeService = themeService;
        }

        public goBack() {
            this.stateService.go("newgame", { loadGame: true });
        }

        public goToGameRules() {
            this.stateService.go("rules", { inGame: true });
        }

        public saveAndExit() {
            this.stateService.go("mainmenu");
        }
    }

    monopolyApp.controller("pauseCtrl", PauseController);
} 