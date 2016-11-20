module MonopolyApp.Viewmodels {
    export class Player {
        name: string;
        money: number;
        mesh: BABYLON.AbstractMesh;
        index: number;
        color: string;
        active: boolean;
        numTurnsToWaitBeforeTrade: number; // number of turns to wait before another trade offer (in one exists) may be presented to the player
    }
}