/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
module Services {
    export class AIService implements Interfaces.IAIService {
        gameService: Interfaces.IGameService;

        static $inject = ["gameService"];

        constructor(gameService: Interfaces.IGameService, themeService: Interfaces.IThemeService) {
            this.gameService = gameService;
        }

        get ownedGroupTradeMultiplier(): number {
            return 4;
        }

        // process computer managing his properties or trading
        public afterMoveProcessing(skipBuyingHouses?: boolean): Array<Model.AIAction> {            
            var actions = new Array<Model.AIAction>();
            var player = this.gameService.players.filter(p => p.playerName === this.gameService.getCurrentPlayer())[0];
            if (this.gameService.canBuy) {
                var asset = this.gameService.getCurrentPlayerPosition().asset;
                if (this.shouldBuy(asset)) {
                    var buyAction = new Model.AIAction();
                    buyAction.actionType = Model.AIActionType.Buy;
                    actions.push(buyAction);
                }
            } else {
                var playerMoney = player.money;
                if (player.turnsInPrison === 0 && this.gameService.lastDiceResult !== 6) {
                    playerMoney -= this.gameService.gameParams.jailBail;
                }
                if (playerMoney < 0) {
                    var moneyToGain = Math.abs(playerMoney);
                    moneyToGain = this.mortgageAssets(moneyToGain, player.playerName, actions);
                    if (moneyToGain > 0 && actions.length === 0) {
                        // unable to raise enough money
                        var surrenderAction = new Model.AIAction();
                        surrenderAction.actionType = Model.AIActionType.Surrender;
                        actions.push(surrenderAction);
                    }
                }
            }
            if (player.money > 0) {
                if (player.turnsInPrison === 0 && this.gameService.canGetOutOfJail) {
                    var outOfJailAction = new Model.AIAction();
                    outOfJailAction.actionType = Model.AIActionType.GetOutOfJail;
                    actions.push(outOfJailAction);
                    return actions; // getting out of jail is the last thing we are doing while being on the current field
                }
                var moneyAvailable = player.money;
                if (!skipBuyingHouses) {
                    this.buyHouses(moneyAvailable, player.playerName, actions);
                }
            }
            this.unmortgageAssets(player.money, player.playerName, actions);
            this.tradeAssets(player, actions);
            return actions;
        }

        // determine whether the computer should buy current property he has landed on
        public shouldBuy(asset: Model.Asset): boolean {
            var player = this.gameService.players.filter(p => p.playerName === this.gameService.getCurrentPlayer())[0];
            var severalOwners = this.severalOwners(asset.group);
            if (player.money < 1800 && severalOwners) {
                return false;
            }
            var assetGroupsToGain = this.numAssetGroupsToGain(player.playerName);
            if (assetGroupsToGain <= 3 && player.money > asset.price + 250) {
                return true;
            }
            if (assetGroupsToGain > 3) {
                if (player.money > asset.price + 700) {
                    return true;
                }
            }
            var canOwnGroup = this.canOwnGroup(asset, player);
            if (player.money > asset.price + 150 && asset.price >= 300 && canOwnGroup) {
                // for higher valued properties AI is prepared to risk a bit more
                return true;
            }
            if (player.money > asset.price && !severalOwners && !canOwnGroup) {
                var groupAssets = this.gameService.getGroupBoardFields(asset.group);
                var numOwned = groupAssets.filter(b => !b.asset.unowned).length;
                var numUnowned = groupAssets.filter(b => b.asset.unowned).length;
                if (numOwned > 0) {
                    // another player has a chance to own entire group; try to thwart him from that
                    if (numUnowned === 1 && player.money > asset.price + 100) {
                        return true;
                    }
                    if (numUnowned > 1 && player.money > asset.price + 300) {
                        return true;
                    }
                }
            }

            return false;
        }

        public acceptTradeOffer(player: Model.Player, tradeState: Model.TradeState): boolean {
            var myMoney = tradeState.firstPlayer.playerName === player.playerName ? tradeState.firstPlayerMoney : tradeState.secondPlayerMoney;
            var otherMoney = tradeState.firstPlayer.playerName === player.playerName ? tradeState.secondPlayerMoney : tradeState.firstPlayerMoney;
            var moneyBalance = otherMoney - myMoney; // how much money am I getting (if +) or losing (if -)
            var gameBeforeTrade = this.gameService.cloneGame();
            var scoreBeforeTrade = this.evaluate(player, gameBeforeTrade);
            gameBeforeTrade.performTrade(tradeState);
            var scoreAfterTrade = this.evaluate(player, gameBeforeTrade);
            var accept = scoreAfterTrade - scoreBeforeTrade + moneyBalance >= 0;
            return accept;
        }

        // evaluate board from the player's view; score is expressed in money units
        private evaluate(player: Model.Player, game: Model.Game): number {
            var myValue = this.evaluatePlayerWorth(player, game);
            game.players.forEach(p => {
                if (p.playerName !== player.playerName && p.active) {
                    myValue = myValue - this.evaluatePlayerWorth(p, game);
                }
            });

            return myValue;
        }

        // used by trading to decide whether the player's position improves after trade
        private evaluatePlayerWorth(player: Model.Player, game: Model.Game): number {
            var score = 0;
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            var ownedGroups = this.getPlayerAssetGroups(player.playerName, game);
            groups.forEach(group => {
                var fieldsInGroup = this.getGroupBoardFields(group, game);
                if (ownedGroups.filter(gr => gr === group).length > 0) {
                    score += fieldsInGroup[0].asset.price * this.ownedGroupTradeMultiplier * fieldsInGroup.length;
                } else {
                    // group not entirely owned by player...
                    if (this.canOwnGroup(fieldsInGroup[0].asset, player, game)) {
                        // ..but it could be, so it is still worth something
                        score += fieldsInGroup[0].asset.price * 3 * fieldsInGroup.filter(f => !f.asset.unowned && f.asset.owner === player.playerName).length;
                    } else {
                        score += fieldsInGroup[0].asset.price * 2 * fieldsInGroup.filter(f => !f.asset.unowned && f.asset.owner === player.playerName).length;
                    }
                }
                // deduct mortgaged assets
                fieldsInGroup.forEach(field => {
                    if (!field.asset.unowned && field.asset.owner === player.playerName && field.asset.mortgage) {
                        score -= Math.floor(field.asset.valueMortgage * 1.1);
                    }
                });
            });

            // count the railways and utilities
            var railways = this.getGroupBoardFields(Model.AssetGroup.Railway, game);
            var railwaysOwned = railways.filter(r => !r.asset.unowned && r.asset.owner === player.playerName).length;
            if (railwaysOwned > 0) {
                score += railways[0].asset.priceRent[railwaysOwned - 1] * 15;
            }
            var utilities = this.getGroupBoardFields(Model.AssetGroup.Utility, game);
            var utilitiesOwned = utilities.filter(r => !r.asset.unowned && r.asset.owner === player.playerName).length;
            if (utilitiesOwned > 0) {
                score += utilities[0].asset.priceMultiplierUtility[utilitiesOwned - 1] * 30;
            }

            return score;
        }

        // get asset groups entirely owned by given player
        private getPlayerAssetGroups(playerName: string, game: Model.Game): Array<Model.AssetGroup> {
            var playerGroups: Array<Model.AssetGroup> = [];
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            groups.forEach(group => {
                var groupFields = this.getGroupBoardFields(group, game);
                if (groupFields.every(field => !field.asset.unowned && field.asset.owner === playerName)) {
                    playerGroups.push(group);
                }
            });
            return playerGroups;
        }

        // mortgage assets to gain required money
        private mortgageAssets(moneyToGain: number, player: string, actions: Model.AIAction[]): number {
            if (moneyToGain <= 0) {
                return 0;
            }
            // first, try finding an asset where not an entire group is owned
            var ownedAssets = this.gameService.getPlayerAssets(player);
            if (ownedAssets.length === 0) {
                return moneyToGain;
            }
            var action = new Model.AIAction();
            var individualAssets: Array<Model.Asset> = new Array<Model.Asset>();
            ownedAssets.forEach(asset => {
                var groupAssets = this.gameService.getGroupBoardFields(asset.group);
                var unownedGroupAssets = groupAssets.filter(groupAsset => groupAsset.asset.unowned || groupAsset.asset.owner !== player || groupAsset.asset.mortgage);
                if (unownedGroupAssets.length > 0 && !asset.mortgage) {
                    if (actions.filter(a => a.actionType === Model.AIActionType.Mortgage && a.asset.name === asset.name).length === 0) {
                        individualAssets.push(asset);
                    }
                }
            });
            // mortgage individual assets one by one
            if (individualAssets.length > 0) {
                var sortedIndividualAssets = individualAssets.sort((a, b) => { return a.valueMortgage > b.valueMortgage ? 1 : (a.valueMortgage < b.valueMortgage ? -1 : 0); });
                var selectedIndividualAsset = sortedIndividualAssets.reduce((previous, current) => {
                    if (current.valueMortgage >= moneyToGain) {
                        return current;
                    } else {
                        if (!previous) {
                            return current;
                        } else {
                            return previous;
                        }
                    }
                });
                if (selectedIndividualAsset) {
                    action.actionType = Model.AIActionType.Mortgage;
                    action.asset = selectedIndividualAsset;
                    actions.push(action);
                    // continue mortgaging until enough money is raised
                    return this.mortgageAssets(Math.max(moneyToGain - selectedIndividualAsset.valueMortgage, 0), player, actions);
                }
            } else {
                // time to sell assets from an owned group and utilities
                var utilities = ownedAssets.filter(asset => asset.group === Model.AssetGroup.Utility && !asset.mortgage);
                if (utilities.length > 0) {
                    var utilityMortgaged = false;
                    utilities.forEach(utility => {
                        if (actions.filter(a => a.actionType === Model.AIActionType.Mortgage && a.asset.name === utility.name).length === 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.Mortgage;
                            action.asset = utility;
                            actions.push(action);
                            moneyToGain -= utility.valueMortgage;
                            utilityMortgaged = true;
                        }
                    });
                    if (utilityMortgaged) {
                        return this.mortgageAssets(Math.max(moneyToGain, 0), player, actions);
                    }
                }
                var railways = ownedAssets.filter(asset => asset.group === Model.AssetGroup.Railway && !asset.mortgage);
                if (railways.length > 0) {
                    var railwayMortgaged = false;
                    railways.forEach(railway => {
                        if (actions.filter(a => a.actionType === Model.AIActionType.Mortgage && a.asset.name === railway.name).length === 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.Mortgage;
                            action.asset = railway;
                            actions.push(action);
                            moneyToGain -= railway.valueMortgage;
                            railwayMortgaged = true;
                        }
                    });
                    if (railwayMortgaged) {
                        return this.mortgageAssets(Math.max(moneyToGain, 0), player, actions);
                    }
                }
                // lastly, sell houses and mortgage assets of an owned group
                var ownedGroups = this.gameService.getPlayerAssetGroups(player);
                if (ownedGroups.length > 0) {
                    var groupFields = this.gameService.getGroupBoardFields(ownedGroups[0]);
                    var fieldsWithHotel = groupFields.filter(field => field.asset.hotel);
                    if (fieldsWithHotel.length > 0) {
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.SellHotel;
                        action.asset = fieldsWithHotel[0].asset;
                        action.position = fieldsWithHotel[0].index;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - fieldsWithHotel[0].asset.priceHotel / 2, 0), player, actions);                        
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - fieldsWithHotel[0].asset.priceHotel / 2, 0);
                    }
                    var fieldsWithHouses = groupFields.filter(field => field.asset.houses && field.asset.houses > 0);
                    if (fieldsWithHouses.length > 0) {
                        var fieldWithMostHouses = fieldsWithHouses.sort((a, b) => a.asset.houses > b.asset.houses ? -1 : (a.asset.houses < b.asset.houses ? 1 : 0))[0];
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.SellHouse;
                        action.asset = fieldWithMostHouses.asset;
                        action.position = fieldWithMostHouses.index;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - fieldWithMostHouses.asset.priceHouse / 2, 0), player, actions);                        
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - fieldWithMostHouses.asset.priceHouse / 2, 0);
                    }
                    // if no houses and hotels, just mortgage one of the assets in a group
                    var unmortgagedFields = groupFields.filter(f => !(f.asset.mortgage));
                    if (unmortgagedFields.length > 0) {
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Mortgage;
                        action.asset = unmortgagedFields[0].asset;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - unmortgagedFields[0].asset.valueMortgage, 0), player, actions);
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - unmortgagedFields[0].asset.valueMortgage, 0);
                    }
                }
            }
            return moneyToGain;
        }

        private getGroupBoardFields(assetGroup: Model.AssetGroup, game: Model.Game): Array<Model.BoardField> {
            return game.board.fields.filter(f => f.type === Model.BoardFieldType.Asset && f.asset.group === assetGroup);
        }

        // buy houses or hotels if available
        private buyHouses(moneyAvailable: number, player: string, actions: Model.AIAction[]) {
            moneyAvailable -= 200;
            if (moneyAvailable < 0) {
                return;
            }
            var assetGroupsToGain = this.numAssetGroupsToGain(player);
            var ownedAssets = this.gameService.getPlayerAssets(player);
            if (ownedAssets.length === 0) {
                return;
            }
            var action: Model.AIAction;
            var ownedGroups = this.gameService.getPlayerAssetGroups(player);
            // try buying houses first
            ownedGroups.forEach(group => {
                // only process one asset group in a single iteration
                if (actions.filter(a => a.actionType === Model.AIActionType.BuyHouse).length === 0) {
                    var groupFields = this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(f => !f.asset.mortgage)) {
                        var housesLeftToBuy = 0;
                        var housesPerAsset = 0;
                        groupFields.forEach(f => {
                            if (!f.asset.mortgage) {
                                if (!f.asset.hotel) {
                                    housesLeftToBuy += !f.asset.houses ? 4 : 4 - f.asset.houses;
                                    housesPerAsset += f.asset.houses ? f.asset.houses : 0;
                                } else {
                                    housesPerAsset += 5;
                                }
                            }
                        });
                        housesPerAsset = Math.floor(housesPerAsset / groupFields.length);
                        var moneyAvailableForHouses = moneyAvailable;
                        // don't spend to much on houses if there already are some and there are still asset groups available
                        if (assetGroupsToGain > 0 && housesPerAsset >= 2) {
                            moneyAvailableForHouses -= 200;
                        }
                        if (assetGroupsToGain >= 3 && housesPerAsset >= 2) {
                            moneyAvailableForHouses -= 2000;
                        }
                        var affordableHouses = Math.floor(moneyAvailableForHouses / groupFields[0].asset.priceHouse);
                        var housesToBuy = Math.min(housesLeftToBuy, affordableHouses);
                        if (housesToBuy > 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.BuyHouse;
                            // never buy more than 3 houses at once
                            action.numHousesOrHotels = Math.min(housesToBuy , 3);
                            action.assetGroup = group;
                            actions.push(action);
                        }
                    }
                }
            });
            if (actions.filter(a => a.actionType === Model.AIActionType.BuyHouse).length > 0) {
                return;
            }
            ownedGroups.forEach(group => {
                // only process one asset group in a single iteration
                if (actions.filter(a => a.actionType === Model.AIActionType.BuyHotel).length === 0) {
                    var groupFields = this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(f => (f.asset.houses && f.asset.houses === 4) || f.asset.hotel)) {
                        var hotelsLeftToBuy = 0;
                        groupFields.forEach(f => {
                            hotelsLeftToBuy += f.asset.hotel ? 0 : 1;
                        });
                        var moneyAvailableForHotels = moneyAvailable;
                        // don't spend to much on hotels if there are still asset groups available
                        if (assetGroupsToGain > 0) {
                            moneyAvailableForHotels -= 300;
                        }
                        if (assetGroupsToGain >= 3) {
                            moneyAvailableForHotels -= 400;
                        }
                        var affordableHotels = Math.floor(moneyAvailableForHotels / groupFields[0].asset.priceHotel);
                        var hotelsToBuy = Math.min(hotelsLeftToBuy, affordableHotels);
                        if (hotelsToBuy > 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.BuyHotel;
                            action.numHousesOrHotels = hotelsToBuy;
                            action.assetGroup = group;
                            actions.push(action);
                        }
                    }
                }
            });
        }

        // unmortgage mortgaged assets if having enough money
        private unmortgageAssets(money: number, player: string, actions: Model.AIAction[]) {
            var actionAdded = false; // only one action in a single iteration so that other users can follow computer actions
            if (money <= 100) {
                return;
            }
            // first, try finding any mortgaged assets where an entire group is owned
            var ownedGroups = this.gameService.getPlayerAssetGroups(player);
            ownedGroups.forEach(ownedGroup => {
                var groupFields = this.gameService.getGroupBoardFields(ownedGroup);
                groupFields.forEach(groupField => {
                    if (!actionAdded && groupField.asset.mortgage && money - (Math.floor(groupField.asset.price * 1.1)) > 50) {
                        var action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Unmortgage;
                        action.asset = groupField.asset;
                        action.position = groupField.index;
                        actions.push(action);
                        money -= Math.floor(groupField.asset.price * 1.1);
                        actionAdded = true;
                    }
                });
            });

            // next, release mortgage on railways and utilities
            var railwayFields = this.gameService.getGroupBoardFields(Model.AssetGroup.Railway);
            railwayFields.forEach(groupField => {
                if (!actionAdded && groupField.asset.mortgage && groupField.asset.owner === player && money - (Math.floor(groupField.asset.price * 1.1)) > 50) {
                    var action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Unmortgage;
                    action.asset = groupField.asset;
                    action.position = groupField.index;
                    actions.push(action);
                    money -= Math.floor(groupField.asset.price * 1.1);
                    actionAdded = true;
                }
            });
            var utilityFields = this.gameService.getGroupBoardFields(Model.AssetGroup.Utility);
            utilityFields.forEach(groupField => {
                if (!actionAdded && groupField.asset.mortgage && groupField.asset.owner === player && money - (Math.floor(groupField.asset.price * 1.1)) > 150) {
                    var action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Unmortgage;
                    action.asset = groupField.asset;
                    actions.push(action);
                    money -= Math.floor(groupField.asset.price * 1.1);
                    actionAdded = true;
                }
            });

            // finally, release mortgage on the rest of the assets if money is in abundance
            var ownedAssets = this.gameService.getPlayerAssets(player);
            ownedAssets.forEach(ownedAsset => {
                if (ownedGroups.filter(ownedGroup => ownedGroup === ownedAsset.group).length === 0) {
                    if (!actionAdded && ownedAsset.mortgage && money - (Math.floor(ownedAsset.price * 1.1)) > 500) {
                        var action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Unmortgage;
                        action.asset = ownedAsset;
                        actions.push(action);
                        money -= Math.floor(ownedAsset.price * 1.1);
                        actionAdded = true;
                    }                    
                }
            });
        }

        // gets the number of groups that are not entirely owned by the player but have a chance to be
        private numAssetGroupsToGain(player: string): number {
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
            var groupsToGain = 0;
            var playerGroups = this.gameService.getPlayerAssetGroups(player); // don't count groups already owned by the player
            groups.forEach(group => {
                if (playerGroups.filter(g => g === group).length === 0) {
                    var groupFields = this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(f => f.asset.unowned || f.asset.owner === player)) {
                        groupsToGain++;
                    }
                }
            });
            return groupsToGain;
        }

        // whether the group that the asset belongs to is still available
        private canOwnGroup(asset: Model.Asset, player: Model.Player, game?: Model.Game): boolean {
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            if (groups.filter(g => g === asset.group).length === 0) {
                // not applicable to railroads and utilities
                return true;
            }
            var groupFields = game ? this.getGroupBoardFields(asset.group, game) : this.gameService.getGroupBoardFields(asset.group);
            var ownedByAnotherPlayer = false;
            groupFields.forEach(f => {
                ownedByAnotherPlayer = ownedByAnotherPlayer || (!f.asset.unowned && f.asset.owner !== player.playerName);
            });
            return !ownedByAnotherPlayer;
        }

        private severalOwners(group: Model.AssetGroup): boolean {
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            var owners: Array<string> = [];
            if (groups.filter(g => g === group).length === 0) {
                // not applicable to railroads and utilities
                return false;
            }
            var groupFields = this.gameService.getGroupBoardFields(group);
            groupFields.forEach(f => {
                if (!f.asset.unowned) {
                    if (owners.filter(o => o === f.asset.owner).length === 0) {
                        owners.push(f.asset.owner);
                    }
                }
            });
            return owners.length > 1;
        }

        private tradeAssets(player: Model.Player, actions: Model.AIAction[]) {
            if (actions.length > 0) {
                // let's investigate trading opportunities only if there are no pending actions already selected which might change the state of the game
                return;
            }

            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            var that = this;
            groups.forEach(group => {
                if (actions.length === 0) {
                    var groupFields = that.gameService.getGroupBoardFields(group);
                    var numOtherPlayer = 0;
                    var otherPlayerName = "";
                    var numMyAssets = 0;
                    var secondPlayerAsset;
                    groupFields.forEach(f => {
                        if (!f.asset.unowned && f.asset.owner !== player.playerName) {
                            numOtherPlayer += 1;
                            otherPlayerName = f.asset.owner;
                            secondPlayerAsset = f.asset;
                        }
                        if (!f.asset.unowned && f.asset.owner === player.playerName) {
                            numMyAssets += 1;
                        }
                    });
                    if (numOtherPlayer === 1 && numMyAssets + numOtherPlayer === groupFields.length) {
                        // I only have one asset missing; let's check if I've got anything to offer to the other player in exchange
                        groups.forEach(otherGroup => {
                            if (otherGroup !== group) {
                                var otherGroupFields = that.gameService.getGroupBoardFields(otherGroup);
                                numOtherPlayer = 0;
                                numMyAssets = 0;
                                var firstPlayerAsset;
                                otherGroupFields.forEach(f => {
                                    if (!f.asset.unowned && f.asset.owner === player.playerName) {
                                        numOtherPlayer += 1;
                                        firstPlayerAsset = f.asset;
                                    }
                                    if (!f.asset.unowned && f.asset.owner === otherPlayerName) {
                                        numMyAssets += 1;
                                    }
                                });
                                if (numOtherPlayer === 1 && numMyAssets + numOtherPlayer === otherGroupFields.length && actions.length === 0) {
                                    // found a candidate; let's check if both players have enough money to compensate for the asset different values
                                    var priceDiff = (groupFields[0].asset.price - otherGroupFields[0].asset.price) * that.ownedGroupTradeMultiplier * Math.max(groupFields.length, otherGroupFields.length);
                                    // deduct mortgaged assets
                                    groupFields.forEach(field => {
                                        if (!field.asset.unowned && field.asset.owner !== player.playerName && field.asset.mortgage) {
                                            priceDiff -= Math.floor(field.asset.valueMortgage * 1.1);
                                        }
                                    });
                                    otherGroupFields.forEach(field => {
                                        if (!field.asset.unowned && field.asset.owner === player.playerName && field.asset.mortgage) {
                                            priceDiff += Math.floor(field.asset.valueMortgage * 1.1);
                                        }
                                    });
                                    var otherPlayer = that.gameService.players.filter(p => p.playerName === otherPlayerName)[0];
                                    if ((priceDiff > 0 && player.money >= priceDiff + 50) || (priceDiff < 0 && otherPlayer.money > -priceDiff + 50) || priceDiff === 0) {
                                        // a valid trade option has been found
                                        // if the other player is a computer, add it immediately, otherwise let's randomize the offer
                                        if (/*!otherPlayer.human ||*/ Math.floor(Math.random() * 4) === 0) {
                                            var tradeState = new Model.TradeState();
                                            tradeState.firstPlayer = player;
                                            tradeState.secondPlayer = otherPlayer;
                                            tradeState.firstPlayerSelectedAssets.push(firstPlayerAsset);
                                            tradeState.secondPlayerSelectedAssets.push(secondPlayerAsset);
                                            if (priceDiff >= 0) {
                                                tradeState.firstPlayerMoney = priceDiff;
                                                tradeState.secondPlayerMoney = 0;
                                            } else {
                                                tradeState.firstPlayerMoney = 0;
                                                tradeState.secondPlayerMoney = -priceDiff;
                                            }
                                            var action = new Model.AIAction();
                                            action.actionType = Model.AIActionType.Trade;
                                            action.tradeState = tradeState;
                                            actions.push(action);
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    monopolyApp.service("aiService", AIService);
}
