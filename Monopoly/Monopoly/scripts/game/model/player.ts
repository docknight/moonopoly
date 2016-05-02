module Model {
    export enum PlayerColor { Red, Blue, Green, Yellow };

    export class Player {
        constructor(name: string, human: boolean) {
            this.playerName = name;
            this.human = human;
        }

        playerName: string;
        human: boolean;
        color: PlayerColor;
        money: number;
        position: BoardField;
        turnsInPrison: number;
        active: boolean;

        public loadDataFrom(savedPlayer: Player, board: Board) {
            this.playerName = savedPlayer.playerName;
            this.human = savedPlayer.human;
            this.color = savedPlayer.color;
            this.money = savedPlayer.money;
            this.turnsInPrison = savedPlayer.turnsInPrison;
            this.active = savedPlayer.active;
            var playerPositionIndex = savedPlayer.position.index;
            this.position = board.fields.filter(f => f.index === playerPositionIndex)[0];
        }
    }
} 