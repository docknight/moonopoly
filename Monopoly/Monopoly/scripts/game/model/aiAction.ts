module Model {
    export enum AIActionType { Buy, Mortgage, Unmortgage, SellHotel, SellHouse, BuyHotel, BuyHouse, Surrender, GetOutOfJail };

    export class AIAction {
        actionType: AIActionType;
        asset: Model.Asset;
        position: number;
        numHousesOrHotels: number;
        assetGroup: Model.AssetGroup; // group where houses or hotels are being bought
    }
}
