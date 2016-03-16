module Model {
    export enum GameState {
        BeginTurn, // beginning of player's turn
        ThrowDice, // player is throwing the dice
        Move, // the move to the next board field is being made
        Process, // destination field processing
        ProcessingDone, // destination field has been processed
        Manage, // the game is paused and the player is managing his assets
        EndOfGame // the game has ended and we have a winner
    };

    export class Game {
        private _currentPlayer: string; // name of the current player
        private _board: Board;
        private _treasureCards: Array<TreasureCard>;
        private _eventCards: Array<EventCard>;
        private previousState: GameState;
        private state: GameState;
        private _moveContext: MoveContext;
        private _gameParams: GameParams;

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

        get gameParams(): GameParams {
            return this._gameParams;
        }

        constructor() {
            this._currentPlayer = "";
            this.players = new Array<Player>();
            this._board = new Board();
            this._treasureCards = new Array<TreasureCard>();
            this._eventCards = new Array<EventCard>();
            this._moveContext = new MoveContext();
            this.state = GameState.BeginTurn;
            this._gameParams = new GameParams();
        }

        getState(): GameState {
            return this.state;
        }

        setState(state: GameState) {
            this.previousState = this.state;
            this.state = state;
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

        public setPreviousState() {
            if (this.previousState !== undefined) {
                this.state = this.previousState;
                this.previousState = undefined;
            }
        }

        public loadDataFrom(savedGame: Game) {
            this._currentPlayer = savedGame._currentPlayer;
            this._board = new Board();
            this._board.loadDataFrom(savedGame._board);
            this._treasureCards = savedGame._treasureCards;
            this._eventCards = savedGame._eventCards;
            this.previousState = savedGame.previousState;
            this.state = savedGame.state;
            this._moveContext = new MoveContext();
            this._moveContext.skipGoAward = savedGame._moveContext.skipGoAward;
            this._moveContext.doubleRent = savedGame._moveContext.doubleRent;
            this._moveContext.flyByEvents = savedGame._moveContext.flyByEvents;
            this._gameParams = new GameParams();
            this._gameParams.loadDataFrom(savedGame._gameParams);
            this.players = [];
            savedGame.players.forEach(savedPlayer => {
                var player = new Player();
                player.loadDataFrom(savedPlayer);
                this.players.push(player);
            });
        }
    }
} 