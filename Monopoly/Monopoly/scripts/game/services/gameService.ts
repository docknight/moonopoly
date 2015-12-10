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
            this.game.state = Model.GameState.BeginTurn;
        }

        getCurrentPlayer(): string {
            return this.game.currentPlayer;
        }

        get players(): Array<Model.Player> {
            return this.game.players;
        }

        setPlayerPosition(player: Model.Player, boardFieldIndex: number) {
            player.position = this.game.board.fields[boardFieldIndex];
            var previousFields = this.game.board.fields.filter(b => b.occupiedBy != null && b.occupiedBy.filter(ocb => ocb == player.playerName).length > 0);
            if (previousFields && previousFields.length > 0) {
                var previousField = previousFields[0];
                previousField.occupiedBy.splice(previousField.occupiedBy.indexOf(player.playerName));
            }

            player.position.occupiedBy.push(player.playerName);
        }

        private initPlayers() {
            var settings = this.settingsService.loadSettings();
            var colors: string[] = ["Red", "Green", "Yellow", "Blue"];
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player();
                player.playerName = i === 0 ? settings.playerName : "Computer " + i;
                player.human = i === 0;
                player.money = 1500;
                player.color = colors[i];
                this.game.players.push(player);
                this.setPlayerPosition(player, 0);
            }
        }        
    }

    monopolyApp.service("gameService", GameService);
} 