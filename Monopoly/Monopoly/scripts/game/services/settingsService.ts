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
            //For the purpose of this demo I am returning the hard coded values, however in real world application
            //You would probably use "this.httpService.get" method to call backend REST apis to fetch the data from server.
            var settings: Model.Settings = new Model.Settings();
            settings.numPlayers = 2;
            settings.playerName = "Player 1";
            return settings;
        }

        saveSettings(settings: Model.Settings) {
            
        }
    }

    monopolyApp.service("settingsService", SettingsService);    
} 