module Model {
    export class Player {
        constructor() {
            this.playerName = "";
            this.human = false;
        }
        playerName: string;
        human: boolean;
        color: string;
    }
} 