/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
module MonopolyApp.controllers {
    export class SettingsController {

        stateService: angular.ui.IStateService;
        settingsService: Interfaces.ISettingsService;
        scope: angular.IScope;
        timeoutService: angular.ITimeoutService;
        themeService: Interfaces.IThemeService;
        static $inject = ["$state", "$scope", "$timeout", "settingsService", "themeService"];

        constructor(stateService: angular.ui.IStateService, scope: angular.IScope, timeoutService: angular.ITimeoutService, settingsService: Interfaces.ISettingsService, themeService: Interfaces.IThemeService) {
            this.stateService = stateService;
            this.scope = scope;
            this.timeoutService = timeoutService;
            this.settingsService = settingsService;
            this.themeService = themeService;
            this.loadSettings();
            var that = this;     
            $("#numPlayersSlider").slider({
                value: this.settings.numPlayers,
                min: 2,
                max: 4,
                step: 1,
                slide(event, ui) {
                    $("#numPlayers").val(ui.value);
                    that.adjustNumPlayers(ui.value);
                }
            });
            that.timeoutService(() => {
                var playerTypeToggle: any = $('[id|="playerType"]');
                playerTypeToggle.bootstrapToggle({
                    on: "Human",
                    off: "Computer"
                });
                playerTypeToggle.on("change", (event) => {
                    var toggle: any = $(event.currentTarget);
                    that.scope.$apply(() => {
                        var i: number = parseInt(toggle.attr("id").substr(11));
                        that.settings.players[i].human = toggle.prop("checked") === true;
                        that.reassignComputerNames();
                    });
                });
            }, 1);

        }
        settings: Model.Settings;

        public saveAndClose() {
            this.saveSettings();
            this.stateService.go("newgame", { loadGame: false });
        }

        public goToGameRules() {
            this.stateService.go("rules", { inGame: false});            
        }

        public goBack() {
            this.stateService.go("mainmenu");
        }

        private loadSettings() {
            this.settings = this.settingsService.loadSettings();
        }

        private saveSettings() {
            this.settingsService.saveSettings(this.settings);
        }

        private adjustNumPlayers(numPlayers: number) {
            var that = this;
            this.scope.$apply(() => {
                while (numPlayers < that.settings.numPlayers) {
                    var playerTypeToggle: any = $("#playerType-" + (that.settings.players.length - 1));
                    playerTypeToggle.off();
                    playerTypeToggle.bootstrapToggle('destroy');
                    that.settings.players.pop();
                    that.settings.numPlayers--;
                }
                while (numPlayers > that.settings.numPlayers) {
                    var numComputers = that.settings.players.filter(p => !p.human).length;
                    that.settings.players.push(new Model.Player("Computer " + (numComputers + 1), false));
                    that.settings.numPlayers++;
                    that.reassignComputerNames();
                    that.timeoutService(() => {
                        var playerTypeToggle: any = $("#playerType-" + (that.settings.players.length - 1));
                        playerTypeToggle.bootstrapToggle({
                            on: "Human",
                            off: "Computer"
                        });
                        playerTypeToggle.on("change", () => {                            
                            that.scope.$apply(() => {
                                var i: number = parseInt(playerTypeToggle.attr("id").substr(11));
                                that.settings.players[i].human = playerTypeToggle.prop("checked") === true;
                                that.reassignComputerNames();
                            });
                        });
                    }, 1);
                }
            });
        }

        private reassignComputerNames() {
            var i = 1;
            this.settings.players.forEach(p => {
                if (!p.human) {
                    p.playerName = "Computer " + i;
                    i++;
                }                
            });
        }
    }

    monopolyApp.controller("settingsCtrl", SettingsController);
} 