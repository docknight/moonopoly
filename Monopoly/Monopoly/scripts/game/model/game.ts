module Model {
    export enum GameState {
        BeginTurn, // beginning of player's turn
        ThrowDice, // player is throwing the dice
        Move, // the move to the next board field is being made
        Process
    };

    export class Game {
        private _currentPlayer: string; // name of the current player
        private _board: Board;

        players: Array<Player>;

        state: GameState;

        get currentPlayer(): string {
            return this._currentPlayer;
        }

        get board(): Board {
            return this._board;
        }

        constructor() {
            this._currentPlayer = "";
            this.players = new Array<Player>();
            this._board = new Board();
            this.state = GameState.BeginTurn;
        }

        advanceToNextPlayer() {
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