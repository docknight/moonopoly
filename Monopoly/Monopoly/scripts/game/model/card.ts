module Model {
    export enum CardType { PayMoney, ReceiveMoney, AdvanceToField, RetractNumFields };

    export class Card {
        constructor() {
        }
        cardType: CardType;
        message: string;
        money: number; // money to pay or receive
        index: number; // card index
        boardFieldIndex: number;
        boardFieldCount: number;
        skipGoAward: boolean;
    }
} 