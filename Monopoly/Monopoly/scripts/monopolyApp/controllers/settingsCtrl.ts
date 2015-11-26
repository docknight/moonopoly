/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
module MonopolyApp.controllers {
    export class SettingsController {

        stateService: angular.ui.IStateService;
        settingsService: Interfaces.ISettingsService;
        static $inject = ["$state", "settingsService"];

        constructor(stateService: angular.ui.IStateService, settingsService: Interfaces.ISettingsService) {
            this.stateService = stateService;
            this.settingsService = settingsService;
            this.loadSettings();            
        }
        settings: Model.Settings;

        saveAndClose() {
            this.saveSettings();
            this.stateService.go("mainmenu");
        }

        private loadSettings() {
            this.settings = new Model.Settings();
            this.settings.playerName = "Noname";
            this.settings.numPlayers = 2;
            this.settings = this.settingsService.loadSettings();
        }

        private saveSettings() {
            this.settingsService.saveSettings(this.settings);
        }
    }

    monopolyApp.controller("settingsCtrl", SettingsController);
} 