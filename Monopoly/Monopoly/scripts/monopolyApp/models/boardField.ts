module MonopolyApp.Viewmodels {
    export class BoardField {
        index: number;
        assetName: string;
        ownerMesh: BABYLON.AbstractMesh;
        houseMeshes: BABYLON.AbstractMesh[];
        hotelMesh: BABYLON.AbstractMesh;
        mortgageMesh: BABYLON.AbstractMesh;
    }
}