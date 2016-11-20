module Model {
    export class TradeState {
        constructor() {
            this.canMakeTradeOffer = false;
            this.canAcceptTradeOffer = false;
            this.firstPlayerSelectedAssets = [];
            this.secondPlayerSelectedAssets = [];
            this.firstPlayerMoney = 0;
            this.secondPlayerMoney = 0;
        }
        canMakeTradeOffer: boolean;
        canAcceptTradeOffer: boolean;
        firstPlayer: Model.Player;
        secondPlayer: Model.Player;
        firstPlayerSelectedAssets: Array<Model.Asset>;
        secondPlayerSelectedAssets: Array<Model.Asset>;
        firstPlayerMoney: number; // how much of his money the player is including in the trade
        secondPlayerMoney: number; // how much of his money the player is including in the trade
        tradeActions: JQueryDeferred<{}>; // deferred object to signalize when the trading is complete

        initializeFrom(tradeState: TradeState) {
            this.firstPlayer = tradeState.firstPlayer;
            this.secondPlayer = tradeState.secondPlayer;
            this.firstPlayerSelectedAssets = tradeState.firstPlayerSelectedAssets;
            this.secondPlayerSelectedAssets = tradeState.secondPlayerSelectedAssets;
            this.firstPlayerMoney = tradeState.firstPlayerMoney;
            this.secondPlayerMoney = tradeState.secondPlayerMoney;
            this.canMakeTradeOffer = tradeState.firstPlayerSelectedAssets.length > 0 || tradeState.secondPlayerSelectedAssets.length > 0;
        }
    }
} 