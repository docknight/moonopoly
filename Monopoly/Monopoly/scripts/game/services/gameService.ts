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
        private currentManageGroup: Model.AssetGroup;

        static $inject = ["$http", "settingsService"];
        constructor($http: ng.IHttpService, settingsService: Interfaces.ISettingsService) {
            this.httpService = $http;
            this.settingsService = settingsService;
        }

        initGame() {
            this.game = new Model.Game();
            this.initPlayers();
            this.game.advanceToNextPlayer();
        }

        endTurn() {
            if (this.canEndTurn) {
                this.game.advanceToNextPlayer();
                this.game.setState(Model.GameState.BeginTurn);
            }
        }

        getCurrentPlayer(): string {
            return this.game.currentPlayer;
        }

        get players(): Array<Model.Player> {
            return this.game.players;
        }

        get canThrowDice() {
            if (this.game.getState() === Model.GameState.BeginTurn) {
                return true;
            }
            return false;
        }

        get canEndTurn() {
            if (this.game.getState() !== Model.GameState.BeginTurn) {
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
            this.lastDiceResult1 = 1;
            this.lastDiceResult2 = 0;
        }

        buy() {
            if (this.canBuy) {
                var asset = this.getCurrentPlayerPosition().asset;
                if (asset) {
                    var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
                    player.money -= asset.price;
                    asset.setOwner(this.getCurrentPlayer());
                }
            }
        }

        manage(): Model.AssetGroup {
            if (this.canManage) {
                this.game.setState(Model.GameState.Manage);
                this.currentManageGroup = Model.AssetGroup.First;
            } else {
                this.currentManageGroup = undefined;
            }

            return this.currentManageGroup;
        }

        manageFocusChange(left: boolean): Model.AssetGroup {
            if (this.game.getState() === Model.GameState.Manage) {
                if (left) {
                    this.currentManageGroup -= 1;
                    if (this.currentManageGroup < Model.AssetGroup.First) {
                        this.currentManageGroup = Model.AssetGroup.Eighth;
                    }                    
                } else {
                    this.currentManageGroup += 1;
                    if (this.currentManageGroup > Model.AssetGroup.Eighth) {
                        this.currentManageGroup = Model.AssetGroup.First;
                    }
                }
            }

            return this.currentManageGroup;
        }

        returnFromManage() {
            if (this.game.getState() === Model.GameState.Manage) {
                this.game.setPreviousState();
            }
        }

        getCurrentPlayerPosition(): Model.BoardField {
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            return player.position;
        }

        moveCurrentPlayer(): Model.BoardField {
            this.game.setState(Model.GameState.Move);
            var player = this.game.players.filter(p => p.playerName === this.getCurrentPlayer())[0];
            var currentPositionIndex = player.position.index;
            var newPositionIndex = Math.floor((currentPositionIndex + this.lastDiceResult1 + this.lastDiceResult2) % 40);
            player.position = this.game.board.fields[newPositionIndex];
            this.game.board.fields[currentPositionIndex].occupiedBy.splice(this.game.board.fields[currentPositionIndex].occupiedBy.indexOf(player.playerName), 1);
            player.position.occupiedBy.push(player.playerName);
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

        private initPlayers() {
            var settings = this.settingsService.loadSettings();
            var colors: string[] = ["Red", "Green", "Yellow", "Blue"];
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player();
                player.playerName = i === 0 ? settings.playerName : "Computer " + i;
                player.human = i === 0;
                player.money = 1500;
                player.color = colors[i];
                this.game.players.push(player);
                this.setPlayerPosition(player, 0);
            }
        }
    }

    monopolyApp.service("gameService", GameService);
} 