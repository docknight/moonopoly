module Model {
    export enum AIActionType { Buy, Sell };

    export class AIAction {
        actionType: AIActionType;
    }
}
