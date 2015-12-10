// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var BlankCordovaApp3;
(function (BlankCordovaApp3) {
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        var createTestScene = function (engine, canvas) {
            // This creates a basic Babylon Scene object (non-mesh)
            var scene = new BABYLON.Scene(engine);
            // This creates and positions a free camera (non-mesh)
            var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
            // This targets the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());
            // This attaches the camera to the canvas
            camera.attachControl(canvas, true);
            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 0.7;
            // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
            var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
            // Move the sphere upward 1/2 its height
            sphere.position.y = 1;
            // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
            var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
            return scene;
        };
        function naloziSceno() {
            var canvas = document.getElementById("renderCanvas");
            var engine = new BABYLON.Engine(canvas, true);
            var scene = createTestScene(engine, canvas);
            engine.runRenderLoop(function () {
                scene.render();
            });
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            //document.getElementById("naloziScenoButton").addEventListener("click", naloziSceno);
            //naloziSceno();
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = BlankCordovaApp3.Application || (BlankCordovaApp3.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(BlankCordovaApp3 || (BlankCordovaApp3 = {}));
var Model;
(function (Model) {
    (function (AssetGroup) {
        AssetGroup[AssetGroup["None"] = 0] = "None";
        AssetGroup[AssetGroup["First"] = 1] = "First";
        AssetGroup[AssetGroup["Second"] = 2] = "Second";
        AssetGroup[AssetGroup["Third"] = 3] = "Third";
        AssetGroup[AssetGroup["Fourth"] = 4] = "Fourth";
        AssetGroup[AssetGroup["Fifth"] = 5] = "Fifth";
        AssetGroup[AssetGroup["Sixth"] = 6] = "Sixth";
        AssetGroup[AssetGroup["Seventh"] = 7] = "Seventh";
        AssetGroup[AssetGroup["Eighth"] = 8] = "Eighth";
        AssetGroup[AssetGroup["Utility"] = 9] = "Utility";
        AssetGroup[AssetGroup["Railway"] = 10] = "Railway";
    })(Model.AssetGroup || (Model.AssetGroup = {}));
    var AssetGroup = Model.AssetGroup;
    ;
    var Asset = (function () {
        function Asset() {
            this._unowned = true;
        }
        Object.defineProperty(Asset.prototype, "unowned", {
            get: function () {
                return this._unowned;
            },
            enumerable: true,
            configurable: true
        });
        Asset.prototype.setOwner = function (ownerName) {
            if (this._unowned) {
                this.owner = ownerName;
                this._unowned = false;
            }
        };
        return Asset;
    })();
    Model.Asset = Asset;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Board = (function () {
        function Board() {
            this.initBoard();
        }
        Board.prototype.initBoard = function () {
            this.fields = new Array();
            var startField = new Model.BoardField(null);
            startField.index = 0;
            startField.type = Model.BoardFieldType.Start;
            this.fields.push(startField);
            var boardField = this.createAssetBoardField("Goriška Brda", this.fields.length, Model.AssetGroup.First);
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
            var treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField("Slovenske Gorice", this.fields.length, Model.AssetGroup.First);
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
            var taxField = new Model.BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = Model.BoardFieldType.Tax;
            this.fields.push(taxField);
            boardField = this.createAssetBoardField("Železniška postaja Jesenice", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Bogenšperk", this.fields.length, Model.AssetGroup.Second);
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
            var eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField("Predjamski grad", this.fields.length, Model.AssetGroup.Second);
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
            boardField = this.createAssetBoardField("Otočec", this.fields.length, Model.AssetGroup.Second);
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
            var prisonAndVisitField = new Model.BoardField(null);
            prisonAndVisitField.index = this.fields.length;
            prisonAndVisitField.type = Model.BoardFieldType.PrisonAndVisit;
            this.fields.push(prisonAndVisitField);
            boardField = this.createAssetBoardField("Terme Čatež", this.fields.length, Model.AssetGroup.Third);
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
            boardField = this.createAssetBoardField("Javna razsvetljava", this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.priceMultiplier1Utility = 4;
            boardField.asset.priceMultiplier2Utility = 10;
            boardField.asset.priceMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Dolenjske toplice", this.fields.length, Model.AssetGroup.Third);
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
            boardField = this.createAssetBoardField("Moravske toplice", this.fields.length, Model.AssetGroup.Third);
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
            boardField = this.createAssetBoardField("Glavni kolodvor Ljubljana", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Športni park Stožice", this.fields.length, Model.AssetGroup.Fourth);
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
            treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField("Planica", this.fields.length, Model.AssetGroup.Fourth);
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
            boardField = this.createAssetBoardField("Mariborsko Pohorje", this.fields.length, Model.AssetGroup.Fourth);
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
            var freeParkingField = new Model.BoardField(null);
            freeParkingField.index = this.fields.length;
            freeParkingField.type = Model.BoardFieldType.FreeParking;
            this.fields.push(freeParkingField);
            boardField = this.createAssetBoardField("Trenta", this.fields.length, Model.AssetGroup.Fifth);
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
            eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField("Rakov Škocjan", this.fields.length, Model.AssetGroup.Fifth);
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
            boardField = this.createAssetBoardField("Logarska dolina", this.fields.length, Model.AssetGroup.Fifth);
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
            boardField = this.createAssetBoardField("Železniška postaja Zidani most", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Lipica", this.fields.length, Model.AssetGroup.Sixth);
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
            boardField = this.createAssetBoardField("Volčji potok", this.fields.length, Model.AssetGroup.Sixth);
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
            boardField = this.createAssetBoardField("Mestni vodovod", this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.priceMultiplier1Utility = 4;
            boardField.asset.priceMultiplier2Utility = 10;
            boardField.asset.priceMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Postojnska jama", this.fields.length, Model.AssetGroup.Sixth);
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
            var goToPrisonField = new Model.BoardField(null);
            goToPrisonField.index = this.fields.length;
            goToPrisonField.type = Model.BoardFieldType.GoToPrison;
            this.fields.push(goToPrisonField);
            boardField = this.createAssetBoardField("Cerkniško jezero", this.fields.length, Model.AssetGroup.Seventh);
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
            boardField = this.createAssetBoardField("Bohinj", this.fields.length, Model.AssetGroup.Seventh);
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
            treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField("Bled", this.fields.length, Model.AssetGroup.Seventh);
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
            boardField = this.createAssetBoardField("Železniška postaja Koper", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.price1Railway = 25;
            boardField.asset.priceRent = 25;
            boardField.asset.price2Railway = 50;
            boardField.asset.price3Railway = 100;
            boardField.asset.price4Railway = 200;
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);
            eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField("Piran", this.fields.length, Model.AssetGroup.Eighth);
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
            taxField = new Model.BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = Model.BoardFieldType.TaxIncome;
            this.fields.push(taxField);
            boardField = this.createAssetBoardField("Portorož", this.fields.length, Model.AssetGroup.Eighth);
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
        };
        Board.prototype.createAssetBoardField = function (assetName, boardFieldIndex, assetGroup) {
            var asset = new Model.Asset();
            asset.name = assetName;
            asset.group = assetGroup;
            var boardField = new Model.BoardField(asset);
            boardField.index = boardFieldIndex;
            return boardField;
        };
        return Board;
    })();
    Model.Board = Board;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (BoardFieldType) {
        BoardFieldType[BoardFieldType["Asset"] = 0] = "Asset";
        BoardFieldType[BoardFieldType["Start"] = 1] = "Start";
        BoardFieldType[BoardFieldType["Tax"] = 2] = "Tax";
        BoardFieldType[BoardFieldType["TaxIncome"] = 3] = "TaxIncome";
        BoardFieldType[BoardFieldType["Event"] = 4] = "Event";
        BoardFieldType[BoardFieldType["Treasure"] = 5] = "Treasure";
        BoardFieldType[BoardFieldType["PrisonAndVisit"] = 6] = "PrisonAndVisit";
        BoardFieldType[BoardFieldType["FreeParking"] = 7] = "FreeParking";
        BoardFieldType[BoardFieldType["GoToPrison"] = 8] = "GoToPrison";
    })(Model.BoardFieldType || (Model.BoardFieldType = {}));
    var BoardFieldType = Model.BoardFieldType;
    ;
    var BoardField = (function () {
        function BoardField(asset) {
            this.occupiedBy = new Array();
            if (asset) {
                this._asset = asset;
                this.type = BoardFieldType.Asset;
            }
        }
        Object.defineProperty(BoardField.prototype, "asset", {
            get: function () {
                return this._asset;
            },
            enumerable: true,
            configurable: true
        });
        return BoardField;
    })();
    Model.BoardField = BoardField;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (GameState) {
        GameState[GameState["BeginTurn"] = 0] = "BeginTurn";
        GameState[GameState["ThrowDice"] = 1] = "ThrowDice";
        GameState[GameState["Move"] = 2] = "Move";
        GameState[GameState["Process"] = 3] = "Process";
    })(Model.GameState || (Model.GameState = {}));
    var GameState = Model.GameState;
    ;
    var Game = (function () {
        function Game() {
            this._currentPlayer = "";
            this.players = new Array();
            this._board = new Model.Board();
            this.state = GameState.BeginTurn;
        }
        Object.defineProperty(Game.prototype, "currentPlayer", {
            get: function () {
                return this._currentPlayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "board", {
            get: function () {
                return this._board;
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.advanceToNextPlayer = function () {
            var _this = this;
            if (this._currentPlayer === "") {
                if (this.players.length > 0) {
                    this._currentPlayer = this.players[0].playerName;
                }
                return;
            }
            var currentPlayerIndex = this.players.indexOf(this.players.filter(function (p) { return p.playerName === _this.currentPlayer; })[0]);
            if (currentPlayerIndex < this.players.length - 1) {
                this._currentPlayer = this.players[currentPlayerIndex + 1].playerName;
            }
            else {
                this._currentPlayer = this.players[0].playerName;
            }
        };
        return Game;
    })();
    Model.Game = Game;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Player = (function () {
        function Player() {
            this.playerName = "";
            this.human = false;
        }
        return Player;
    })();
    Model.Player = Player;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Settings = (function () {
        function Settings() {
            this.numPlayers = 2;
            this.playerName = "";
        }
        return Settings;
    })();
    Model.Settings = Settings;
})(Model || (Model = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
//((): void=> {
//    var app = angular.module("angularWithTS", ['ngRoute']);
//    app.config(angularWithTS.Routes.configureRoutes);
//})() 
var monopolyApp = angular.module('monopolyApp', ['ui.router', 'ui.bootstrap']);
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
var Services;
(function (Services) {
    var DrawingService = (function () {
        function DrawingService($http, gameService) {
            this.boardFieldsInQuadrant = 11;
            this.httpService = $http;
            this.gameService = gameService;
            this.boardFieldWidth = this.boardSize / (this.boardFieldsInQuadrant + 2); // assuming the corner fields are double the width of the rest of the fields
            this.boardFieldHeight = this.boardFieldWidth * 2;
            this.boardFieldEdgeWidth = this.boardFieldWidth * 2;
            this.initQuadrantStartingCoordinates();
        }
        Object.defineProperty(DrawingService.prototype, "boardSize", {
            /// board dimenzion in both, X and Z directions
            get: function () {
                return 10;
            },
            enumerable: true,
            configurable: true
        });
        DrawingService.prototype.positionPlayer = function (playerModel) {
            var player = this.gameService.players.filter(function (player, index) { return player.playerName === playerModel.name; })[0];
            var playerQuadrant = Math.floor(player.position.index / this.boardFieldsInQuadrant);
            var playerQuadrantOffset = player.position.index % this.boardFieldsInQuadrant;
            var playerCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            playerCoordinate.x = this.quadrantStartingCoordinate[playerQuadrant].x;
            playerCoordinate.z = this.quadrantStartingCoordinate[playerQuadrant].z;
            playerCoordinate[this.getQuadrantRunningCoordinate(playerQuadrant)] += playerQuadrantOffset * this.boardFieldWidth * this.getQuadrantRunningDirection(playerQuadrant);
            // now that the player is positioned on the board field corner, position him inside the field
            var playersInField = player.position.occupiedBy.length;
            var playerIndexInField = player.position.occupiedBy.indexOf(player.playerName);
            var offset = ((playerQuadrantOffset === 0 ? this.boardFieldEdgeWidth : this.boardFieldWidth) / (playersInField + 1)) * (playerIndexInField + 1);
            playerCoordinate[this.getQuadrantRunningCoordinate(playerQuadrant)] += offset * this.getQuadrantRunningDirection(playerQuadrant) * -1;
            playerModel.mesh.position.x = playerCoordinate.x;
            playerModel.mesh.position.z = playerCoordinate.z;
        };
        DrawingService.prototype.initQuadrantStartingCoordinates = function () {
            this.quadrantStartingCoordinate = [];
            var firstQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            firstQuadrantStartingCoordinate.x = (this.boardSize / 2) - this.boardFieldEdgeWidth;
            firstQuadrantStartingCoordinate.z = -(this.boardSize / 2) + this.boardFieldHeight;
            this.quadrantStartingCoordinate.push(firstQuadrantStartingCoordinate);
            var secondQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            secondQuadrantStartingCoordinate.x = -(this.boardSize / 2) + this.boardFieldHeight;
            secondQuadrantStartingCoordinate.z = -(this.boardSize / 2) + this.boardFieldEdgeWidth;
            this.quadrantStartingCoordinate.push(secondQuadrantStartingCoordinate);
            var thirdQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            thirdQuadrantStartingCoordinate.x = -(this.boardSize / 2) + this.boardFieldEdgeWidth;
            thirdQuadrantStartingCoordinate.z = (this.boardSize / 2) - this.boardFieldHeight;
            this.quadrantStartingCoordinate.push(thirdQuadrantStartingCoordinate);
            var fourthQuadrantStartingCoordinate = new MonopolyApp.Viewmodels.Coordinate();
            fourthQuadrantStartingCoordinate.x = (this.boardSize / 2) + this.boardFieldHeight;
            fourthQuadrantStartingCoordinate.z = (this.boardSize / 2) - this.boardFieldEdgeWidth;
            this.quadrantStartingCoordinate.push(fourthQuadrantStartingCoordinate);
        };
        DrawingService.prototype.getQuadrantRunningCoordinate = function (quadrantIndex) {
            if (quadrantIndex === 0) {
                return "x";
            }
            else if (quadrantIndex === 1) {
                return "z";
            }
            else if (quadrantIndex === 2) {
                return "x";
            }
            else {
                return "z";
            }
        };
        DrawingService.prototype.getQuadrantRunningDirection = function (quadrantIndex) {
            if (quadrantIndex === 0) {
                return -1;
            }
            else if (quadrantIndex === 1) {
                return 1;
            }
            else if (quadrantIndex === 2) {
                return 1;
            }
            else {
                return -1;
            }
        };
        DrawingService.$inject = ["$http", "gameService"];
        return DrawingService;
    })();
    Services.DrawingService = DrawingService;
    monopolyApp.service("drawingService", DrawingService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
var Services;
(function (Services) {
    var SettingsService = (function () {
        function SettingsService($http) {
            this.loadSettings = function () {
                //For the purpose of this demo I am returning the hard coded values, hoever in real world application
                //You would probably use "this.httpService.get" method to call backend REST apis to fetch the data from server.
                var settings = new Model.Settings();
                settings.numPlayers = 2;
                settings.playerName = "Enter name";
                return settings;
            };
            this.httpService = $http;
        }
        SettingsService.prototype.saveSettings = function (settings) {
        };
        SettingsService.$inject = ["$http"];
        return SettingsService;
    })();
    Services.SettingsService = SettingsService;
    monopolyApp.service("settingsService", SettingsService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
var Services;
(function (Services) {
    var GameService = (function () {
        function GameService($http, settingsService) {
            this.httpService = $http;
            this.settingsService = settingsService;
        }
        GameService.prototype.initGame = function () {
            this.game = new Model.Game();
            this.initPlayers();
            this.game.advanceToNextPlayer();
        };
        GameService.prototype.endTurn = function () {
            this.game.advanceToNextPlayer();
            this.game.state = Model.GameState.BeginTurn;
        };
        GameService.prototype.getCurrentPlayer = function () {
            return this.game.currentPlayer;
        };
        Object.defineProperty(GameService.prototype, "players", {
            get: function () {
                return this.game.players;
            },
            enumerable: true,
            configurable: true
        });
        GameService.prototype.setPlayerPosition = function (player, boardFieldIndex) {
            player.position = this.game.board.fields[boardFieldIndex];
            var previousFields = this.game.board.fields.filter(function (b) { return b.occupiedBy != null && b.occupiedBy.filter(function (ocb) { return ocb == player.playerName; }).length > 0; });
            if (previousFields && previousFields.length > 0) {
                var previousField = previousFields[0];
                previousField.occupiedBy.splice(previousField.occupiedBy.indexOf(player.playerName));
            }
            player.position.occupiedBy.push(player.playerName);
        };
        GameService.prototype.initPlayers = function () {
            var settings = this.settingsService.loadSettings();
            var colors = ["Red", "Green", "Yellow", "Blue"];
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player();
                player.playerName = i === 0 ? settings.playerName : "Computer " + i;
                player.human = i === 0;
                player.money = 1500;
                player.color = colors[i];
                this.game.players.push(player);
                this.setPlayerPosition(player, 0);
            }
        };
        GameService.$inject = ["$http", "settingsService"];
        return GameService;
    })();
    Services.GameService = GameService;
    monopolyApp.service("gameService", GameService);
})(Services || (Services = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/game.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var GameController = (function () {
            function GameController(stateService, gameService, drawingService) {
                this.stateService = stateService;
                this.gameService = gameService;
                this.drawingService = drawingService;
                this.initGame();
                this.createScene();
            }
            Object.defineProperty(GameController.prototype, "currentPlayer", {
                get: function () {
                    return this.gameService.getCurrentPlayer();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GameController.prototype, "playerModels", {
                get: function () {
                    return this.players;
                },
                enumerable: true,
                configurable: true
            });
            GameController.prototype.initGame = function () {
                this.gameService.initGame();
            };
            GameController.prototype.createScene = function () {
                var canvas = document.getElementById("renderCanvas");
                var engine = new BABYLON.Engine(canvas, true);
                var scene = this.createBoard(engine, canvas);
                engine.runRenderLoop(function () {
                    scene.render();
                });
                window.addEventListener("resize", function () {
                    engine.resize();
                });
                // Watch for browser/canvas resize events
                window.addEventListener("resize", function () {
                    engine.resize();
                });
            };
            GameController.prototype.createBoard = function (engine, canvas) {
                var _this = this;
                // This creates a basic Babylon Scene object (non-mesh)
                var scene = new BABYLON.Scene(engine);
                // This creates and positions a free camera (non-mesh)
                var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
                // This targets the camera to scene origin
                camera.setTarget(BABYLON.Vector3.Zero());
                // This attaches the camera to the canvas
                camera.attachControl(canvas, true);
                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                // Default intensity is 1. Let's dim the light a small amount
                light.intensity = 1;
                // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
                var board = BABYLON.Mesh.CreateGround("ground1", this.drawingService.boardSize, this.drawingService.boardSize, 2, scene);
                var boardMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
                boardMaterial.emissiveTexture = new BABYLON.Texture("images/Gameboard.png", scene);
                boardMaterial.diffuseTexture = new BABYLON.Texture("images/Gameboard.png", scene);
                board.material = boardMaterial;
                this.players = [];
                var meshLoads = [];
                this.gameService.players.forEach(function (player) {
                    var playerModel = new MonopolyApp.Viewmodels.Player();
                    playerModel.name = player.playerName;
                    var d = $.Deferred();
                    meshLoads.push(d);
                    var that = _this;
                    BABYLON.SceneLoader.ImportMesh(null, "meshes/", "character.babylon", scene, function (newMeshes, particleSystems) {
                        if (newMeshes != null) {
                            var mesh = newMeshes[0];
                            playerModel.mesh = mesh;
                            d.resolve(that);
                        }
                    });
                    _this.players.push(playerModel);
                });
                $.when.apply($, meshLoads).done(this.setupPlayerPositions);
                return scene;
            };
            GameController.prototype.setupPlayerPositions = function (that) {
                that.players.forEach(function (playerModel) {
                    that.drawingService.positionPlayer(playerModel);
                });
            };
            GameController.$inject = ["$state", "gameService", "drawingService"];
            return GameController;
        })();
        controllers.GameController = GameController;
        monopolyApp.controller("gameCtrl", GameController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var MainMenuController = (function () {
            function MainMenuController(stateService) {
                var _this = this;
                this.startNewGame = function () {
                    _this.stateService.go("newgame");
                };
                this.stateService = stateService;
                this.title = "POZDRAVLJEN";
            }
            MainMenuController.prototype.settings = function () {
                this.stateService.go("settings");
            };
            MainMenuController.$inject = ["$state"];
            return MainMenuController;
        })();
        controllers.MainMenuController = MainMenuController;
        monopolyApp.controller("mainMenuCtrl", MainMenuController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../scripts/game/model/settings.ts" />
var MonopolyApp;
(function (MonopolyApp) {
    var controllers;
    (function (controllers) {
        var SettingsController = (function () {
            function SettingsController(stateService, settingsService) {
                this.stateService = stateService;
                this.settingsService = settingsService;
                this.loadSettings();
            }
            SettingsController.prototype.saveAndClose = function () {
                this.saveSettings();
                this.stateService.go("mainmenu");
            };
            SettingsController.prototype.loadSettings = function () {
                this.settings = new Model.Settings();
                this.settings.playerName = "Noname";
                this.settings.numPlayers = 2;
                this.settings = this.settingsService.loadSettings();
            };
            SettingsController.prototype.saveSettings = function () {
                this.settingsService.saveSettings(this.settings);
            };
            SettingsController.$inject = ["$state", "settingsService"];
            return SettingsController;
        })();
        controllers.SettingsController = SettingsController;
        monopolyApp.controller("settingsCtrl", SettingsController);
    })(controllers = MonopolyApp.controllers || (MonopolyApp.controllers = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var Coordinate = (function () {
            function Coordinate() {
            }
            return Coordinate;
        })();
        Viewmodels.Coordinate = Coordinate;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var Player = (function () {
            function Player() {
            }
            return Player;
        })();
        Viewmodels.Player = Player;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
//# sourceMappingURL=appBundle.js.map