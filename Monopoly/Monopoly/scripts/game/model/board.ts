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

            var boardField = this.createAssetBoardField("Goriška Brda", this.fields.length, AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent = 2;
            boardField.asset.priceRentGroup = 4;
            boardField.asset.priceRent1House = 10;
            boardField.asset.priceRent2House = 30;
            boardField.asset.priceRent3House = 90;
            boardField.asset.priceRent4House = 160;
            boardField.asset.priceRentHotel = 250;
            boardField.asset.priceMortgage = 30;
            this.fields.push(boardField);

            var treasureField = new BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = BoardFieldType.Treasure;
            this.fields.push(treasureField);

            boardField = this.createAssetBoardField("Slovenske Gorice", this.fields.length, AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent = 4;
            boardField.asset.priceRentGroup = 8;
            boardField.asset.priceRent1House = 20;
            boardField.asset.priceRent2House = 60;
            boardField.asset.priceRent3House = 180;
            boardField.asset.priceRent4House = 320;
            boardField.asset.priceRentHotel = 450;
            boardField.asset.priceMortgage = 30;
            this.fields.push(boardField);

            var taxField = new BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = BoardFieldType.Tax;
            this.fields.push(taxField);

            boardField = this.createAssetBoardField("Železniška postaja Jesenice", this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Bogenšperk", this.fields.length, AssetGroup.Second);
            boardField.asset.price = 100;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent = 6;
            boardField.asset.priceRentGroup = 12;
            boardField.asset.priceRent1House = 30;
            boardField.asset.priceRent2House = 90;
            boardField.asset.priceRent3House = 270;
            boardField.asset.priceRent4House = 400;
            boardField.asset.priceRentHotel = 550;
            boardField.asset.priceMortgage = 50;
            this.fields.push(boardField);

            var eventField = new BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = BoardFieldType.Event;
            this.fields.push(eventField);

            boardField = this.createAssetBoardField("Predjamski grad", this.fields.length, AssetGroup.Second);
            boardField.asset.price = 100;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent = 6;
            boardField.asset.priceRentGroup = 12;
            boardField.asset.priceRent1House = 30;
            boardField.asset.priceRent2House = 90;
            boardField.asset.priceRent3House = 270;
            boardField.asset.priceRent4House = 400;
            boardField.asset.priceRentHotel = 550;
            boardField.asset.priceMortgage = 50;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Otočec", this.fields.length, AssetGroup.Second);
            boardField.asset.price = 120;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent = 8;
            boardField.asset.priceRentGroup = 16;
            boardField.asset.priceRent1House = 40;
            boardField.asset.priceRent2House = 100;
            boardField.asset.priceRent3House = 300;
            boardField.asset.priceRent4House = 450;
            boardField.asset.priceRentHotel = 600;
            boardField.asset.priceMortgage = 60;
            this.fields.push(boardField);

            var prisonAndVisitField = new BoardField(null);
            prisonAndVisitField.index = this.fields.length;
            prisonAndVisitField.type = BoardFieldType.PrisonAndVisit;
            this.fields.push(prisonAndVisitField);

            boardField = this.createAssetBoardField("Terme Čatež", this.fields.length, AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent = 10;
            boardField.asset.priceRentGroup = 20;
            boardField.asset.priceRent1House = 50;
            boardField.asset.priceRent2House = 150;
            boardField.asset.priceRent3House = 450;
            boardField.asset.priceRent4House = 625;
            boardField.asset.priceRentHotel = 750;
            boardField.asset.priceMortgage = 70;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Javna razsvetljava", this.fields.length, AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.priceMultiplier1Utility = 4;
            boardField.asset.priceMultiplier2Utility = 10;
            boardField.asset.priceMortgage = 75;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Dolenjske toplice", this.fields.length, AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent = 10;
            boardField.asset.priceRentGroup = 20;
            boardField.asset.priceRent1House = 50;
            boardField.asset.priceRent2House = 150;
            boardField.asset.priceRent3House = 450;
            boardField.asset.priceRent4House = 625;
            boardField.asset.priceRentHotel = 750;
            boardField.asset.priceMortgage = 70;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Moravske toplice", this.fields.length, AssetGroup.Third);
            boardField.asset.price = 160;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent = 12;
            boardField.asset.priceRentGroup = 24;
            boardField.asset.priceRent1House = 60;
            boardField.asset.priceRent2House = 180;
            boardField.asset.priceRent3House = 500;
            boardField.asset.priceRent4House = 700;
            boardField.asset.priceRentHotel = 900;
            boardField.asset.priceMortgage = 80;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Glavni kolodvor Ljubljana", this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Športni park Stožice", this.fields.length, AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent = 14;
            boardField.asset.priceRentGroup = 28;
            boardField.asset.priceRent1House = 70;
            boardField.asset.priceRent2House = 200;
            boardField.asset.priceRent3House = 550;
            boardField.asset.priceRent4House = 750;
            boardField.asset.priceRentHotel = 950;
            boardField.asset.priceMortgage = 90;
            this.fields.push(boardField);

            treasureField = new BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = BoardFieldType.Treasure;
            this.fields.push(treasureField);

            boardField = this.createAssetBoardField("Planica", this.fields.length, AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent = 14;
            boardField.asset.priceRentGroup = 28;
            boardField.asset.priceRent1House = 70;
            boardField.asset.priceRent2House = 200;
            boardField.asset.priceRent3House = 550;
            boardField.asset.priceRent4House = 750;
            boardField.asset.priceRentHotel = 950;
            boardField.asset.priceMortgage = 90;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Mariborsko Pohorje", this.fields.length, AssetGroup.Fourth);
            boardField.asset.price = 200;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent = 16;
            boardField.asset.priceRentGroup = 32;
            boardField.asset.priceRent1House = 80;
            boardField.asset.priceRent2House = 220;
            boardField.asset.priceRent3House = 600;
            boardField.asset.priceRent4House = 800;
            boardField.asset.priceRentHotel = 1000;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);

            var freeParkingField = new BoardField(null);
            freeParkingField.index = this.fields.length;
            freeParkingField.type = BoardFieldType.FreeParking;
            this.fields.push(freeParkingField);

            boardField = this.createAssetBoardField("Trenta", this.fields.length, AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent = 18;
            boardField.asset.priceRentGroup = 36;
            boardField.asset.priceRent1House = 90;
            boardField.asset.priceRent2House = 250;
            boardField.asset.priceRent3House = 700;
            boardField.asset.priceRent4House = 875;
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.priceMortgage = 110;
            this.fields.push(boardField);

            eventField = new BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = BoardFieldType.Event;
            this.fields.push(eventField);

            boardField = this.createAssetBoardField("Rakov Škocjan", this.fields.length, AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent = 18;
            boardField.asset.priceRentGroup = 36;
            boardField.asset.priceRent1House = 90;
            boardField.asset.priceRent2House = 250;
            boardField.asset.priceRent3House = 700;
            boardField.asset.priceRent4House = 875;
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.priceMortgage = 110;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Logarska dolina", this.fields.length, AssetGroup.Fifth);
            boardField.asset.price = 240;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent = 20;
            boardField.asset.priceRentGroup = 40;
            boardField.asset.priceRent1House = 100;
            boardField.asset.priceRent2House = 300;
            boardField.asset.priceRent3House = 750;
            boardField.asset.priceRent4House = 925;
            boardField.asset.priceRentHotel = 1100;
            boardField.asset.priceMortgage = 120;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Železniška postaja Zidani most", this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Lipica", this.fields.length, AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent = 22;
            boardField.asset.priceRentGroup = 44;
            boardField.asset.priceRent1House = 110;
            boardField.asset.priceRent2House = 330;
            boardField.asset.priceRent3House = 800;
            boardField.asset.priceRent4House = 975;
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.priceMortgage = 130;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Volčji potok", this.fields.length, AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent = 22;
            boardField.asset.priceRentGroup = 44;
            boardField.asset.priceRent1House = 110;
            boardField.asset.priceRent2House = 330;
            boardField.asset.priceRent3House = 800;
            boardField.asset.priceRent4House = 975;
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.priceMortgage = 130;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Mestni vodovod", this.fields.length, AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.priceMultiplier1Utility = 4;
            boardField.asset.priceMultiplier2Utility = 10;
            boardField.asset.priceMortgage = 75;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Postojnska jama", this.fields.length, AssetGroup.Sixth);
            boardField.asset.price = 280;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent = 24;
            boardField.asset.priceRentGroup = 48;
            boardField.asset.priceRent1House = 120;
            boardField.asset.priceRent2House = 360;
            boardField.asset.priceRent3House = 850;
            boardField.asset.priceRent4House = 1025;
            boardField.asset.priceRentHotel = 1200;
            boardField.asset.priceMortgage = 140;
            this.fields.push(boardField);

            var goToPrisonField = new BoardField(null);
            goToPrisonField.index = this.fields.length;
            goToPrisonField.type = BoardFieldType.GoToPrison;
            this.fields.push(goToPrisonField);

            boardField = this.createAssetBoardField("Cerkniško jezero", this.fields.length, AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent = 26;
            boardField.asset.priceRentGroup = 52;
            boardField.asset.priceRent1House = 130;
            boardField.asset.priceRent2House = 390;
            boardField.asset.priceRent3House = 900;
            boardField.asset.priceRent4House = 1100;
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.priceMortgage = 150;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Bohinj", this.fields.length, AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent = 26;
            boardField.asset.priceRentGroup = 52;
            boardField.asset.priceRent1House = 130;
            boardField.asset.priceRent2House = 390;
            boardField.asset.priceRent3House = 900;
            boardField.asset.priceRent4House = 1100;
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.priceMortgage = 150;
            this.fields.push(boardField);

            treasureField = new BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = BoardFieldType.Treasure;
            this.fields.push(treasureField);

            boardField = this.createAssetBoardField("Bled", this.fields.length, AssetGroup.Seventh);
            boardField.asset.price = 320;
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent = 28;
            boardField.asset.priceRentGroup = 56;
            boardField.asset.priceRent1House = 150;
            boardField.asset.priceRent2House = 450;
            boardField.asset.priceRent3House = 1000;
            boardField.asset.priceRent4House = 1200;
            boardField.asset.priceRentHotel = 1400;
            boardField.asset.priceMortgage = 160;
            this.fields.push(boardField);

            boardField = this.createAssetBoardField("Železniška postaja Koper", this.fields.length, AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);

            eventField = new BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = BoardFieldType.Event;
            this.fields.push(eventField);

            boardField = this.createAssetBoardField("Piran", this.fields.length, AssetGroup.Eighth);
            boardField.asset.price = 350;
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent = 35;
            boardField.asset.priceRentGroup = 70;
            boardField.asset.priceRent1House = 175;
            boardField.asset.priceRent2House = 500;
            boardField.asset.priceRent3House = 1100;
            boardField.asset.priceRent4House = 1300;
            boardField.asset.priceRentHotel = 1500;
            boardField.asset.priceMortgage = 175;
            this.fields.push(boardField);

            taxField = new BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = BoardFieldType.TaxIncome;
            this.fields.push(taxField);

            boardField = this.createAssetBoardField("Portorož", this.fields.length, AssetGroup.Eighth);
            boardField.asset.price = 400;
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent = 50;
            boardField.asset.priceRentGroup = 100;
            boardField.asset.priceRent1House = 200;
            boardField.asset.priceRent2House = 600;
            boardField.asset.priceRent3House = 1400;
            boardField.asset.priceRent4House = 1700;
            boardField.asset.priceRentHotel = 2000;
            boardField.asset.priceMortgage = 200;
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