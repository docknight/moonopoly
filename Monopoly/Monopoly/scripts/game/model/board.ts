module Model {
    export class Board {
        constructor() {
            this.initBoard();
        }

        fields: Array<BoardField>;

        private initBoard() {
            this.fields = new Array<BoardField>();
            var startField = new BoardField(null);
            startField.index = 0;
            startField.type = BoardFieldType.Start;
            this.fields.push(startField);
            this.fields.push(this.createAssetBoardField("Kranjska gora", this.fields.length, AssetGroup.First));
            // TODO: declare the rest of the board
        }

        private createAssetBoardField(assetName: string, boardFieldIndex: number, assetGroup: AssetGroup): BoardField {
            var asset = new Asset();
            asset.name = assetName;
            asset.group = assetGroup;
            var boardField = new BoardField(asset);
            boardField.index = boardFieldIndex;
            return boardField;
        }
    }
} 