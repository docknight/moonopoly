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
        gameState: Model.GameState;
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
        setDiceResult(diceResult: number);
    }
    export interface IDrawingService {
        boardSize: number;
        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player);
        animatePlayerMove(oldPositionIndex: Model.BoardField, newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player, scene: BABYLON.Scene);
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
        animateDiceThrow(impulsePoint: BABYLON.Vector3, scene: BABYLON.Scene);
        isDiceAtRestAfterThrowing(scene: BABYLON.Scene): boolean; // whether the dice has come to rest after being thrown
        setupDiceForThrow(scene: BABYLON.Scene);
        getDiceLocation(scene: BABYLON.Scene): BABYLON.Vector3;
        getDiceResult(): number;
        // get the rotation required for the camera to face the target; position determines the camera position, if it is not equal to its current position
        getCameraRotationForTarget(target: BABYLON.Vector3, camera: BABYLON.FreeCamera, position?: BABYLON.Vector3): BABYLON.Vector3;
        returnCameraToMainPosition(scene: BABYLON.Scene, camera: BABYLON.FreeCamera): JQueryDeferred<{}>;
    }
}