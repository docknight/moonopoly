/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
module MonopolyApp.controllers {
    export class OptionsController {

        stateService: angular.ui.IStateService;
        stateParamsService: angular.ui.IStateParamsService;
        settingsService: Interfaces.ISettingsService;
        scope: angular.IScope;
        timeoutService: angular.ITimeoutService;
        themeService: Interfaces.IThemeService;
        static $inject = ["$state", "$stateParams", "$scope", "$timeout", "settingsService", "themeService"];

        constructor(stateService: angular.ui.IStateService, stateParamsService: angular.ui.IStateParamsService, scope: angular.IScope, timeoutService: angular.ITimeoutService, settingsService: Interfaces.ISettingsService, themeService: Interfaces.IThemeService) {
            this.stateService = stateService;
            this.stateParamsService = stateParamsService;
            this.scope = scope;
            this.timeoutService = timeoutService;
            this.settingsService = settingsService;
            this.themeService = themeService;
            $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gameOptionsImage);
            this.loadOptions();
            this.timeoutService(() => {
                var toggles: any = $('[id|="optiontoggle"]');
                toggles.bootstrapToggle({
                    on: "On",
                    off: "Off"
                });
                var that = this;
                toggles.on("change", (event) => {
                    var toggle: any = $(event.currentTarget);
                    that.scope.$apply(() => {
                        var option = toggle.prop("id").split("-")[1];
                        that.options[option] = toggle.prop("checked") === true;
                    });
                });
            }, 1);
        }
        options: Model.Options;

        public goBack() {
            this.saveOptions();
            this.stateService.go("mainmenu");
        }

        private loadOptions() {
            this.options = this.settingsService.loadOptions();
        }

        private saveOptions() {
            this.settingsService.saveOptions(this.options);
        }
    }

    monopolyApp.controller("optionsCtrl", OptionsController);
} 