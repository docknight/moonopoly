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
        settingsService: Interfaces.ISettingsService;
        static $inject = ["$state", "$stateParams", "$scope", "$timeout", "themeService", "settingsService"];

        constructor(stateService: angular.ui.IStateService, stateParamsService: angular.ui.IStateParamsService, scope: angular.IScope, timeoutService: angular.ITimeoutService, themeService: Interfaces.IThemeService, settingsService: Interfaces.ISettingsService) {
            this.stateService = stateService;
            this.stateParamsService = stateParamsService;
            this.scope = scope;
            this.timeoutService = timeoutService;
            this.themeService = themeService;
            this.settingsService = settingsService;
            $(".background").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.gamePauseImage);
            var that = this;
            this.timeoutService(() => {
                that.initAudio();
                that.playMusic();
            });
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

        private initAudio() {
            var that = this;
            $(".backgroundMusic").off("ended");
            $(".backgroundMusic").on("ended", e => {
                var next = $(e.currentTarget).nextAll(".backgroundMusic.stopped");
                if (next.length === 0) {
                    next = $(".backgroundMusic.stopped").first();
                } else {
                    next = next.first();
                }
                $(e.currentTarget).removeClass("playing").addClass("stopped");
                next.removeClass("stopped").addClass("playing");
                that.playMusic();
            });
        }

        private playMusic() {
            if (this.settingsService.options.music) {
                var musicToPlay = $(".backgroundMusic.playing");
                if (musicToPlay.length === 0) {
                    musicToPlay = $(".backgroundMusic");
                }
                musicToPlay = musicToPlay.first();
                musicToPlay.removeClass("stopped").addClass("playing");
                var musicElementToPlay: any = musicToPlay[0];
                musicElementToPlay.play();
            }
        }
    }

    monopolyApp.controller("pauseCtrl", PauseController);
} 