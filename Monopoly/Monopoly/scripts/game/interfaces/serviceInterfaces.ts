module Interfaces {
    export interface ISettingsService {
        loadSettings: () => Model.Settings;
        saveSettings(settings: Model.Settings);
    }
    export interface IGameService {
        initGame();
        getCurrentPlayer(): string;
        endTurn();
    }

}