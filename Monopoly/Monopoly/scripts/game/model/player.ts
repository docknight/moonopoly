module Model {
    export enum PlayerColor { Red, Blue, Green, Yellow };

    export class Player {
        constructor() {
            this.playerName = "";
            this.human = false;
        }
        playerName: string;
        human: boolean;
        color: PlayerColor;
        money: number;
        position: BoardField;
        turnsInPrison: number;
        active: boolean;
    }
} 