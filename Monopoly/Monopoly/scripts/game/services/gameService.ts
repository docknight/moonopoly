/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
module Services {
    export class GameService implements Interfaces.IGameService {
        httpService: ng.IHttpService;
        settingsService: Interfaces.ISettingsService;

        private game: Model.Game;

        static $inject = ["$http", "settingsService"];
        constructor($http: ng.IHttpService, settingsService: Interfaces.ISettingsService) {
            this.httpService = $http;
            this.settingsService = settingsService;
        }

        initGame() {
            this.game = new Model.Game();
            this.initPlayers();
            this.game.advanceToNextPlayer();
        }

        endTurn() {
            this.game.advanceToNextPlayer();
        }

        getCurrentPlayer(): string {
            return this.game.currentPlayer;
        }

        private initPlayers() {
            var settings = this.settingsService.loadSettings();
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player();
                player.playerName = i === 0 ? settings.playerName : "Computer " + i;
                player.human = i === 0;
                this.game.players.push(player);
            }
        }
    }

    monopolyApp.service("gameService", GameService);
} 