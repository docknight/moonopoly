module Interfaces {
    export interface ISettingsService {
        loadSettings: () => Model.Settings;
        saveSettings(settings: Model.Settings);
    }
    export interface IGameService {
        players: Array<Model.Player>;
        initGame();
        getCurrentPlayer(): string;
        endTurn();
    }
    export interface IDrawingService {
        boardSize: number;
        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player);
    }
}