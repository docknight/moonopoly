module Model {
    export class Game {
        private _currentPlayer: string; // name of the current player

        players: Array<Player>;

        get currentPlayer(): string {
            return this._currentPlayer;
        }

        constructor() {
            this._currentPlayer = "";
            this.players = new Array<Player>();
        }

        public advanceToNextPlayer() {
            if (this._currentPlayer === "") {
                if (this.players.length > 0) {
                    this._currentPlayer = this.players[0].playerName;
                }

                return;
            }

            var currentPlayerIndex = this.players.indexOf(this.players.filter((p) => p.playerName === this.currentPlayer)[0]);
            if (currentPlayerIndex < this.players.length - 1) {
                this._currentPlayer = this.players[currentPlayerIndex + 1].playerName;
            } else {
                this._currentPlayer = this.players[0].playerName;
            }
        }
    }
} 