/// <reference path="../interfaces/serviceInterfaces.ts" />
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

        public initGame(loadGame?: boolean) {
            this.game = new Model.Game();
            if (loadGame) {
                this.loadGame();
            } else {
                this.initPlayers();
                this.initCards();                
            }
            this.initManageGroups();
            if (!loadGame) {
                this.game.advanceToNextPlayer();
            }
            this.uncommittedHousesPrice = 0;
            //this.setupTestData();
        }

        public saveGame() {
            var gameString = JSON.stringify(this.game);
            localStorage.setItem("game", gameString);    
            gameString = localStorage.getItem("game");
        }

        public loadGame() {
            var gameString = localStorage.getItem("game");
            if (gameString) {
                this.game = new Model.Game();
                var savedGame: Model.Game = JSON.parse(gameString);
                this.game.loadDataFrom(savedGame);
            }
        }

        public endTurn() {
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

        get gameParams(): Model.GameParams {
            return this.game ? this.game.gameParams : undefined;
        }

        get lastDiceResult(): number {
            if (!this.lastDiceResult1 && !this.lastDiceResult2) {
                return undefined;
            }
            return this.lastDiceResult1 + this.lastDiceResult2;
        }

        get anyFlyByEvents(): boolean {
            return this.game.moveContext && this.game.moveContext.flyByEvents.length > 0;
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
            if (this.game.getState() === Model.GameState.ProcessingDone || this.game.getState() === Model.GameState.Manage) {
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
            if (this.game.getState() === Model.GameState.ProcessingDone) {
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
            if (this.game.getState() === Model.GameState.Move || this.game.getState() === Model.GameState.Process || this.game.getState() === Model.GameState.ThrowDice) {
                return false;
            }

            return true;
        }

        get canGetOutOfJail(): boolean {
            if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.ProcessingDone) {
                var currentPosition = this.getCurrentPlayerPosition();
                if (currentPosition.type === Model.BoardFieldType.PrisonAndVisit) {
                    var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                    if (player.turnsInPrison !== undefined && player.money >= this.gameParams.jailBail) {
                        if (this.game.getState() === Model.GameState.BeginTurn) {
                            return true;
                        }
                        if (this.game.getState() === Model.GameState.ProcessingDone && player.turnsInPrison === 0 && this.lastDiceResult !== 6) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        get canSurrender(): boolean {
            if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.ProcessingDone) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                if (player.money < 0 && player.active) {
                    return true;
                }
                if (player.money < this.gameParams.jailBail && player.turnsInPrison === 0 && this.lastDiceResult !== 6) {
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

        get isComputerMove(): boolean {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            return !player.human;
        }

        public setPlayerPosition(player: Model.Player, boardFieldIndex: number) {
            player.position = this.game.board.fields[boardFieldIndex];
            var previousFields = this.game.board.fields.filter(b => b.occupiedBy != null && b.occupiedBy.filter(ocb => ocb === player.playerName).length > 0);
            if (previousFields && previousFields.length > 0) {
                var previousField = previousFields[0];
                previousField.occupiedBy.splice(previousField.occupiedBy.indexOf(player.playerName));
            }

            player.position.occupiedBy.push(player.playerName);
        }

        public throwDice() {
            this.game.setState(Model.GameState.ThrowDice);
        }

        public buy(): boolean {
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

        public manage(): number {
            if (this.canManage) {
                this.game.setState(Model.GameState.Manage);
                this.currentManageGroupIndex = 0;
            } else {
                this.currentManageGroupIndex = undefined;
            }

            return this.currentManageGroupIndex;
        }

        public manageFocusChange(left: boolean): number {
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

        public returnFromManage() {
            if (this.game.getState() === Model.GameState.Manage) {
                this.game.setPreviousState();
            }
        }

        public getOutOfJail() {
            if (this.canGetOutOfJail) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                player.money -= this.gameParams.jailBail;
                player.turnsInPrison = undefined;
            }    
        }

        public surrender() {
            if (this.canSurrender) {
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                player.active = false;
                var activePlayers = this.game.players.filter(p => p.active);
                if (activePlayers && activePlayers.length === 1) {
                    this.game.setState(Model.GameState.EndOfGame);
                }
            }
        }

        public getCurrentPlayerPosition(): Model.BoardField {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            return player.position;
        }

        public getPlayerAssets(playerName: string): Array<Model.Asset> {
            return this.game.board.fields.filter(f => f.type === Model.BoardFieldType.Asset && f.asset.owner === playerName).map(f => f.asset);
        }

        // get asset groups entirely owned by given player
        public getPlayerAssetGroups(playerName: string): Array<Model.AssetGroup> {
            var playerGroups: Array<Model.AssetGroup> = [];
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            groups.forEach(group => {
                var groupFields = this.getGroupBoardFields(group);
                if (groupFields.every(field => !field.asset.unowned && field.asset.owner === playerName)) {
                    playerGroups.push(group);
                }
            });
            return playerGroups;
        }

        moveCurrentPlayer(newPositionIndex?: number, doubleRent?: boolean): Model.BoardField {
            this.game.setState(Model.GameState.Move);
            this.game.moveContext.reset();
            if (doubleRent) {
                this.game.moveContext.doubleRent = doubleRent;
            }
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
                } else if (asset.houses && asset.houses > 0) {
                    priceToPay = asset.priceRentHouse[asset.houses - 1];
                } else {
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
                }
                var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                if (this.game.moveContext.doubleRent) {
                    priceToPay *= 2;
                }
                player.money -= priceToPay;
                var ownerPlayer = this.game.players.filter(p => p.playerName === asset.owner)[0];
                ownerPlayer.money += priceToPay;
                result.message = this.getCurrentPlayer() + " paid rent of " + priceToPay + " to " + ownerPlayer.playerName + ".";
            }

            return result;
        }

        public moveProcessingDone() {
            if (this.game.getState() === Model.GameState.Process) {
                this.game.setState(Model.GameState.ProcessingDone);
            }
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

        hasMonopoly(player: string, focusedAssetGroupIndex: number, assetGroup?: Model.AssetGroup): boolean {
            var monopoly = true;
            if (!assetGroup) {
                var firstAssetIndex = this.manageGroups[focusedAssetGroupIndex][0];
                assetGroup = this.getBoardFieldGroup(firstAssetIndex);
            }
            if (assetGroup < Model.AssetGroup.First || assetGroup > Model.AssetGroup.Eighth) {
                return false;
            }

            var groupFields = this.getGroupBoardFields(assetGroup);
            groupFields.forEach(field => {
                if (field.asset.unowned || field.asset.owner !== this.getCurrentPlayer()) {
                    monopoly = false;
                }
            });

            return monopoly;
        }

        // determine the first asset that is eligible for upgrade in a group and then perform the upgrade
        public addHousePreviewForGroup(playerName: string, group: Model.AssetGroup): boolean {
            var groupFields = this.getGroupBoardFields(group);
            var sortedFields = groupFields.sort((a, b) => {
                if (a.asset.hotel && b.asset.hotel) {
                    return 0;
                }
                if (a.asset.hotel) {
                    return 1;
                }
                if (b.asset.hotel) {
                    return -1;
                }

                if (!a.asset.houses && !b.asset.houses) {
                    return 0;
                }
                if (!a.asset.houses && b.asset.houses) {
                    return -1;
                }
                if (a.asset.houses && !b.asset.houses) {
                    return 1;
                }
                return a.asset.houses > b.asset.houses ? 1 : -1;
            });
            return this.addHousePreview(playerName, sortedFields[0].index);
        }

        public addHousePreview(playerName: string, position: number): boolean {
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

        public removeHousePreview(playerName: string, position: number): boolean {
            var boardField = this.game.board.fields.filter(f => f.index === position)[0];
            if (!boardField.asset || !this.hasMonopoly(playerName, 0, boardField.asset.group) || (!boardField.asset.houses && !boardField.asset.hotel)) {
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

        public commitHouseOrHotel(playerName: string, focusedAssetGroupIndex: number, assetGroup?: Model.AssetGroup): boolean {
            if (!this.hasMonopoly(playerName, focusedAssetGroupIndex, assetGroup)) {
                return false;
            }    
            var firstFocusedBoardField = assetGroup ? this.getGroupBoardFields(assetGroup)[0] : this.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
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

        public rollbackHouseOrHotel(playerName: string, focusedAssetGroupIndex: number): boolean {
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

        // check if the asset can be upgraded
        // all currently uncommitted houses and hotels are taken into account; 
        // also, a purchase of a house/ hotel might require simultaneous purchase of a house on the neighbouring assets
        public canUpgradeAsset(asset: Model.Asset, playerName: string): boolean {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, 0, asset.group)) {
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
            groupAssets.forEach(groupAsset => {
                requiredPrice += groupAsset.uncommittedPrice();
                if (groupAsset.name !== asset.name) {
                    if (groupAsset.houses < asset.houses) {
                        requiredPrice += (asset.houses - groupAsset.houses) * groupAsset.getPriceForHouseDuringManage(false);
                    }
                }
            });

            return player.money >= requiredPrice;
        }

        public canDowngradeAsset(asset: Model.Asset, playerName: string): boolean {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, 0, asset.group)) {
                return false;
            }

            if ((!asset.houses || asset.houses === 0) && !asset.hotel) {
                return false;
            }
            return true;
        }

        public getAssetGroup(position: number): Model.AssetGroup {
            return this.game.board.fields.filter(f => f.index === position).map(f => f.type === Model.BoardFieldType.Asset ? f.asset.group : undefined)[0];
        }

        public setDiceResult(diceResult: number) {
            this.lastDiceResult1 = diceResult;
            this.lastDiceResult2 = 0;
        }

        public getNextTreasureCard(): Model.TreasureCard {
            var card = this.game.treasureCards.filter(c => c.index === this.currentTreasureCardIndex);
            if (!card || card.length === 0) {
                this.currentTreasureCardIndex = 0;
                card = this.game.treasureCards.filter(c => c.index === this.currentTreasureCardIndex);
            }
            this.currentTreasureCardIndex++;
            return card[0];
        }

        public getNextEventCard(): Model.EventCard {
            var card = this.game.eventCards.filter(c => c.index === this.currentEventCardIndex);
            if (!card || card.length === 0) {
                this.currentEventCardIndex = 0;
                card = this.game.eventCards.filter(c => c.index === this.currentEventCardIndex);
            }
            this.currentEventCardIndex++;
            return card[0];
        }

        public processCard(card: Model.Card) {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            if (card.cardType === Model.CardType.ReceiveMoney) {
                player.money += card.money;
            }
            if (card.cardType === Model.CardType.PayMoney) {
                player.money -= card.money;
            }
            if (card.cardType === Model.CardType.ReceiveMoneyFromPlayers) {
                this.game.players.forEach(p => {
                    if (p.playerName !== player.playerName && p.active) {
                        player.money += card.money;
                        p.money -= card.money;
                    }
                });
            }
            if (card.cardType === Model.CardType.PayMoneyToPlayers) {
                this.game.players.forEach(p => {
                    if (p.playerName !== player.playerName && p.active) {
                        player.money -= card.money;
                        p.money += card.money;
                    }
                });
            }
            if (card.cardType === Model.CardType.AdvanceToField) {
                if (card.boardFieldIndex === 0 && card.skipGoAward) {
                    this.game.moveContext.skipGoAward = true;
                }
            }
            if (card.cardType === Model.CardType.JumpToField) {
                if (card.boardFieldIndex !== 10) {
                    this.moveCurrentPlayer(card.boardFieldIndex);
                }
            }
            if (card.cardType === Model.CardType.Maintenance || card.cardType === Model.CardType.OwnMaintenance) {
                card.money = 0;
                this.game.board.fields.forEach(f => {
                    if (f.type === Model.BoardFieldType.Asset && !f.asset.unowned) {
                        if (f.asset.owner === this.getCurrentPlayer() || card.cardType === Model.CardType.Maintenance) {
                            var money = 0;
                            if (f.asset.hotel) {
                                money = card.pricePerHotel;
                            } else if (f.asset.houses) {
                                money += f.asset.houses * card.pricePerHouse;
                            }
                            player.money -= money;
                            card.money += money;
                        }
                    }
                });
            }
        }

        public processTax(boardFieldType: Model.BoardFieldType): number {
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

        public processPrison(wasSentToPrison: boolean): boolean {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            if (player.turnsInPrison === undefined) {
                if (wasSentToPrison) {
                    player.turnsInPrison = 3;
                    return true;
                } else {
                    return false;
                }
            } else {
                if (player.turnsInPrison > 0) {
                    player.turnsInPrison--;
                }
                return true;
            }
        }

        // process intermediate board fields while moving a player to its destination field
        public processFlyBy(positionIndex: number, backwards?: boolean): Model.ProcessingEvent {
            var processedEvent = Model.ProcessingEvent.None;
            if (positionIndex === 0 && !backwards) {
                if (this.game.moveContext.skipGoAward === false) {
                    var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                    player.money += 200;
                    processedEvent = Model.ProcessingEvent.PassGoAward;
                    this.game.moveContext.flyByEvents.push(processedEvent);
                }
            }

            return processedEvent;
        }

        public toggleMortgageAsset(asset: Model.Asset): boolean {
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
        public getBoardFieldsInGroup(focusedAssetGroupIndex: number): Model.BoardField[] {
            var groupFieldIndexes = this.manageGroups[focusedAssetGroupIndex];
            return this.game.board.fields.filter(f => groupFieldIndexes.filter(g => g === f.index).length > 0);
        }

        public canMortgage(asset: Model.Asset): boolean {
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

        private setupTestData() {
            var player = this.game.players[1];
            this.game.board.fields[1].asset.setOwner(player.playerName);
            this.game.board.fields[3].asset.setOwner(player.playerName);
            //this.toggleMortgageAsset(this.game.board.fields[1].asset);
            //this.toggleMortgageAsset(this.game.board.fields[3].asset);
            this.game.board.fields[1].asset.addHouse();
            this.game.board.fields[1].asset.commitHouseOrHotel();
            this.game.board.fields[3].asset.addHouse();
            this.game.board.fields[3].asset.addHouse();
            this.game.board.fields[3].asset.commitHouseOrHotel();
            player.money = 0;
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
            treasureCard.message = "Pay M100 for hospital treatment.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Doctor's fee. Pay M50";
            treasureCard.money = 50;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Yearly bonus. You receive M100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Life insurance payoff. You receive M100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Pay M50 for scholarship.";
            treasureCard.money = 50;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Personal income tax return. You receive M20.";
            treasureCard.money = 20;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.JumpToField;
            treasureCard.message = "Go directly to jail, without passing START.";
            treasureCard.boardFieldIndex = 10;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You receive M25 for counseling services.";
            treasureCard.money = 25;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoneyFromPlayers;
            treasureCard.message = "it's your birthday. You receive M10 from each player.";
            treasureCard.money = 10;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Personal income tax return. You receive M20.";
            treasureCard.money = 20;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.Maintenance;
            treasureCard.message = "Pay for road maintenance. M40 for each house and M115 for each hotel.";
            treasureCard.pricePerHouse = 40;
            treasureCard.pricePerHotel = 115;
            this.game.treasureCards.push(treasureCard);

            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You have inherited M100.";
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

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.ReceiveMoney;
            eventCard.message = "Bank has issued dividends worth of M50.";
            eventCard.money = 50;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to Terme Čatež. If you pass START, you receive M200.";
            eventCard.boardFieldIndex = 11;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.OwnMaintenance;
            eventCard.message = "Your houses are in need of renovation. Pay M25 for each house and M100 for each hotel.";
            eventCard.pricePerHouse = 25;
            eventCard.pricePerHotel = 100;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.PayMoneyToPlayers;
            eventCard.message = "You have been elected board chairman. Pay each player M50.";
            eventCard.money = 50;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToRailway;
            eventCard.message = "Go to the next railway station. If unowned, you may purchase it from the bank. Otherwise, pay double rent to the owner.";
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to Logarska dolina. If you pass START, you receive M200.";
            eventCard.boardFieldIndex = 24;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.ReceiveMoney;
            eventCard.message = "Building loan payment. You receive M150.";
            eventCard.money = 150;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToRailway;
            eventCard.message = "Go to the next railway station. If unowned, you may purchase it from the bank. Otherwise, pay double rent to the owner.";
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Take a trip to Jesenice. If you pass START, you receive M200.";
            eventCard.boardFieldIndex = 5;
            this.game.eventCards.push(eventCard);

            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to Portorož.";
            eventCard.boardFieldIndex = 39;
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