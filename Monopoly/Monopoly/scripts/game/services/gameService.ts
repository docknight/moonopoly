﻿/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
module Services {

    export class GameService implements Interfaces.IGameService {
        httpService: ng.IHttpService;
        settingsService: Interfaces.ISettingsService;

        private game: Model.Game;
        private lastDiceResult1: number;
        private lastDiceResult2: number;
        private currentManageGroupIndex: number;
        private uncommittedHousesPrice: number; // price sum of currently uncommitted house deals
        private currentTreasureCardIndex: number;
        private currentEventCardIndex: number;
        private manageGroups: Array<Array<number>>;

        static $inject = ["$http", "settingsService"];
        constructor($http: ng.IHttpService, settingsService: Interfaces.ISettingsService) {
            this.httpService = $http;
            this.settingsService = settingsService;
        }

        initGame() {
            this.game = new Model.Game();
            this.initPlayers();
            this.initCards();
            this.initManageGroups();
            this.game.advanceToNextPlayer();
            this.uncommittedHousesPrice = 0;
        }

        endTurn() {
            if (this.canEndTurn) {
                this.game.advanceToNextPlayer();
                this.game.setState(Model.GameState.BeginTurn);
                this.lastDiceResult1 = undefined;
                this.lastDiceResult2 = undefined;
            }
        }

        getCurrentPlayer(): string {
            return this.game.currentPlayer;
        }

        get players(): Array<Model.Player> {
            return this.game.players;
        }

        get lastDiceResult(): number {
            if (!this.lastDiceResult1 && !this.lastDiceResult2) {
                return undefined;
            }
            return this.lastDiceResult1 + this.lastDiceResult2;
        }

        get canThrowDice() {
            if (this.game.getState() === Model.GameState.BeginTurn) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                if (player.money >= 0) {
                    return true;
                }
            }
            return false;
        }

        get canEndTurn() {
            if (this.game.getState() !== Model.GameState.BeginTurn) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                if (player.turnsInPrison === 0) {
                    // must pay off bail before leaving prison
                    return false;
                }
                if (player.money < 0) {
                    return false;
                }
                return true;
            }
            return false;
        }

        get canBuy() {
            if (this.game.getState() === Model.GameState.Process) {
                var currentPosition = this.getCurrentPlayerPosition();
                if (currentPosition.type === Model.BoardFieldType.Asset) {
                    if (currentPosition.asset.unowned) {
                        var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                        if (player.money >= currentPosition.asset.price) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        get canManage(): boolean {
            if (this.game.getState() === Model.GameState.Move) {
                return false;
            }

            return true;
        }

        get canGetOutOfJail(): boolean {
            if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.Process) {
                var currentPosition = this.getCurrentPlayerPosition();
                if (currentPosition.type === Model.BoardFieldType.PrisonAndVisit) {
                    var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                    if (player.turnsInPrison !== undefined && player.money >= 50) {
                        if (this.game.getState() === Model.GameState.BeginTurn) {
                            return true;
                        }
                        if (this.game.getState() === Model.GameState.Process && player.turnsInPrison === 0 && this.lastDiceResult !== 6) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        get canSurrender(): boolean {
            if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.Process) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                if (player.money < 0 && player.active) {
                    return true;
                }
            }
            return false;
        }

        get gameState(): Model.GameState {
            return this.game.getState();
        }

        get winner(): string {
            var activePlayers = this.game.players.filter(p => p.active);
            if (activePlayers && activePlayers.length === 1) {
                return activePlayers[0].playerName;
            }

            return undefined;
        }

        setPlayerPosition(player: Model.Player, boardFieldIndex: number) {
            player.position = this.game.board.fields[boardFieldIndex];
            var previousFields = this.game.board.fields.filter(b => b.occupiedBy != null && b.occupiedBy.filter(ocb => ocb === player.playerName).length > 0);
            if (previousFields && previousFields.length > 0) {
                var previousField = previousFields[0];
                previousField.occupiedBy.splice(previousField.occupiedBy.indexOf(player.playerName));
            }

            player.position.occupiedBy.push(player.playerName);
        }

        throwDice() {
            this.game.setState(Model.GameState.ThrowDice);
        }

        buy(): boolean {
            if (this.canBuy) {
                var asset = this.getCurrentPlayerPosition().asset;
                if (asset) {
                    var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                    player.money -= asset.price;
                    asset.setOwner(this.getCurrentPlayer());
                    return true;
                }
            }

            return false;
        }

        manage(): number {
            if (this.canManage) {
                this.game.setState(Model.GameState.Manage);
                this.currentManageGroupIndex = 0;
            } else {
                this.currentManageGroupIndex = undefined;
            }

            return this.currentManageGroupIndex;
        }

        manageFocusChange(left: boolean): number {
            if (this.game.getState() === Model.GameState.Manage) {
                if (left) {
                    this.currentManageGroupIndex -= 1;
                    if (this.currentManageGroupIndex < 0) {
                        this.currentManageGroupIndex = this.manageGroups.length - 1;
                    }                    
                } else {
                    this.currentManageGroupIndex += 1;
                    if (this.currentManageGroupIndex >= this.manageGroups.length) {
                        this.currentManageGroupIndex = 0;
                    }
                }
            }

            return this.currentManageGroupIndex;
        }

        returnFromManage() {
            if (this.game.getState() === Model.GameState.Manage) {
                this.game.setPreviousState();
            }
        }

        getOutOfJail() {
            if (this.canGetOutOfJail) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                player.money -= 50;
                player.turnsInPrison = undefined;
                //this.game.setState(Model.GameState.BeginTurn);
            }    
        }

        surrender() {
            if (this.canSurrender) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                player.active = false;
                var activePlayers = this.game.players.filter(p => p.active);
                if (activePlayers && activePlayers.length === 1) {
                    this.game.setState(Model.GameState.EndOfGame);
                }
            }
        }

        getCurrentPlayerPosition(): Model.BoardField {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            return player.position;
        }

        moveCurrentPlayer(newPositionIndex?: number): Model.BoardField {
            this.game.setState(Model.GameState.Move);
            this.game.moveContext.reset();
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            var currentPositionIndex = player.position.index;
            if (player.turnsInPrison === undefined || this.letOutOfPrison(player)) {
                newPositionIndex = newPositionIndex !== undefined ? newPositionIndex : Math.floor((currentPositionIndex + this.lastDiceResult1 + this.lastDiceResult2) % 40);
                player.position = this.game.board.fields[newPositionIndex];
                this.game.board.fields[currentPositionIndex].occupiedBy.splice(this.game.board.fields[currentPositionIndex].occupiedBy.indexOf(player.playerName), 1);
                player.position.occupiedBy.push(player.playerName);
            } else {
                if (player.turnsInPrison !== undefined) {
                    this.game.setState(Model.GameState.Process);
                    return null;
                }
            }
            this.game.setState(Model.GameState.Process);
            return player.position;
        }

        // process visit of a field owned by another player
        processOwnedFieldVisit(): Model.ProcessResult {
            var result = new Model.ProcessResult();
            var asset = this.getCurrentPlayerPosition().asset;
            var priceToPay = 0;
            if (!asset.mortgage) {
                if (asset.hotel) {
                    priceToPay = asset.priceRentHotel;
                } else if (asset.houses > 0) {
                    priceToPay = asset.priceRentHouse[asset.houses - 1];
                }

                // for the rest of the scenarios, we need to find out the number of owned assets in a group
                var numOwnedInGroup = this.game.board.fields.filter(f => {
                     return f.type === Model.BoardFieldType.Asset && f.asset.group === asset.group && !f.asset.unowned && f.asset.owner === asset.owner;
                }).length;
                if (asset.group === Model.AssetGroup.Railway) {
                    priceToPay = asset.priceRent[numOwnedInGroup - 1];
                } else if (asset.group === Model.AssetGroup.Utility) {
                    priceToPay = asset.priceMultiplierUtility[numOwnedInGroup - 1] * (this.lastDiceResult1 + this.lastDiceResult2);
                } else if (asset.group !== Model.AssetGroup.None) {
                    priceToPay = asset.priceRent[numOwnedInGroup - 1];
                }

                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                if (player.money < priceToPay) {
                    // TODO: player can not pay
                    result.moneyShortage = priceToPay - player.money;
                    return result;
                }
                player.money -= priceToPay;
                var ownerPlayer = this.game.players.filter(p => p.playerName === asset.owner)[0];
                ownerPlayer.money += priceToPay;
                result.message = "Paid rent of " + priceToPay + " to " + ownerPlayer.playerName + ".";
            }

            return result;
        }

        getGroupBoardFields(assetGroup: Model.AssetGroup): Array<Model.BoardField> {
            return this.game.board.fields.filter(f => f.type === Model.BoardFieldType.Asset && f.asset.group === assetGroup);
        }

        getBoardFieldGroup(boardFieldIndex: number): Model.AssetGroup {
            var fields = this.game.board.fields.filter(f => f.type === Model.BoardFieldType.Asset && f.index == boardFieldIndex);
            if (fields && fields.length > 0) {
                return fields[0].asset.group;
            } else {
                return undefined;
            }
        }

        hasMonopoly(player: string, focusedAssetGroupIndex: number): boolean {
            var monopoly = true;
            var firstAssetIndex = this.manageGroups[focusedAssetGroupIndex][0];
            var assetGroup = this.getBoardFieldGroup(firstAssetIndex);
            if (assetGroup < Model.AssetGroup.First || assetGroup > Model.AssetGroup.Eighth) {
                monopoly = false;
                return;
            }

            var groupFields = this.getGroupBoardFields(assetGroup);
            groupFields.forEach(field => {
                if (field.asset.unowned || field.asset.owner !== this.getCurrentPlayer()) {
                    monopoly = false;
                }
            });

            return monopoly;
        }

        addHousePreview(playerName: string, position: number): boolean {
            var boardField = this.game.board.fields.filter(f => f.index === position)[0];
            if (!this.canUpgradeAsset(boardField.asset, playerName)) {
                return false;
            }

            // first, check if the player has the money to afford the upgrade
            var groupBoardFields = this.getGroupBoardFields(boardField.asset.group);
            var requiredMoney = 0;
            var houseCount = boardField.asset.houses + 1;
            requiredMoney += houseCount === 5 ? boardField.asset.getPriceForHotelDuringManage(false) : boardField.asset.getPriceForHouseDuringManage(false);
            groupBoardFields.forEach(field => {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.houses;
                    while (neighbourHouseCount < houseCount - 1) {
                        neighbourHouseCount++;
                        requiredMoney += field.asset.getPriceForHouseDuringManage(false);
                    }
                }
            });
            var player = this.game.players.filter(p => p.playerName === playerName)[0];
            if (requiredMoney > player.money) {
                return false;
            }

            // next, perform the upgrade
            if (houseCount <= 4) {
                boardField.asset.addHouse();
            } else {
                boardField.asset.addHotel();
            }
            groupBoardFields.forEach(field => {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.houses;
                    while (neighbourHouseCount < houseCount - 1) {
                        neighbourHouseCount++;
                        field.asset.addHouse();
                    }
                }
            });

            return true;
        }

        removeHousePreview(playerName: string, position: number): boolean {
            var boardField = this.game.board.fields.filter(f => f.index === position)[0];
            if (!boardField.asset || !this.hasMonopoly(playerName, boardField.asset.group) || (!boardField.asset.houses && !boardField.asset.hotel)) {
                return false;
            }

            var groupBoardFields = this.getGroupBoardFields(boardField.asset.group);
            var sellPrice = 0;
            var houseCount = boardField.asset.houses - 1;
            var player = this.game.players.filter(p => p.playerName === playerName)[0];

            // next, perform the upgrade
            if (houseCount < 0) {
                boardField.asset.removeHotel();
                sellPrice += boardField.asset.getPriceForHotelDuringManage(true);
                houseCount = 4;
            } else {
                boardField.asset.removeHouse();
                sellPrice += boardField.asset.getPriceForHouseDuringManage(true);
            }
            groupBoardFields.forEach(field => {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.hotel ? 5 : field.asset.houses;
                    while (neighbourHouseCount > houseCount + 1) {
                        if (neighbourHouseCount === 5) {
                            field.asset.removeHotel();
                            sellPrice += boardField.asset.getPriceForHotelDuringManage(true);
                        } else {
                            field.asset.removeHouse();
                            sellPrice += boardField.asset.getPriceForHouseDuringManage(true);
                        }
                        neighbourHouseCount--;
                    }
                }
            });
            this.uncommittedHousesPrice -= sellPrice;

            return true;
        }

        commitHouseOrHotel(playerName: string, focusedAssetGroupIndex: number): boolean {
            if (!this.hasMonopoly(playerName, focusedAssetGroupIndex)) {
                return false;
            }    
            var firstFocusedBoardField = this.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            var boardFields = this.game.board.fields.filter(f => f.type === Model.BoardFieldType.Asset && f.asset.group === firstFocusedBoardField.asset.group);
            var totalPrice = 0;
            var that = this;
            boardFields.forEach(boardField => {
                totalPrice += boardField.asset.uncommittedPrice();
                boardField.asset.commitHouseOrHotel();
            });
            var player = that.game.players.filter(p => p.playerName === playerName)[0];
            player.money -= totalPrice;
            return true;
        }

        rollbackHouseOrHotel(playerName: string, focusedAssetGroupIndex: number): boolean {
            if (!this.hasMonopoly(playerName, focusedAssetGroupIndex)) {
                return false;
            }
            var firstFocusedBoardField = this.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            var boardFields = this.game.board.fields.filter(f => f.type === Model.BoardFieldType.Asset && f.asset.group === firstFocusedBoardField.asset.group);
            boardFields.forEach(boardField => {
                boardField.asset.rollbackHouseOrHotel();
            });
            return true;
        }

        canUpgradeAsset(asset: Model.Asset, playerName: string): boolean {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, asset.group)) {
                return false;
            }
            if (asset.hotel) {
                return false;
            }
            var groupAssets = this.getGroupBoardFields(asset.group).map(f => f.asset);
            if (groupAssets.filter(a => a.mortgage).length > 0) {
                return false;
            }
            var player = this.players.filter(p => p.playerName === playerName)[0];
            var requiredPrice = !asset.houses || asset.houses <= 3 ? asset.getPriceForHouseDuringManage(false) : asset.getPriceForHotelDuringManage(false);
            return player.money >= requiredPrice;
        }

        canDowngradeAsset(asset: Model.Asset, playerName: string): boolean {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, asset.group)) {
                return false;
            }

            if ((!asset.houses || asset.houses === 0) && !asset.hotel) {
                return false;
            }
            return true;
        }

        setDiceResult(diceResult: number) {
            this.lastDiceResult1 = diceResult;
            this.lastDiceResult2 = 0;
        }

        getNextTreasureCard(): Model.TreasureCard {
            var card = this.game.treasureCards.filter(c => c.index === this.currentTreasureCardIndex);
            if (!card || card.length === 0) {
                this.currentTreasureCardIndex = 0;
                card = this.game.treasureCards.filter(c => c.index === this.currentTreasureCardIndex);
            }
            this.currentTreasureCardIndex++;
            return card[0];
        }

        getNextEventCard(): Model.EventCard {
            var card = this.game.eventCards.filter(c => c.index === this.currentEventCardIndex);
            if (!card || card.length === 0) {
                this.currentEventCardIndex = 0;
                card = this.game.eventCards.filter(c => c.index === this.currentEventCardIndex);
            }
            this.currentEventCardIndex++;
            return card[0];
        }

        processCard(card: Model.Card) {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            if (card.cardType === Model.CardType.ReceiveMoney) {
                player.money += card.money;
            }
            if (card.cardType === Model.CardType.PayMoney) {
                player.money -= card.money;
            }
            if (card.cardType === Model.CardType.AdvanceToField) {
                if (card.boardFieldIndex === 0 && card.skipGoAward) {
                    this.game.moveContext.skipGoAward = true;
                }
            }
        }

        processTax(boardFieldType: Model.BoardFieldType): number {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            if (boardFieldType === Model.BoardFieldType.Tax) {
                player.money -= 100;
                return 100;
            }
            if (boardFieldType === Model.BoardFieldType.TaxIncome) {
                player.money -= 200;
                return 200;
            }
            return 0;
        }

        processPrison(wasSentToPrison: boolean) {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            if (player.turnsInPrison === undefined) {
                if (wasSentToPrison) {
                    player.turnsInPrison = 3;
                }
            } else {
                if (player.turnsInPrison > 0) {
                    player.turnsInPrison--;
                }
            }
        }

        // process intermediate board fields while moving a player to its destination field
        processFlyBy(positionIndex: number): Model.ProcessingEvent {
            var processedEvent = Model.ProcessingEvent.None;
            if (positionIndex === 0) {
                if (this.game.moveContext.skipGoAward === false) {
                    var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                    player.money += 200;
                    processedEvent = Model.ProcessingEvent.PassGoAward;
                }
            }

            return processedEvent;
        }

        toggleMortgageAsset(asset: Model.Asset): boolean {
            var owner = this.players.filter(p => p.playerName === asset.owner)[0];
            if (asset.mortgage) {                
                if (owner.money >= Math.floor(asset.valueMortgage * 1.1)) {
                    owner.money -= Math.floor(asset.valueMortgage * 1.1);
                    asset.releaseMortgage();
                } else {
                    return false;
                }
            } else {
                owner.money += asset.valueMortgage;
                asset.putUnderMortgage();
            }
            return true;
        }

        // get fields in management group, identified by its index in the manage group array
        getBoardFieldsInGroup(focusedAssetGroupIndex: number): Model.BoardField[] {
            var groupFieldIndexes = this.manageGroups[focusedAssetGroupIndex];
            return this.game.board.fields.filter(f => groupFieldIndexes.filter(g => g === f.index).length > 0);
        }

        canMortgage(asset: Model.Asset): boolean {
            if (!asset) {
                return false;
            }
            var canMortgage = !asset.unowned && asset.owner === this.getCurrentPlayer();
            if (asset.group === Model.AssetGroup.Railway || asset.group === Model.AssetGroup.Utility) {
                return canMortgage;
            } 
            if (canMortgage) {
                var groupAssets = this.getGroupBoardFields(asset.group).map(f => f.asset);
                groupAssets.forEach(a => {
                    if ((a.houses && a.houses > 0) || a.hotel) {
                        canMortgage = false;
                    }
                });
            }
            return canMortgage;
        }

        private initPlayers() {
            var settings = this.settingsService.loadSettings();
            var colors: string[] = ["Red", "Green", "Yellow", "Blue"];
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player();
                player.playerName = i === 0 ? settings.playerName : "Computer " + i;
                player.human = i === 0;
                player.money = 1500;
                player.color = i;
                player.active = true;
                this.game.players.push(player);
                this.setPlayerPosition(player, 0);
            }
        }

        private initCards() {
            this.currentEventCardIndex = 0;
            this.currentTreasureCardIndex = 0;
            var treasureCardIndex = 0;
            var eventCardIndex = 0;
            var treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Bank error. You receive M200.";
            treasureCard.money = 200;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You have won second award at the beauty competition. You receive M10.";
            treasureCard.money = 10;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.AdvanceToField;
            treasureCard.message = "Go to START. You receive M200.";
            treasureCard.boardFieldIndex = 0;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Pay M100 for hospital expenses.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);

            var eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.PayMoney;
            eventCard.message = "You have received a speeding ticket. Pay M15.";
            eventCard.money = 15;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.RetractNumFields;
            eventCard.message = "Go three fields backwards.";
            eventCard.boardFieldCount = 3;
            this.game.eventCards.push(eventCard);

            var eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.ReceiveMoney;
            eventCard.message = "Bank has issued dividends worth of M50.";
            eventCard.money = 50;
            this.game.eventCards.push(eventCard);
        }

        private initManageGroups() {
            this.manageGroups = new Array<Array<number>>();
            var manageGroup = this.getGroupBoardFields(Model.AssetGroup.First).map(f => f.index);
            this.manageGroups.push(manageGroup);
            manageGroup = [5];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Second).map(f => f.index);
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Third).map(f => f.index);
            manageGroup.push(12);
            this.manageGroups.push(manageGroup);
            manageGroup = [15];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Fourth).map(f => f.index);
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Fifth).map(f => f.index);
            this.manageGroups.push(manageGroup);
            manageGroup = [25];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Sixth).map(f => f.index);
            manageGroup.push(28);
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Seventh).map(f => f.index);
            this.manageGroups.push(manageGroup);
            manageGroup = [35];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Eighth).map(f => f.index);
            this.manageGroups.push(manageGroup);
        }

        private letOutOfPrison(player: Model.Player): boolean {
            if (player.turnsInPrison === undefined) {
                return true;
            }
            if (this.lastDiceResult1 === 6) {
                player.turnsInPrison = undefined;
                return true;
            }
            if (player.turnsInPrison && player.turnsInPrison > 0) {
                return false;
            }
            return false;
        }
    }

    monopolyApp.service("gameService", GameService);
} 