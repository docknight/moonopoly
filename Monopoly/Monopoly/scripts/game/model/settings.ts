module Model {    
    export class Settings {
        constructor() {
            this.numPlayers = 2;
            this.players = [new Model.Player("Player 1", true), new Model.Player("Computer 1", false)];
            this.rules = new Rules();
        }
        numPlayers: number;
        players: Array<Model.Player>;
        tutorial: boolean; // whether the tutorial mode is enabled when starting a new game
        rules: Model.Rules;
    }
} 