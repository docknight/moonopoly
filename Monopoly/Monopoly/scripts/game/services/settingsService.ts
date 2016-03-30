/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
module Services {
    export class SettingsService implements Interfaces.ISettingsService {
        httpService: ng.IHttpService;
        static $inject = ["$http"];
        constructor($http: ng.IHttpService) {
            this.httpService = $http;
        }

        loadSettings = () => {
            var settings: Model.Settings = new Model.Settings();
            var localStorageAny: any = localStorage;
            if (localStorage.getItem("settings_v1_0")) {
                var savedSettings: Model.Settings = JSON.parse(localStorageAny.settings_v1_0);
                settings.numPlayers = savedSettings.numPlayers;
                settings.playerName = savedSettings.playerName;
            } else {
                settings.playerName = "Player 1";
            }
            return settings;
        }

        saveSettings(settings: Model.Settings) {
            var localStorageAny: any = localStorage;
            localStorageAny.settings_v1_0 = JSON.stringify(settings);
        }
    }

    monopolyApp.service("settingsService", SettingsService);    
} 