module Interfaces {
    export interface ISettingsService {
        loadSettings: () => Model.Settings;
        saveSettings(settings: Model.Settings);
    }
    export interface IGameService {
        players: Array<Model.Player>;
        canThrowDice: boolean;
        canEndTurn: boolean;
        canBuy: boolean;
        canManage: boolean;
        initGame();
        getCurrentPlayer(): string;
        endTurn();
        throwDice();
        getCurrentPlayerPosition(): Model.BoardField;
        moveCurrentPlayer(): Model.BoardField;
        buy(): boolean;
        processOwnedFieldVisit(): Model.ProcessResult;
        manage(): Model.AssetGroup;
        manageFocusChange(left: boolean): Model.AssetGroup;
        returnFromManage();
        getGroupBoardFields(assetGroup: Model.AssetGroup): Array<Model.BoardField>;
        getBoardFieldGroup(boardFieldIndex: number): Model.AssetGroup;
        hasMonopoly(player: string, assetGroup: Model.AssetGroup): boolean;
        addHousePreview(playerName: string, position: number): boolean;
        removeHousePreview(playerName: string, position: number): boolean;
        commitHouseOrHotel(playerName: string, assetGroup: Model.AssetGroup): boolean;
        rollbackHouseOrHotel(playerName: string, assetGroup: Model.AssetGroup): boolean;
        canUpgradeAsset(asset: Model.Asset, playerName: string): boolean;
    }
    export interface IDrawingService {
        boardSize: number;
        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player);
        animatePlayerMove(oldPositionIndex: Model.BoardField, newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player);
        setGameCameraPosition(camera: BABYLON.FreeCamera);
        setManageCameraPosition(camera: BABYLON.ArcRotateCamera, group: Model.AssetGroup, scene: BABYLON.Scene);
        returnFromManage(scene: BABYLON.Scene);
        pickBoardElement(scene: BABYLON.Scene, coords?: any): MonopolyApp.Viewmodels.PickedObject;
        createBoard(scene: BABYLON.Scene);
        setBoardFieldOwner(boardField: MonopolyApp.Viewmodels.BoardField, asset: Model.Asset, scene: BABYLON.Scene);
        setBoardFieldHouses(viewBoardField: MonopolyApp.Viewmodels.BoardField, houses: number, hotel: boolean, scene: BABYLON.Scene);
        loadMeshes(players: MonopolyApp.Viewmodels.Player[], scene: BABYLON.Scene, gameController: MonopolyApp.controllers.GameController): JQueryDeferred<{}>[];
        showHouseButtons(focusedAssetGroup: Model.AssetGroup, scene: BABYLON.Scene);
        onSwipeMove(scene: BABYLON.Scene, coords: any);
        onSwipeEnd(scene: BABYLON.Scene, coords: any): MonopolyApp.Viewmodels.PickedObject;
        showActionButtons();
    }
}