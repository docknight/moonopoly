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
            this._mortgage = false;
            this._houses = 0;
            this._uncommittedHouses = 0;
            this._hotel = false;
            this._uncommittedHotel = undefined;
            this.priceRent = [];
            this.priceRentHouse = [];
            this.priceMultiplierUtility = [];
        }
        Object.defineProperty(Asset.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "unowned", {
            get: function () {
                return this._unowned;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "houses", {
            get: function () {
                if (this.hotel || this._uncommittedHotel) {
                    return 0;
                }
                else if (this._uncommittedHotel === false) {
                    return 4 + this._uncommittedHouses;
                }
                return this._houses + this._uncommittedHouses;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "hotel", {
            get: function () {
                if (this._uncommittedHotel !== undefined) {
                    return this._uncommittedHotel;
                }
                return this._hotel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "mortgage", {
            get: function () {
                return this._mortgage;
            },
            enumerable: true,
            configurable: true
        });
        // add a house in a preview mode;
        Asset.prototype.addHouse = function () {
            this._uncommittedHouses++;
        };
        // add a hotel in a preview mode;
        Asset.prototype.addHotel = function () {
            this._uncommittedHotel = this._uncommittedHotel === false ? undefined : true;
        };
        // remove a house in a preview mode
        Asset.prototype.removeHouse = function () {
            this._uncommittedHouses--;
        };
        // remove a hotel in a preview mode
        Asset.prototype.removeHotel = function () {
            this._uncommittedHotel = this._uncommittedHotel ? undefined : false;
            //this._uncommittedHouses = 4;
        };
        Asset.prototype.commitHouseOrHotel = function () {
            if (this._uncommittedHotel !== undefined) {
                this.hotel = this._uncommittedHotel;
                if (this._uncommittedHotel === false) {
                    this._houses = 4;
                }
            }
            this._houses += this._uncommittedHouses;
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
            if (this.hotel) {
                this.houses = 0;
            }
        };
        Asset.prototype.rollbackHouseOrHotel = function () {
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
        };
        // gets the price to pay for all the uncommitted amenities of the asset (can be negative if the player is selling houses/hotel);
        Asset.prototype.uncommittedPrice = function () {
            var price = 0;
            if (this._uncommittedHotel) {
                price += this.priceHotel;
            }
            else if (this._uncommittedHotel === false) {
                price -= this.priceHotel / 2;
            }
            if (this._uncommittedHouses) {
                var priceHouses = this._uncommittedHouses * this.priceHouse;
                price += priceHouses;
            }
            return price;
        };
        Asset.prototype.hasUncommittedUpgrades = function () {
            return this._uncommittedHotel || this._uncommittedHotel === false || (this._uncommittedHouses && (this._uncommittedHouses > 0 || this._uncommittedHouses < 0));
        };
        // returns hotel price, taking into account that the hotel that has just been sold (at a half price) can be bought back at the same price, since the sell has not been
        // committed yet
        // the 'selling' parameter determines whether the hotel is being sold or bought
        Asset.prototype.getPriceForHotelDuringManage = function (selling) {
            if (!selling) {
                if (this._uncommittedHotel === false) {
                    return this.priceHotel / 2;
                }
                return this.priceHotel;
            }
            else {
                if (this._uncommittedHotel) {
                    return this.priceHotel;
                }
                return this.priceHotel / 2;
            }
        };
        // returns house price, taking into account that the house that has just been sold (at a half price) can be bought back at the same price, since the sell has not been
        // committed yet
        // the 'selling' parameter determines whether the house is being sold or bought
        Asset.prototype.getPriceForHouseDuringManage = function (selling) {
            if (!selling) {
                if (this._uncommittedHouses === undefined || this._uncommittedHouses < 0) {
                    return this.priceHouse / 2;
                }
                return this.priceHouse;
            }
            else {
                if (this._uncommittedHouses && this._uncommittedHouses > 0) {
                    return this.priceHouse;
                }
                return this.priceHouse / 2;
            }
        };
        Asset.prototype.putUnderMortgage = function () {
            this._mortgage = true;
        };
        Asset.prototype.releaseMortgage = function () {
            this._mortgage = false;
        };
        Asset.prototype.setOwner = function (ownerName) {
            if (this._unowned) {
                this._owner = ownerName;
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
            boardField.asset.priceRent.push(2, 4);
            boardField.asset.priceRentHouse.push(10, 30, 90, 160);
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
            boardField.asset.priceRent.push(4, 8);
            boardField.asset.priceRentHouse.push(20, 60, 180, 320);
            boardField.asset.priceRentHotel = 450;
            boardField.asset.priceMortgage = 30;
            this.fields.push(boardField);
            var taxField = new Model.BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = Model.BoardFieldType.Tax;
            this.fields.push(taxField);
            boardField = this.createAssetBoardField("Železniška postaja Jesenice", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Bogenšperk", this.fields.length, Model.AssetGroup.Second);
            boardField.asset.price = 100;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
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
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
            boardField.asset.priceRentHotel = 550;
            boardField.asset.priceMortgage = 50;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Otočec", this.fields.length, Model.AssetGroup.Second);
            boardField.asset.price = 120;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(8, 8, 16);
            boardField.asset.priceRentHouse.push(40, 100, 300, 450);
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
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.priceMortgage = 70;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Javna razsvetljava", this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.priceMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Dolenjske toplice", this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.priceMortgage = 70;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Moravske toplice", this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 160;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(12, 12, 24);
            boardField.asset.priceRentHouse.push(60, 180, 500, 700);
            boardField.asset.priceRentHotel = 900;
            boardField.asset.priceMortgage = 80;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Glavni kolodvor Ljubljana", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Športni park Stožice", this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
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
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
            boardField.asset.priceRentHotel = 950;
            boardField.asset.priceMortgage = 90;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Mariborsko Pohorje", this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 200;
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(16, 16, 32);
            boardField.asset.priceRentHouse.push(80, 220, 600, 800);
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
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
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
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.priceMortgage = 110;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Logarska dolina", this.fields.length, Model.AssetGroup.Fifth);
            boardField.asset.price = 240;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(20, 20, 40);
            boardField.asset.priceRentHouse.push(100, 300, 750, 925);
            boardField.asset.priceRentHotel = 1100;
            boardField.asset.priceMortgage = 120;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Železniška postaja Zidani most", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.priceMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Lipica", this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.priceMortgage = 130;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Volčji potok", this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.priceMortgage = 130;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Mestni vodovod", this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.priceMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Postojnska jama", this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 280;
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(24, 24, 48);
            boardField.asset.priceRentHouse.push(120, 360, 850, 1025);
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
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.priceMortgage = 150;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Bohinj", this.fields.length, Model.AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
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
            boardField.asset.priceRent.push(28, 28, 56);
            boardField.asset.priceRentHouse.push(150, 450, 1000, 1200);
            boardField.asset.priceRentHotel = 1400;
            boardField.asset.priceMortgage = 160;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField("Železniška postaja Koper", this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.priceRent.push(25, 50, 100, 200);
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
            boardField.asset.priceRent.push(35, 70);
            boardField.asset.priceRentHouse.push(175, 500, 1100, 1300);
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
            boardField.asset.priceRent.push(50, 100);
            boardField.asset.priceRentHouse.push(200, 600, 1400, 1700);
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
        GameState[GameState["Manage"] = 4] = "Manage"; // the game is paused and the player is managing his assets
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
        Game.prototype.getState = function () {
            return this.state;
        };
        Game.prototype.setState = function (state) {
            this.previousState = this.state;
            this.state = state;
        };
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
        Game.prototype.setPreviousState = function () {
            if (this.previousState !== undefined) {
                this.state = this.previousState;
                this.previousState = undefined;
            }
        };
        return Game;
    })();
    Model.Game = Game;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (PlayerColor) {
        PlayerColor[PlayerColor["Red"] = 0] = "Red";
        PlayerColor[PlayerColor["Blue"] = 1] = "Blue";
        PlayerColor[PlayerColor["Green"] = 2] = "Green";
        PlayerColor[PlayerColor["Yellow"] = 3] = "Yellow";
    })(Model.PlayerColor || (Model.PlayerColor = {}));
    var PlayerColor = Model.PlayerColor;
    ;
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
    var ProcessResult = (function () {
        function ProcessResult() {
        }
        return ProcessResult;
    })();
    Model.ProcessResult = ProcessResult;
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
var monopolyApp = angular.module('monopolyApp', ['ui.router', 'ui.bootstrap', 'ngTouch']);
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
var Services;
(function (Services) {
    var DrawingService = (function () {
        function DrawingService($http, gameService) {
            this.boardFieldsInQuadrant = 11;
            this.groundMeshName = "board";
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
            var playerQuadrant = Math.floor(player.position.index / (this.boardFieldsInQuadrant - 1));
            var playerQuadrantOffset = player.position.index % (this.boardFieldsInQuadrant - 1);
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
        DrawingService.prototype.animatePlayerMove = function (oldPositionIndex, newPosition, playerModel) {
            this.positionPlayer(playerModel);
        };
        DrawingService.prototype.setGameCameraPosition = function (camera) {
            camera.position.x = 0;
            camera.position.y = 5;
            camera.position.z = -10;
            camera.setTarget(BABYLON.Vector3.Zero());
        };
        DrawingService.prototype.setManageCameraPosition = function (camera, group, scene) {
            if (!this.boardGroupLeftCoordinate) {
                this.initBoardGroupCoordinates();
            }
            var groupLeftCoordinate = this.boardGroupLeftCoordinate[group];
            var groupRightCoordinate = this.boardGroupRightCoordinate[group];
            var groupQuadrant = Math.floor((group - 1) / 2);
            var centerVector = BABYLON.Vector3.Center(new BABYLON.Vector3(groupLeftCoordinate.x, 0, groupLeftCoordinate.z), new BABYLON.Vector3(groupRightCoordinate.x, 0, groupRightCoordinate.z));
            camera.setTarget(centerVector);
            camera.target = centerVector;
            if (groupQuadrant === 0) {
                camera.setPosition(new BABYLON.Vector3(centerVector.x, 2, -7));
            }
            if (groupQuadrant === 1) {
                camera.setPosition(new BABYLON.Vector3(-7, 2, centerVector.z));
            }
            if (groupQuadrant === 2) {
                camera.setPosition(new BABYLON.Vector3(centerVector.x, 2, 7));
            }
            if (groupQuadrant === 3) {
                camera.setPosition(new BABYLON.Vector3(7, 2, centerVector.z));
            }
            this.cleanupHouseButtons(scene);
            this.highlightGroupFields(group, groupQuadrant, centerVector, scene);
        };
        DrawingService.prototype.returnFromManage = function (scene) {
            this.cleanupHighlights(scene);
            this.cleanupHouseButtons(scene);
        };
        DrawingService.prototype.pickBoardElement = function (scene, coords) {
            var pickResult = scene.pick(coords ? coords.x : scene.pointerX, coords ? coords.y : scene.pointerY);
            if (pickResult.hit) {
                var pickedObject = new MonopolyApp.Viewmodels.PickedObject();
                pickedObject.pickedMesh = pickResult.pickedMesh;
                if (pickResult.pickedMesh && pickResult.pickedMesh.name === this.groundMeshName) {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.BoardField;
                    pickedObject.position = this.getBoardElementAt(pickResult.pickedPoint);
                }
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 12) === "houseButton_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.AddHouse;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(12));
                }
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 18) === "houseRemoveButton_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.RemoveHouse;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(18));
                }
                return pickedObject;
            }
            return undefined;
        };
        DrawingService.prototype.createBoard = function (scene) {
            var board = BABYLON.Mesh.CreateGround(this.groundMeshName, this.boardSize, this.boardSize, 2, scene);
            var boardMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            boardMaterial.emissiveTexture = new BABYLON.Texture("images/Gameboard.png", scene);
            boardMaterial.diffuseTexture = new BABYLON.Texture("images/Gameboard.png", scene);
            board.material = boardMaterial;
        };
        DrawingService.prototype.setBoardFieldOwner = function (boardField, asset, scene) {
            var _this = this;
            if (boardField.ownerMesh) {
                scene.removeMesh(boardField.ownerMesh);
                boardField.ownerMesh.dispose();
            }
            var fieldQuadrant = Math.floor(boardField.index / (this.boardFieldsInQuadrant - 1));
            var playerColor = this.gameService.players.filter(function (p) { return p.playerName === _this.gameService.getCurrentPlayer(); })[0].color;
            var topCenter = this.getPositionCoordinate(boardField.index);
            var heightCoordinate = this.getQuadrantRunningCoordinate(fieldQuadrant) === "x" ? "z" : "x";
            var heightDirection = fieldQuadrant === 0 || fieldQuadrant === 1 ? -1 : 1;
            var bottomCenter = new MonopolyApp.Viewmodels.Coordinate(topCenter.x, topCenter.z);
            bottomCenter[heightCoordinate] += this.boardFieldHeight * 1.2 * heightDirection;
            boardField.ownerMesh = BABYLON.Mesh.CreateBox("ownerbox_" + boardField.index, this.boardFieldWidth * 0.8, scene);
            var mat = new BABYLON.StandardMaterial("ownerboxmaterial_" + boardField.index, scene);
            mat.alpha = 1.0;
            mat.diffuseColor = this.getColor(playerColor, true);
            mat.emissiveColor = this.getColor(playerColor, false);
            mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
            boardField.ownerMesh.material = mat;
            boardField.ownerMesh.position.x = bottomCenter.x;
            boardField.ownerMesh.position.z = bottomCenter.z;
            boardField.ownerMesh.scaling.y = 0.2;
            boardField.ownerMesh.scaling.z = 0.2;
            if (fieldQuadrant === 1) {
                boardField.ownerMesh.rotation.y = Math.PI / 2;
            }
            else if (fieldQuadrant === 2) {
                boardField.ownerMesh.rotation.y = Math.PI;
            }
            else if (fieldQuadrant === 3) {
                boardField.ownerMesh.rotation.y = Math.PI * 3 / 2;
            }
        };
        DrawingService.prototype.setBoardFieldHouses = function (viewBoardField, houses, hotel, scene) {
            if (viewBoardField.hotelMesh) {
                scene.removeMesh(viewBoardField.hotelMesh);
                viewBoardField.hotelMesh.dispose();
            }
            if (viewBoardField.houseMeshes && viewBoardField.houseMeshes.length > 0) {
                viewBoardField.houseMeshes.forEach(function (h) {
                    scene.removeMesh(h);
                    h.dispose();
                });
            }
            var topLeftCorner = this.getPositionCoordinate(viewBoardField.index, hotel ? false : true);
            var houseSize = 0.165;
            var boardFieldQuadrant = Math.floor(viewBoardField.index / (this.boardFieldsInQuadrant - 1));
            var runningCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant);
            var heightCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
            var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
            if (!hotel) {
                topLeftCorner[runningCoordinate] += (houseSize / 2) * 1.15 * this.getQuadrantRunningDirection(boardFieldQuadrant) * -1;
            }
            topLeftCorner[heightCoordinate] += (houseSize / 2) * 1.3 * heightDirection;
            if ((houses && houses > 0) || hotel) {
                viewBoardField.houseMeshes = [];
                while ((houses > 0) || hotel) {
                    var houseMesh = BABYLON.Mesh.CreateBox(hotel ? "hotel_" + viewBoardField.index : "house_" + viewBoardField.index + "_" + houses, houseSize, scene);
                    houseMesh.scaling = new BABYLON.Vector3(1, 0.5, 1);
                    if (hotel) {
                        houseMesh.scaling[runningCoordinate] = 2;
                    }
                    houseMesh.position = new BABYLON.Vector3(topLeftCorner.x, 0, topLeftCorner.z);
                    if (!hotel) {
                        houseMesh.position[runningCoordinate] += (houses - 1) * houseSize * 1.15 * this.getQuadrantRunningDirection(boardFieldQuadrant) * -1;
                    }
                    viewBoardField.houseMeshes.push(houseMesh);
                    if (hotel) {
                        hotel = false;
                        houses = 0;
                    }
                    else {
                        houses--;
                    }
                }
            }
        };
        DrawingService.prototype.loadMeshes = function (players, scene, gameController) {
            var _this = this;
            var meshLoads = [];
            this.gameService.players.forEach(function (player) {
                var playerModel = players.filter(function (p) { return p.name === player.playerName; })[0];
                playerModel.name = player.playerName;
                var d = $.Deferred();
                meshLoads.push(d);
                var that = _this;
                BABYLON.SceneLoader.ImportMesh(null, "meshes/", "character.babylon", scene, function (newMeshes, particleSystems) {
                    if (newMeshes != null) {
                        var mesh = newMeshes[0];
                        playerModel.mesh = mesh;
                        var mat = new BABYLON.StandardMaterial("player_" + player.color + "_material", scene);
                        mat.diffuseColor = that.getColor(player.color, true);
                        //mat.emissiveColor = that.getColor(player.color, false);
                        mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                        newMeshes[1].material = mat;
                        d.resolve(gameController);
                    }
                });
            });
            var d = $.Deferred();
            meshLoads.push(d);
            BABYLON.SceneLoader.ImportMesh(null, "meshes/", "house2.babylon", scene, function (newMeshes, particleSystems) {
                if (newMeshes != null) {
                    var mesh = newMeshes[0];
                    var mat = new BABYLON.StandardMaterial("house", scene);
                    //mat.alpha = 0;
                    mat.ambientColor = new BABYLON.Color3(0.1098, 0.6392, 0.102);
                    mat.diffuseColor = new BABYLON.Color3(0.1098, 0.6392, 0.102);
                    mat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                    mesh.material = mat;
                    mesh.position.x = 5;
                    mesh.position.z = -5;
                    mesh.visibility = 0;
                    _this.houseMeshTemplate = mesh;
                    d.resolve(gameController);
                }
            });
            this.houseButtonMeshTemplate = BABYLON.Mesh.CreateGround("houseButton", 0.3, 0.3, 2, scene, true);
            this.houseButtonMaterial = new BABYLON.StandardMaterial("houseButtonTexture", scene);
            this.houseButtonMaterial.diffuseTexture = new BABYLON.Texture("images/House3.png", scene);
            this.houseButtonMaterial.diffuseTexture.hasAlpha = true;
            this.houseButtonMaterial.useAlphaFromDiffuseTexture = true;
            var houseButtonMeshTemplateMaterial = new BABYLON.StandardMaterial("houseButtonTemplateTexture", scene);
            houseButtonMeshTemplateMaterial.alpha = 0;
            this.houseButtonMeshTemplate.material = houseButtonMeshTemplateMaterial;
            this.houseButtonMeshTemplate.position.y = 0.01;
            //this.houseButtonMeshTemplate.visibility = 0;
            scene.removeMesh(this.houseButtonMeshTemplate);
            this.houseRemoveButtonMeshTemplate = BABYLON.Mesh.CreateGround("houseRemoveButton", 0.3, 0.3, 2, scene);
            this.houseRemoveButtonMaterial = new BABYLON.StandardMaterial("houseRemoveButtonTexture", scene);
            this.houseRemoveButtonMaterial.diffuseTexture = new BABYLON.Texture("images/House-remove.png", scene);
            this.houseRemoveButtonMaterial.diffuseTexture.hasAlpha = true;
            this.houseRemoveButtonMaterial.useAlphaFromDiffuseTexture = true;
            var houseRemoveButtonMeshTemplateMaterial = new BABYLON.StandardMaterial("houseRemoveButtonTemplateTexture", scene);
            houseRemoveButtonMeshTemplateMaterial.alpha = 0;
            this.houseRemoveButtonMeshTemplate.material = houseRemoveButtonMeshTemplateMaterial;
            this.houseRemoveButtonMeshTemplate.position.y = 0.01;
            //this.houseButtonMeshTemplate.visibility = 0;
            scene.removeMesh(this.houseRemoveButtonMeshTemplate);
            return meshLoads;
        };
        DrawingService.prototype.showHouseButtons = function (focusedAssetGroup, scene) {
            var _this = this;
            this.cleanupHouseButtons(scene);
            var groupBoardFields = this.gameService.getGroupBoardFields(focusedAssetGroup);
            //var groupBoardPositions = $.map(groupBoardFields, (f, i) => f.index);
            var that = this;
            groupBoardFields.forEach(function (field) {
                var topLeft = that.getPositionCoordinate(field.index, true);
                var boardFieldQuadrant = Math.floor(field.index / (that.boardFieldsInQuadrant - 1));
                var runningCoordinate = that.getQuadrantRunningCoordinate(boardFieldQuadrant);
                var heightCoordinate = that.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
                var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
                if (that.gameService.canUpgradeAsset(field.asset, that.gameService.getCurrentPlayer())) {
                    var houseButtonMesh = that.houseButtonMeshTemplate.clone("houseButton_" + field.index);
                    houseButtonMesh.material = that.houseButtonMaterial;
                    scene.addMesh(houseButtonMesh);
                    houseButtonMesh.position[runningCoordinate] = topLeft[runningCoordinate] + (0.5 * _this.getQuadrantRunningDirection(boardFieldQuadrant) * -1);
                    houseButtonMesh.position[heightCoordinate] = topLeft[heightCoordinate] + (that.boardFieldHeight - 0.2) * heightDirection;
                    //houseButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1.5, 1, 1.5), 100));
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1, 1, 1), 100));
                    that.houseButtonMeshes.push(houseButtonMesh);
                }
                var houseRemoveButtonMesh = that.houseRemoveButtonMeshTemplate.clone("houseRemoveButton_" + field.index);
                houseRemoveButtonMesh.material = that.houseRemoveButtonMaterial;
                scene.addMesh(houseRemoveButtonMesh);
                houseRemoveButtonMesh.position[runningCoordinate] = topLeft[runningCoordinate] + (0.2 * that.getQuadrantRunningDirection(boardFieldQuadrant) * -1);
                houseRemoveButtonMesh.position[heightCoordinate] = topLeft[heightCoordinate] + (that.boardFieldHeight - 0.2) * heightDirection;
                houseRemoveButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                that.houseRemoveButtonMeshes.push(houseRemoveButtonMesh);
                if (boardFieldQuadrant === 1) {
                    houseButtonMesh.rotation.y = Math.PI / 2;
                    houseRemoveButtonMesh.rotation.y = Math.PI / 2;
                }
                else if (boardFieldQuadrant === 2) {
                    houseButtonMesh.rotation.y = Math.PI;
                    houseRemoveButtonMesh.rotation.y = Math.PI;
                }
                else if (boardFieldQuadrant === 3) {
                    houseButtonMesh.rotation.y = Math.PI * 3 / 2;
                    houseRemoveButtonMesh.rotation.y = Math.PI * 3 / 2;
                }
            });
        };
        DrawingService.prototype.onSwipeMove = function (scene, coords) {
            if (this.houseButtonMeshes && this.houseButtonMeshes.length > 0) {
                var pickedObject = this.pickBoardElement(scene, coords);
                if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                    pickedObject.pickedMesh.scaling = new BABYLON.Vector3(1.5, 1, 1.5);
                }
                else {
                    this.houseButtonMeshes.forEach(function (m) {
                        if (m.scaling.x > 1) {
                            m.scaling = new BABYLON.Vector3(1, 1, 1);
                        }
                    });
                }
            }
        };
        DrawingService.prototype.onSwipeEnd = function (scene, coords) {
            var pickedObject = this.pickBoardElement(scene, coords);
            if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                pickedObject.pickedMesh.scaling = new BABYLON.Vector3(1, 1, 1);
            }
            return pickedObject;
        };
        DrawingService.prototype.showActionButtons = function () {
            // sdf
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
            fourthQuadrantStartingCoordinate.x = (this.boardSize / 2) - this.boardFieldHeight;
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
        DrawingService.prototype.initBoardGroupCoordinates = function () {
            this.boardGroupLeftCoordinate = [];
            this.boardGroupRightCoordinate = [];
            var group;
            for (group = Model.AssetGroup.First; group <= Model.AssetGroup.Eighth; group++) {
                var groupBoardFields = this.gameService.getGroupBoardFields(group);
                var groupBoardPositions = $.map(groupBoardFields, function (f, i) { return f.index; });
                var position = Math.max.apply(this, groupBoardPositions);
                var leftCoordinate = this.getPositionCoordinate(position);
                position = Math.min.apply(this, groupBoardPositions);
                var rightCoordinate = this.getPositionCoordinate(position);
                this.boardGroupLeftCoordinate[group] = leftCoordinate;
                this.boardGroupRightCoordinate[group] = rightCoordinate;
            }
        };
        // returns the coordinate of top center of the board field with a given index
        DrawingService.prototype.getPositionCoordinate = function (position, returnTopLeftCorner) {
            var fieldQuadrant = Math.floor(position / (this.boardFieldsInQuadrant - 1));
            var fieldQuadrantOffset = position % (this.boardFieldsInQuadrant - 1);
            var coordinate = new MonopolyApp.Viewmodels.Coordinate();
            coordinate.x = this.quadrantStartingCoordinate[fieldQuadrant].x;
            coordinate.z = this.quadrantStartingCoordinate[fieldQuadrant].z;
            coordinate[this.getQuadrantRunningCoordinate(fieldQuadrant)] += fieldQuadrantOffset * this.boardFieldWidth * this.getQuadrantRunningDirection(fieldQuadrant);
            if (!returnTopLeftCorner) {
                coordinate[this.getQuadrantRunningCoordinate(fieldQuadrant)] += (fieldQuadrantOffset === 0 ? this.boardFieldWidth : this.boardFieldWidth / 2) * -this.getQuadrantRunningDirection(fieldQuadrant);
            }
            return coordinate;
        };
        DrawingService.prototype.highlightGroupFields = function (assetGroup, groupQuadrantIndex, groupCenter, scene) {
            var _this = this;
            this.cleanupHighlights(scene);
            var meshes = [];
            var mat = new BABYLON.StandardMaterial("mat1", scene);
            mat.alpha = 1.0;
            mat.diffuseColor = new BABYLON.Color3(0.5, 0.1, 0);
            mat.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0);
            this.highlightLight = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(groupCenter.x, 10, groupCenter.z), new BABYLON.Vector3(0, -1, 0), 0.8, 2, scene);
            this.highlightLight.diffuse = new BABYLON.Color3(1, 0, 0);
            this.highlightLight.specular = new BABYLON.Color3(1, 1, 1);
            var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
            var groupBoardPositions = $.map(groupBoardFields, function (f, i) { return f.index; });
            var highlightBoxWidth = 0.03;
            var cornerLength = 0.05;
            var that = this;
            groupBoardPositions.forEach(function (position) {
                var arcPath = [];
                for (var i = 0; i <= 180; i++) {
                    var radian = i * 0.0174532925;
                    arcPath.push(new BABYLON.Vector3(Math.cos(radian) * highlightBoxWidth, Math.sin(radian) * highlightBoxWidth, 0));
                }
                arcPath[arcPath.length - 1].y = 0;
                var path2 = [];
                path2.push(new BABYLON.Vector3(0, 0, -cornerLength));
                path2.push(new BABYLON.Vector3(0, 0, -that.boardFieldHeight + cornerLength));
                path2.push(new BABYLON.Vector3(0 + cornerLength, 0, -that.boardFieldHeight));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth - cornerLength, 0, -that.boardFieldHeight));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth, 0, -that.boardFieldHeight + cornerLength));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth, 0, -cornerLength));
                path2.push(new BABYLON.Vector3(that.boardFieldWidth - cornerLength, 0, 0));
                path2.push(new BABYLON.Vector3(cornerLength, 0, 0));
                path2.push(new BABYLON.Vector3(0, 0, -cornerLength));
                path2.push(new BABYLON.Vector3(0, 0, -cornerLength * 3));
                var extruded = BABYLON.Mesh.ExtrudeShape("extruded", arcPath, path2, 1, 0, 0, scene);
                if (groupQuadrantIndex === 1) {
                    extruded.rotation.y = Math.PI / 2;
                }
                else if (groupQuadrantIndex === 2) {
                    extruded.rotation.y = Math.PI;
                }
                else if (groupQuadrantIndex === 3) {
                    extruded.rotation.y = Math.PI * 3 / 2;
                }
                var topLeft = _this.getPositionCoordinate(position, true);
                extruded.position.x = topLeft.x;
                extruded.position.z = topLeft.z;
                extruded.material = mat;
                meshes.push(extruded);
            });
            this.highlightMeshes = meshes;
        };
        DrawingService.prototype.cleanupHighlights = function (scene) {
            if (this.highlightMeshes) {
                this.highlightMeshes.forEach(function (mesh) {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
                this.highlightMeshes = undefined;
            }
            if (this.highlightLight) {
                scene.removeLight(this.highlightLight);
                this.highlightLight.dispose();
                this.highlightLight = undefined;
            }
        };
        DrawingService.prototype.getBoardElementAt = function (pickedPoint) {
            var _this = this;
            var boardFieldIndex;
            this.quadrantStartingCoordinate.forEach(function (quadrant, index) {
                var topRightCorner = quadrant[_this.getQuadrantRunningCoordinate(index)] + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) * -1;
                var topLeftCorner = topRightCorner + (_this.boardSize - _this.boardFieldEdgeWidth) * _this.getQuadrantRunningDirection(index);
                var heightCoordinate = _this.getQuadrantRunningCoordinate(index) === "x" ? "z" : "x";
                var heightDirection = index === 0 || index === 1 ? -1 : 1;
                if (pickedPoint[_this.getQuadrantRunningCoordinate(index)] < topRightCorner && pickedPoint[_this.getQuadrantRunningCoordinate(index)] > topLeftCorner &&
                    pickedPoint[heightCoordinate] < quadrant[heightCoordinate] && pickedPoint[heightCoordinate] > quadrant[heightCoordinate] + _this.boardFieldHeight * heightDirection) {
                    var quadrantOffset = pickedPoint[_this.getQuadrantRunningCoordinate(index)] > topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) ? 0 :
                        Math.ceil(Math.abs((pickedPoint[_this.getQuadrantRunningCoordinate(index)] - (topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index))) / _this.boardFieldWidth));
                    boardFieldIndex = index * (_this.boardFieldsInQuadrant - 1) + quadrantOffset;
                }
            }, this);
            return boardFieldIndex;
        };
        DrawingService.prototype.getColor = function (playerColor, diffuse) {
            if (playerColor === Model.PlayerColor.Blue) {
                return diffuse ? new BABYLON.Color3(0.3, 0.3, 1) : new BABYLON.Color3(0.1, 0, 0.7);
            }
            else if (playerColor === Model.PlayerColor.Red) {
                return diffuse ? new BABYLON.Color3(1, 0.3, 0.3) : new BABYLON.Color3(0.7, 0, 0.1);
            }
            else if (playerColor === Model.PlayerColor.Green) {
                return diffuse ? new BABYLON.Color3(0.3, 1, 0.3) : new BABYLON.Color3(0.1, 0.7, 0);
            }
            else if (playerColor === Model.PlayerColor.Yellow) {
                return diffuse ? new BABYLON.Color3(1, 1, 0.3) : new BABYLON.Color3(0.7, 0.7, 0.1);
            }
            return BABYLON.Color3.White();
        };
        DrawingService.prototype.cleanupHouseButtons = function (scene) {
            if (this.houseButtonMeshes && this.houseButtonMeshes.length > 0) {
                this.houseButtonMeshes.forEach(function (mesh) {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
            }
            this.houseButtonMeshes = [];
            if (this.houseRemoveButtonMeshes && this.houseRemoveButtonMeshes.length > 0) {
                this.houseRemoveButtonMeshes.forEach(function (mesh) {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
            }
            this.houseRemoveButtonMeshes = [];
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
            this.uncommittedHousesPrice = 0;
        };
        GameService.prototype.endTurn = function () {
            if (this.canEndTurn) {
                this.game.advanceToNextPlayer();
                this.game.setState(Model.GameState.BeginTurn);
            }
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
        Object.defineProperty(GameService.prototype, "canThrowDice", {
            get: function () {
                if (this.game.getState() === Model.GameState.BeginTurn) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canEndTurn", {
            get: function () {
                if (this.game.getState() !== Model.GameState.BeginTurn) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canBuy", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.Process) {
                    var currentPosition = this.getCurrentPlayerPosition();
                    if (currentPosition.type === Model.BoardFieldType.Asset) {
                        if (currentPosition.asset.unowned) {
                            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                            if (player.money >= currentPosition.asset.price) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canManage", {
            get: function () {
                if (this.game.getState() === Model.GameState.Move) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        GameService.prototype.setPlayerPosition = function (player, boardFieldIndex) {
            player.position = this.game.board.fields[boardFieldIndex];
            var previousFields = this.game.board.fields.filter(function (b) { return b.occupiedBy != null && b.occupiedBy.filter(function (ocb) { return ocb === player.playerName; }).length > 0; });
            if (previousFields && previousFields.length > 0) {
                var previousField = previousFields[0];
                previousField.occupiedBy.splice(previousField.occupiedBy.indexOf(player.playerName));
            }
            player.position.occupiedBy.push(player.playerName);
        };
        GameService.prototype.throwDice = function () {
            this.game.setState(Model.GameState.ThrowDice);
            this.lastDiceResult1 = 1;
            this.lastDiceResult2 = 0;
        };
        GameService.prototype.buy = function () {
            var _this = this;
            if (this.canBuy) {
                var asset = this.getCurrentPlayerPosition().asset;
                if (asset) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    player.money -= asset.price;
                    asset.setOwner(this.getCurrentPlayer());
                    return true;
                }
            }
            return false;
        };
        GameService.prototype.manage = function () {
            if (this.canManage) {
                this.game.setState(Model.GameState.Manage);
                this.currentManageGroup = Model.AssetGroup.First;
            }
            else {
                this.currentManageGroup = undefined;
            }
            return this.currentManageGroup;
        };
        GameService.prototype.manageFocusChange = function (left) {
            if (this.game.getState() === Model.GameState.Manage) {
                if (left) {
                    this.currentManageGroup -= 1;
                    if (this.currentManageGroup < Model.AssetGroup.First) {
                        this.currentManageGroup = Model.AssetGroup.Eighth;
                    }
                }
                else {
                    this.currentManageGroup += 1;
                    if (this.currentManageGroup > Model.AssetGroup.Eighth) {
                        this.currentManageGroup = Model.AssetGroup.First;
                    }
                }
            }
            return this.currentManageGroup;
        };
        GameService.prototype.returnFromManage = function () {
            if (this.game.getState() === Model.GameState.Manage) {
                this.game.setPreviousState();
            }
        };
        GameService.prototype.getCurrentPlayerPosition = function () {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            return player.position;
        };
        GameService.prototype.moveCurrentPlayer = function () {
            var _this = this;
            this.game.setState(Model.GameState.Move);
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            var currentPositionIndex = player.position.index;
            var newPositionIndex = Math.floor((currentPositionIndex + this.lastDiceResult1 + this.lastDiceResult2) % 40);
            player.position = this.game.board.fields[newPositionIndex];
            this.game.board.fields[currentPositionIndex].occupiedBy.splice(this.game.board.fields[currentPositionIndex].occupiedBy.indexOf(player.playerName), 1);
            player.position.occupiedBy.push(player.playerName);
            this.game.setState(Model.GameState.Process);
            return player.position;
        };
        // process visit of a field owned by another player
        GameService.prototype.processOwnedFieldVisit = function () {
            var _this = this;
            var result = new Model.ProcessResult();
            var asset = this.getCurrentPlayerPosition().asset;
            var priceToPay = 0;
            if (!asset.mortgage) {
                if (asset.hotel) {
                    priceToPay = asset.priceRentHotel;
                }
                else if (asset.houses > 0) {
                    priceToPay = asset.priceRentHouse[asset.houses - 1];
                }
                // for the rest of the scenarios, we need to find out the number of owned assets in a group
                var numOwnedInGroup = this.game.board.fields.filter(function (f) {
                    return f.type === Model.BoardFieldType.Asset && f.asset.group === asset.group && !f.asset.unowned && f.asset.owner === asset.owner;
                }).length;
                if (asset.group === Model.AssetGroup.Railway) {
                    priceToPay = asset.priceRent[numOwnedInGroup - 1];
                }
                else if (asset.group === Model.AssetGroup.Utility) {
                    priceToPay = asset.priceMultiplierUtility[numOwnedInGroup - 1] * (this.lastDiceResult1 + this.lastDiceResult2);
                }
                else if (asset.group !== Model.AssetGroup.None) {
                    priceToPay = asset.priceRent[numOwnedInGroup - 1];
                }
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                if (player.money < priceToPay) {
                    // TODO: player can not pay
                    result.moneyShortage = priceToPay - player.money;
                    return result;
                }
                player.money -= priceToPay;
                var ownerPlayer = this.game.players.filter(function (p) { return p.playerName === asset.owner; })[0];
                ownerPlayer.money += priceToPay;
                result.message = "Paid rent of " + priceToPay + " to " + ownerPlayer.playerName + ".";
            }
            return result;
        };
        GameService.prototype.getGroupBoardFields = function (assetGroup) {
            return this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === assetGroup; });
        };
        GameService.prototype.getBoardFieldGroup = function (boardFieldIndex) {
            var fields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.index == boardFieldIndex; });
            if (fields && fields.length > 0) {
                return fields[0].asset.group;
            }
            else {
                return undefined;
            }
        };
        GameService.prototype.hasMonopoly = function (player, assetGroup) {
            var _this = this;
            var monopoly = true;
            // temporarily
            return monopoly;
            if (assetGroup < Model.AssetGroup.First || assetGroup > Model.AssetGroup.Eighth) {
                monopoly = false;
            }
            var groupFields = this.getGroupBoardFields(assetGroup);
            groupFields.forEach(function (field) {
                if (field.asset.unowned || field.asset.owner !== _this.getCurrentPlayer()) {
                    monopoly = false;
                }
            });
            return monopoly;
        };
        GameService.prototype.addHousePreview = function (playerName, position) {
            var boardField = this.game.board.fields.filter(function (f) { return f.index === position; })[0];
            if (!this.canUpgradeAsset(boardField.asset, playerName)) {
                return false;
            }
            // first, check if the player has the money to afford the upgrade
            var groupBoardFields = this.getGroupBoardFields(boardField.asset.group);
            var requiredMoney = 0;
            var houseCount = boardField.asset.houses + 1;
            requiredMoney += houseCount === 5 ? boardField.asset.getPriceForHotelDuringManage(false) : boardField.asset.getPriceForHouseDuringManage(false);
            groupBoardFields.forEach(function (field) {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.houses;
                    while (neighbourHouseCount < houseCount - 1) {
                        neighbourHouseCount++;
                        requiredMoney += field.asset.getPriceForHouseDuringManage(false);
                    }
                }
            });
            var player = this.game.players.filter(function (p) { return p.playerName === playerName; })[0];
            if (requiredMoney > player.money) {
                return false;
            }
            // next, perform the upgrade
            if (houseCount <= 4) {
                boardField.asset.addHouse();
            }
            else {
                boardField.asset.addHotel();
            }
            groupBoardFields.forEach(function (field) {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.houses;
                    while (neighbourHouseCount < houseCount - 1) {
                        neighbourHouseCount++;
                        field.asset.addHouse();
                    }
                }
            });
            return true;
        };
        GameService.prototype.removeHousePreview = function (playerName, position) {
            var boardField = this.game.board.fields.filter(function (f) { return f.index === position; })[0];
            if (!boardField.asset || !this.hasMonopoly(playerName, boardField.asset.group) || (!boardField.asset.houses && !boardField.asset.hotel)) {
                return false;
            }
            var groupBoardFields = this.getGroupBoardFields(boardField.asset.group);
            var sellPrice = 0;
            var houseCount = boardField.asset.houses - 1;
            var player = this.game.players.filter(function (p) { return p.playerName === playerName; })[0];
            // next, perform the upgrade
            if (houseCount < 0) {
                boardField.asset.removeHotel();
                sellPrice += boardField.asset.getPriceForHotelDuringManage(true);
                houseCount = 4;
            }
            else {
                boardField.asset.removeHouse();
                sellPrice += boardField.asset.getPriceForHouseDuringManage(true);
            }
            groupBoardFields.forEach(function (field) {
                if (field.index !== boardField.index) {
                    var neighbourHouseCount = field.asset.hotel ? 5 : field.asset.houses;
                    while (neighbourHouseCount > houseCount + 1) {
                        if (neighbourHouseCount === 5) {
                            field.asset.removeHotel();
                            sellPrice += boardField.asset.getPriceForHotelDuringManage(true);
                        }
                        else {
                            field.asset.removeHouse();
                            sellPrice += boardField.asset.getPriceForHouseDuringManage(true);
                        }
                        neighbourHouseCount--;
                    }
                }
            });
            this.uncommittedHousesPrice -= sellPrice;
            return true;
        };
        GameService.prototype.commitHouseOrHotel = function (playerName, assetGroup) {
            if (!this.hasMonopoly(playerName, assetGroup)) {
                return false;
            }
            var boardFields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === assetGroup; });
            var totalPrice = 0;
            var that = this;
            boardFields.forEach(function (boardField) {
                totalPrice += boardField.asset.uncommittedPrice();
                boardField.asset.commitHouseOrHotel();
            });
            var player = that.game.players.filter(function (p) { return p.playerName === playerName; })[0];
            player.money -= totalPrice;
            return true;
        };
        GameService.prototype.rollbackHouseOrHotel = function (playerName, assetGroup) {
            if (!this.hasMonopoly(playerName, assetGroup)) {
                return false;
            }
            var boardFields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === assetGroup; });
            boardFields.forEach(function (boardField) {
                boardField.asset.rollbackHouseOrHotel();
            });
            return true;
        };
        GameService.prototype.canUpgradeAsset = function (asset, playerName) {
            // temporarily
            if (!asset /*|| asset.unowned || asset.owner !== playerName*/ || !this.hasMonopoly(playerName, asset.group)) {
                return false;
            }
            if (asset.hotel) {
                return false;
            }
            var player = this.players.filter(function (p) { return p.playerName === playerName; })[0];
            var requiredPrice = !asset.houses || asset.houses <= 3 ? asset.getPriceForHouseDuringManage(false) : asset.getPriceForHotelDuringManage(false);
            return player.money >= requiredPrice;
        };
        GameService.prototype.initPlayers = function () {
            var settings = this.settingsService.loadSettings();
            var colors = ["Red", "Green", "Yellow", "Blue"];
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player();
                player.playerName = i === 0 ? settings.playerName : "Computer " + i;
                player.human = i === 0;
                player.money = 1500;
                player.color = i;
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
            function GameController(stateService, swipeService, scope, timeoutService, gameService, drawingService) {
                var _this = this;
                this.scope = scope;
                this.stateService = stateService;
                this.timeoutService = timeoutService;
                this.gameService = gameService;
                this.drawingService = drawingService;
                this.swipeService = swipeService;
                this.initGame();
                this.createScene();
                this.availableActions = new MonopolyApp.Viewmodels.AvailableActions();
                this.setAvailableActions();
                this.messages = [];
                this.swipeService.bind($("#renderCanvas"), {
                    'move': function (coords) { _this.swipeMove(coords); },
                    'end': function (coords, event) { _this.swipeEnd(coords, event); },
                    'cancel': function (event) { _this.swipeCancel(event); }
                });
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
            GameController.prototype.throwDice = function () {
                if (this.gameService.canThrowDice) {
                    this.gameService.throwDice();
                    var oldPosition = this.gameService.getCurrentPlayerPosition();
                    var newPosition = this.gameService.moveCurrentPlayer();
                    this.animateMove(oldPosition, newPosition);
                    this.setAvailableActions();
                    this.processDestinationField();
                }
            };
            GameController.prototype.buy = function () {
                var bought = this.gameService.buy();
                if (bought) {
                    var boardField = this.gameService.getCurrentPlayerPosition();
                    this.drawingService.setBoardFieldOwner(this.boardFields.filter(function (f) { return f.index === boardField.index; })[0], boardField.asset, this.scene);
                    this.updatePlayersForView();
                }
                this.setAvailableActions();
            };
            GameController.prototype.manage = function () {
                if (!this.manageMode) {
                    this.manageMode = true;
                    this.focusedAssetGroup = this.gameService.manage();
                    this.setupManageHighlight();
                    this.scene.activeCamera = this.manageCamera;
                    //var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
                    //this.manageCamera.attachControl(canvas, true);
                    this.setAvailableActions();
                    $("#commandPanel").hide();
                    $("#manageCommandPanel").show();
                    //var that = this;
                    //this.timeoutService(() => { $(window).on("click", null, that, that.handleClickEvent); }, 1000, false);
                    //this.scope.$evalAsync(() => { $(window).on("click", null, that, that.handleClickEvent); });
                    $(window).on("click", null, this, this.handleClickEvent);
                }
            };
            GameController.prototype.returnFromManage = function () {
                this.manageMode = false;
                $(window).off("click", this.handleClickEvent);
                this.closeAssetManagementWindow();
                this.scene.activeCamera = this.gameCamera;
                this.gameService.returnFromManage();
                this.drawingService.returnFromManage(this.scene);
                //var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
                //this.manageCamera.detachControl(canvas);            
                this.setAvailableActions();
                this.actionButtonsVisible = false;
                $("#manageCommandPanel").hide();
                $("#commandPanel").show();
            };
            GameController.prototype.endTurn = function () {
                if (this.gameService.canEndTurn) {
                    this.gameService.endTurn();
                    this.setAvailableActions();
                }
            };
            GameController.prototype.closeAssetManagementWindow = function () {
                $("#assetManagement").hide();
            };
            GameController.prototype.executeConfirmAction = function (data) {
                this.confirmButtonCallback(data);
            };
            GameController.prototype.executeCancelAction = function (data) {
                this.cancelButtonCallback(data);
            };
            GameController.prototype.createScene = function () {
                var canvas = document.getElementById("renderCanvas");
                var engine = new BABYLON.Engine(canvas, true);
                var theScene = this.createBoard(engine, canvas);
                engine.runRenderLoop(function () {
                    theScene.render();
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
                // This creates a basic Babylon Scene object (non-mesh)
                this.scene = new BABYLON.Scene(engine);
                // This creates and positions a free camera (non-mesh)
                this.gameCamera = new BABYLON.FreeCamera("camera1", BABYLON.Vector3.Zero(), this.scene);
                this.drawingService.setGameCameraPosition(this.gameCamera);
                this.manageCamera = new BABYLON.ArcRotateCamera("camera2", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
                this.scene.activeCamera = this.gameCamera;
                // This attaches the camera to the canvas
                //this.gameCamera.attachControl(canvas, true);
                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
                // Default intensity is 1. Let's dim the light a small amount
                light.intensity = 1;
                // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
                this.drawingService.createBoard(this.scene);
                this.initPlayers();
                var meshLoads = this.drawingService.loadMeshes(this.players, this.scene, this);
                $.when.apply($, meshLoads).done(this.setupPlayerPositions);
                this.setupBoardFields();
                return this.scene;
            };
            GameController.prototype.initPlayers = function () {
                this.players = [];
                var that = this;
                this.gameService.players.forEach(function (player) {
                    var playerModel = new MonopolyApp.Viewmodels.Player();
                    playerModel.name = player.playerName;
                    playerModel.money = player.money;
                    that.playerModels.push(playerModel);
                });
            };
            GameController.prototype.setupBoardFields = function () {
                var _this = this;
                this.boardFields = [];
                for (var i = 0; i < 40; i++) {
                    var boardField = new MonopolyApp.Viewmodels.BoardField();
                    boardField.index = i;
                    this.boardFields.push(boardField);
                }
                for (var assetGroup = Model.AssetGroup.First; assetGroup <= Model.AssetGroup.Eighth; assetGroup++) {
                    var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                    groupBoardFields.forEach(function (groupBoardField) {
                        if (!groupBoardField.asset.unowned) {
                            _this.drawingService.setBoardFieldOwner(_this.boardFields.filter(function (f) { return f.index === groupBoardField.index; })[0], groupBoardField.asset, _this.scene);
                        }
                    });
                }
            };
            GameController.prototype.setupPlayerPositions = function (that) {
                that.players.forEach(function (playerModel) {
                    that.drawingService.positionPlayer(playerModel);
                });
            };
            GameController.prototype.setAvailableActions = function () {
                this.availableActions.endTurn = this.gameService.canEndTurn;
                this.availableActions.throwDice = this.gameService.canThrowDice;
                this.availableActions.buy = this.gameService.canBuy;
                this.availableActions.manage = this.gameService.canManage;
            };
            GameController.prototype.animateMove = function (oldPosition, newPosition) {
                var _this = this;
                var playerModel = this.players.filter(function (p) { return p.name === _this.gameService.getCurrentPlayer(); })[0];
                this.drawingService.animatePlayerMove(oldPosition, newPosition, playerModel);
            };
            GameController.prototype.showDeed = function () {
                this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
            };
            GameController.prototype.processDestinationField = function () {
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Asset) {
                    this.processAssetField(this.gameService.getCurrentPlayerPosition());
                }
            };
            GameController.prototype.processAssetField = function (position) {
                if (this.availableActions.buy) {
                    this.showDeed();
                }
                else if (!position.asset.unowned && position.asset.owner !== this.gameService.getCurrentPlayer()) {
                    var result = this.gameService.processOwnedFieldVisit();
                    if (result.message) {
                        this.showMessage(result.message);
                    }
                    this.updatePlayersForView();
                }
            };
            GameController.prototype.showMessage = function (message) {
                var _this = this;
                var overlayOffset = Math.floor(jQuery(window).height() * 0.15);
                $("#messageOverlay").html(message).show().animate({
                    top: "-=" + overlayOffset + "px",
                    opacity: 0
                }, 5000, function () {
                    $("#messageOverlay").hide();
                    $("#messageOverlay").css({ opacity: 1, top: 0 });
                    _this.messages.push(message);
                });
            };
            GameController.prototype.handleSwipe = function (left) {
                if (this.manageMode) {
                    this.focusedAssetGroup = this.gameService.manageFocusChange(left);
                    this.setupManageHighlight();
                    this.drawingService.setManageCameraPosition(this.manageCamera, this.focusedAssetGroup, this.scene);
                    if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroup)) {
                        this.drawingService.showHouseButtons(this.focusedAssetGroup, this.scene);
                    }
                }
            };
            GameController.prototype.setupManageHighlight = function () {
                this.drawingService.setManageCameraPosition(this.manageCamera, this.focusedAssetGroup, this.scene);
                if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroup)) {
                    this.drawingService.showHouseButtons(this.focusedAssetGroup, this.scene);
                }
            };
            GameController.prototype.handleClickEvent = function (eventObject) {
                var data = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    data[_i - 1] = arguments[_i];
                }
                var thisInstance = eventObject.data;
                if (thisInstance.manageMode && !thisInstance.swipeInProgress) {
                    var pickedObject = thisInstance.drawingService.pickBoardElement(thisInstance.scene);
                    if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.BoardField) {
                        var groupFields = thisInstance.gameService.getGroupBoardFields(thisInstance.focusedAssetGroup);
                        var clickedFields = groupFields.filter(function (f) { return f.index === pickedObject.position; });
                        if (clickedFields.length > 0) {
                            // user clicked a field that is currently focused - show its details
                            thisInstance.scope.$apply(function () {
                                thisInstance.manageField(clickedFields[0].asset);
                            });
                        }
                    }
                    else if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                        thisInstance.addHousePreview(pickedObject.position);
                    }
                    else if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.RemoveHouse) {
                        thisInstance.removeHousePreview(pickedObject.position);
                    }
                }
            };
            GameController.prototype.manageField = function (asset) {
                this.assetToManage = asset;
                $("#assetManagement").show();
            };
            GameController.prototype.swipeMove = function (coords) {
                this.swipeInProgress = true;
                if (this.manageMode) {
                    this.drawingService.onSwipeMove(this.scene, coords);
                }
            };
            GameController.prototype.swipeEnd = function (coords, event) {
                var _this = this;
                if (!this.swipeInProgress) {
                    return;
                }
                if (this.manageMode) {
                    var pickedObject = this.drawingService.onSwipeEnd(this.scene, coords);
                    if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                    }
                }
                this.timeoutService(function () { return _this.swipeInProgress = false; }, 100, false);
            };
            GameController.prototype.swipeCancel = function (event) {
                this.swipeInProgress = false;
            };
            GameController.prototype.addHousePreview = function (position) {
                if (this.gameService.addHousePreview(this.gameService.getCurrentPlayer(), position)) {
                    this.setupActionButtonsForHousePreview(position);
                }
            };
            GameController.prototype.removeHousePreview = function (position) {
                if (this.gameService.removeHousePreview(this.gameService.getCurrentPlayer(), position)) {
                    this.setupActionButtonsForHousePreview(position);
                }
            };
            GameController.prototype.setupActionButtonsForHousePreview = function (position) {
                var assetGroup = this.gameService.getBoardFieldGroup(position);
                var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                var hasUncommittedUpgrades = false;
                groupBoardFields.forEach(function (field) {
                    hasUncommittedUpgrades = hasUncommittedUpgrades || field.asset.hasUncommittedUpgrades();
                });
                this.refreshBoardFieldGroupHouses(assetGroup);
                if (hasUncommittedUpgrades) {
                    this.setupActionButtons(this.commitHouses, this.rollbackHouses);
                }
                else {
                    var that = this;
                    this.scope.$apply(function () {
                        that.actionButtonsVisible = false;
                    });
                }
            };
            GameController.prototype.setupActionButtons = function (confirmCallback, cancelCallback) {
                this.confirmButtonCallback = confirmCallback;
                this.cancelButtonCallback = cancelCallback;
                this.drawingService.showActionButtons();
                var that = this;
                this.scope.$apply(function () {
                    that.actionButtonsVisible = true;
                });
            };
            GameController.prototype.refreshBoardFieldGroupHouses = function (assetGroup) {
                var fields = this.gameService.getGroupBoardFields(assetGroup);
                var fieldIndexes = $.map(fields, function (f) { return f.index; });
                var viewGroupBoardFields = this.boardFields.filter(function (viewBoardField) { return $.inArray(viewBoardField.index, fieldIndexes) >= 0; });
                var that = this;
                viewGroupBoardFields.forEach(function (f) {
                    var asset = fields.filter(function (field) { return f.index === field.index; })[0].asset;
                    that.drawingService.setBoardFieldHouses(f, asset.houses, asset.hotel, that.scene);
                });
            };
            GameController.prototype.commitHouses = function (data) {
                this.gameService.commitHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroup);
                this.actionButtonsVisible = false;
                this.updatePlayersForView();
            };
            GameController.prototype.rollbackHouses = function (data) {
                this.gameService.rollbackHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroup);
                this.actionButtonsVisible = false;
                this.refreshBoardFieldGroupHouses(this.focusedAssetGroup);
                this.updatePlayersForView();
            };
            GameController.prototype.updatePlayersForView = function () {
                var that = this;
                this.gameService.players.forEach(function (p) {
                    var viewPlayer = that.playerModels.filter(function (model) { return model.name === p.playerName; })[0];
                    viewPlayer.money = p.money;
                });
            };
            GameController.$inject = ["$state", "$swipe", "$scope", "$timeout", "gameService", "drawingService"];
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
        var AvailableActions = (function () {
            function AvailableActions() {
            }
            return AvailableActions;
        })();
        Viewmodels.AvailableActions = AvailableActions;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var BoardField = (function () {
            function BoardField() {
            }
            return BoardField;
        })();
        Viewmodels.BoardField = BoardField;
    })(Viewmodels = MonopolyApp.Viewmodels || (MonopolyApp.Viewmodels = {}));
})(MonopolyApp || (MonopolyApp = {}));
var MonopolyApp;
(function (MonopolyApp) {
    var Viewmodels;
    (function (Viewmodels) {
        var Coordinate = (function () {
            function Coordinate(x, z) {
                if (x) {
                    this.x = x;
                }
                if (z) {
                    this.z = z;
                }
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
        (function (PickedObjectType) {
            PickedObjectType[PickedObjectType["None"] = 0] = "None";
            PickedObjectType[PickedObjectType["BoardField"] = 1] = "BoardField";
            PickedObjectType[PickedObjectType["AddHouse"] = 2] = "AddHouse";
            PickedObjectType[PickedObjectType["RemoveHouse"] = 3] = "RemoveHouse";
        })(Viewmodels.PickedObjectType || (Viewmodels.PickedObjectType = {}));
        var PickedObjectType = Viewmodels.PickedObjectType;
        ;
        // represents an object that has been picked from the scene either via click/tap or via swipe
        var PickedObject = (function () {
            function PickedObject() {
            }
            return PickedObject;
        })();
        Viewmodels.PickedObject = PickedObject;
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