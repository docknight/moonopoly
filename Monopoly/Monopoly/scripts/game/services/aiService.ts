/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
module Services {
    export class AIService implements Interfaces.IAIService {
        gameService: Interfaces.IGameService;

        static $inject = ["gameService"];

        constructor(gameService: Interfaces.IGameService) {
            this.gameService = gameService;
        }

        // process computer managing his properties or trading
        public afterMoveProcessing(): Array<Model.AIAction> {            
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
                this.buyHouses(moneyAvailable, player.playerName, actions);
            }
            this.unmortgageAssets(player.money, player.playerName, actions);
            return actions;
        }

        // determine whether the computer should buy current property he has landed on
        public shouldBuy(asset: Model.Asset): boolean {
            var player = this.gameService.players.filter(p => p.playerName === this.gameService.getCurrentPlayer())[0];
            if (player.money > asset.price + 150) {
                return true;
            }

            return false;
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

        // buy houses or hotels if available
        private buyHouses(moneyAvailable: number, player: string, actions: Model.AIAction[]) {
            if (moneyAvailable <= 200) {
                return;
            }
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
                        groupFields.forEach(f => {
                            if (!f.asset.mortgage && !f.asset.hotel) {
                                housesLeftToBuy += !f.asset.houses ? 4 : 4 - f.asset.houses;
                            }
                        });
                        var affordableHouses = Math.floor(moneyAvailable / groupFields[0].asset.priceHouse);
                        var housesToBuy = Math.min(housesLeftToBuy, affordableHouses);
                        if (housesToBuy > 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.BuyHouse;
                            action.numHousesOrHotels = housesToBuy;
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
                        var affordableHotels = Math.floor(moneyAvailable / groupFields[0].asset.priceHotel);
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
            var utilityFields = this.gameService.getGroupBoardFields(Model.AssetGroup.Utility);
            utilityFields.forEach(groupField => {
                if (!actionAdded && groupField.asset.mortgage && money - (Math.floor(groupField.asset.price * 1.1)) > 150) {
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
    }

    monopolyApp.service("aiService", AIService);
}
