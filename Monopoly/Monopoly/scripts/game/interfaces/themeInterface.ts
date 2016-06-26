module Interfaces {
    export interface ITheme {
        boardFieldName: Array<string>;
        boardFieldColor: Array<string>;
        imagesFolder: string;
        gameboardImage: string;
        backgroundImage: string;
        backgroundSize: number[];
        gameSetupImage: string;
        gameRulesImage: string;
        gamePauseImage: string;
        gameOptionsImage: string;
        gameHelpImage: string;
        gameStatsImage: string;
        mainMenuImage: string;
        mainMenuTitleImage: string;
        railroadImage: string;
        utility1Image: string;
        utility2Image: string;
        skyboxFolder: string;
        meshFolder: string;
        playerMesh: string;
        playerSubmeshIndex: number;
        playerColoredSubmeshIndices: Array<number>;
        playerMeshRotationQuaternion: number[][];
        moneySymbol: string;
        house: string;
        hotel: string;
        railroad: string;
        utility: string;
        utilities: string;
        communityChestTitle: string;
        eventTitle: string;
        prison: string;
    }
}