module Interfaces {
    export interface ISettingsService {
        loadSettings: () => Model.Settings;
        saveSettings(settings: Model.Settings);
    }
    export interface IGameService {
        players: Array<Model.Player>;
        lastDiceResult: number;
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
        moveCurrentPlayer(newPositionIndex?: number): Model.BoardField;
        buy(): boolean;
        processOwnedFieldVisit(): Model.ProcessResult;
        manage(): number;
        manageFocusChange(left: boolean): Model.AssetGroup;
        returnFromManage();
        getGroupBoardFields(assetGroup: Model.AssetGroup): Array<Model.BoardField>;
        getBoardFieldGroup(boardFieldIndex: number): Model.AssetGroup;
        hasMonopoly(player: string, focusedAssetGroupIndex: number): boolean;
        addHousePreview(playerName: string, position: number): boolean;
        removeHousePreview(playerName: string, position: number): boolean;
        commitHouseOrHotel(playerName: string, focusedAssetGroupIndex: number): boolean;
        rollbackHouseOrHotel(playerName: string, focusedAssetGroupIndex: number): boolean;
        canUpgradeAsset(asset: Model.Asset, playerName: string): boolean;
        canDowngradeAsset(asset: Model.Asset, playerName: string): boolean;
        setDiceResult(diceResult: number);
        getNextTreasureCard(): Model.TreasureCard;
        getNextEventCard(): Model.EventCard;
        processCard(card: Model.Card);
        processTax(boardFieldType: Model.BoardFieldType): number;
        processFlyBy(positionIndex: number): Model.ProcessingEvent;
        toggleMortgageAsset(asset: Model.Asset): boolean;
        
        // get fields in management group, identified by its index in the manage group array
        getBoardFieldsInGroup(focusedAssetGroupIndex: number): Array<Model.BoardField>;
        canMortgage(asset: Model.Asset): boolean;
    }
    export interface IDrawingService {
        boardSize: number;
        framesToMoveOneBoardField: number;
        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player);
        animatePlayerMove(oldPositionIndex: Model.BoardField, newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player, scene: BABYLON.Scene, fast?: boolean): JQueryDeferred<{}>;
        animatePlayerPrisonMove(newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player, scene: BABYLON.Scene, camera: BABYLON.FreeCamera): JQueryDeferred<{}>;
        setGameCameraInitialPosition(camera: BABYLON.FreeCamera);
        setManageCameraPosition(camera: BABYLON.ArcRotateCamera, focusedAssetGroupIndex: number, scene: BABYLON.Scene);
        returnFromManage(scene: BABYLON.Scene);
        pickBoardElement(scene: BABYLON.Scene, coords?: any): MonopolyApp.Viewmodels.PickedObject;
        createBoard(scene: BABYLON.Scene);
        setBoardFieldOwner(boardField: MonopolyApp.Viewmodels.BoardField, asset: Model.Asset, scene: BABYLON.Scene);
        setBoardFieldHouses(viewBoardField: MonopolyApp.Viewmodels.BoardField, houses: number, hotel: boolean, scene: BABYLON.Scene);
        loadMeshes(players: MonopolyApp.Viewmodels.Player[], scene: BABYLON.Scene, gameController: MonopolyApp.controllers.GameController): JQueryDeferred<{}>[];
        showHouseButtons(focusedAssetGroupIndex: number, scene: BABYLON.Scene);
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
        returnCameraToMainPosition(scene: BABYLON.Scene, camera: BABYLON.FreeCamera, currentPlayerPositionIndex: number, numFrames?: number): JQueryDeferred<{}>;
        moveCameraForDiceThrow(scene: BABYLON.Scene, camera: BABYLON.FreeCamera, currentPlayerPosition: Model.BoardField);
    }
}