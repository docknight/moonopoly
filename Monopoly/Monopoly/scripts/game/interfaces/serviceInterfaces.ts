module Interfaces {
    export interface ISettingsService {
        settings: Model.Settings;
        options: Model.Options;
        loadSettings: () => Model.Settings;       
        saveSettings(settings: Model.Settings);
        loadOptions: () => Model.Options;
        saveOptions(options: Model.Options);
    }
    export interface IGameService {
        players: Array<Model.Player>;
        gameParams: Model.GameParams;
        lastDiceResult: number;
        anyFlyByEvents: boolean;
        canThrowDice: boolean;
        canEndTurn: boolean;
        canBuy: boolean;
        canManage: boolean;
        canTrade: boolean;
        canGetOutOfJail: boolean;
        canSurrender: boolean;
        canPause: boolean;
        winner: string;
        gameState: Model.GameState;
        isComputerMove: boolean;
        initGame(loadGame?: boolean);
        saveGame();
        loadGame();
        cloneGame(): Model.Game;
        getCurrentPlayer(): string;
        endTurn();
        throwDice();
        getCurrentPlayerPosition(): Model.BoardField;
        moveCurrentPlayer(newPositionIndex?: number, doubleRent?: boolean): Model.BoardField;
        buy(): boolean;
        surrender();
        processOwnedFieldVisit(): Model.ProcessResult;
        manage(): number;
        manageFocusChange(left: boolean): Model.AssetGroup;
        returnFromManage();
        getGroupBoardFields(assetGroup: Model.AssetGroup): Array<Model.BoardField>;
        getBoardFieldGroup(boardFieldIndex: number): Model.AssetGroup;
        getPlayerAssets(playerName: string): Array<Model.Asset>;
        getPlayerAssetGroups(playerName: string): Array<Model.AssetGroup>;
        hasMonopoly(player: string, focusedAssetGroupIndex: number, assetGroup?: Model.AssetGroup): boolean;
        addHousePreview(playerName: string, position: number): boolean;
        addHousePreviewForGroup(playerName: string, group: Model.AssetGroup): boolean;
        removeHousePreview(playerName: string, position: number): boolean;
        commitHouseOrHotel(playerName: string, focusedAssetGroupIndex: number, assetGroup?: Model.AssetGroup): boolean;
        rollbackHouseOrHotel(playerName: string, focusedAssetGroupIndex: number): boolean;
        canUpgradeAsset(asset: Model.Asset, playerName: string): boolean;
        canDowngradeAsset(asset: Model.Asset, playerName: string): boolean;
        setDiceResult(diceResult: number);
        getNextTreasureCard(): Model.TreasureCard;
        getNextEventCard(): Model.EventCard;
        processCard(card: Model.Card);
        processTax(boardFieldType: Model.BoardFieldType): number;
        processFlyBy(positionIndex: number, backwards?: boolean): Model.ProcessingEvent;
        processPrison(wasSentToPrison: boolean): boolean;
        toggleMortgageAsset(asset: Model.Asset): boolean;
        
        // get fields in management group, identified by its index in the manage group array
        getBoardFieldsInGroup(focusedAssetGroupIndex: number): Array<Model.BoardField>;
        canMortgage(asset: Model.Asset): boolean;
        getOutOfJail();
        moveProcessingDone();
        getAssetGroup(position: number): Model.AssetGroup;
        getPlayersForTrade(): Array<Model.Player>;
        trade();
        returnFromTrade();
        canSellAsset(asset: Model.Asset): boolean;
        getAssetByName(assetName: string): Model.Asset;
    }
    export interface IDrawingService {
        boardSize: number;
        framesToMoveOneBoardField: number;
        diceHeight: number;
        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player);
        animatePlayerMove(oldPositionIndex: Model.BoardField, newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player, scene: BABYLON.Scene, fast?: boolean, backwards?: boolean): JQueryDeferred<{}>;
        animatePlayerPrisonMove(newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player, scene: BABYLON.Scene, camera: BABYLON.FreeCamera): JQueryDeferred<{}>;
        setGameCameraInitialPosition(camera: BABYLON.FreeCamera);
        setManageCameraPosition(camera: BABYLON.FreeCamera, focusedAssetGroupIndex: number, scene: BABYLON.Scene, animate: boolean);
        returnFromManage(scene: BABYLON.Scene);
        pickBoardElement(scene: BABYLON.Scene, coords?: any): MonopolyApp.Viewmodels.PickedObject;
        createBoard(scene: BABYLON.Scene);
        setBoardFieldOwner(boardField: MonopolyApp.Viewmodels.BoardField, asset: Model.Asset, scene: BABYLON.Scene, shootParticles: boolean);
        setBoardFieldHouses(viewBoardField: MonopolyApp.Viewmodels.BoardField, houses: number, hotel: boolean, uncommittedHouses: number, uncommittedHotel: boolean, scene: BABYLON.Scene);
        setBoardFieldMortgage(boardField: MonopolyApp.Viewmodels.BoardField, asset: Model.Asset, scene: BABYLON.Scene, particles: boolean);
        loadMeshes(players: MonopolyApp.Viewmodels.Player[], scene: BABYLON.Scene, gameController: MonopolyApp.controllers.GameController): JQueryDeferred<{}>[];
        showHouseButtons(focusedAssetGroupIndex: number, scene: BABYLON.Scene, focusedAssetGroup?: Model.AssetGroup);
        onSwipeMove(scene: BABYLON.Scene, coords: any);
        onSwipeEnd(scene: BABYLON.Scene, coords: any): MonopolyApp.Viewmodels.PickedObject;
        showActionButtons();
        animateDiceThrow(scene: BABYLON.Scene, impulsePoint?: BABYLON.Vector3);
        isDiceAtRestAfterThrowing(scene: BABYLON.Scene): boolean; // whether the dice has come to rest after being thrown
        diceIsColliding(): boolean;
        setupDiceForThrow(scene: BABYLON.Scene);
        unregisterPhysicsMeshes(scene: BABYLON.Scene);
        moveDiceToPosition(position: BABYLON.Vector3, scene: BABYLON.Scene);
        getDiceLocation(scene: BABYLON.Scene): BABYLON.Vector3;
        getDiceResult(): number;
        // get the rotation required for the camera to face the target; position determines the camera position, if it is not equal to its current position
        getCameraRotationForTarget(target: BABYLON.Vector3, camera: BABYLON.FreeCamera, position?: BABYLON.Vector3): BABYLON.Vector3;
        returnCameraToMainPosition(scene: BABYLON.Scene, camera: BABYLON.FreeCamera, currentPlayerPositionIndex: number, numFrames?: number, closer?: boolean): JQueryDeferred<{}>;
        moveCameraForDiceThrow(scene: BABYLON.Scene, camera: BABYLON.FreeCamera, currentPlayerPosition: Model.BoardField): JQueryDeferred<{}>;
        getRandomPointOnDice(): BABYLON.Vector3;
        addParticle(abstractMesh: BABYLON.AbstractMesh, scene: BABYLON.Scene): BABYLON.ParticleSystem;
        clearBoardField(boardField: MonopolyApp.Viewmodels.BoardField, scene: BABYLON.Scene);
    }

    export interface IAIService {
        ownedGroupTradeMultiplier: number;
        afterMoveProcessing(skipBuyingHouses?: boolean): Array<Model.AIAction>;
        shouldBuy(asset: Model.Asset): boolean;
        acceptTradeOffer(player: Model.Player, tradeState: Model.TradeState): boolean; // returns TRUE if the player is accepting trade offer specified in tradeState
    }

    export interface IThemeService {
        theme: ITheme;
    }

    export interface ITutorialService {
        timeoutService: angular.ITimeoutService;
        initialize(data: Model.TutorialData);
        canAdvance: boolean; // whether the user can advance to the next tutorial step
        canAdvanceByClick: boolean; // whether the user can click to advance to the next tutorial step
        currentStep: number; // 1-indexed step of the tutorial
        isActive: boolean;
        advanceToNextStep();
        canExecuteAction(action: string): boolean; // whether a user action can be executed within the current tutorial step
        executeActionCallback(action: string);
        initManageModeTutorial(scope: angular.IScope);
        endCurrentSection();
    }

    export interface ITradeService {
        start(firstPlayer: Model.Player, secondPlayer: Model.Player, scope: angular.IScope, tradeActions: JQueryDeferred<{}>);
        getTradeState(): Model.TradeState;
        buildPlayerAssetList(player: Model.Player): Model.TradeGroup[];
        buildAssetTree(playerAssets: Array<Model.TradeGroup>): any;
        switchSelection(assetName: string);
        makeTradeOffer(): boolean;
        acceptTradeOffer();
        executeTrade(tradeState: Model.TradeState);
        setCounterOffer();
    }

}