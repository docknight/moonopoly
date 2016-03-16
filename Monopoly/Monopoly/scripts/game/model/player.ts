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

        public loadDataFrom(savedPlayer: Player) {
            this.playerName = savedPlayer.playerName;
            this.human = savedPlayer.human;
            this.color = savedPlayer.color;
            this.money = savedPlayer.money;
            this.position = savedPlayer.position;
            this.turnsInPrison = savedPlayer.turnsInPrison;
            this.active = savedPlayer.active;
        }
    }
} 