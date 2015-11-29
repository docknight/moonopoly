module Model {
    export enum BoardFieldType { Asset, Start, Event, Treasure, Prison, Relax};

    export class BoardField {
        private _asset: Asset;
        constructor(asset: Asset) {
            this.occupiedBy = new Array<string>();
            if (asset) {
                this._asset = asset;
                this.type = BoardFieldType.Asset;
            }
        }

        get asset(): Asset {
            return this._asset;
        }

        type: BoardFieldType;
        index: number; // 0-based index of the field on the board
        occupiedBy: Array<string>; // names of players that are occupying the board field
    }
} 