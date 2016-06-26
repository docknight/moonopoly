module Model {    
    export class Settings {
        constructor() {
            this.numPlayers = 2;
            this.players = [new Model.Player("Player 1", true), new Model.Player("Apollo", false)];
            this.rules = new Rules();
        }
        numPlayers: number;
        players: Array<Model.Player>;
        rules: Model.Rules;
    }
} 