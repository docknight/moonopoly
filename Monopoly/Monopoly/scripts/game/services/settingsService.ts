/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
module Services {
    export class SettingsService implements Interfaces.ISettingsService {
        httpService: ng.IHttpService;
        static $inject = ["$http"];
        private _settings: Model.Settings;
        private _options: Model.Options;
        constructor($http: ng.IHttpService) {
            this.httpService = $http;
        }

        get settings(): Model.Settings {
            if (!this._settings) {
                this.loadSettings();
            }
            return this._settings;
        }

        get options(): Model.Options {
            if (!this._options) {
                this.loadOptions();
            }
            return this._options;
        }

        loadSettings = () => {
            var settings: Model.Settings = new Model.Settings();
            var localStorageAny: any = localStorage;
            if (localStorage.getItem("settings_v1_01")) {
                var savedSettings: Model.Settings = JSON.parse(localStorageAny.settings_v1_01);
                settings.numPlayers = savedSettings.numPlayers;
                settings.players = savedSettings.players;
                if (savedSettings.rules) {
                    settings.rules = savedSettings.rules;
                }
            }
            this._settings = settings;
            return settings;
        }

        saveSettings(settings: Model.Settings) {
            var localStorageAny: any = localStorage;
            localStorageAny.settings_v1_01 = JSON.stringify(settings);
        }

        loadOptions = () => {
            var options: Model.Options = new Model.Options();
            var localStorageAny: any = localStorage;
            var savedOptions: Model.Options;
            if (localStorage.getItem("options_v0_02")) {
                savedOptions = JSON.parse(localStorageAny.options_v0_02);
                options.tutorial = savedOptions.tutorial;
                options.sound = savedOptions.sound;
                options.music = savedOptions.music;
                options.staticCamera = savedOptions.staticCamera;
                options.shadows = savedOptions.shadows;
            } else if (localStorage.getItem("options_v0_01")) {
                savedOptions = JSON.parse(localStorageAny.options_v0_01);
                options.tutorial = savedOptions.tutorial;
                options.sound = savedOptions.sound;
                options.music = savedOptions.music;
                options.staticCamera = false;
                options.shadows = false;
            } else {
                options.tutorial = true;
                options.sound = false;
                options.music = true;
                options.staticCamera = false;
                options.shadows = false;
            }
            this._options = options;
            return options;
        }

        saveOptions(options: Model.Options) {
            var localStorageAny: any = localStorage;
            localStorageAny.options_v0_02 = JSON.stringify(options);
        }
    }

    monopolyApp.service("settingsService", SettingsService);    
} 