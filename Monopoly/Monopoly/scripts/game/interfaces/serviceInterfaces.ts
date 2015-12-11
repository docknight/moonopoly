module Interfaces {
    export interface ISettingsService {
        loadSettings: () => Model.Settings;
        saveSettings(settings: Model.Settings);
    }
    export interface IGameService {
        players: Array<Model.Player>;
        canThrowDice: boolean;
        canEndTurn: boolean;
        initGame();
        getCurrentPlayer(): string;
        endTurn();
        throwDice();
        getCurrentPlayerPosition(): Model.BoardField;
        moveCurrentPlayer(): Model.BoardField;
    }
    export interface IDrawingService {
        boardSize: number;
        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player);
        animatePlayerMove(oldPositionIndex: Model.BoardField, newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player);
    }
}