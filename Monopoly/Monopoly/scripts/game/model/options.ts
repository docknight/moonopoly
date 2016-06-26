module Model {
    export class Options {
        constructor() {
            this.tutorial = true;
            this.sound = false;
        }
        tutorial: boolean; // whether the tutorial mode is enabled when starting a new game
        sound: boolean; // whether the game sounds are enabled
        music: boolean; // whether the game music is enabled
    }
} 