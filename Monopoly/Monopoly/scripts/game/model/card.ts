module Model {
    export enum CardType { PayMoney, PayMoneyToPlayers, ReceiveMoney, ReceiveMoneyFromPlayers, AdvanceToField, AdvanceToRailway, RetractNumFields, JumpToField, Maintenance, OwnMaintenance };

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
        pricePerHouse: number;
        pricePerHotel: number;
    }
} 