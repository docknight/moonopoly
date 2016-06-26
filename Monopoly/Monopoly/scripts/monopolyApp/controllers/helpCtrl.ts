/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
module MonopolyApp.controllers {
    export class HelpController {

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
            $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gameHelpImage);
        }

        public goBack() {
            this.stateService.go("mainmenu");
        }
    }

    monopolyApp.controller("helpCtrl", HelpController);
} 