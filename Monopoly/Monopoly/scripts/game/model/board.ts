module Model {
    export class Board {
        constructor(theme: Interfaces.ITheme) {
            this.initBoard(theme);
        }

        fields: Array<BoardField>;

        public loadDataFrom(savedBoard: Board) {
            this.fields = new Array<BoardField>();
            var that = this;
            savedBoard.fields.sort((f1, f2) => {
                return f1.index > f2.index ? 1 : -1;
            }).forEach(f => {
                var savedBoardField: any = f;
                var asset: Asset = undefined;
                if (savedBoardField._asset) {
                    asset = new Asset();
                    asset.loadDataFrom(savedBoardField._asset);
                }
                var boardField = new BoardField(asset);
                boardField.loadDataFrom(f);
                that.fields.push(boardField);
            });
        }

        private initBoard(theme: Interfaces.ITheme) {
            this.fields = new Array<BoardField>();
            var startField = new BoardField(null);
            startField.index = 0;
            startField.type = BoardFieldType.Start;
            this.fields.push(startField);

            var boardField = this.createAssetBoardField(theme.boardFieldName[1], this.fields.length, AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.color = theme.boardFieldColor[1];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(2, 4);
            boardField.asset.priceRentHouse.push(10, 30, 90, 160);
            boardField.asset.priceRentHotel = 250;
            boardField.asset.valueMortgage = 30;
            this.fields.push(boardField);

            var treasureField = new BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = BoardFieldType.Treasure;
            this.fields.push(treasureField);

            boardField = this.createAssetBoardField(theme.boardFieldName[3], this.fields.length, AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.color = theme.boardFieldColor[3];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(4, 8);
            boardField.asset.priceRentHouse.push(20, 60, 180, 320);
            boardField.asset.priceRentHotel = 450;
            boardField.asset.valueMortgage = 30;
            this.fields.push(boardField);

            var taxField = new BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = BoardFieldType.TaxIncome;
            this.fields.push(taxField);

            boardField = this.createAssetBoardField(theme.boardFieldName[5], this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[5];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[6], this.fields.length, AssetGroup.Second);
            boardField.asset.price = 100;
            boardField.asset.color = theme.boardFieldColor[6];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
            boardField.asset.priceRentHotel = 550;
            boardField.asset.valueMortgage = 50;
            this.fields.push(boardField);

            var eventField = new BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = BoardFieldType.Event;
            this.fields.push(eventField);

            boardField = this.createAssetBoardField(theme.boardFieldName[8], this.fields.length, AssetGroup.Second);
            boardField.asset.color = theme.boardFieldColor[8];
            boardField.asset.price = 100;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
            boardField.asset.priceRentHotel = 550;
            boardField.asset.valueMortgage = 50;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[9], this.fields.length, AssetGroup.Second);
            boardField.asset.price = 120;
            boardField.asset.color = theme.boardFieldColor[9];
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(8, 8, 16);
            boardField.asset.priceRentHouse.push(40, 100, 300, 450);
            boardField.asset.priceRentHotel = 600;
            boardField.asset.valueMortgage = 60;
            this.fields.push(boardField);

            var prisonAndVisitField = new BoardField(null);
            prisonAndVisitField.index = this.fields.length;
            prisonAndVisitField.type = BoardFieldType.PrisonAndVisit;
            this.fields.push(prisonAndVisitField);

            boardField = this.createAssetBoardField(theme.boardFieldName[11], this.fields.length, AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.color = theme.boardFieldColor[11];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.valueMortgage = 70;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[12], this.fields.length, AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.color = theme.boardFieldColor[12];
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.valueMortgage = 75;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[13], this.fields.length, AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.color = theme.boardFieldColor[13];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.valueMortgage = 70;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[14], this.fields.length, AssetGroup.Third);
            boardField.asset.price = 160;
            boardField.asset.color = theme.boardFieldColor[14];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(12, 12, 24);
            boardField.asset.priceRentHouse.push(60, 180, 500, 700);
            boardField.asset.priceRentHotel = 900;
            boardField.asset.valueMortgage = 80;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[15], this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[15];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[16], this.fields.length, AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.color = theme.boardFieldColor[16];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
            boardField.asset.priceRentHotel = 950;
            boardField.asset.valueMortgage = 90;
            this.fields.push(boardField);

            treasureField = new BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = BoardFieldType.Treasure;
            this.fields.push(treasureField);

            boardField = this.createAssetBoardField(theme.boardFieldName[18], this.fields.length, AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.color = theme.boardFieldColor[18];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
            boardField.asset.priceRentHotel = 950;
            boardField.asset.valueMortgage = 90;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[19], this.fields.length, AssetGroup.Fourth);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[19];
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(16, 16, 32);
            boardField.asset.priceRentHouse.push(80, 220, 600, 800);
            boardField.asset.priceRentHotel = 1000;
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);

            var freeParkingField = new BoardField(null);
            freeParkingField.index = this.fields.length;
            freeParkingField.type = BoardFieldType.FreeParking;
            this.fields.push(freeParkingField);

            boardField = this.createAssetBoardField(theme.boardFieldName[21], this.fields.length, AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.color = theme.boardFieldColor[21];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.valueMortgage = 110;
            this.fields.push(boardField);

            eventField = new BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = BoardFieldType.Event;
            this.fields.push(eventField);

            boardField = this.createAssetBoardField(theme.boardFieldName[23], this.fields.length, AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.color = theme.boardFieldColor[23];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.valueMortgage = 110;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[24], this.fields.length, AssetGroup.Fifth);
            boardField.asset.price = 240;
            boardField.asset.color = theme.boardFieldColor[24];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(20, 20, 40);
            boardField.asset.priceRentHouse.push(100, 300, 750, 925);
            boardField.asset.priceRentHotel = 1100;
            boardField.asset.valueMortgage = 120;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[25], this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[25];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[26], this.fields.length, AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.color = theme.boardFieldColor[26];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.valueMortgage = 130;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[27], this.fields.length, AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.color = theme.boardFieldColor[27];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.valueMortgage = 130;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[28], this.fields.length, AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.color = theme.boardFieldColor[28];
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.valueMortgage = 75;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[29], this.fields.length, AssetGroup.Sixth);
            boardField.asset.price = 280;
            boardField.asset.color = theme.boardFieldColor[29];
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(24, 24, 48);
            boardField.asset.priceRentHouse.push(120, 360, 850, 1025);
            boardField.asset.priceRentHotel = 1200;
            boardField.asset.valueMortgage = 140;
            this.fields.push(boardField);

            var goToPrisonField = new BoardField(null);
            goToPrisonField.index = this.fields.length;
            goToPrisonField.type = BoardFieldType.GoToPrison;
            this.fields.push(goToPrisonField);

            boardField = this.createAssetBoardField(theme.boardFieldName[31], this.fields.length, AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.color = theme.boardFieldColor[31];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.valueMortgage = 150;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[32], this.fields.length, AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.color = theme.boardFieldColor[32];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.valueMortgage = 150;
            this.fields.push(boardField);

            treasureField = new BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = BoardFieldType.Treasure;
            this.fields.push(treasureField);

            boardField = this.createAssetBoardField(theme.boardFieldName[34], this.fields.length, AssetGroup.Seventh);
            boardField.asset.price = 320;
            boardField.asset.color = theme.boardFieldColor[34];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(28, 28, 56);
            boardField.asset.priceRentHouse.push(150, 450, 1000, 1200);
            boardField.asset.priceRentHotel = 1400;
            boardField.asset.valueMortgage = 160;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField(theme.boardFieldName[35], this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = theme.boardFieldColor[35];
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);

            eventField = new BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = BoardFieldType.Event;
            this.fields.push(eventField);

            boardField = this.createAssetBoardField(theme.boardFieldName[37], this.fields.length, AssetGroup.Eighth);
            boardField.asset.price = 350;
            boardField.asset.color = theme.boardFieldColor[37];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(35, 70);
            boardField.asset.priceRentHouse.push(175, 500, 1100, 1300);
            boardField.asset.priceRentHotel = 1500;
            boardField.asset.valueMortgage = 175;
            this.fields.push(boardField);

            taxField = new BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = BoardFieldType.Tax;
            this.fields.push(taxField);

            boardField = this.createAssetBoardField(theme.boardFieldName[39], this.fields.length, AssetGroup.Eighth);
            boardField.asset.price = 400;
            boardField.asset.color = theme.boardFieldColor[39];
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(50, 100);
            boardField.asset.priceRentHouse.push(200, 600, 1400, 1700);
            boardField.asset.priceRentHotel = 2000;
            boardField.asset.valueMortgage = 200;
            this.fields.push(boardField);
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