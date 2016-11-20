module Model {
    export enum GameState {
        BeginTurn, // beginning of player's turn
        ThrowDice, // player is throwing the dice
        Move, // the move to the next board field is being made
        Process, // destination field processing
        ProcessingDone, // destination field has been processed
        Manage, // the game is paused and the player is managing his assets
        EndOfGame, // the game has ended and we have a winner
        Trade // the game is paused and the player has initiated a trade
    };

    export class Game {
        public static version = "game_v0_01";
        private _currentPlayer: string; // name of the current player
        private _board: Board;
        private _treasureCards: Array<TreasureCard>;
        private _eventCards: Array<EventCard>;
        private previousState: GameState;
        private state: GameState;
        private _moveContext: MoveContext;
        private _gameParams: GameParams;

        players: Array<Player>;
        currentTreasureCardIndex: number;
        currentEventCardIndex: number;

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

        constructor(theme: Interfaces.ITheme) {
            this._currentPlayer = "";
            this.players = new Array<Player>();
            this._board = new Board(theme);
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
            var isActive: boolean;
            if (this._currentPlayer === "") {
                if (this.players.length > 0) {
                    this._currentPlayer = this.players[0].playerName;
                    if (!this.players[0].active) {
                        this.advanceToNextPlayer();
                    }
                }
                return;
            }

            var currentPlayerIndex = this.players.indexOf(this.players.filter((p) => p.playerName === this.currentPlayer)[0]);
            if (currentPlayerIndex < this.players.length - 1) {
                this._currentPlayer = this.players[currentPlayerIndex + 1].playerName;
                isActive = this.players[currentPlayerIndex + 1].active;
            } else {
                this._currentPlayer = this.players[0].playerName;
                isActive = this.players[0].active;
            }
            if (!isActive) {
                var anyActive = this.players.filter(p => p.active).length > 0;
                if (anyActive) {
                    this.advanceToNextPlayer();                    
                }
            }
        }

        public setPreviousState() {
            if (this.previousState !== undefined) {
                this.state = this.previousState;
                this.previousState = undefined;
            }
        }

        public loadDataFrom(savedGame: Game, theme: Interfaces.ITheme) {
            this._currentPlayer = savedGame._currentPlayer;
            this._board = new Board(theme);
            this._board.loadDataFrom(savedGame._board);
            this._treasureCards = savedGame._treasureCards;
            this._eventCards = savedGame._eventCards;
            this.currentEventCardIndex = savedGame.currentEventCardIndex;
            this.currentTreasureCardIndex = savedGame.currentTreasureCardIndex;
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
                var player = new Player(savedPlayer.playerName, savedPlayer.human);
                player.loadDataFrom(savedPlayer, this.board);
                this.players.push(player);
            });
        }

        public performTrade(tradeState: TradeState) {
            tradeState.firstPlayerSelectedAssets.forEach(firstPlayerAsset => {
                var asset = this.board.fields.filter(f => f.type === BoardFieldType.Asset && f.asset.name === firstPlayerAsset.name)[0].asset;
                asset.setOwner(tradeState.secondPlayer.playerName);
            });
            tradeState.secondPlayerSelectedAssets.forEach(secondPlayerAsset => {
                var asset = this.board.fields.filter(f => f.type === BoardFieldType.Asset && f.asset.name === secondPlayerAsset.name)[0].asset;
                asset.setOwner(tradeState.firstPlayer.playerName);
            });
        }
    }
} 