/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
module MonopolyApp.controllers {
    export class RulesController {

        stateService: angular.ui.IStateService;
        stateParamsService: angular.ui.IStateParamsService;
        settingsService: Interfaces.ISettingsService;
        scope: angular.IScope;
        timeoutService: angular.ITimeoutService;
        themeService: Interfaces.IThemeService;
        public inGame: boolean; // whether the game rules are opened from within a running game
        static $inject = ["$state", "$stateParams", "$scope", "$timeout", "settingsService", "themeService"];

        constructor(stateService: angular.ui.IStateService, stateParamsService: angular.ui.IStateParamsService, scope: angular.IScope, timeoutService: angular.ITimeoutService, settingsService: Interfaces.ISettingsService, themeService: Interfaces.IThemeService) {
            this.stateService = stateService;
            this.stateParamsService = stateParamsService;
            this.scope = scope;
            this.timeoutService = timeoutService;
            this.settingsService = settingsService;
            this.themeService = themeService;
            this.loadSettings();
            var spService: any = this.stateParamsService;
            this.inGame = eval(spService.inGame);
            if (this.settings.rules) {
                this.setInitialCash(this.settings.rules.initialCash);
                this.setPassStartAward(this.settings.rules.passStartAward);
            }
            $('[id|="initialCash"]').click((e) => {
                this.onButtonClick(e);
            });
            $('[id|="passStart"]').click((e) => {
                this.onButtonClick(e);
            });
        }
        settings: Model.Settings;

        public goBack() {
            if (this.inGame) {
                this.stateService.go("pause");
            } else {
                this.saveSettings();
                this.stateService.go("settings");
            }
        }

        private setInitialCash(cash: number) {
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
        }

        private setPassStartAward(award: number) {
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
        }

        private loadSettings() {
            this.settings = this.settingsService.loadSettings();
        }

        private saveSettings() {
            this.settingsService.saveSettings(this.settings);
        }

        private onButtonClick(jQueryEventObject: JQueryEventObject) {
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
        }
    }

    monopolyApp.controller("rulesCtrl", RulesController);
} 