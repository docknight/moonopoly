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
            if (this.gameService.canBuy) {
                var asset = this.gameService.getCurrentPlayerPosition().asset;
                if (this.shouldBuy(asset)) {
                    var buyAction = new Model.AIAction();
                    buyAction.actionType = Model.AIActionType.Buy;
                    actions.push(buyAction);
                }
            } else {
                var player = this.gameService.players.filter(p => p.playerName === this.gameService.getCurrentPlayer())[0];
                if (player.money < 0) {
                    var moneyToGain = Math.abs(player.money);
                    moneyToGain = this.mortgageAssets(moneyToGain, player.playerName, actions);
                    if (moneyToGain > 0) {
                        // unable to raise enough money
                        var surrenderAction = new Model.AIAction();
                        surrenderAction.actionType = Model.AIActionType.Surrender;
                        actions.push(surrenderAction);
                    }
                }
            }
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
                    individualAssets.push(asset);
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
                    action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Mortgage;
                    action.asset = utilities[0];
                    actions.push(action);
                    return this.mortgageAssets(Math.max(moneyToGain - utilities[0].valueMortgage, 0), player, actions);
                }
                var railways = ownedAssets.filter(asset => asset.group === Model.AssetGroup.Railway && !asset.mortgage);
                if (railways.length > 0) {
                    action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Mortgage;
                    action.asset = railways[0];
                    actions.push(action);
                    return this.mortgageAssets(Math.max(moneyToGain - railways[0].valueMortgage, 0), player, actions);
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
                        return this.mortgageAssets(Math.max(moneyToGain - fieldsWithHotel[0].asset.priceHotel / 2, 0), player, actions);                        
                    }
                    var fieldsWithHouses = groupFields.filter(field => field.asset.houses && field.asset.houses > 0);
                    if (fieldsWithHouses.length > 0) {
                        var fieldWithMostHouses = fieldsWithHouses.sort((a, b) => a.asset.houses > b.asset.houses ? 1 : (a.asset.houses < b.asset.houses ? -1 : 0))[0];
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.SellHouse;
                        action.asset = fieldWithMostHouses.asset;
                        action.position = fieldWithMostHouses.index;
                        actions.push(action);
                        return this.mortgageAssets(Math.max(moneyToGain - fieldWithMostHouses.asset.priceHouse / 2, 0), player, actions);                        
                    }
                    // if no houses and hotels, just mortgage one of the assets in a group
                    var unmortgagedFields = groupFields.filter(f => !(f.asset.mortgage));
                    if (unmortgagedFields.length > 0) {
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Mortgage;
                        action.asset = unmortgagedFields[0].asset;
                        actions.push(action);
                        return this.mortgageAssets(Math.max(moneyToGain - unmortgagedFields[0].asset.valueMortgage, 0), player, actions);
                    }
                }
            }
            return moneyToGain;
        }
    }

    monopolyApp.service("aiService", AIService);
}
