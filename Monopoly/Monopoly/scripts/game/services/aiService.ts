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
    }

    monopolyApp.service("aiService", AIService);
}
