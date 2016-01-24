module Model {
    export enum GameState {
        BeginTurn, // beginning of player's turn
        ThrowDice, // player is throwing the dice
        Move, // the move to the next board field is being made
        Process, // destination field processing
        Manage // the game is paused and the player is managing his assets
    };

    export class Game {
        private _currentPlayer: string; // name of the current player
        private _board: Board;
        private _treasureCards: Array<TreasureCard>;
        private _eventCards: Array<EventCard>;
        private previousState: GameState;
        private state: GameState;
        private _moveContext: MoveContext;

        players: Array<Player>;


        get currentPlayer(): string {
            return this._currentPlayer;
        }

        get treasureCards(): Array<TreasureCard> {
            return this._treasureCards;
        }

        get eventCards(): Array<EventCard> {
            return this._eventCards;
        }

        get board(): Board {
            return this._board;
        }

        get moveContext(): MoveContext {
            return this._moveContext;
        }

        constructor() {
            this._currentPlayer = "";
            this.players = new Array<Player>();
            this._board = new Board();
            this._treasureCards = new Array<TreasureCard>();
            this._eventCards = new Array<EventCard>();
            this._moveContext = new MoveContext();
            this.state = GameState.BeginTurn;
        }

        getState(): GameState {
            return this.state;
        }

        setState(state: GameState) {
            this.previousState = this.state;
            this.state = state;
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

        setPreviousState() {
            if (this.previousState !== undefined) {
                this.state = this.previousState;
                this.previousState = undefined;
            }
        }
    }
} 