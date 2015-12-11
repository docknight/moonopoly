/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
module Services {

    export class GameService implements Interfaces.IGameService {
        httpService: ng.IHttpService;
        settingsService: Interfaces.ISettingsService;

        private game: Model.Game;
        private lastDiceResult1: number;
        private lastDiceResult2: number;

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
            if (this.canEndTurn) {
                this.game.advanceToNextPlayer();
                this.game.state = Model.GameState.BeginTurn;
            }
        }

        getCurrentPlayer(): string {
            return this.game.currentPlayer;
        }

        get players(): Array<Model.Player> {
            return this.game.players;
        }

        get canThrowDice() {
            if (this.game.state === Model.GameState.BeginTurn) {
                return true;
            }
            return false;
        }

        get canEndTurn() {
            if (this.game.state !== Model.GameState.BeginTurn) {
                return true;
            }
            return false;
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

        throwDice() {
            this.game.state = Model.GameState.ThrowDice;
            this.lastDiceResult1 = 3;
            this.lastDiceResult2 = 2;
        }

        getCurrentPlayerPosition(): Model.BoardField {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            return player.position;
        }

        moveCurrentPlayer(): Model.BoardField {
            this.game.state = Model.GameState.Move;
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            var currentPositionIndex = player.position.index;
            var newPositionIndex = currentPositionIndex + Math.floor((this.lastDiceResult1 + this.lastDiceResult2) % 40);
            player.position = this.game.board.fields[newPositionIndex];
            this.game.board.fields[currentPositionIndex].occupiedBy.splice(this.game.board.fields[currentPositionIndex].occupiedBy.indexOf(player.playerName), 1);
            player.position.occupiedBy.push(player.playerName);
            return player.position;
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