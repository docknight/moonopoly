module Services {
    declare var sweetAlert: any;
    export class TradeService implements Interfaces.ITradeService {
        private gameService: Interfaces.IGameService;
        private aiService: Interfaces.IAIService;
        private timeoutService: angular.ITimeoutService;
        private isCounterOffer: boolean; // whether the player currently in control has made a change to original offer
        private scope: angular.IScope;

        static $inject = ["gameService", "aiService", "$timeout"];

        tradeState: Model.TradeState;
        currentPlayer: Model.Player;
        player1Assets: Array<Model.TradeGroup>; // list of all player assets, grouped into asset groups
        player2Assets: Array<Model.TradeGroup>; // list of all player assets, grouped into asset groups

        constructor(gameService: Interfaces.IGameService, aiService: Interfaces.IAIService, timeoutService: angular.ITimeoutService) {
            this.gameService = gameService;
            this.aiService = aiService;
            this.timeoutService = timeoutService;
        }

        public start(firstPlayer: Model.Player, secondPlayer: Model.Player, scope: angular.IScope, tradeActions: JQueryDeferred<{}>) {
            this.scope = scope;
            this.currentPlayer = firstPlayer;
            this.isCounterOffer = false;
            this.tradeState = new Model.TradeState();
            this.tradeState.firstPlayer = firstPlayer;
            this.tradeState.secondPlayer = secondPlayer;
            this.tradeState.tradeActions = tradeActions;
            this.player1Assets = this.buildPlayerAssetList(firstPlayer);
            this.player2Assets = this.buildPlayerAssetList(secondPlayer);
        }

        public getTradeState(): Model.TradeState {
            return this.tradeState;
        }

        public buildPlayerAssetList(player: Model.Player): Model.TradeGroup[] {
            var assetGroups: Array<Model.TradeGroup> = [];
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
            groups.forEach(group => {
                var groupFields = this.gameService.getGroupBoardFields(group);
                var assetsToSell: Array<Model.Asset> = [];
                groupFields.forEach(f => {
                    if (!f.asset.unowned && f.asset.owner === player.playerName && this.gameService.canSellAsset(f.asset)) {
                        assetsToSell.push(f.asset);
                    }
                });
                if (assetsToSell.length > 0) {
                    var groupToSell = new Model.TradeGroup();
                    groupToSell.assets = assetsToSell;
                    groupToSell.assetGroup = group;
                    groupToSell.name = this.mapGroupName(group);
                    assetGroups.push(groupToSell);
                }
            });

            return assetGroups;
        }

        public buildAssetTree(playerAssets: Array<Model.TradeGroup>): any {
            var data = [];
            playerAssets.forEach(tradeGroup => {
                data.push({
                    'text': tradeGroup.name,
                    'state': {
                        'opened': false,
                        'selected': false
                    },
                    children: this.buildAssetGroupChildren(tradeGroup.assets)
                });
            });
            return data;
        }

        public switchSelection(assetName: string) {
            var selectedAsset = this.gameService.getAssetByName(assetName);
            if (selectedAsset) {
                var playerSelectedAssets = selectedAsset.owner === this.tradeState.firstPlayer.playerName ? this.tradeState.firstPlayerSelectedAssets : this.tradeState.secondPlayerSelectedAssets;
                var currentlySelectedAsset = playerSelectedAssets.filter(a => a.name === assetName);
                if (currentlySelectedAsset.length > 0) {
                    var index = playerSelectedAssets.indexOf(selectedAsset);
                    if (index >= 0) {
                        playerSelectedAssets.splice(index, 1);
                    }
                } else {
                    playerSelectedAssets.push(selectedAsset);
                }
                this.setCounterOffer();
            }
        }

        public setCounterOffer() {
            this.isCounterOffer = true; // any selection is starting a new offer and the previous one doesn't need a confirmation
            this.setAllowedActions();            
        }

        public makeTradeOffer(): boolean {
            if (!this.tradeState.canMakeTradeOffer) {
                return false;
            }
            if (this.tradeState.firstPlayerMoney && this.tradeState.firstPlayerMoney > this.tradeState.firstPlayer.money) {
                return false;
            }
            if (this.tradeState.secondPlayerMoney && this.tradeState.secondPlayerMoney > this.tradeState.secondPlayer.money) {
                return false;
            }
            var offerAccepted: boolean = false;
            var otherPlayer = this.tradeState.firstPlayer.playerName === this.currentPlayer.playerName ? this.tradeState.secondPlayer : this.tradeState.firstPlayer;
            if (!otherPlayer.human) {
                offerAccepted = this.aiService.acceptTradeOffer(otherPlayer, this.tradeState);
                if (offerAccepted) {
                    this.executeTrade(this.tradeState);
                } else {
                    sweetAlert({
                        title: "Trade message",
                        text: otherPlayer.playerName + " rejected your trade offer.",
                        type: "info",
                        showCancelButton: false,
                        confirmButtonText: "Ok"
                    },
                        isConfirm => {
                        });
                }
            } else {
                var that = this;
                if (this.gameService.players.filter(p => p.human).length > 1) {
                    sweetAlert.close();
                    this.timeoutService(() => {
                        sweetAlert({
                                title: "Trade message",
                                text: "Please hand the device to " + otherPlayer.playerName + ".",
                                type: "info",
                                showCancelButton: false,
                                confirmButtonText: "Ok"
                            },
                            isConfirm => {
                                that.scope.$apply(() => {
                                    that.switchToPlayer(otherPlayer);
                                });
                            });
                    }, 100);
                } else {
                    that.scope.$apply(() => {
                        that.switchToPlayer(otherPlayer);
                    });
                }
            }
            return offerAccepted;
        }

        public acceptTradeOffer() {
            this.executeTrade(this.tradeState);
        }

        public executeTrade(tradeState: Model.TradeState) {
            var firstPlayerMoney: any = tradeState.firstPlayerMoney;
            var secondPlayerMoney: any = tradeState.secondPlayerMoney;
            firstPlayerMoney = parseInt(firstPlayerMoney);
            secondPlayerMoney = parseInt(secondPlayerMoney);
            tradeState.firstPlayer.money -= firstPlayerMoney;
            tradeState.firstPlayer.money += secondPlayerMoney;
            tradeState.secondPlayer.money -= secondPlayerMoney;
            tradeState.secondPlayer.money += firstPlayerMoney;
            var that = this;
            tradeState.firstPlayerSelectedAssets.forEach(firstPlayerAsset => {
                firstPlayerAsset.setOwner(tradeState.secondPlayer.playerName);
            });
            tradeState.secondPlayerSelectedAssets.forEach(secondPlayerAsset => {
                secondPlayerAsset.setOwner(tradeState.firstPlayer.playerName);
            });
        }

        private buildAssetGroupChildren(assets: Model.Asset[]): any {
            var data = [];
            assets.forEach(a => data.push({ text: a.name, "icon": "jstree-file" }));
            return data;
        }

        private setAllowedActions() {
            if (this.tradeState.firstPlayerSelectedAssets.length > 0 || this.tradeState.secondPlayerSelectedAssets.length > 0) {
                this.tradeState.canMakeTradeOffer = this.isCounterOffer;
                this.tradeState.canAcceptTradeOffer = this.isCounterOffer === false;
            } else {
                this.tradeState.canMakeTradeOffer = false;
                this.tradeState.canAcceptTradeOffer = false;                
            }
        }

        private switchToPlayer(player: Model.Player) {
            this.currentPlayer = player;
            this.isCounterOffer = false;
            this.setAllowedActions();
        }

        private mapGroupName(assetGroup: Model.AssetGroup): string {
            if (assetGroup === Model.AssetGroup.First) {
                return "Rimas";
            } else if (assetGroup === Model.AssetGroup.Second) {
                return "Mountains";
            } else if (assetGroup === Model.AssetGroup.Third) {
                return "Valleys";
            } else if (assetGroup === Model.AssetGroup.Fourth) {
                return "Cliffs";
            } else if (assetGroup === Model.AssetGroup.Fifth) {
                return "Terras";
            } else if (assetGroup === Model.AssetGroup.Sixth) {
                return "Seas";
            } else if (assetGroup === Model.AssetGroup.Seventh) {
                return "Oceans";
            } else if (assetGroup === Model.AssetGroup.Eighth) {
                return "Craters";
            } else if (assetGroup === Model.AssetGroup.Railway) {
                return "Iron mines";
            } else if (assetGroup === Model.AssetGroup.Utility) {
                return "Oil rigs";
            }


            return "";
        }
    }
}

monopolyApp.service("tradeService", Services.TradeService);