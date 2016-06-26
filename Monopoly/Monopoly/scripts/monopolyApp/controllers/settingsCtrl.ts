/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
module MonopolyApp.controllers {
    declare var sweetAlert: any;
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
            $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gameSetupImage);
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
                        if (that.settings.players[i].human) {
                            that.settings.players[i].playerName = "";
                        }
                        that.reassignComputerNames();
                    });
                });
            }, 1);

        }
        settings: Model.Settings;

        public saveAndClose() {
            if (this.checkData()) {
                this.saveSettings();
                this.stateService.go("newgame", { loadGame: false });
            }
        }

        public goToGameRules() {
            this.saveSettings();
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
                    that.timeoutService((i) => {
                        var playerTypeToggle: any = $("#playerType-" + i);
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
                    }, 1, false, that.settings.numPlayers - 1);
                }
            });
        }

        private reassignComputerNames() {
            var computerNames = ["Apollo", "Gemini", "Voshkod", "Altair"];
            var i = 0;
            this.settings.players.forEach(p => {
                if (!p.human) {
                    p.playerName = computerNames[i];
                    i++;
                }                
            });
        }

        private checkData(): boolean {
            var unique = true;
            var empty = false;
            var that = this;
            this.settings.players.forEach(p => {
                if (that.settings.players.filter(p2 => p.playerName === p2.playerName).length >= 2) {
                    unique = false;
                }
                if (!p.playerName || p.playerName.length === 0) {
                    empty = true;
                }
            });
            if (!unique) {
                sweetAlert({
                    title: "Data entry error",
                    text: "Please enter unique player names.",
                    type: "error",
                    confirmButtonText: "Ok",
                    allowOutsideClick: true
                });
            } else {
                if (empty) {
                    sweetAlert({
                        title: "Data entry error",
                        text: "Please enter missing player names.",
                        type: "error",
                        confirmButtonText: "Ok",
                        allowOutsideClick: true
                    });                    
                }
            }
            return unique && !empty;
        }
    }

    monopolyApp.controller("settingsCtrl", SettingsController);
} 