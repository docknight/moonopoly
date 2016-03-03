module Model {
    export enum AIActionType { Buy, Mortgage, SellHotel, SellHouse, Surrender };

    export class AIAction {
        actionType: AIActionType;
        asset: Model.Asset;
        position: number;
    }
}
