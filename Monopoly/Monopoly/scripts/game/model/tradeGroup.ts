module Model {
    export class TradeGroup {
        constructor() {
            this.assets = [];
        }

        assetGroup: Model.AssetGroup;
        assets: Array<Model.Asset>;
        name: string;
    }
} 