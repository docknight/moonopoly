﻿module Interfaces {
    export interface ITheme {
        boardFieldName: Array<string>;
        imagesFolder: string;
        gameboardImage: string;
        backgroundImage: string;
        backgroundSize: number[];
        gameSetupImage: string;
        gameRulesImage: string;
        gamePauseImage: string;
        mainMenuImage: string;
        skyboxFolder: string;
        meshFolder: string;
        playerMesh: string;
        playerSubmeshIndex: number;
        playerColoredSubmeshIndices: Array<number>;
        playerMeshRotationQuaternion: number[][];

        house: string;
        hotel: string;
    }
}