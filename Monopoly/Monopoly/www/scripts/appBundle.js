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
    (function (AIActionType) {
        AIActionType[AIActionType["Buy"] = 0] = "Buy";
        AIActionType[AIActionType["Mortgage"] = 1] = "Mortgage";
        AIActionType[AIActionType["Unmortgage"] = 2] = "Unmortgage";
        AIActionType[AIActionType["SellHotel"] = 3] = "SellHotel";
        AIActionType[AIActionType["SellHouse"] = 4] = "SellHouse";
        AIActionType[AIActionType["BuyHotel"] = 5] = "BuyHotel";
        AIActionType[AIActionType["BuyHouse"] = 6] = "BuyHouse";
        AIActionType[AIActionType["Surrender"] = 7] = "Surrender";
        AIActionType[AIActionType["GetOutOfJail"] = 8] = "GetOutOfJail";
    })(Model.AIActionType || (Model.AIActionType = {}));
    var AIActionType = Model.AIActionType;
    ;
    var AIAction = (function () {
        function AIAction() {
        }
        return AIAction;
    })();
    Model.AIAction = AIAction;
})(Model || (Model = {}));
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
        Object.defineProperty(Asset.prototype, "uncommittedHouses", {
            get: function () {
                return this._uncommittedHouses;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "uncommittedHotel", {
            get: function () {
                return this._uncommittedHotel;
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
        Object.defineProperty(Asset.prototype, "isUtility", {
            get: function () {
                return this.group === Model.AssetGroup.Utility;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Asset.prototype, "isRailway", {
            get: function () {
                return this.group === Model.AssetGroup.Railway;
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
                this._hotel = this._uncommittedHotel;
                if (this._uncommittedHotel === false) {
                    this._houses = 4;
                }
            }
            this._houses += this._uncommittedHouses;
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
            if (this.hotel) {
                this._houses = 0;
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
                if (this._uncommittedHouses < 0) {
                    priceHouses = Math.floor(priceHouses / 2);
                }
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
                if (this._uncommittedHouses < 0) {
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
        Asset.prototype.loadDataFrom = function (savedAsset) {
            this._unowned = savedAsset._unowned;
            this._owner = savedAsset._owner;
            this._houses = savedAsset._houses;
            this._uncommittedHouses = savedAsset._uncommittedHouses;
            this._hotel = savedAsset._hotel;
            this._uncommittedHotel = savedAsset._uncommittedHotel;
            this._mortgage = savedAsset._mortgage;
            this.name = savedAsset.name;
            this.color = savedAsset.color;
            this.price = savedAsset.price;
            this.group = savedAsset.group;
            this.priceRent = savedAsset.priceRent;
            this.priceRentHouse = savedAsset.priceRentHouse;
            this.priceRentHotel = savedAsset.priceRentHotel;
            this.priceHouse = savedAsset.priceHouse;
            this.priceHotel = savedAsset.priceHotel;
            this.valueMortgage = savedAsset.valueMortgage;
            this.priceMultiplierUtility = savedAsset.priceMultiplierUtility;
        };
        return Asset;
    })();
    Model.Asset = Asset;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Board = (function () {
        function Board(theme) {
            this.initBoard(theme);
        }
        Board.prototype.loadDataFrom = function (savedBoard) {
            this.fields = new Array();
            var that = this;
            savedBoard.fields.sort(function (f1, f2) {
                return f1.index > f2.index ? 1 : -1;
            }).forEach(function (f) {
                var savedBoardField = f;
                var asset = undefined;
                if (savedBoardField._asset) {
                    asset = new Model.Asset();
                    asset.loadDataFrom(savedBoardField._asset);
                }
                var boardField = new Model.BoardField(asset);
                boardField.loadDataFrom(f);
                that.fields.push(boardField);
            });
        };
        Board.prototype.initBoard = function (theme) {
            this.fields = new Array();
            var startField = new Model.BoardField(null);
            startField.index = 0;
            startField.type = Model.BoardFieldType.Start;
            this.fields.push(startField);
            var boardField = this.createAssetBoardField(theme.boardFieldName[1], this.fields.length, Model.AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.color = "#723E00";
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(2, 4);
            boardField.asset.priceRentHouse.push(10, 30, 90, 160);
            boardField.asset.priceRentHotel = 250;
            boardField.asset.valueMortgage = 30;
            this.fields.push(boardField);
            var treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField(theme.boardFieldName[3], this.fields.length, Model.AssetGroup.First);
            boardField.asset.price = 60;
            boardField.asset.color = "#723E00";
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(4, 8);
            boardField.asset.priceRentHouse.push(20, 60, 180, 320);
            boardField.asset.priceRentHotel = 450;
            boardField.asset.valueMortgage = 30;
            this.fields.push(boardField);
            var taxField = new Model.BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = Model.BoardFieldType.TaxIncome;
            this.fields.push(taxField);
            boardField = this.createAssetBoardField(theme.boardFieldName[5], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = "#FFFFFF";
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[6], this.fields.length, Model.AssetGroup.Second);
            boardField.asset.price = 100;
            boardField.asset.color = "#69EEF6";
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
            boardField.asset.priceRentHotel = 550;
            boardField.asset.valueMortgage = 50;
            this.fields.push(boardField);
            var eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField(theme.boardFieldName[8], this.fields.length, Model.AssetGroup.Second);
            boardField.asset.color = "#69EEF6";
            boardField.asset.price = 100;
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(6, 6, 12);
            boardField.asset.priceRentHouse.push(30, 90, 270, 400);
            boardField.asset.priceRentHotel = 550;
            boardField.asset.valueMortgage = 50;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[9], this.fields.length, Model.AssetGroup.Second);
            boardField.asset.price = 120;
            boardField.asset.color = "#69EEF6";
            boardField.asset.priceHouse = 50;
            boardField.asset.priceHotel = 50;
            boardField.asset.priceRent.push(8, 8, 16);
            boardField.asset.priceRentHouse.push(40, 100, 300, 450);
            boardField.asset.priceRentHotel = 600;
            boardField.asset.valueMortgage = 60;
            this.fields.push(boardField);
            var prisonAndVisitField = new Model.BoardField(null);
            prisonAndVisitField.index = this.fields.length;
            prisonAndVisitField.type = Model.BoardFieldType.PrisonAndVisit;
            this.fields.push(prisonAndVisitField);
            boardField = this.createAssetBoardField(theme.boardFieldName[11], this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.color = "#FD23BD";
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.valueMortgage = 70;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[12], this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.color = "#FFFFFF";
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.valueMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[13], this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 140;
            boardField.asset.color = "#FD23BD";
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(10, 10, 20);
            boardField.asset.priceRentHouse.push(50, 150, 450, 625);
            boardField.asset.priceRentHotel = 750;
            boardField.asset.valueMortgage = 70;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[14], this.fields.length, Model.AssetGroup.Third);
            boardField.asset.price = 160;
            boardField.asset.color = "#FD23BD";
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(12, 12, 24);
            boardField.asset.priceRentHouse.push(60, 180, 500, 700);
            boardField.asset.priceRentHotel = 900;
            boardField.asset.valueMortgage = 80;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[15], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = "#FFFFFF";
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[16], this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.color = "#F39D37";
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
            boardField.asset.priceRentHotel = 950;
            boardField.asset.valueMortgage = 90;
            this.fields.push(boardField);
            treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField(theme.boardFieldName[18], this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 180;
            boardField.asset.color = "#F39D37";
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(14, 14, 28);
            boardField.asset.priceRentHouse.push(70, 200, 550, 750);
            boardField.asset.priceRentHotel = 950;
            boardField.asset.valueMortgage = 90;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[19], this.fields.length, Model.AssetGroup.Fourth);
            boardField.asset.price = 200;
            boardField.asset.color = "#F39D37";
            boardField.asset.priceHouse = 100;
            boardField.asset.priceHotel = 100;
            boardField.asset.priceRent.push(16, 16, 32);
            boardField.asset.priceRentHouse.push(80, 220, 600, 800);
            boardField.asset.priceRentHotel = 1000;
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            var freeParkingField = new Model.BoardField(null);
            freeParkingField.index = this.fields.length;
            freeParkingField.type = Model.BoardFieldType.FreeParking;
            this.fields.push(freeParkingField);
            boardField = this.createAssetBoardField(theme.boardFieldName[21], this.fields.length, Model.AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.color = "#E50E13";
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.valueMortgage = 110;
            this.fields.push(boardField);
            eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField(theme.boardFieldName[23], this.fields.length, Model.AssetGroup.Fifth);
            boardField.asset.price = 220;
            boardField.asset.color = "#E50E13";
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(18, 18, 36);
            boardField.asset.priceRentHouse.push(90, 250, 700, 875);
            boardField.asset.priceRentHotel = 1050;
            boardField.asset.valueMortgage = 110;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[24], this.fields.length, Model.AssetGroup.Fifth);
            boardField.asset.price = 240;
            boardField.asset.color = "#E50E13";
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(20, 20, 40);
            boardField.asset.priceRentHouse.push(100, 300, 750, 925);
            boardField.asset.priceRentHotel = 1100;
            boardField.asset.valueMortgage = 120;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[25], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = "#FFFFFF";
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[26], this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.color = "#F4F10B";
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.valueMortgage = 130;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[27], this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 260;
            boardField.asset.color = "#F4F10B";
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(22, 22, 44);
            boardField.asset.priceRentHouse.push(110, 330, 800, 975);
            boardField.asset.priceRentHotel = 1150;
            boardField.asset.valueMortgage = 130;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[28], this.fields.length, Model.AssetGroup.Utility);
            boardField.asset.price = 150;
            boardField.asset.color = "#FFFFFF";
            boardField.asset.priceMultiplierUtility.push(4, 10);
            boardField.asset.valueMortgage = 75;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[29], this.fields.length, Model.AssetGroup.Sixth);
            boardField.asset.price = 280;
            boardField.asset.color = "#F4F10B";
            boardField.asset.priceHouse = 150;
            boardField.asset.priceHotel = 150;
            boardField.asset.priceRent.push(24, 24, 48);
            boardField.asset.priceRentHouse.push(120, 360, 850, 1025);
            boardField.asset.priceRentHotel = 1200;
            boardField.asset.valueMortgage = 140;
            this.fields.push(boardField);
            var goToPrisonField = new Model.BoardField(null);
            goToPrisonField.index = this.fields.length;
            goToPrisonField.type = Model.BoardFieldType.GoToPrison;
            this.fields.push(goToPrisonField);
            boardField = this.createAssetBoardField(theme.boardFieldName[31], this.fields.length, Model.AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.color = "#09C123";
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.valueMortgage = 150;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[32], this.fields.length, Model.AssetGroup.Seventh);
            boardField.asset.price = 300;
            boardField.asset.color = "#09C123";
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(26, 26, 52);
            boardField.asset.priceRentHouse.push(130, 390, 900, 1100);
            boardField.asset.priceRentHotel = 1275;
            boardField.asset.valueMortgage = 150;
            this.fields.push(boardField);
            treasureField = new Model.BoardField(null);
            treasureField.index = this.fields.length;
            treasureField.type = Model.BoardFieldType.Treasure;
            this.fields.push(treasureField);
            boardField = this.createAssetBoardField(theme.boardFieldName[34], this.fields.length, Model.AssetGroup.Seventh);
            boardField.asset.price = 320;
            boardField.asset.color = "#09C123";
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(28, 28, 56);
            boardField.asset.priceRentHouse.push(150, 450, 1000, 1200);
            boardField.asset.priceRentHotel = 1400;
            boardField.asset.valueMortgage = 160;
            this.fields.push(boardField);
            boardField = this.createAssetBoardField(theme.boardFieldName[35], this.fields.length, Model.AssetGroup.Railway);
            boardField.asset.price = 200;
            boardField.asset.color = "#FFFFFF";
            boardField.asset.priceRent.push(25, 50, 100, 200);
            boardField.asset.valueMortgage = 100;
            this.fields.push(boardField);
            eventField = new Model.BoardField(null);
            eventField.index = this.fields.length;
            eventField.type = Model.BoardFieldType.Event;
            this.fields.push(eventField);
            boardField = this.createAssetBoardField(theme.boardFieldName[37], this.fields.length, Model.AssetGroup.Eighth);
            boardField.asset.price = 350;
            boardField.asset.color = "#2231F8";
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(35, 70);
            boardField.asset.priceRentHouse.push(175, 500, 1100, 1300);
            boardField.asset.priceRentHotel = 1500;
            boardField.asset.valueMortgage = 175;
            this.fields.push(boardField);
            taxField = new Model.BoardField(null);
            taxField.index = this.fields.length;
            taxField.type = Model.BoardFieldType.Tax;
            this.fields.push(taxField);
            boardField = this.createAssetBoardField(theme.boardFieldName[39], this.fields.length, Model.AssetGroup.Eighth);
            boardField.asset.price = 400;
            boardField.asset.color = "#2231F8";
            boardField.asset.priceHouse = 200;
            boardField.asset.priceHotel = 200;
            boardField.asset.priceRent.push(50, 100);
            boardField.asset.priceRentHouse.push(200, 600, 1400, 1700);
            boardField.asset.priceRentHotel = 2000;
            boardField.asset.valueMortgage = 200;
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
        BoardField.prototype.loadDataFrom = function (savedBoardField) {
            this.index = savedBoardField.index;
            this.occupiedBy = savedBoardField.occupiedBy ? savedBoardField.occupiedBy : new Array();
            this.type = savedBoardField.type;
        };
        return BoardField;
    })();
    Model.BoardField = BoardField;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (CardType) {
        CardType[CardType["PayMoney"] = 0] = "PayMoney";
        CardType[CardType["PayMoneyToPlayers"] = 1] = "PayMoneyToPlayers";
        CardType[CardType["ReceiveMoney"] = 2] = "ReceiveMoney";
        CardType[CardType["ReceiveMoneyFromPlayers"] = 3] = "ReceiveMoneyFromPlayers";
        CardType[CardType["AdvanceToField"] = 4] = "AdvanceToField";
        CardType[CardType["AdvanceToRailway"] = 5] = "AdvanceToRailway";
        CardType[CardType["RetractNumFields"] = 6] = "RetractNumFields";
        CardType[CardType["JumpToField"] = 7] = "JumpToField";
        CardType[CardType["Maintenance"] = 8] = "Maintenance";
        CardType[CardType["OwnMaintenance"] = 9] = "OwnMaintenance";
    })(Model.CardType || (Model.CardType = {}));
    var CardType = Model.CardType;
    ;
    var Card = (function () {
        function Card() {
        }
        return Card;
    })();
    Model.Card = Card;
})(Model || (Model = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Model;
(function (Model) {
    var EventCard = (function (_super) {
        __extends(EventCard, _super);
        function EventCard() {
            _super.call(this);
        }
        return EventCard;
    })(Model.Card);
    Model.EventCard = EventCard;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (GameState) {
        GameState[GameState["BeginTurn"] = 0] = "BeginTurn";
        GameState[GameState["ThrowDice"] = 1] = "ThrowDice";
        GameState[GameState["Move"] = 2] = "Move";
        GameState[GameState["Process"] = 3] = "Process";
        GameState[GameState["ProcessingDone"] = 4] = "ProcessingDone";
        GameState[GameState["Manage"] = 5] = "Manage";
        GameState[GameState["EndOfGame"] = 6] = "EndOfGame"; // the game has ended and we have a winner
    })(Model.GameState || (Model.GameState = {}));
    var GameState = Model.GameState;
    ;
    var Game = (function () {
        function Game(theme) {
            this._currentPlayer = "";
            this.players = new Array();
            this._board = new Model.Board(theme);
            this._treasureCards = new Array();
            this._eventCards = new Array();
            this._moveContext = new Model.MoveContext();
            this.state = GameState.BeginTurn;
            this._gameParams = new Model.GameParams();
        }
        Object.defineProperty(Game.prototype, "currentPlayer", {
            get: function () {
                return this._currentPlayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "treasureCards", {
            get: function () {
                return this._treasureCards;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "eventCards", {
            get: function () {
                return this._eventCards;
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
        Object.defineProperty(Game.prototype, "moveContext", {
            get: function () {
                return this._moveContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "gameParams", {
            get: function () {
                return this._gameParams;
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
        Game.prototype.loadDataFrom = function (savedGame, theme) {
            var _this = this;
            this._currentPlayer = savedGame._currentPlayer;
            this._board = new Model.Board(theme);
            this._board.loadDataFrom(savedGame._board);
            this._treasureCards = savedGame._treasureCards;
            this._eventCards = savedGame._eventCards;
            this.previousState = savedGame.previousState;
            this.state = savedGame.state;
            this._moveContext = new Model.MoveContext();
            this._moveContext.skipGoAward = savedGame._moveContext.skipGoAward;
            this._moveContext.doubleRent = savedGame._moveContext.doubleRent;
            this._moveContext.flyByEvents = savedGame._moveContext.flyByEvents;
            this._gameParams = new Model.GameParams();
            this._gameParams.loadDataFrom(savedGame._gameParams);
            this.players = [];
            savedGame.players.forEach(function (savedPlayer) {
                var player = new Model.Player(savedPlayer.playerName, savedPlayer.human);
                player.loadDataFrom(savedPlayer, _this.board);
                _this.players.push(player);
            });
        };
        Game.version = "game_v0_01";
        return Game;
    })();
    Model.Game = Game;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var GameParams = (function () {
        function GameParams() {
            this._jailBail = 50;
            this._rules = new Model.Rules();
        }
        Object.defineProperty(GameParams.prototype, "jailBail", {
            get: function () {
                return this._jailBail;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameParams.prototype, "rules", {
            get: function () {
                return this._rules;
            },
            enumerable: true,
            configurable: true
        });
        GameParams.prototype.loadDataFrom = function (savedGameParams) {
            this._jailBail = savedGameParams._jailBail;
            this._rules.loadDataFrom(savedGameParams._rules);
        };
        return GameParams;
    })();
    Model.GameParams = GameParams;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (ProcessingEvent) {
        ProcessingEvent[ProcessingEvent["None"] = 0] = "None";
        ProcessingEvent[ProcessingEvent["PassGoAward"] = 1] = "PassGoAward";
    })(Model.ProcessingEvent || (Model.ProcessingEvent = {}));
    var ProcessingEvent = Model.ProcessingEvent;
    ;
    // context data associated with the current player move
    var MoveContext = (function () {
        function MoveContext() {
            this.reset();
        }
        MoveContext.prototype.reset = function () {
            this.skipGoAward = false;
            this.flyByEvents = [];
        };
        return MoveContext;
    })();
    Model.MoveContext = MoveContext;
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
        function Player(name, human) {
            this.playerName = name;
            this.human = human;
        }
        Player.prototype.loadDataFrom = function (savedPlayer, board) {
            this.playerName = savedPlayer.playerName;
            this.human = savedPlayer.human;
            this.color = savedPlayer.color;
            this.money = savedPlayer.money;
            this.turnsInPrison = savedPlayer.turnsInPrison;
            this.active = savedPlayer.active;
            var playerPositionIndex = savedPlayer.position.index;
            this.position = board.fields.filter(function (f) { return f.index === playerPositionIndex; })[0];
        };
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
    var Rules = (function () {
        function Rules() {
            this.passStartAward = 200;
            this.initialCash = 1500;
        }
        Rules.prototype.loadDataFrom = function (savedRules) {
            this.passStartAward = savedRules.passStartAward;
            this.initialCash = savedRules.initialCash;
        };
        return Rules;
    })();
    Model.Rules = Rules;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var Settings = (function () {
        function Settings() {
            this.numPlayers = 2;
            this.players = [new Model.Player("Player 1", true), new Model.Player("Computer 1", false)];
            this.rules = new Model.Rules();
        }
        return Settings;
    })();
    Model.Settings = Settings;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var TreasureCard = (function (_super) {
        __extends(TreasureCard, _super);
        function TreasureCard() {
            _super.call(this);
        }
        return TreasureCard;
    })(Model.Card);
    Model.TreasureCard = TreasureCard;
})(Model || (Model = {}));
var Model;
(function (Model) {
    // defines data for a single tutorial stage (or step)
    var TutorialData = (function () {
        function TutorialData() {
        }
        return TutorialData;
    })();
    Model.TutorialData = TutorialData;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var MonopolyTheme = (function () {
        function MonopolyTheme() {
        }
        Object.defineProperty(MonopolyTheme.prototype, "boardFieldName", {
            get: function () {
                return MonopolyTheme.boardFields;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "imagesFolder", {
            get: function () {
                return "images/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameboardImage", {
            get: function () {
                return "Gameboard-Model.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "backgroundImage", {
            get: function () {
                return "wood_texture.jpg";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "backgroundSize", {
            get: function () {
                return [20, 13.33];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameSetupImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gameRulesImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "gamePauseImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "mainMenuImage", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "skyboxFolder", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "meshFolder", {
            get: function () {
                return "meshes/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerMesh", {
            get: function () {
                return "character.babylon";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerSubmeshIndex", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerColoredSubmeshIndices", {
            get: function () {
                return [1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "playerMeshRotationQuaternion", {
            get: function () {
                return MonopolyTheme.playerMeshRotation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "house", {
            get: function () {
                return "house";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonopolyTheme.prototype, "hotel", {
            get: function () {
                return "house";
            },
            enumerable: true,
            configurable: true
        });
        MonopolyTheme.playerMeshRotation = [[0, 0, 0, 1], [0, 0.7071, 0, 0.7071], [0, 1, 0, 0], [0, 0.7071, 0, -0.7071]];
        MonopolyTheme.boardFields = ["Start", "Goriška Brda", "Community chest", "Slovenske Gorice", "Income tax", "Železniška postaja Jesenice",
            "Bogenšperk", "Chance", "Predjamski grad", "Otočec", "Prison", "Terme Čatež", "Javna razsvetljava", "Dolenjske toplice",
            "Moravske toplice", "Glavni kolodvor Ljubljana", "Športni park Stožice", "Community chest", "Planica", "Mariborsko Pohorje",
            "Free parking", "Trenta", "Chance", "Rakov Škocjan", "Logarska dolina", "Železniška postaja Zidani most", "Lipica",
            "Volčji potok", "Mestni vodovod", "Postojnska jama", "Go to prison", "Cerkniško jezero", "Bohinj", "Community chest",
            "Bled", "Železniški terminal Koper", "Chance", "Piran", "Tax", "Portorož"];
        return MonopolyTheme;
    })();
    Model.MonopolyTheme = MonopolyTheme;
})(Model || (Model = {}));
var Model;
(function (Model) {
    var MoonopolyTheme = (function () {
        function MoonopolyTheme() {
        }
        Object.defineProperty(MoonopolyTheme.prototype, "boardFieldName", {
            get: function () {
                return MoonopolyTheme.boardFields;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "imagesFolder", {
            get: function () {
                return "images/Moonopoly/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameboardImage", {
            get: function () {
                return "Gameboard4.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "backgroundImage", {
            get: function () {
                return "pl_stars_milky_way.jpg";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "backgroundSize", {
            get: function () {
                return [25, 25];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameSetupImage", {
            get: function () {
                return "GameSetup.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gameRulesImage", {
            get: function () {
                return "GameRules.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "gamePauseImage", {
            get: function () {
                return "GamePause.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "mainMenuImage", {
            get: function () {
                return "MainMenu.png";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "skyboxFolder", {
            get: function () {
                return "skybox3/skybox";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "meshFolder", {
            get: function () {
                return "meshes/Moonopoly/";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerMesh", {
            get: function () {
                return "rocket2.babylon";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerSubmeshIndex", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerColoredSubmeshIndices", {
            get: function () {
                return [4, 5, 6, 9];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "playerMeshRotationQuaternion", {
            get: function () {
                return MoonopolyTheme.playerMeshRotation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "house", {
            get: function () {
                return "habitat";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonopolyTheme.prototype, "hotel", {
            get: function () {
                return "settlement dome";
            },
            enumerable: true,
            configurable: true
        });
        MoonopolyTheme.playerMeshRotation = [
            [0, 0, -0.7071, -0.7071],
            [-0.5, -0.5, -0.5, -0.5],
            [0.7071, 0.7071, 0, 0],
            [0.5, 0.5, -0.5, -0.5]
        ];
        MoonopolyTheme.boardFields = ["Start", "Rima Bradley", "Space debris", "Rima Hadley", "Lunar ecology tax", "Montes Alpes iron mines",
            "Mons Huygens", "Dust cloud", "Mons Hadley", "Mons Penck", "Quarantine", "Vallis Bohr", "Southern sea oil rig", "Vallis Planck",
            "Vallis Alpes", "Montes Cordillera iron mines", "Altai Cliff", "Space debris", "Kelvin Cliff", "Mercator Cliff",
            "Free docking", "Terra Sanitatis", "Dust cloud", "Terra Vigoris", "Terra Vitae", "Montes Carpatus iron mines", "Mare Anguis",
            "Mare Vaporum", "Eastern sea oil rig", "Mare Imbrium", "Go to quarantine", "Mare Nubium", "Mare Serenitatis", "Space debris",
            "Oceanus Procellarum", "Montes Taurus iron mines", "Dust cloud", "Apollo crater", "Lunar energy tax", "Aitken basin"];
        return MoonopolyTheme;
    })();
    Model.MoonopolyTheme = MoonopolyTheme;
})(Model || (Model = {}));
var Model;
(function (Model) {
    (function (Themes) {
        Themes[Themes["Monopoly"] = 0] = "Monopoly";
        Themes[Themes["Moonopoly"] = 1] = "Moonopoly";
    })(Model.Themes || (Model.Themes = {}));
    var Themes = Model.Themes;
    ;
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
    var SettingsService = (function () {
        function SettingsService($http) {
            var _this = this;
            this.loadSettings = function () {
                var settings = new Model.Settings();
                var localStorageAny = localStorage;
                if (localStorage.getItem("settings_v1_01")) {
                    var savedSettings = JSON.parse(localStorageAny.settings_v1_01);
                    settings.numPlayers = savedSettings.numPlayers;
                    settings.players = savedSettings.players;
                    settings.tutorial = savedSettings.tutorial;
                    if (savedSettings.rules) {
                        settings.rules = savedSettings.rules;
                    }
                }
                else {
                    settings.tutorial = true;
                }
                _this._settings = settings;
                return settings;
            };
            this.httpService = $http;
        }
        Object.defineProperty(SettingsService.prototype, "settings", {
            get: function () {
                if (!this._settings) {
                    this.loadSettings();
                }
                return this._settings;
            },
            enumerable: true,
            configurable: true
        });
        SettingsService.prototype.saveSettings = function (settings) {
            var localStorageAny = localStorage;
            localStorageAny.settings_v1_01 = JSON.stringify(settings);
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
    var AIService = (function () {
        function AIService(gameService) {
            this.gameService = gameService;
        }
        // process computer managing his properties or trading
        AIService.prototype.afterMoveProcessing = function () {
            var _this = this;
            var actions = new Array();
            var player = this.gameService.players.filter(function (p) { return p.playerName === _this.gameService.getCurrentPlayer(); })[0];
            if (this.gameService.canBuy) {
                var asset = this.gameService.getCurrentPlayerPosition().asset;
                if (this.shouldBuy(asset)) {
                    var buyAction = new Model.AIAction();
                    buyAction.actionType = Model.AIActionType.Buy;
                    actions.push(buyAction);
                }
            }
            else {
                var playerMoney = player.money;
                if (player.turnsInPrison === 0 && this.gameService.lastDiceResult !== 6) {
                    playerMoney -= this.gameService.gameParams.jailBail;
                }
                if (playerMoney < 0) {
                    var moneyToGain = Math.abs(playerMoney);
                    moneyToGain = this.mortgageAssets(moneyToGain, player.playerName, actions);
                    if (moneyToGain > 0 && actions.length === 0) {
                        // unable to raise enough money
                        var surrenderAction = new Model.AIAction();
                        surrenderAction.actionType = Model.AIActionType.Surrender;
                        actions.push(surrenderAction);
                    }
                }
            }
            if (player.money > 0) {
                if (player.turnsInPrison === 0 && this.gameService.canGetOutOfJail) {
                    var outOfJailAction = new Model.AIAction();
                    outOfJailAction.actionType = Model.AIActionType.GetOutOfJail;
                    actions.push(outOfJailAction);
                    return actions; // getting out of jail is the last thing we are doing while being on the current field
                }
                var moneyAvailable = player.money;
                this.buyHouses(moneyAvailable, player.playerName, actions);
            }
            this.unmortgageAssets(player.money, player.playerName, actions);
            return actions;
        };
        // determine whether the computer should buy current property he has landed on
        AIService.prototype.shouldBuy = function (asset) {
            var _this = this;
            var player = this.gameService.players.filter(function (p) { return p.playerName === _this.gameService.getCurrentPlayer(); })[0];
            if (player.money > asset.price + 150) {
                return true;
            }
            return false;
        };
        // mortgage assets to gain required money
        AIService.prototype.mortgageAssets = function (moneyToGain, player, actions) {
            var _this = this;
            if (moneyToGain <= 0) {
                return 0;
            }
            // first, try finding an asset where not an entire group is owned
            var ownedAssets = this.gameService.getPlayerAssets(player);
            if (ownedAssets.length === 0) {
                return moneyToGain;
            }
            var action = new Model.AIAction();
            var individualAssets = new Array();
            ownedAssets.forEach(function (asset) {
                var groupAssets = _this.gameService.getGroupBoardFields(asset.group);
                var unownedGroupAssets = groupAssets.filter(function (groupAsset) { return groupAsset.asset.unowned || groupAsset.asset.owner !== player || groupAsset.asset.mortgage; });
                if (unownedGroupAssets.length > 0 && !asset.mortgage) {
                    if (actions.filter(function (a) { return a.actionType === Model.AIActionType.Mortgage && a.asset.name === asset.name; }).length === 0) {
                        individualAssets.push(asset);
                    }
                }
            });
            // mortgage individual assets one by one
            if (individualAssets.length > 0) {
                var sortedIndividualAssets = individualAssets.sort(function (a, b) { return a.valueMortgage > b.valueMortgage ? 1 : (a.valueMortgage < b.valueMortgage ? -1 : 0); });
                var selectedIndividualAsset = sortedIndividualAssets.reduce(function (previous, current) {
                    if (current.valueMortgage >= moneyToGain) {
                        return current;
                    }
                    else {
                        if (!previous) {
                            return current;
                        }
                        else {
                            return previous;
                        }
                    }
                });
                if (selectedIndividualAsset) {
                    action.actionType = Model.AIActionType.Mortgage;
                    action.asset = selectedIndividualAsset;
                    actions.push(action);
                    // continue mortgaging until enough money is raised
                    return this.mortgageAssets(Math.max(moneyToGain - selectedIndividualAsset.valueMortgage, 0), player, actions);
                }
            }
            else {
                // time to sell assets from an owned group and utilities
                var utilities = ownedAssets.filter(function (asset) { return asset.group === Model.AssetGroup.Utility && !asset.mortgage; });
                if (utilities.length > 0) {
                    var utilityMortgaged = false;
                    utilities.forEach(function (utility) {
                        if (actions.filter(function (a) { return a.actionType === Model.AIActionType.Mortgage && a.asset.name === utility.name; }).length === 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.Mortgage;
                            action.asset = utility;
                            actions.push(action);
                            moneyToGain -= utility.valueMortgage;
                            utilityMortgaged = true;
                        }
                    });
                    if (utilityMortgaged) {
                        return this.mortgageAssets(Math.max(moneyToGain, 0), player, actions);
                    }
                }
                var railways = ownedAssets.filter(function (asset) { return asset.group === Model.AssetGroup.Railway && !asset.mortgage; });
                if (railways.length > 0) {
                    var railwayMortgaged = false;
                    railways.forEach(function (railway) {
                        if (actions.filter(function (a) { return a.actionType === Model.AIActionType.Mortgage && a.asset.name === railway.name; }).length === 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.Mortgage;
                            action.asset = railway;
                            actions.push(action);
                            moneyToGain -= railway.valueMortgage;
                            railwayMortgaged = true;
                        }
                    });
                    if (railwayMortgaged) {
                        return this.mortgageAssets(Math.max(moneyToGain, 0), player, actions);
                    }
                }
                // lastly, sell houses and mortgage assets of an owned group
                var ownedGroups = this.gameService.getPlayerAssetGroups(player);
                if (ownedGroups.length > 0) {
                    var groupFields = this.gameService.getGroupBoardFields(ownedGroups[0]);
                    var fieldsWithHotel = groupFields.filter(function (field) { return field.asset.hotel; });
                    if (fieldsWithHotel.length > 0) {
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.SellHotel;
                        action.asset = fieldsWithHotel[0].asset;
                        action.position = fieldsWithHotel[0].index;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - fieldsWithHotel[0].asset.priceHotel / 2, 0), player, actions);                        
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - fieldsWithHotel[0].asset.priceHotel / 2, 0);
                    }
                    var fieldsWithHouses = groupFields.filter(function (field) { return field.asset.houses && field.asset.houses > 0; });
                    if (fieldsWithHouses.length > 0) {
                        var fieldWithMostHouses = fieldsWithHouses.sort(function (a, b) { return a.asset.houses > b.asset.houses ? -1 : (a.asset.houses < b.asset.houses ? 1 : 0); })[0];
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.SellHouse;
                        action.asset = fieldWithMostHouses.asset;
                        action.position = fieldWithMostHouses.index;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - fieldWithMostHouses.asset.priceHouse / 2, 0), player, actions);                        
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - fieldWithMostHouses.asset.priceHouse / 2, 0);
                    }
                    // if no houses and hotels, just mortgage one of the assets in a group
                    var unmortgagedFields = groupFields.filter(function (f) { return !(f.asset.mortgage); });
                    if (unmortgagedFields.length > 0) {
                        action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Mortgage;
                        action.asset = unmortgagedFields[0].asset;
                        actions.push(action);
                        //return this.mortgageAssets(Math.max(moneyToGain - unmortgagedFields[0].asset.valueMortgage, 0), player, actions);
                        // remaining deficit will be handled in a next iteration
                        return Math.max(moneyToGain - unmortgagedFields[0].asset.valueMortgage, 0);
                    }
                }
            }
            return moneyToGain;
        };
        // buy houses or hotels if available
        AIService.prototype.buyHouses = function (moneyAvailable, player, actions) {
            var _this = this;
            moneyAvailable -= 200;
            var assetGroupsToGain = this.numAssetGroupsToGain(player);
            if (moneyAvailable < 0) {
                return;
            }
            var ownedAssets = this.gameService.getPlayerAssets(player);
            if (ownedAssets.length === 0) {
                return;
            }
            var action;
            var ownedGroups = this.gameService.getPlayerAssetGroups(player);
            // try buying houses first
            ownedGroups.forEach(function (group) {
                // only process one asset group in a single iteration
                if (actions.filter(function (a) { return a.actionType === Model.AIActionType.BuyHouse; }).length === 0) {
                    var groupFields = _this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(function (f) { return !f.asset.mortgage; })) {
                        var housesLeftToBuy = 0;
                        var housesPerAsset = 0;
                        groupFields.forEach(function (f) {
                            if (!f.asset.mortgage) {
                                if (!f.asset.hotel) {
                                    housesLeftToBuy += !f.asset.houses ? 4 : 4 - f.asset.houses;
                                    housesPerAsset += f.asset.houses ? f.asset.houses : 0;
                                }
                                else {
                                    housesPerAsset += 5;
                                }
                            }
                        });
                        housesPerAsset = Math.floor(housesPerAsset / groupFields.length);
                        var moneyAvailableForHouses = moneyAvailable;
                        // don't spend to much on houses if there already are some and there are still asset groups available
                        if (assetGroupsToGain > 0 && housesPerAsset >= 2) {
                            moneyAvailableForHouses -= 200;
                        }
                        if (assetGroupsToGain >= 3 && housesPerAsset >= 2) {
                            moneyAvailableForHouses -= 300;
                        }
                        var affordableHouses = Math.floor(moneyAvailableForHouses / groupFields[0].asset.priceHouse);
                        var housesToBuy = Math.min(housesLeftToBuy, affordableHouses);
                        if (housesToBuy > 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.BuyHouse;
                            action.numHousesOrHotels = housesToBuy;
                            action.assetGroup = group;
                            actions.push(action);
                        }
                    }
                }
            });
            if (actions.filter(function (a) { return a.actionType === Model.AIActionType.BuyHouse; }).length > 0) {
                return;
            }
            ownedGroups.forEach(function (group) {
                // only process one asset group in a single iteration
                if (actions.filter(function (a) { return a.actionType === Model.AIActionType.BuyHotel; }).length === 0) {
                    var groupFields = _this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(function (f) { return (f.asset.houses && f.asset.houses === 4) || f.asset.hotel; })) {
                        var hotelsLeftToBuy = 0;
                        groupFields.forEach(function (f) {
                            hotelsLeftToBuy += f.asset.hotel ? 0 : 1;
                        });
                        var moneyAvailableForHotels = moneyAvailable;
                        // don't spend to much on hotels if there are still asset groups available
                        if (assetGroupsToGain > 0) {
                            moneyAvailableForHotels -= 300;
                        }
                        if (assetGroupsToGain >= 3) {
                            moneyAvailableForHotels -= 400;
                        }
                        var affordableHotels = Math.floor(moneyAvailableForHotels / groupFields[0].asset.priceHotel);
                        var hotelsToBuy = Math.min(hotelsLeftToBuy, affordableHotels);
                        if (hotelsToBuy > 0) {
                            action = new Model.AIAction();
                            action.actionType = Model.AIActionType.BuyHotel;
                            action.numHousesOrHotels = hotelsToBuy;
                            action.assetGroup = group;
                            actions.push(action);
                        }
                    }
                }
            });
        };
        // unmortgage mortgaged assets if having enough money
        AIService.prototype.unmortgageAssets = function (money, player, actions) {
            var _this = this;
            var actionAdded = false; // only one action in a single iteration so that other users can follow computer actions
            if (money <= 100) {
                return;
            }
            // first, try finding any mortgaged assets where an entire group is owned
            var ownedGroups = this.gameService.getPlayerAssetGroups(player);
            ownedGroups.forEach(function (ownedGroup) {
                var groupFields = _this.gameService.getGroupBoardFields(ownedGroup);
                groupFields.forEach(function (groupField) {
                    if (!actionAdded && groupField.asset.mortgage && money - (Math.floor(groupField.asset.price * 1.1)) > 50) {
                        var action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Unmortgage;
                        action.asset = groupField.asset;
                        action.position = groupField.index;
                        actions.push(action);
                        money -= Math.floor(groupField.asset.price * 1.1);
                        actionAdded = true;
                    }
                });
            });
            // next, release mortgage on railways and utilities
            var railwayFields = this.gameService.getGroupBoardFields(Model.AssetGroup.Railway);
            railwayFields.forEach(function (groupField) {
                if (!actionAdded && groupField.asset.mortgage && money - (Math.floor(groupField.asset.price * 1.1)) > 50) {
                    var action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Unmortgage;
                    action.asset = groupField.asset;
                    action.position = groupField.index;
                    actions.push(action);
                    money -= Math.floor(groupField.asset.price * 1.1);
                    actionAdded = true;
                }
            });
            var utilityFields = this.gameService.getGroupBoardFields(Model.AssetGroup.Utility);
            utilityFields.forEach(function (groupField) {
                if (!actionAdded && groupField.asset.mortgage && money - (Math.floor(groupField.asset.price * 1.1)) > 150) {
                    var action = new Model.AIAction();
                    action.actionType = Model.AIActionType.Unmortgage;
                    action.asset = groupField.asset;
                    actions.push(action);
                    money -= Math.floor(groupField.asset.price * 1.1);
                    actionAdded = true;
                }
            });
            // finally, release mortgage on the rest of the assets if money is in abundance
            var ownedAssets = this.gameService.getPlayerAssets(player);
            ownedAssets.forEach(function (ownedAsset) {
                if (ownedGroups.filter(function (ownedGroup) { return ownedGroup === ownedAsset.group; }).length === 0) {
                    if (!actionAdded && ownedAsset.mortgage && money - (Math.floor(ownedAsset.price * 1.1)) > 500) {
                        var action = new Model.AIAction();
                        action.actionType = Model.AIActionType.Unmortgage;
                        action.asset = ownedAsset;
                        actions.push(action);
                        money -= Math.floor(ownedAsset.price * 1.1);
                        actionAdded = true;
                    }
                }
            });
        };
        // gets the number of groups that are not entirely owned by the player but have a chance to be
        AIService.prototype.numAssetGroupsToGain = function (player) {
            var _this = this;
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth, Model.AssetGroup.Railway, Model.AssetGroup.Utility];
            var groupsToGain = 0;
            var playerGroups = this.gameService.getPlayerAssetGroups(player); // don't count groups already owned by the player
            groups.forEach(function (group) {
                if (playerGroups.filter(function (g) { return g === group; }).length === 0) {
                    var groupFields = _this.gameService.getGroupBoardFields(group);
                    if (groupFields.every(function (f) { return f.asset.unowned || f.asset.owner === player; })) {
                        groupsToGain++;
                    }
                }
            });
            return groupsToGain;
        };
        AIService.$inject = ["gameService"];
        return AIService;
    })();
    Services.AIService = AIService;
    monopolyApp.service("aiService", AIService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
var Services;
(function (Services) {
    var DrawingService = (function () {
        function DrawingService($http, gameService, themeService) {
            this.boardFieldsInQuadrant = 11;
            this.groundMeshName = "board";
            this.httpService = $http;
            this.gameService = gameService;
            this.themeService = themeService;
            this.boardFieldWidth = this.boardSize / (this.boardFieldsInQuadrant + 2); // assuming the corner fields are double the width of the rest of the fields
            this.boardFieldHeight = this.boardFieldWidth * 2;
            this.boardFieldEdgeWidth = this.boardFieldWidth * 2;
            this.initQuadrantStartingCoordinates();
            this.dicePosition = new BABYLON.Vector3(0, 3, 0);
        }
        Object.defineProperty(DrawingService.prototype, "boardSize", {
            /// board dimenzion in both, X and Z directions
            get: function () {
                return 10;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingService.prototype, "diceHeight", {
            get: function () {
                return 0.36;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DrawingService.prototype, "framesToMoveOneBoardField", {
            // number of frames to animate player move between two neighbouring fields
            get: function () {
                return 10;
            },
            enumerable: true,
            configurable: true
        });
        DrawingService.prototype.positionPlayer = function (playerModel) {
            var player = this.gameService.players.filter(function (player, index) { return player.playerName === playerModel.name; })[0];
            var playerCoordinate = this.getPlayerPositionOnBoardField(playerModel, player.position.index);
            var playerQuadrant = Math.floor(player.position.index / (this.boardFieldsInQuadrant - 1));
            var playerQuadrantOffset = player.position.index % (this.boardFieldsInQuadrant - 1);
            playerModel.mesh.position.x = playerCoordinate.x;
            playerModel.mesh.position.z = playerCoordinate.z;
            playerModel.mesh.rotationQuaternion = this.getPlayerRotationOnBoardField(playerModel, player.position.index);
        };
        DrawingService.prototype.animatePlayerMove = function (oldPosition, newPosition, playerModel, scene, fast, backwards) {
            var positionKeys = [];
            var rotationKeys = [];
            var framesForField = this.framesToMoveOneBoardField;
            var framesForRotation = this.framesToMoveOneBoardField * 2;
            if (fast) {
                framesForField = Math.floor(framesForField / 2);
                framesForRotation = framesForRotation / 2;
            }
            var runningFrame = 0;
            var runningField = 0;
            var fieldsToTravel = backwards ? (newPosition.index <= oldPosition.index ? oldPosition.index - newPosition.index : 40 - newPosition.index + oldPosition.index) :
                newPosition.index >= oldPosition.index ? newPosition.index - oldPosition.index : 40 - oldPosition.index + newPosition.index;
            while (runningField <= fieldsToTravel) {
                var runningPosition = (oldPosition.index + runningField) % 40;
                if (backwards) {
                    runningPosition = oldPosition.index - runningField;
                    if (runningPosition < 0) {
                        runningPosition = 40 + runningPosition;
                    }
                }
                if (runningField > 0) {
                    if (backwards) {
                        if (runningPosition % 10 === 0) {
                            runningFrame += framesForRotation;
                        }
                        else {
                            runningFrame += framesForField;
                        }
                    }
                    else {
                        if ((oldPosition.index + runningField) % 10 === 0) {
                            runningFrame += framesForRotation;
                        }
                        else {
                            runningFrame += framesForField;
                        }
                    }
                }
                var coordinate = this.getPlayerPositionOnBoardField(playerModel, runningPosition);
                var playerPosition = new BABYLON.Vector3(coordinate.x, playerModel.mesh.position.y, coordinate.z);
                positionKeys.push({ frame: runningFrame, value: playerPosition });
                rotationKeys.push({ frame: runningFrame, value: this.getPlayerRotationOnBoardField(playerModel, runningPosition) });
                runningField++;
            }
            var animationplayerPosition = new BABYLON.Animation("playerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var animationplayerRotation = new BABYLON.Animation("playerRotationAnimation", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            animationplayerPosition.setKeys(positionKeys);
            animationplayerRotation.setKeys(rotationKeys);
            playerModel.mesh.animations = [];
            playerModel.mesh.animations.push(animationplayerPosition);
            playerModel.mesh.animations.push(animationplayerRotation);
            var d = $.Deferred();
            var particleSystem = this.addParticle(playerModel.mesh, scene);
            scene.beginAnimation(playerModel.mesh, 0, runningFrame, false, undefined, function () { d.resolve(); });
            particleSystem.start();
            return d;
        };
        DrawingService.prototype.animatePlayerPrisonMove = function (newPosition, playerModel, scene, camera) {
            var _this = this;
            var positionKeys = [];
            var playerPosition = new BABYLON.Vector3(playerModel.mesh.position.x, playerModel.mesh.position.y, playerModel.mesh.position.z);
            positionKeys.push({ frame: 0, value: playerPosition });
            var playerTopPosition = new BABYLON.Vector3(playerModel.mesh.position.x, playerModel.mesh.position.y + 10, playerModel.mesh.position.z);
            positionKeys.push({ frame: 30, value: playerTopPosition });
            var animationplayerPosition = new BABYLON.Animation("playerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            animationplayerPosition.setKeys(positionKeys);
            playerModel.mesh.animations = [];
            playerModel.mesh.animations.push(animationplayerPosition);
            var firstAnim = $.Deferred();
            var secondAnim = $.Deferred();
            scene.beginAnimation(playerModel.mesh, 0, 30, false, undefined, function () { firstAnim.resolve(); });
            var that = this;
            $.when(firstAnim).done(function () {
                var cameraMovement = that.returnCameraToMainPosition(scene, camera, newPosition.index);
                $.when(cameraMovement).done(function () {
                    var finalPosition = that.getPlayerPositionOnBoardField(playerModel, newPosition.index);
                    playerTopPosition = new BABYLON.Vector3(finalPosition.x, playerTopPosition.y, finalPosition.z);
                    playerPosition = new BABYLON.Vector3(finalPosition.x, playerTopPosition.y - 10, finalPosition.z);
                    positionKeys = [];
                    var rotationKeys = [];
                    positionKeys.push({ frame: 0, value: playerTopPosition });
                    positionKeys.push({ frame: 30, value: playerPosition });
                    rotationKeys.push({ frame: 0, value: playerModel.mesh.rotationQuaternion });
                    rotationKeys.push({ frame: 30, value: _this.getPlayerRotationOnBoardField(playerModel, newPosition.index) });
                    animationplayerPosition = new BABYLON.Animation("playerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animationplayerPosition.setKeys(positionKeys);
                    var animationplayerRotation = new BABYLON.Animation("playerRotationAnimation", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animationplayerRotation.setKeys(rotationKeys);
                    playerModel.mesh.animations = [];
                    playerModel.mesh.animations.push(animationplayerPosition);
                    playerModel.mesh.animations.push(animationplayerRotation);
                    scene.beginAnimation(playerModel.mesh, 0, 30, false, undefined, function () { secondAnim.resolve(); });
                });
            });
            return secondAnim;
        };
        DrawingService.prototype.setupDiceForThrow = function (scene) {
            this.diceMesh.position.x = this.dicePosition.x;
            this.diceMesh.position.y = this.dicePosition.y;
            this.diceMesh.position.z = this.dicePosition.z;
            var physicsEngine = scene.getPhysicsEngine();
            physicsEngine._unregisterMesh(this.diceMesh);
        };
        DrawingService.prototype.moveDiceToPosition = function (position, scene) {
            this.diceMesh.position.x = position.x;
            this.diceMesh.position.y = position.y;
            this.diceMesh.position.z = position.z;
            var physicsEngine = scene.getPhysicsEngine();
            var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
            if (body) {
                body.position.x = position.x;
                body.position.y = position.y;
                body.position.z = position.z;
            }
        };
        DrawingService.prototype.moveCameraForDiceThrow = function (scene, camera, currentPlayerPosition) {
            var d = $.Deferred();
            var animationCameraPosition = new BABYLON.Animation("cameraDiceThrowMoveAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var animationCameraRotation = new BABYLON.Animation("cameraDiceThrowRotateAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var topCenter = this.getPositionCoordinate(currentPlayerPosition.index);
            var cameraDirection = new BABYLON.Vector3(topCenter.x, 6, topCenter.z).subtract(this.dicePosition).normalize();
            var finalCameraPosition = this.dicePosition.add(new BABYLON.Vector3(cameraDirection.x * 1.5, cameraDirection.y * 1.5, cameraDirection.z * 1.5)); //this.getGameCameraPosition(currentPlayerPosition);
            var keys = [];
            keys.push({
                frame: 0,
                value: camera.position
            });
            keys.push({
                frame: 30,
                value: finalCameraPosition
            });
            var keysRotation = [];
            keysRotation.push({
                frame: 0,
                value: camera.rotation
            });
            keysRotation.push({
                frame: 30,
                value: this.getCameraRotationForTarget(this.dicePosition, camera, finalCameraPosition)
            });
            // make sure the starting and ending rotation angle are at the same side of the numeric scale; Math.Pi and -Math.Pi are the same in terms of object rotation, but for
            // computer animation, this is a 360 degree spin, which is undesirable...
            if (keysRotation[0].value.y < 0 && keysRotation[1].value.y >= 0 && keysRotation[1].value.y + Math.abs(keysRotation[0].value.y) > Math.PI) {
                keysRotation[0].value.y = Math.PI + Math.PI + keysRotation[0].value.y;
            }
            if (keysRotation[0].value.y >= 0 && keysRotation[1].value.y < 0 && keysRotation[0].value.y + Math.abs(keysRotation[1].value.y) > Math.PI) {
                keysRotation[0].value.y = -Math.PI - Math.PI + keysRotation[0].value.y;
            }
            animationCameraPosition.setKeys(keys);
            animationCameraRotation.setKeys(keysRotation);
            camera.animations = [];
            camera.animations.push(animationCameraPosition);
            camera.animations.push(animationCameraRotation);
            scene.beginAnimation(camera, 0, 30, false, undefined, function () { d.resolve(); });
            return d;
        };
        DrawingService.prototype.animateDiceThrow = function (scene, impulsePoint) {
            this.numFramesDiceIsAtRest = 0;
            this.diceMesh.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0.1, friction: 0.5, restitution: 0.5 });
            this.diceMesh.checkCollisions = true;
            if (impulsePoint) {
                var dir = impulsePoint.subtract(scene.activeCamera.position);
                dir.normalize();
                this.diceMesh.applyImpulse(dir.scale(0.2), impulsePoint);
            }
            this.throwingDice = true;
        };
        DrawingService.prototype.getRandomPointOnDice = function () {
            var point = new BABYLON.Vector3(this.diceMesh.position.x, this.diceMesh.position.y, this.diceMesh.position.z);
            point.x = point.x - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            point.y = point.y - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            point.z = point.z - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            return point;
        };
        // animates camera back to the base viewing position; returns the deferred object that will be resolved when the animation finishes
        DrawingService.prototype.returnCameraToMainPosition = function (scene, camera, currentPlayerPositionIndex, numFrames, closer) {
            var d = $.Deferred();
            var animationCameraPosition = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var animationCameraRotation = new BABYLON.Animation("myAnimation2", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var finalCameraPosition = this.getGameCameraPosition(currentPlayerPositionIndex, false, closer);
            var keys = [];
            keys.push({
                frame: 0,
                value: camera.position
            });
            keys.push({
                frame: numFrames ? numFrames : 30,
                value: finalCameraPosition
            });
            var keysRotation = [];
            keysRotation.push({
                frame: 0,
                value: camera.rotation
            });
            var targetCoordinate = this.getPositionCoordinate(currentPlayerPositionIndex);
            /*var currentTarget = camera.getTarget();
            var currentRotation = new BABYLON.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z);
            var currentPosition = new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z);
            camera.position = new BABYLON.Vector3(finalCameraPosition.x, finalCameraPosition.y, finalCameraPosition.z);
            camera.setTarget(new BABYLON.Vector3(targetCoordinate.x, 0, targetCoordinate.z));
            var targetRotation = new BABYLON.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z);
            camera.setTarget(currentTarget);
            camera.rotation.x = currentRotation.x;
            camera.rotation.y = currentRotation.y;
            camera.rotation.z = currentRotation.z;
            camera.position.x = currentPosition.x;
            camera.position.y = currentPosition.y;
            camera.position.z = currentPosition.z;*/
            keysRotation.push({
                frame: numFrames ? numFrames : 30,
                value: this.getCameraRotationForTarget(new BABYLON.Vector3(closer ? targetCoordinate.x + 0.01 : 0, 0, closer ? targetCoordinate.z + 0.01 : 0), camera, finalCameraPosition) // closer ? targetRotation : this.getCameraRotationForTarget(new BABYLON.Vector3(closer ? targetCoordinate.x : 0, 0, closer ? targetCoordinate.z : 0), camera, finalCameraPosition)
            });
            // make sure the starting and ending rotation angle are at the same side of the numeric scale; Math.Pi and -Math.Pi are the same in terms of object rotation, but for
            // computer animation, this is a 360 degree spin, which is undesirable...
            if (keysRotation[0].value.y < 0 && keysRotation[1].value.y >= 0 && keysRotation[1].value.y + Math.abs(keysRotation[0].value.y) > Math.PI) {
                keysRotation[0].value.y = Math.PI + Math.PI + keysRotation[0].value.y;
            }
            if (keysRotation[0].value.y >= 0 && keysRotation[1].value.y < 0 && keysRotation[0].value.y + Math.abs(keysRotation[1].value.y) > Math.PI) {
                keysRotation[0].value.y = -Math.PI - Math.PI + keysRotation[0].value.y;
            }
            animationCameraPosition.setKeys(keys);
            animationCameraRotation.setKeys(keysRotation);
            camera.animations.splice(0, camera.animations.length);
            camera.animations = [];
            camera.animations.push(animationCameraPosition);
            camera.animations.push(animationCameraRotation);
            var speedRatio = 1;
            scene.beginAnimation(camera, 0, numFrames ? numFrames : 30, false, speedRatio, function () {
                d.resolve();
            });
            return d;
        };
        DrawingService.prototype.isDiceAtRestAfterThrowing = function (scene) {
            if (this.throwingDice) {
                var physicsEngine = scene.getPhysicsEngine();
                var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
                //$("#debugMessage").html("Y=" + body.velocity.y.toPrecision(5));
                if (Math.abs(body.velocity.x) > BABYLON.Engine.Epsilon * 100 || Math.abs(body.velocity.y) > BABYLON.Engine.Epsilon * 100 || Math.abs(body.velocity.z) > BABYLON.Engine.Epsilon * 100) {
                    this.numFramesDiceIsAtRest -= 5;
                    if (this.numFramesDiceIsAtRest < 0) {
                        this.numFramesDiceIsAtRest = 0;
                    }
                    return false;
                }
                this.numFramesDiceIsAtRest++;
                if (this.numFramesDiceIsAtRest < scene.getEngine().getFps() * 2) {
                    return false;
                }
                this.throwingDice = false;
                return true;
            }
            return false;
        };
        DrawingService.prototype.getDiceLocation = function (scene) {
            //var physicsEngine = scene.getPhysicsEngine();
            //var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
            //if (body) {
            //    return <BABYLON.Vector3>body.position;
            //}
            return this.diceMesh.position;
        };
        DrawingService.prototype.setGameCameraInitialPosition = function (camera) {
            camera.position = this.getGameCameraPosition(this.gameService.getCurrentPlayerPosition().index, true);
            camera.setTarget(BABYLON.Vector3.Zero());
        };
        DrawingService.prototype.setManageCameraPosition = function (camera, focusedAssetGroupIndex, scene) {
            var firstFocusedBoardField = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            if (!this.boardGroupLeftCoordinate) {
                this.initBoardGroupCoordinates();
            }
            var group = firstFocusedBoardField.asset.group;
            var centerVector;
            if (group !== Model.AssetGroup.Railway) {
                var groupLeftCoordinate = this.boardGroupLeftCoordinate[group];
                var groupRightCoordinate = this.boardGroupRightCoordinate[group];
                centerVector = BABYLON.Vector3.Center(new BABYLON.Vector3(groupLeftCoordinate.x, 0, groupLeftCoordinate.z), new BABYLON.Vector3(groupRightCoordinate.x, 0, groupRightCoordinate.z));
            }
            else {
                var centerCoordinate = this.getPositionCoordinate(firstFocusedBoardField.index);
                centerVector = new BABYLON.Vector3(centerCoordinate.x, 0, centerCoordinate.z);
            }
            var groupQuadrant = group === Model.AssetGroup.Railway ? Math.floor(firstFocusedBoardField.index / 10) : Math.floor((group - 1) / 2);
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
            this.highlightGroupFields(focusedAssetGroupIndex, groupQuadrant, centerVector, scene);
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
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 9) === "mortgage_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.BoardField;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(9));
                }
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 12) === "houseButton_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.AddHouse;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(12));
                }
                if (pickResult.pickedMesh && pickResult.pickedMesh.name.substring(0, 18) === "houseRemoveButton_") {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.RemoveHouse;
                    pickedObject.position = Number(pickResult.pickedMesh.name.substring(18));
                }
                if (pickResult.pickedMesh && (pickResult.pickedMesh.name.substring(0, 6) === "Boole_" || pickResult.pickedMesh.name === "Dice_obj")) {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.Dice;
                    pickedObject.pickedPoint = pickResult.pickedPoint;
                }
                return pickedObject;
            }
            return undefined;
        };
        DrawingService.prototype.createBoard = function (scene) {
            var boardMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            var board = BABYLON.Mesh.CreateGround(this.groundMeshName, this.boardSize, this.boardSize, 2, scene);
            boardMaterial.emissiveTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.gameboardImage, scene);
            boardMaterial.diffuseTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.gameboardImage, scene);
            board.material = boardMaterial;
            board.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.4, restitution: 0.5 });
            board.checkCollisions = true;
            var tableMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            if (this.themeService.theme.skyboxFolder) {
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000, scene);
                tableMaterial.backFaceCulling = false;
                tableMaterial.reflectionTexture = new BABYLON.CubeTexture(this.themeService.theme.imagesFolder + this.themeService.theme.skyboxFolder, scene);
                tableMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                tableMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                tableMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skybox.material = tableMaterial;
            }
            else {
                var table = BABYLON.Mesh.CreateGround("tableMesh", this.themeService.theme.backgroundSize[0], this.themeService.theme.backgroundSize[1], 2, scene);
                tableMaterial.emissiveTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.backgroundImage, scene);
                tableMaterial.diffuseTexture = new BABYLON.Texture(this.themeService.theme.imagesFolder + this.themeService.theme.backgroundImage, scene);
                table.material = tableMaterial;
                table.position.y = -0.01;
                table.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.5 });
                table.checkCollisions = true;
            }
        };
        DrawingService.prototype.setBoardFieldOwner = function (boardField, asset, scene) {
            if (boardField.ownerMesh) {
                scene.removeMesh(boardField.ownerMesh);
                boardField.ownerMesh.dispose();
            }
            var fieldQuadrant = Math.floor(boardField.index / (this.boardFieldsInQuadrant - 1));
            var playerColor = this.gameService.players.filter(function (p) { return p.playerName === asset.owner; })[0].color;
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
        DrawingService.prototype.setBoardFieldHouses = function (viewBoardField, houses, hotel, uncommittedHouses, uncommittedHotel, scene) {
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
            var housesPlaced = 0;
            if ((houses && houses > 0) || hotel) {
                viewBoardField.houseMeshes = [];
                while ((houses > 0) || hotel) {
                    var houseMesh = BABYLON.Mesh.CreateBox(hotel ? "hotel_" + viewBoardField.index : "house_" + viewBoardField.index + "_" + houses, houseSize, scene);
                    houseMesh.scaling = new BABYLON.Vector3(1, 0.5, 1);
                    if (hotel) {
                        houseMesh.scaling[runningCoordinate] = 2;
                        if (uncommittedHotel) {
                            var uncommittedHotelMaterial = new BABYLON.StandardMaterial("uncommittedHotelMaterial_" + viewBoardField.index, scene);
                            uncommittedHotelMaterial.alpha = 1.0;
                            uncommittedHotelMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.0, 0.1);
                            houseMesh.material = uncommittedHotelMaterial;
                        }
                    }
                    houseMesh.position = new BABYLON.Vector3(topLeftCorner.x, 0, topLeftCorner.z);
                    if (!hotel) {
                        housesPlaced++;
                        houseMesh.position[runningCoordinate] += (houses - 1) * houseSize * 1.15 * this.getQuadrantRunningDirection(boardFieldQuadrant) * -1;
                        if (uncommittedHouses && housesPlaced <= uncommittedHouses) {
                            var uncommittedHouseMaterial = new BABYLON.StandardMaterial("uncommittedHouseMaterial" + houses + "_" + viewBoardField.index, scene);
                            uncommittedHouseMaterial.alpha = 1.0;
                            uncommittedHouseMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.0, 0.1);
                            houseMesh.material = uncommittedHouseMaterial;
                        }
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
        DrawingService.prototype.setBoardFieldMortgage = function (boardField, asset, scene) {
            if (boardField.mortgageMesh) {
                scene.removeMesh(boardField.mortgageMesh);
                boardField.mortgageMesh.dispose();
            }
            if (asset.mortgage) {
                var fieldQuadrant = Math.floor(boardField.index / (this.boardFieldsInQuadrant - 1));
                var topCenter = this.getPositionCoordinate(boardField.index);
                var heightCoordinate = this.getQuadrantRunningCoordinate(fieldQuadrant) === "x" ? "z" : "x";
                var heightDirection = fieldQuadrant === 0 || fieldQuadrant === 1 ? -1 : 1;
                var bottomCenter = new MonopolyApp.Viewmodels.Coordinate(topCenter.x, topCenter.z);
                bottomCenter[heightCoordinate] += this.boardFieldHeight * 0.65 * heightDirection;
                boardField.mortgageMesh = BABYLON.Mesh.CreateGround("mortgage_" + boardField.index, this.boardFieldWidth * 0.8, this.boardFieldWidth * 0.8, 2, scene);
                var mat = new BABYLON.StandardMaterial("mortgagematerial_" + boardField.index, scene);
                mat.diffuseTexture = new BABYLON.Texture("images/Mortgage.png", scene);
                mat.diffuseTexture.hasAlpha = true;
                mat.useAlphaFromDiffuseTexture = true;
                boardField.mortgageMesh.material = mat;
                boardField.mortgageMesh.position.x = bottomCenter.x;
                boardField.mortgageMesh.position.z = bottomCenter.z;
                boardField.mortgageMesh.position.y = 0.05;
                if (fieldQuadrant === 1) {
                    boardField.mortgageMesh.rotation.y = Math.PI / 2;
                }
                else if (fieldQuadrant === 2) {
                    boardField.mortgageMesh.rotation.y = Math.PI;
                }
                else if (fieldQuadrant === 3) {
                    boardField.mortgageMesh.rotation.y = Math.PI * 3 / 2;
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
                //var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(-0.1, -1, 0), scene);
                //light0.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
                //light0.specular = new BABYLON.Color3(1, 1, 1);
                BABYLON.SceneLoader.ImportMesh(null, _this.themeService.theme.meshFolder, _this.themeService.theme.playerMesh, scene, function (newMeshes, particleSystems) {
                    if (newMeshes != null) {
                        var mesh = newMeshes[that.themeService.theme.playerSubmeshIndex];
                        //sdf
                        playerModel.mesh = mesh;
                        var mat = new BABYLON.StandardMaterial("player_" + player.color + "_material", scene);
                        mat.diffuseColor = that.getColor(player.color, true);
                        //mat.emissiveColor = that.getColor(player.color, false);
                        mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                        that.themeService.theme.playerColoredSubmeshIndices.forEach(function (i) {
                            newMeshes[i].material = mat;
                        });
                        var mat2 = new BABYLON.StandardMaterial("player_" + player.color + "_material2", scene);
                        //mat2.bumpTexture = new BABYLON.Texture("images/Moonopoly/metal.jpg", scene);
                        mat2.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                        mat2.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                        //mat2.diffuseTexture = new BABYLON.Texture("images/Moonopoly/metal.png", scene);
                        //mat2.ambientTexture = new BABYLON.Texture("images/Moonopoly/metal.png", scene);
                        //mat2.backFaceCulling = false;
                        //mat2.diffuseTexture.scale(5);
                        var mat3 = new BABYLON.StandardMaterial("player_" + player.color + "_material3", scene);
                        mat3.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                        mat3.ambientColor = new BABYLON.Color3(0.05, 0.05, 0.05);
                        mat3.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                        newMeshes[1].material = mat2;
                        newMeshes[2].material = mat2;
                        newMeshes[3].material = mat2;
                        newMeshes[7].material = mat2;
                        newMeshes[8].material = mat2;
                        d.resolve(gameController);
                    }
                });
            });
            var d = $.Deferred();
            meshLoads.push(d);
            var that = this;
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
                    that.houseMeshTemplate = mesh;
                    d.resolve(gameController);
                }
            });
            var d1 = $.Deferred();
            meshLoads.push(d1);
            var that = this;
            BABYLON.SceneLoader.ImportMesh(null, "meshes/", "dice.babylon", scene, function (newMeshes, particleSystems) {
                if (newMeshes != null) {
                    var mesh = newMeshes[0];
                    mesh.position.x = 0;
                    mesh.position.z = 0;
                    mesh.position.y = _this.diceHeight / 2;
                    //// DEBUGGING
                    ////var vector = new BABYLON.Vector3(1.57, 0.21, 0);
                    ////var quaternion = new BABYLON.Quaternion(0, 0, 0, 0);
                    ////mesh.rotationQuaternion = quaternion; //vector.toQuaternion(); //new BABYLON.Quaternion(-0.75, 0, 0, -0.75);
                    ////var rotationMatrix = new BABYLON.Matrix();
                    ////quaternion.toRotationMatrix(rotationMatrix);
                    ////vector = new BABYLON.Vector3(0, 0, 1);
                    ////var x = 2;
                    ////if (x > 1) {
                    ////    mesh.rotate(vector, 0.3);
                    ////}
                    that.diceMesh = mesh;
                    /*
                    since the dice mesh has no bounding box assigned (required by the physics calculations), we borrow it from a temporary box object;
                    the size of the impostor box is determined by the bounding box of the dice shell mesh (newMeshes[1].getBoundingInfo().boundingBox.minimum & maximum), divided
                    by the dice mesh scaling factor (defined in the .babylon file)
                    */
                    var diceMeshImpostor = BABYLON.Mesh.CreateBox("dice", 120, scene);
                    diceMeshImpostor.position.x = 5;
                    //diceMeshImpostor.scaling = new BABYLON.Vector3(0.003, 0.003, 0.003);
                    that.diceMesh.getBoundingInfo().boundingBox = diceMeshImpostor.getBoundingInfo().boundingBox;
                    scene.removeMesh(diceMeshImpostor);
                    that.diceMesh.checkCollisions = true;
                    d1.resolve(gameController);
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
        DrawingService.prototype.showHouseButtons = function (focusedAssetGroupIndex, scene, focusedAssetGroup) {
            var _this = this;
            if (!focusedAssetGroup) {
                var focusedFields = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex);
                focusedAssetGroup = focusedFields[0].asset.group;
            }
            this.cleanupHouseButtons(scene);
            var groupBoardFields = this.gameService.getGroupBoardFields(focusedAssetGroup);
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
                    if (boardFieldQuadrant === 1) {
                        houseButtonMesh.rotation.y = Math.PI / 2;
                    }
                    else if (boardFieldQuadrant === 2) {
                        houseButtonMesh.rotation.y = Math.PI;
                    }
                    else if (boardFieldQuadrant === 3) {
                        houseButtonMesh.rotation.y = Math.PI * 3 / 2;
                    }
                    //houseButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1.5, 1, 1.5), 100));
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1, 1, 1), 100));
                    that.houseButtonMeshes.push(houseButtonMesh);
                }
                if (that.gameService.canDowngradeAsset(field.asset, that.gameService.getCurrentPlayer())) {
                    var houseRemoveButtonMesh = that.houseRemoveButtonMeshTemplate.clone("houseRemoveButton_" + field.index);
                    houseRemoveButtonMesh.material = that.houseRemoveButtonMaterial;
                    scene.addMesh(houseRemoveButtonMesh);
                    houseRemoveButtonMesh.position[runningCoordinate] = topLeft[runningCoordinate] + (0.2 * that.getQuadrantRunningDirection(boardFieldQuadrant) * -1);
                    houseRemoveButtonMesh.position[heightCoordinate] = topLeft[heightCoordinate] + (that.boardFieldHeight - 0.2) * heightDirection;
                    houseRemoveButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                    that.houseRemoveButtonMeshes.push(houseRemoveButtonMesh);
                    if (boardFieldQuadrant === 1) {
                        houseRemoveButtonMesh.rotation.y = Math.PI / 2;
                    }
                    else if (boardFieldQuadrant === 2) {
                        houseRemoveButtonMesh.rotation.y = Math.PI;
                    }
                    else if (boardFieldQuadrant === 3) {
                        houseRemoveButtonMesh.rotation.y = Math.PI * 3 / 2;
                    }
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
        DrawingService.prototype.highlightGroupFields = function (focusedAssetGroupIndex, groupQuadrantIndex, groupCenter, scene) {
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
            var groupBoardFields = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex);
            groupBoardFields = groupBoardFields.filter(function (f) { return Math.floor(f.index / 10) === groupQuadrantIndex; });
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
                var upperBound = topRightCorner >= topLeftCorner ? topRightCorner : topLeftCorner;
                var lowerBound = topRightCorner >= topLeftCorner ? topLeftCorner : topRightCorner;
                var heightCoordinate = _this.getQuadrantRunningCoordinate(index) === "x" ? "z" : "x";
                var heightDirection = index === 0 || index === 1 ? -1 : 1;
                var heightTop = quadrant[heightCoordinate];
                var heightBottom = quadrant[heightCoordinate] + _this.boardFieldHeight * heightDirection;
                if (heightTop < heightBottom) {
                    var temp = heightTop;
                    heightTop = heightBottom;
                    heightBottom = temp;
                }
                if (pickedPoint[_this.getQuadrantRunningCoordinate(index)] < upperBound && pickedPoint[_this.getQuadrantRunningCoordinate(index)] > lowerBound &&
                    pickedPoint[heightCoordinate] < heightTop && pickedPoint[heightCoordinate] > heightBottom) {
                    var quadrantOffset = 0;
                    if (index === 0 || index === 3) {
                        quadrantOffset = pickedPoint[_this.getQuadrantRunningCoordinate(index)] > topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[_this.getQuadrantRunningCoordinate(index)] - (topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index))) / _this.boardFieldWidth));
                    }
                    else if (index === 1) {
                        quadrantOffset = pickedPoint[_this.getQuadrantRunningCoordinate(index)] < topRightCorner - _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[_this.getQuadrantRunningCoordinate(index)] - (topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index))) / _this.boardFieldWidth));
                    }
                    else if (index === 2) {
                        quadrantOffset = pickedPoint[_this.getQuadrantRunningCoordinate(index)] < topRightCorner - _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[_this.getQuadrantRunningCoordinate(index)] - (topRightCorner + _this.boardFieldEdgeWidth * _this.getQuadrantRunningDirection(index))) / _this.boardFieldWidth));
                    }
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
        DrawingService.prototype.getPlayerPositionOnBoardField = function (playerModel, positionIndex) {
            var playerQuadrant = Math.floor(positionIndex / (this.boardFieldsInQuadrant - 1));
            var playerQuadrantOffset = positionIndex % (this.boardFieldsInQuadrant - 1);
            var playerCoordinate = this.getPositionCoordinate(positionIndex);
            var heightCoordinate = this.getQuadrantRunningCoordinate(playerQuadrant) === "x" ? "z" : "x";
            var heightDirection = playerQuadrant === 0 || playerQuadrant === 1 ? -1 : 1;
            playerCoordinate[heightCoordinate] += this.boardFieldHeight / 5 * (playerModel.index + 1) * heightDirection;
            return playerCoordinate;
        };
        DrawingService.prototype.getPlayerRotationOnBoardField = function (playerModel, positionIndex) {
            var playerQuadrant = Math.floor(positionIndex / (this.boardFieldsInQuadrant - 1));
            var theme = this.themeService.theme;
            var rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[0][0], theme.playerMeshRotationQuaternion[0][1], theme.playerMeshRotationQuaternion[0][2], theme.playerMeshRotationQuaternion[0][3]);
            if (playerQuadrant === 1) {
                rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[1][0], theme.playerMeshRotationQuaternion[1][1], theme.playerMeshRotationQuaternion[1][2], theme.playerMeshRotationQuaternion[1][3]);
            }
            else if (playerQuadrant === 2) {
                rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[2][0], theme.playerMeshRotationQuaternion[2][1], theme.playerMeshRotationQuaternion[2][2], theme.playerMeshRotationQuaternion[2][3]);
            }
            else if (playerQuadrant === 3) {
                rotationQuaternion = new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[3][0], theme.playerMeshRotationQuaternion[3][1], theme.playerMeshRotationQuaternion[3][2], theme.playerMeshRotationQuaternion[3][3]);
            }
            return rotationQuaternion;
        };
        /*
        This has been coded with the help of http://www.euclideanspace.com/maths/discrete/groups/categorise/finite/cube/
        */
        DrawingService.prototype.getDiceResult = function () {
            var rotationMatrix = new BABYLON.Matrix();
            this.diceMesh.rotationQuaternion.toRotationMatrix(rotationMatrix);
            if (this.epsilonCompare(rotationMatrix.m[0], 0) && this.epsilonCompare(rotationMatrix.m[1], 1) && this.epsilonCompare(rotationMatrix.m[2], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 1;
            }
            if (this.epsilonCompare(rotationMatrix.m[0], 0) && this.epsilonCompare(rotationMatrix.m[1], -1) && this.epsilonCompare(rotationMatrix.m[2], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 2;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[4], 0) && this.epsilonCompare(rotationMatrix.m[5], -1) && this.epsilonCompare(rotationMatrix.m[6], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 3;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[4], 0) && this.epsilonCompare(rotationMatrix.m[5], 1) && this.epsilonCompare(rotationMatrix.m[6], 0) && this.epsilonCompare(rotationMatrix.m[9], 0)) {
                return 4;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[8], 0) && this.epsilonCompare(rotationMatrix.m[9], -1) && this.epsilonCompare(rotationMatrix.m[10], 0)) {
                return 5;
            }
            if (this.epsilonCompare(rotationMatrix.m[1], 0) && this.epsilonCompare(rotationMatrix.m[5], 0) && this.epsilonCompare(rotationMatrix.m[8], 0) && this.epsilonCompare(rotationMatrix.m[9], 1) && this.epsilonCompare(rotationMatrix.m[10], 0)) {
                return 6;
            }
            return 0;
        };
        // get the rotation required for the camera to face the target; position determines the camera position, if it is not equal to its current position
        DrawingService.prototype.getCameraRotationForTarget = function (target, camera, position) {
            var rotation = new BABYLON.Vector3(0, 0, 0);
            camera.upVector.normalize();
            BABYLON.Matrix.LookAtLHToRef(position ? position : camera.position, target, camera.upVector, camera._camMatrix);
            var invertedCamMatrix = camera._camMatrix.invert();
            rotation.x = Math.atan(invertedCamMatrix.m[6] / invertedCamMatrix.m[10]);
            var vDir = target.subtract(position ? position : camera.position);
            if (vDir.x >= 0.0) {
                rotation.y = (-Math.atan(vDir.z / vDir.x) + Math.PI / 2.0);
            }
            else {
                rotation.y = (-Math.atan(vDir.z / vDir.x) - Math.PI / 2.0);
            }
            rotation.z = -Math.acos(BABYLON.Vector3.Dot(new BABYLON.Vector3(0, 1.0, 0), camera.upVector));
            if (isNaN(rotation.x)) {
                rotation.x = 0;
            }
            if (isNaN(rotation.y)) {
                rotation.y = 0;
            }
            if (isNaN(rotation.z)) {
                rotation.z = 0;
            }
            return rotation;
        };
        DrawingService.prototype.epsilonCompare = function (v1, v2) {
            if (Math.abs(v1 - v2) < 0.02) {
                return true;
            }
            return false;
        };
        DrawingService.prototype.getGameCameraPosition = function (currentPlayerPositionIndex, center, closer) {
            var boardFieldQuadrant = Math.floor(currentPlayerPositionIndex / (this.boardFieldsInQuadrant - 1));
            var runningCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant);
            var heightCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
            var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
            var position = new BABYLON.Vector3(0, closer ? 2.65 : 5, -10);
            position[heightCoordinate] = (closer ? 6.85 : 10) * heightDirection;
            position[runningCoordinate] = center ? 0 : this.getPositionCoordinate(currentPlayerPositionIndex)[runningCoordinate];
            return position;
        };
        DrawingService.prototype.addParticle = function (abstractMesh, scene) {
            var particleSystem = new BABYLON.ParticleSystem("particles", 500, scene);
            particleSystem.particleTexture = new BABYLON.Texture("images/Moonopoly/Flare.png", scene);
            particleSystem.emitter = abstractMesh;
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.2;
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 0.5;
            particleSystem.emitRate = 300;
            particleSystem.direction1 = new BABYLON.Vector3(1, 0, 0);
            particleSystem.direction2 = new BABYLON.Vector3(1, 0, 0);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 4;
            particleSystem.updateSpeed = 0.005;
            particleSystem.targetStopDuration = 3;
            particleSystem.disposeOnStop = true;
            particleSystem.minEmitBox = new BABYLON.Vector3(0, -2.2, -0.4); // Starting all From
            particleSystem.maxEmitBox = new BABYLON.Vector3(0, -2.7, -0);
            return particleSystem;
        };
        DrawingService.$inject = ["$http", "gameService", "themeService"];
        return DrawingService;
    })();
    Services.DrawingService = DrawingService;
    monopolyApp.service("drawingService", DrawingService);
})(Services || (Services = {}));
/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
/// <reference path="../../../scripts/game/services/settingsService.ts" />
var Services;
(function (Services) {
    var GameService = (function () {
        function GameService($http, settingsService, themeService) {
            this.httpService = $http;
            this.settingsService = settingsService;
            this.themeService = themeService;
        }
        GameService.prototype.initGame = function (loadGame) {
            this.game = new Model.Game(this.themeService.theme);
            if (loadGame) {
                this.loadGame();
            }
            else {
                var settings = this.settingsService.loadSettings();
                this.initPlayers(settings);
                this.initCards();
                this.game.gameParams.rules.loadDataFrom(settings.rules);
            }
            this.initManageGroups();
            if (!loadGame) {
                this.game.advanceToNextPlayer();
            }
            this.uncommittedHousesPrice = 0;
            //this.setupTestData();
        };
        GameService.prototype.saveGame = function () {
            var gameString = JSON.stringify(this.game);
            localStorage.setItem(Model.Game.version, gameString);
            gameString = localStorage.getItem(Model.Game.version);
        };
        GameService.prototype.loadGame = function () {
            var gameString = localStorage.getItem(Model.Game.version);
            if (gameString) {
                this.game = new Model.Game(this.themeService.theme);
                var savedGame = JSON.parse(gameString);
                this.game.loadDataFrom(savedGame, this.themeService.theme);
            }
        };
        GameService.prototype.endTurn = function () {
            if (this.canEndTurn) {
                this.game.advanceToNextPlayer();
                this.game.setState(Model.GameState.BeginTurn);
                this.lastDiceResult1 = undefined;
                this.lastDiceResult2 = undefined;
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
        Object.defineProperty(GameService.prototype, "gameParams", {
            get: function () {
                return this.game ? this.game.gameParams : undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "lastDiceResult", {
            get: function () {
                if (!this.lastDiceResult1 && !this.lastDiceResult2) {
                    return undefined;
                }
                return this.lastDiceResult1 + this.lastDiceResult2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "anyFlyByEvents", {
            get: function () {
                return this.game.moveContext && this.game.moveContext.flyByEvents.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canThrowDice", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.BeginTurn) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    if (player.money >= 0) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canEndTurn", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.ProcessingDone || this.game.getState() === Model.GameState.Manage) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    if (player.turnsInPrison === 0) {
                        // must pay off bail before leaving prison
                        return false;
                    }
                    if (player.money < 0) {
                        return false;
                    }
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
                if (this.game.getState() === Model.GameState.ProcessingDone) {
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
                if (this.game.getState() === Model.GameState.Move || this.game.getState() === Model.GameState.Process || this.game.getState() === Model.GameState.ThrowDice) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canGetOutOfJail", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.ProcessingDone) {
                    var currentPosition = this.getCurrentPlayerPosition();
                    if (currentPosition.type === Model.BoardFieldType.PrisonAndVisit) {
                        var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                        if (player.turnsInPrison !== undefined && player.money >= this.gameParams.jailBail) {
                            if (this.game.getState() === Model.GameState.BeginTurn) {
                                return true;
                            }
                            if (this.game.getState() === Model.GameState.ProcessingDone && player.turnsInPrison === 0 && this.lastDiceResult !== 6) {
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
        Object.defineProperty(GameService.prototype, "canSurrender", {
            get: function () {
                var _this = this;
                if (this.game.getState() === Model.GameState.BeginTurn || this.game.getState() === Model.GameState.ProcessingDone) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    if (player.money < 0 && player.active) {
                        return true;
                    }
                    if (player.money < this.gameParams.jailBail && player.turnsInPrison === 0 && this.lastDiceResult !== 6) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "canPause", {
            get: function () {
                if (this.game.getState() === Model.GameState.Process || this.game.getState() === Model.GameState.Move || this.game.getState() === Model.GameState.ThrowDice) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "gameState", {
            get: function () {
                return this.game.getState();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "winner", {
            get: function () {
                var activePlayers = this.game.players.filter(function (p) { return p.active; });
                if (activePlayers && activePlayers.length === 1) {
                    return activePlayers[0].playerName;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameService.prototype, "isComputerMove", {
            get: function () {
                var _this = this;
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                return !player.human;
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
                this.currentManageGroupIndex = 0;
            }
            else {
                this.currentManageGroupIndex = undefined;
            }
            return this.currentManageGroupIndex;
        };
        GameService.prototype.manageFocusChange = function (left) {
            if (this.game.getState() === Model.GameState.Manage) {
                if (left) {
                    this.currentManageGroupIndex -= 1;
                    if (this.currentManageGroupIndex < 0) {
                        this.currentManageGroupIndex = this.manageGroups.length - 1;
                    }
                }
                else {
                    this.currentManageGroupIndex += 1;
                    if (this.currentManageGroupIndex >= this.manageGroups.length) {
                        this.currentManageGroupIndex = 0;
                    }
                }
            }
            return this.currentManageGroupIndex;
        };
        GameService.prototype.returnFromManage = function () {
            if (this.game.getState() === Model.GameState.Manage) {
                this.game.setPreviousState();
            }
        };
        GameService.prototype.getOutOfJail = function () {
            var _this = this;
            if (this.canGetOutOfJail) {
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                player.money -= this.gameParams.jailBail;
                player.turnsInPrison = undefined;
            }
        };
        GameService.prototype.surrender = function () {
            var _this = this;
            if (this.canSurrender) {
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                player.active = false;
                var activePlayers = this.game.players.filter(function (p) { return p.active; });
                if (activePlayers && activePlayers.length === 1) {
                    this.game.setState(Model.GameState.EndOfGame);
                }
            }
        };
        GameService.prototype.getCurrentPlayerPosition = function () {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            return player.position;
        };
        GameService.prototype.getPlayerAssets = function (playerName) {
            return this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.owner === playerName; }).map(function (f) { return f.asset; });
        };
        // get asset groups entirely owned by given player
        GameService.prototype.getPlayerAssetGroups = function (playerName) {
            var _this = this;
            var playerGroups = [];
            var groups = [Model.AssetGroup.First, Model.AssetGroup.Second, Model.AssetGroup.Third, Model.AssetGroup.Fourth, Model.AssetGroup.Fifth, Model.AssetGroup.Sixth, Model.AssetGroup.Seventh, Model.AssetGroup.Eighth];
            groups.forEach(function (group) {
                var groupFields = _this.getGroupBoardFields(group);
                if (groupFields.every(function (field) { return !field.asset.unowned && field.asset.owner === playerName; })) {
                    playerGroups.push(group);
                }
            });
            return playerGroups;
        };
        GameService.prototype.moveCurrentPlayer = function (newPositionIndex, doubleRent) {
            var _this = this;
            this.game.setState(Model.GameState.Move);
            this.game.moveContext.reset();
            if (doubleRent) {
                this.game.moveContext.doubleRent = doubleRent;
            }
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            var currentPositionIndex = player.position.index;
            if (player.turnsInPrison === undefined || this.letOutOfPrison(player)) {
                newPositionIndex = newPositionIndex !== undefined ? newPositionIndex : Math.floor((currentPositionIndex + this.lastDiceResult1 + this.lastDiceResult2) % 40);
                player.position = this.game.board.fields[newPositionIndex];
                this.game.board.fields[currentPositionIndex].occupiedBy.splice(this.game.board.fields[currentPositionIndex].occupiedBy.indexOf(player.playerName), 1);
                player.position.occupiedBy.push(player.playerName);
            }
            else {
                if (player.turnsInPrison !== undefined) {
                    this.game.setState(Model.GameState.Process);
                    return null;
                }
            }
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
                else if (asset.houses && asset.houses > 0) {
                    priceToPay = asset.priceRentHouse[asset.houses - 1];
                }
                else {
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
                }
                var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                if (this.game.moveContext.doubleRent) {
                    priceToPay *= 2;
                }
                player.money -= priceToPay;
                var ownerPlayer = this.game.players.filter(function (p) { return p.playerName === asset.owner; })[0];
                ownerPlayer.money += priceToPay;
                result.message = this.getCurrentPlayer() + " paid rent of " + priceToPay + " to " + ownerPlayer.playerName + ".";
            }
            return result;
        };
        GameService.prototype.moveProcessingDone = function () {
            if (this.game.getState() === Model.GameState.Process) {
                this.game.setState(Model.GameState.ProcessingDone);
            }
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
        GameService.prototype.hasMonopoly = function (player, focusedAssetGroupIndex, assetGroup) {
            var _this = this;
            var monopoly = true;
            if (!assetGroup) {
                var firstAssetIndex = this.manageGroups[focusedAssetGroupIndex][0];
                assetGroup = this.getBoardFieldGroup(firstAssetIndex);
            }
            if (assetGroup < Model.AssetGroup.First || assetGroup > Model.AssetGroup.Eighth) {
                return false;
            }
            var groupFields = this.getGroupBoardFields(assetGroup);
            groupFields.forEach(function (field) {
                if (field.asset.unowned || field.asset.owner !== _this.getCurrentPlayer()) {
                    monopoly = false;
                }
            });
            return monopoly;
        };
        // determine the first asset that is eligible for upgrade in a group and then perform the upgrade
        GameService.prototype.addHousePreviewForGroup = function (playerName, group) {
            var groupFields = this.getGroupBoardFields(group);
            var sortedFields = groupFields.sort(function (a, b) {
                if (a.asset.hotel && b.asset.hotel) {
                    return 0;
                }
                if (a.asset.hotel) {
                    return 1;
                }
                if (b.asset.hotel) {
                    return -1;
                }
                if (!a.asset.houses && !b.asset.houses) {
                    return 0;
                }
                if (!a.asset.houses && b.asset.houses) {
                    return -1;
                }
                if (a.asset.houses && !b.asset.houses) {
                    return 1;
                }
                return a.asset.houses > b.asset.houses ? 1 : -1;
            });
            return this.addHousePreview(playerName, sortedFields[0].index);
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
            if (!boardField.asset || !this.hasMonopoly(playerName, 0, boardField.asset.group) || (!boardField.asset.houses && !boardField.asset.hotel)) {
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
        GameService.prototype.commitHouseOrHotel = function (playerName, focusedAssetGroupIndex, assetGroup) {
            if (!this.hasMonopoly(playerName, focusedAssetGroupIndex, assetGroup)) {
                return false;
            }
            var firstFocusedBoardField = assetGroup ? this.getGroupBoardFields(assetGroup)[0] : this.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            var boardFields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === firstFocusedBoardField.asset.group; });
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
        GameService.prototype.rollbackHouseOrHotel = function (playerName, focusedAssetGroupIndex) {
            if (!this.hasMonopoly(playerName, focusedAssetGroupIndex)) {
                return false;
            }
            var firstFocusedBoardField = this.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            var boardFields = this.game.board.fields.filter(function (f) { return f.type === Model.BoardFieldType.Asset && f.asset.group === firstFocusedBoardField.asset.group; });
            boardFields.forEach(function (boardField) {
                boardField.asset.rollbackHouseOrHotel();
            });
            return true;
        };
        // check if the asset can be upgraded
        // all currently uncommitted houses and hotels are taken into account; 
        // also, a purchase of a house/ hotel might require simultaneous purchase of a house on the neighbouring assets
        GameService.prototype.canUpgradeAsset = function (asset, playerName) {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, 0, asset.group)) {
                return false;
            }
            if (asset.hotel) {
                return false;
            }
            var groupAssets = this.getGroupBoardFields(asset.group).map(function (f) { return f.asset; });
            if (groupAssets.filter(function (a) { return a.mortgage; }).length > 0) {
                return false;
            }
            var player = this.players.filter(function (p) { return p.playerName === playerName; })[0];
            var requiredPrice = !asset.houses || asset.houses <= 3 ? asset.getPriceForHouseDuringManage(false) : asset.getPriceForHotelDuringManage(false);
            groupAssets.forEach(function (groupAsset) {
                requiredPrice += groupAsset.uncommittedPrice();
                if (groupAsset.name !== asset.name) {
                    if (groupAsset.houses < asset.houses) {
                        requiredPrice += (asset.houses - groupAsset.houses) * groupAsset.getPriceForHouseDuringManage(false);
                    }
                }
            });
            return player.money >= requiredPrice;
        };
        GameService.prototype.canDowngradeAsset = function (asset, playerName) {
            if (!asset || asset.unowned || asset.owner !== playerName || !this.hasMonopoly(playerName, 0, asset.group)) {
                return false;
            }
            if ((!asset.houses || asset.houses === 0) && !asset.hotel) {
                return false;
            }
            return true;
        };
        GameService.prototype.getAssetGroup = function (position) {
            return this.game.board.fields.filter(function (f) { return f.index === position; }).map(function (f) { return f.type === Model.BoardFieldType.Asset ? f.asset.group : undefined; })[0];
        };
        GameService.prototype.setDiceResult = function (diceResult) {
            this.lastDiceResult1 = diceResult;
            this.lastDiceResult2 = 0;
        };
        GameService.prototype.getNextTreasureCard = function () {
            var _this = this;
            var card = this.game.treasureCards.filter(function (c) { return c.index === _this.currentTreasureCardIndex; });
            if (!card || card.length === 0) {
                this.currentTreasureCardIndex = 0;
                card = this.game.treasureCards.filter(function (c) { return c.index === _this.currentTreasureCardIndex; });
            }
            this.currentTreasureCardIndex++;
            return card[0];
        };
        GameService.prototype.getNextEventCard = function () {
            var _this = this;
            var card = this.game.eventCards.filter(function (c) { return c.index === _this.currentEventCardIndex; });
            if (!card || card.length === 0) {
                this.currentEventCardIndex = 0;
                card = this.game.eventCards.filter(function (c) { return c.index === _this.currentEventCardIndex; });
            }
            this.currentEventCardIndex++;
            return card[0];
        };
        GameService.prototype.processCard = function (card) {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            if (card.cardType === Model.CardType.ReceiveMoney) {
                player.money += card.money;
            }
            if (card.cardType === Model.CardType.PayMoney) {
                player.money -= card.money;
            }
            if (card.cardType === Model.CardType.ReceiveMoneyFromPlayers) {
                this.game.players.forEach(function (p) {
                    if (p.playerName !== player.playerName && p.active) {
                        player.money += card.money;
                        p.money -= card.money;
                    }
                });
            }
            if (card.cardType === Model.CardType.PayMoneyToPlayers) {
                this.game.players.forEach(function (p) {
                    if (p.playerName !== player.playerName && p.active) {
                        player.money -= card.money;
                        p.money += card.money;
                    }
                });
            }
            if (card.cardType === Model.CardType.AdvanceToField) {
                if (card.boardFieldIndex === 0 && card.skipGoAward) {
                    this.game.moveContext.skipGoAward = true;
                }
            }
            if (card.cardType === Model.CardType.JumpToField) {
                if (card.boardFieldIndex !== 10) {
                    this.moveCurrentPlayer(card.boardFieldIndex);
                }
            }
            if (card.cardType === Model.CardType.Maintenance || card.cardType === Model.CardType.OwnMaintenance) {
                card.money = 0;
                this.game.board.fields.forEach(function (f) {
                    if (f.type === Model.BoardFieldType.Asset && !f.asset.unowned) {
                        if (f.asset.owner === _this.getCurrentPlayer() || card.cardType === Model.CardType.Maintenance) {
                            var money = 0;
                            if (f.asset.hotel) {
                                money = card.pricePerHotel;
                            }
                            else if (f.asset.houses) {
                                money += f.asset.houses * card.pricePerHouse;
                            }
                            player.money -= money;
                            card.money += money;
                        }
                    }
                });
            }
        };
        GameService.prototype.processTax = function (boardFieldType) {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            if (boardFieldType === Model.BoardFieldType.Tax) {
                player.money -= 100;
                return 100;
            }
            if (boardFieldType === Model.BoardFieldType.TaxIncome) {
                player.money -= 200;
                return 200;
            }
            return 0;
        };
        GameService.prototype.processPrison = function (wasSentToPrison) {
            var _this = this;
            var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
            if (player.turnsInPrison === undefined) {
                if (wasSentToPrison) {
                    player.turnsInPrison = 3;
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (player.turnsInPrison > 0) {
                    player.turnsInPrison--;
                }
                return true;
            }
        };
        // process intermediate board fields while moving a player to its destination field
        GameService.prototype.processFlyBy = function (positionIndex, backwards) {
            var _this = this;
            var processedEvent = Model.ProcessingEvent.None;
            if (positionIndex === 0 && !backwards) {
                if (this.game.moveContext.skipGoAward === false) {
                    var player = this.game.players.filter(function (p) { return p.playerName === _this.getCurrentPlayer(); })[0];
                    player.money += 200;
                    processedEvent = Model.ProcessingEvent.PassGoAward;
                    this.game.moveContext.flyByEvents.push(processedEvent);
                }
            }
            return processedEvent;
        };
        GameService.prototype.toggleMortgageAsset = function (asset) {
            var owner = this.players.filter(function (p) { return p.playerName === asset.owner; })[0];
            if (asset.mortgage) {
                if (owner.money >= Math.floor(asset.valueMortgage * 1.1)) {
                    owner.money -= Math.floor(asset.valueMortgage * 1.1);
                    asset.releaseMortgage();
                }
                else {
                    return false;
                }
            }
            else {
                owner.money += asset.valueMortgage;
                asset.putUnderMortgage();
            }
            return true;
        };
        // get fields in management group, identified by its index in the manage group array
        GameService.prototype.getBoardFieldsInGroup = function (focusedAssetGroupIndex) {
            var groupFieldIndexes = this.manageGroups[focusedAssetGroupIndex];
            return this.game.board.fields.filter(function (f) { return groupFieldIndexes.filter(function (g) { return g === f.index; }).length > 0; });
        };
        GameService.prototype.canMortgage = function (asset) {
            if (!asset) {
                return false;
            }
            var canMortgage = !asset.unowned && asset.owner === this.getCurrentPlayer();
            if (asset.group === Model.AssetGroup.Railway || asset.group === Model.AssetGroup.Utility) {
                return canMortgage;
            }
            if (canMortgage) {
                var groupAssets = this.getGroupBoardFields(asset.group).map(function (f) { return f.asset; });
                groupAssets.forEach(function (a) {
                    if ((a.houses && a.houses > 0) || a.hotel) {
                        canMortgage = false;
                    }
                });
            }
            return canMortgage;
        };
        GameService.prototype.setupTestData = function () {
            var player = this.game.players[1];
            this.game.board.fields[1].asset.setOwner(player.playerName);
            this.game.board.fields[3].asset.setOwner(player.playerName);
            //this.toggleMortgageAsset(this.game.board.fields[1].asset);
            //this.toggleMortgageAsset(this.game.board.fields[3].asset);
            this.game.board.fields[1].asset.addHouse();
            this.game.board.fields[1].asset.commitHouseOrHotel();
            this.game.board.fields[3].asset.addHouse();
            this.game.board.fields[3].asset.addHouse();
            this.game.board.fields[3].asset.commitHouseOrHotel();
            player.money = 0;
        };
        GameService.prototype.initPlayers = function (settings) {
            var colors = ["Red", "Green", "Yellow", "Blue"];
            for (var i = 0; i < settings.numPlayers; i++) {
                var player = new Model.Player(settings.players[i].playerName, settings.players[i].human);
                player.money = settings.rules.initialCash;
                player.color = i;
                player.active = true;
                this.game.players.push(player);
                this.setPlayerPosition(player, 0);
            }
        };
        GameService.prototype.initCards = function () {
            this.currentEventCardIndex = 0;
            this.currentTreasureCardIndex = 0;
            var treasureCardIndex = 0;
            var eventCardIndex = 0;
            var treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Bank error. You receive M200.";
            treasureCard.money = 200;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You have won second award at the beauty competition. You receive M10.";
            treasureCard.money = 10;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.AdvanceToField;
            treasureCard.message = "Go to START. You receive M200.";
            treasureCard.boardFieldIndex = 0;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Pay M100 for hospital treatment.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Doctor's fee. Pay M50";
            treasureCard.money = 50;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Yearly bonus. You receive M100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Life insurance payoff. You receive M100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.PayMoney;
            treasureCard.message = "Pay M50 for scholarship.";
            treasureCard.money = 50;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Personal income tax return. You receive M20.";
            treasureCard.money = 20;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.JumpToField;
            treasureCard.message = "Go directly to jail, without passing START.";
            treasureCard.boardFieldIndex = 10;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You receive M25 for counseling services.";
            treasureCard.money = 25;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoneyFromPlayers;
            treasureCard.message = "it's your birthday. You receive M10 from each player.";
            treasureCard.money = 10;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "Personal income tax return. You receive M20.";
            treasureCard.money = 20;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.Maintenance;
            treasureCard.message = "Pay for road maintenance. M40 for each house and M115 for each hotel.";
            treasureCard.pricePerHouse = 40;
            treasureCard.pricePerHotel = 115;
            this.game.treasureCards.push(treasureCard);
            treasureCard = new Model.TreasureCard();
            treasureCard.index = treasureCardIndex++;
            treasureCard.cardType = Model.CardType.ReceiveMoney;
            treasureCard.message = "You have inherited M100.";
            treasureCard.money = 100;
            this.game.treasureCards.push(treasureCard);
            var eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.PayMoney;
            eventCard.message = "You have received a speeding ticket. Pay M15.";
            eventCard.money = 15;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.RetractNumFields;
            eventCard.message = "Go three fields backwards.";
            eventCard.boardFieldCount = 3;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.ReceiveMoney;
            eventCard.message = "Bank has issued dividends worth of M50.";
            eventCard.money = 50;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to Terme Čatež. If you pass START, you receive M200.";
            eventCard.boardFieldIndex = 11;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.OwnMaintenance;
            eventCard.message = "Your houses are in need of renovation. Pay M25 for each house and M100 for each hotel.";
            eventCard.pricePerHouse = 25;
            eventCard.pricePerHotel = 100;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.PayMoneyToPlayers;
            eventCard.message = "You have been elected board chairman. Pay each player M50.";
            eventCard.money = 50;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToRailway;
            eventCard.message = "Go to the next railway station. If unowned, you may purchase it from the bank. Otherwise, pay double rent to the owner.";
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to Logarska dolina. If you pass START, you receive M200.";
            eventCard.boardFieldIndex = 24;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.ReceiveMoney;
            eventCard.message = "Building loan payment. You receive M150.";
            eventCard.money = 150;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToRailway;
            eventCard.message = "Go to the next railway station. If unowned, you may purchase it from the bank. Otherwise, pay double rent to the owner.";
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Take a trip to Jesenice. If you pass START, you receive M200.";
            eventCard.boardFieldIndex = 5;
            this.game.eventCards.push(eventCard);
            eventCard = new Model.EventCard();
            eventCard.index = eventCardIndex++;
            eventCard.cardType = Model.CardType.AdvanceToField;
            eventCard.message = "Go to Portorož.";
            eventCard.boardFieldIndex = 39;
            this.game.eventCards.push(eventCard);
        };
        GameService.prototype.initManageGroups = function () {
            this.manageGroups = new Array();
            var manageGroup = this.getGroupBoardFields(Model.AssetGroup.First).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = [5];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Second).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Third).map(function (f) { return f.index; });
            manageGroup.push(12);
            this.manageGroups.push(manageGroup);
            manageGroup = [15];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Fourth).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Fifth).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = [25];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Sixth).map(function (f) { return f.index; });
            manageGroup.push(28);
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Seventh).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
            manageGroup = [35];
            this.manageGroups.push(manageGroup);
            manageGroup = this.getGroupBoardFields(Model.AssetGroup.Eighth).map(function (f) { return f.index; });
            this.manageGroups.push(manageGroup);
        };
        GameService.prototype.letOutOfPrison = function (player) {
            if (player.turnsInPrison === undefined) {
                return true;
            }
            if (this.lastDiceResult1 === 6) {
                player.turnsInPrison = undefined;
                return true;
            }
            if (player.turnsInPrison && player.turnsInPrison > 0) {
                return false;
            }
            return false;
        };
        GameService.$inject = ["$http", "settingsService", "themeService"];
        return GameService;
    })();
    Services.GameService = GameService;
    monopolyApp.service("gameService", GameService);
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ThemeService = (function () {
        function ThemeService() {
            if (ThemeService.theme === Model.Themes.Monopoly) {
                this.themeInstance = new Model.MonopolyTheme();
            }
            else if (ThemeService.theme === Model.Themes.Moonopoly) {
                this.themeInstance = new Model.MoonopolyTheme();
            }
        }
        Object.defineProperty(ThemeService.prototype, "theme", {
            get: function () {
                return this.themeInstance;
            },
            enumerable: true,
            configurable: true
        });
        // TODO: move this to build-time variable
        ThemeService.theme = Model.Themes.Moonopoly;
        return ThemeService;
    })();
    Services.ThemeService = ThemeService;
})(Services || (Services = {}));
monopolyApp.service("themeService", Services.ThemeService);
var Services;
(function (Services) {
    var TutorialService = (function () {
        function TutorialService(swipeService, timeoutService, gameService) {
            this.numSteps = 6;
            this.timeoutService = timeoutService;
            this.gameService = gameService;
            this.swipeService = swipeService;
        }
        TutorialService.prototype.initialize = function (data) {
            this.data = data;
        };
        TutorialService.prototype.advanceToNextStep = function () {
            var hasAdvanced = false;
            if (!this.currentStep) {
                this.currentStep = 1;
                hasAdvanced = true;
            }
            else {
                if (this.canAdvance) {
                    this.currentStep++;
                    hasAdvanced = true;
                }
            }
            if (hasAdvanced) {
                this.setupCurrentStep();
                if (this.data.customFunction) {
                    this.data.customFunction(this, this.data, undefined);
                }
            }
        };
        Object.defineProperty(TutorialService.prototype, "canAdvance", {
            get: function () {
                if (!this.currentStep || this.currentStep > this.numSteps) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TutorialService.prototype, "canAdvanceByClick", {
            get: function () {
                return this.canAdvance && !this.data.disableClickForward;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TutorialService.prototype, "isActive", {
            get: function () {
                return this.currentStep && this.currentStep <= this.numSteps;
            },
            enumerable: true,
            configurable: true
        });
        TutorialService.prototype.canExecuteAction = function (action) {
            if (!this.isActive) {
                return true;
            }
            if (action === "setupthrow" && this.currentStep === 5) {
                return true;
            }
            return false;
        };
        TutorialService.prototype.executeActionCallback = function (action) {
            if (this.data.executeOnAction) {
                this.data.executeOnAction(action, this, this.data);
            }
        };
        TutorialService.prototype.setupCurrentStep = function () {
            if (this.currentStep === 1) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Welcome to MOONopoly! A historical moment has been reached where the Moon is now available to the wealthiest explorers of the world.";
                this.data.messageDialogTop = 70;
                this.data.messagePaddingTop = 25;
            }
            else if (this.currentStep === 2) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "It is only fair for the Moon to be divided among them by chance and strategic skills.";
                this.data.messagePaddingTop = 50;
            }
            else if (this.currentStep === 3) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "In a turn based game you have a choice of THROWING the dice, MANAGING your assets and ENDING current turn.";
                this.data.messagePaddingTop = 35;
            }
            else if (this.currentStep === 4) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "To select your action, swipe your finger over the buttons at the bottom of the screen.";
                this.data.messagePaddingTop = 50;
                this.data.customFunction = function (tutorialService, stepData, backwards) {
                    // this custom function will iterate over visible buttons and highlight them one at a time
                    var highlighted = $("#commandPanel img.highlightedButton");
                    var nextHighlighted;
                    if (highlighted.length === 0) {
                        nextHighlighted = $("#commandPanel a:visible img.unhighlightedButton").first();
                        var position = nextHighlighted[0].getBoundingClientRect();
                        $("#handCursor").css("top", position.top - 90);
                        $("#handCursor").css("left", position.left);
                        $("#handCursor").show();
                    }
                    else {
                        highlighted.removeClass("highlightedButton").addClass("unhighlightedButton");
                        highlighted.parent().children().children(".commandButtonOverlayText").hide();
                        if (tutorialService.currentStep === 4) {
                            highlighted = highlighted.first().parent();
                            nextHighlighted = backwards ? highlighted.prevAll("a:visible") : highlighted.nextAll("a:visible");
                            if (nextHighlighted.length === 0) {
                                // change direction if the end has been reached
                                if (backwards) {
                                    backwards = false;
                                }
                                else {
                                    backwards = true;
                                }
                                nextHighlighted = backwards ? highlighted.prevAll("a:visible").first().children("img") : highlighted.nextAll("a:visible").first().children("img"); //$("#commandPanel a:visible img").first();
                            }
                            else {
                                nextHighlighted = backwards ? nextHighlighted.first().children("img") : nextHighlighted.first().children("img");
                            }
                        }
                    }
                    if (nextHighlighted) {
                        nextHighlighted.removeClass("unhighlightedButton").addClass("highlightedButton");
                        nextHighlighted.parent().children().children(".commandButtonOverlayText").show();
                        var nextHighlighted2 = backwards ? nextHighlighted.parent().prevAll("a:visible") : nextHighlighted.parent().nextAll("a:visible");
                        var nextBackwards = nextHighlighted2.length > 0 ? backwards : !backwards;
                        $("#handCursor").animate({
                            left: nextBackwards ? "-=65" : "+=65" }, 1000);
                        tutorialService.timeoutService(function () {
                            if (stepData.customFunction && tutorialService.currentStep === 4) {
                                stepData.customFunction(tutorialService, stepData, backwards);
                            }
                            else {
                                highlighted = $("#commandPanel img.highlightedButton");
                                highlighted.removeClass("highlightedButton").addClass("unhighlightedButton");
                                highlighted.parent().children().children(".commandButtonOverlayText").hide();
                                $("#handCursor").hide();
                            }
                        }, 1000);
                    }
                };
            }
            else if (this.currentStep === 5) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Try THROWING the dice for your first move.";
                this.data.messagePaddingTop = 55;
                this.data.disableClickForward = true;
                this.data.customFunction = undefined;
                this.data.executeOnAction = function (action, tutorialService, stepData) {
                    if (action === "setupthrow") {
                        stepData.messageDialogVisible = false;
                    }
                    if (action === "throw") {
                        tutorialService.advanceToNextStep();
                    }
                };
            }
            else if (this.currentStep === 6) {
                this.data.messageDialogVisible = true;
                this.data.messageDialogText = "Tap anywhere on the dice to drop it to the Moon surface.";
                this.data.messageDialogTop = 180;
                this.data.messagePaddingTop = 55;
                this.data.disableClickForward = false;
                this.data.customFunction = undefined;
                this.data.executeOnAction = undefined;
            }
            else {
                this.data.messageDialogVisible = false;
                this.data.customFunction = undefined;
            }
        };
        TutorialService.$inject = ["$swipe", "$timeout", "gameService"];
        return TutorialService;
    })();
    Services.TutorialService = TutorialService;
    monopolyApp.service("tutorialService", TutorialService);
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
            function GameController(stateService, stateParamsService, swipeService, scope, timeoutService, gameService, drawingService, aiService, themeService, settingsService, tutorialService) {
                var _this = this;
                this.scope = scope;
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.timeoutService = timeoutService;
                this.gameService = gameService;
                this.drawingService = drawingService;
                this.aiService = aiService;
                this.themeService = themeService;
                this.swipeService = swipeService;
                this.settingsService = settingsService;
                this.tutorialService = tutorialService;
                var spService = this.stateParamsService;
                var loadGame = eval(spService.loadGame);
                this.initGame(loadGame);
                var sceneCreated = this.createScene();
                this.availableActions = new MonopolyApp.Viewmodels.AvailableActions();
                this.setAvailableActions();
                this.initMessageHistory();
                this.currentCard = new MonopolyApp.Viewmodels.Card();
                this.bindInputEvents();
                var that = this;
                $.when(sceneCreated).done(function () {
                    for (var i = 0; i < 8; i++) {
                        that.refreshBoardFieldGroupHouses(i);
                    }
                    that.initTutorial(loadGame);
                    if (loadGame) {
                        that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, that.gameService.getCurrentPlayerPosition().index);
                    }
                    if (_this.gameService.isComputerMove) {
                        that.timeoutService(function () {
                            that.setupThrowDice();
                        }, 3000);
                    }
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
            Object.defineProperty(GameController.prototype, "theme", {
                get: function () {
                    return this.themeService.theme;
                },
                enumerable: true,
                configurable: true
            });
            GameController.prototype.initGame = function (loadGame) {
                this.gameService.initGame(loadGame);
                if (loadGame) {
                    this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
                }
            };
            GameController.prototype.setupThrowDice = function () {
                var _this = this;
                if (this.isBlockedByTutorial("setupthrow")) {
                    return;
                }
                if (this.gameService.canThrowDice) {
                    this.executeTutorialCallback("setupthrow");
                    this.gameService.throwDice();
                    this.setAvailableActions();
                    this.drawingService.setupDiceForThrow(this.scene);
                    $.when(this.drawingService.moveCameraForDiceThrow(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition())).done(function () {
                        var that = _this;
                        _this.scope.$apply(function () {
                            _this.executeTutorialCallback("throw");
                        });
                        if (_this.gameService.isComputerMove) {
                            _this.throwDice(_this.drawingService.getRandomPointOnDice());
                        }
                    });
                }
            };
            GameController.prototype.throwDice = function (impulsePoint) {
                if (this.gameService.gameState === Model.GameState.ThrowDice) {
                    this.diceThrowCompleted = $.Deferred();
                    this.drawingService.animateDiceThrow(this.scene, impulsePoint);
                    var that = this;
                    $.when(this.diceThrowCompleted).done(function () {
                        that.diceThrowCompleted = undefined;
                        var diceResult = that.drawingService.getDiceResult();
                        if (diceResult && diceResult > 0) {
                            that.gameService.setDiceResult(diceResult);
                            that.movePlayer();
                        }
                        else {
                            // something went wrong - unable to determine dice orientation; just drop it again from a height
                            that.resetOverboardDice(new BABYLON.Vector3(0, 0, 0));
                            that.throwDice();
                        }
                    });
                }
            };
            // move player to a destination defined by last dice throw or by explicit parameter value (as requested by an event card, for instance)
            GameController.prototype.movePlayer = function (newPositionIndex, backwards, doubleRent) {
                var d = $.Deferred();
                var oldPosition = this.gameService.getCurrentPlayerPosition();
                var newPosition = this.gameService.moveCurrentPlayer(newPositionIndex, doubleRent);
                var cameraMovementCompleted = this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, oldPosition.index);
                var that = this;
                $.when(cameraMovementCompleted).done(function () {
                    cameraMovementCompleted = that.drawingService.returnCameraToMainPosition(that.scene, that.gameCamera, oldPosition.index, 30, true);
                    $.when(cameraMovementCompleted).done(function () {
                        var animateMoveCompleted;
                        var followBoardAnimation = $.Deferred();
                        if (newPosition) {
                            animateMoveCompleted = that.animateMove(oldPosition, newPosition, newPositionIndex !== undefined, backwards);
                            //var positionsToMove = oldPosition.index < newPosition.index ? newPosition.index - oldPosition.index : (40 - oldPosition.index) + newPosition.index;
                            var positionsToMove = backwards ? (newPosition.index <= oldPosition.index ? oldPosition.index - newPosition.index : 40 - newPosition.index + oldPosition.index) :
                                newPosition.index >= oldPosition.index ? newPosition.index - oldPosition.index : 40 - oldPosition.index + newPosition.index;
                            that.followBoardFields(oldPosition.index, positionsToMove, that.drawingService, that.scene, that.gameCamera, that, followBoardAnimation, newPositionIndex !== undefined, backwards);
                        }
                        else {
                            animateMoveCompleted = $.Deferred().resolve();
                            followBoardAnimation = $.Deferred().resolve();
                        }
                        $.when.apply($, [animateMoveCompleted, followBoardAnimation]).done(function () {
                            that.scope.$apply(function () {
                                that.setAvailableActions();
                                $.when(that.processDestinationField()).done(function () {
                                    that.gameService.moveProcessingDone();
                                    if (that.gameService.isComputerMove && (that.gameService.canEndTurn || that.gameService.canSurrender || that.gameService.canGetOutOfJail)) {
                                        // since movePlayer() can be executed several times during a single move, we must ensure this block only runs once
                                        var computerActions = $.Deferred();
                                        that.processComputerActions(computerActions);
                                        $.when(computerActions).done(function (anotherMove) {
                                            if (!anotherMove) {
                                                // end the turn after processing, unless one of the computer actions resulted in another move 
                                                // (for instance, if computer bailed out of jail)
                                                that.endTurn();
                                            }
                                            that.updatePlayersForView();
                                            that.setAvailableActions();
                                            d.resolve();
                                        });
                                    }
                                    else {
                                        that.timeoutService(function () {
                                            that.scope.$apply(function () {
                                                that.setAvailableActions();
                                            });
                                        });
                                        d.resolve();
                                    }
                                });
                            });
                        });
                    });
                });
                return d;
            };
            GameController.prototype.processComputerActions = function (allActionsProcessed) {
                var _this = this;
                var actions = this.aiService.afterMoveProcessing();
                var computerActions = $.Deferred();
                if (actions.length > 0) {
                    actions.forEach(function (action) {
                        if (action.actionType === Model.AIActionType.Buy) {
                            _this.buy();
                        }
                        if (action.actionType === Model.AIActionType.Mortgage || action.actionType === Model.AIActionType.Unmortgage) {
                            _this.toggleMortgageAsset(action.asset);
                        }
                        if (action.actionType === Model.AIActionType.SellHouse || action.actionType === Model.AIActionType.SellHotel) {
                            _this.gameService.removeHousePreview(_this.currentPlayer, action.position);
                            if (_this.gameService.commitHouseOrHotel(_this.currentPlayer, 0, action.asset.group)) {
                                var viewBoardField = _this.boardFields.filter(function (f) { return f.index === action.position; })[0];
                                _this.drawingService.setBoardFieldHouses(viewBoardField, action.asset.houses, action.asset.hotel, undefined, undefined, _this.scene);
                                _this.showMessage(_this.currentPlayer + " sold " + (action.actionType === Model.AIActionType.SellHouse ? "a house" : "hotel") + " on " + action.asset.name + ".");
                            }
                        }
                        if (action.actionType === Model.AIActionType.BuyHouse || action.actionType === Model.AIActionType.BuyHotel) {
                            for (var i = 0; i < action.numHousesOrHotels; i++) {
                                _this.gameService.addHousePreviewForGroup(_this.currentPlayer, action.assetGroup);
                                if (!_this.gameService.commitHouseOrHotel(_this.currentPlayer, 0, action.assetGroup)) {
                                }
                            }
                            var groupFields = _this.gameService.getGroupBoardFields(action.assetGroup);
                            groupFields.forEach(function (groupField) {
                                var viewBoardFieldWithHouse = _this.boardFields.filter(function (f) { return f.index === groupField.index; })[0];
                                _this.drawingService.setBoardFieldHouses(viewBoardFieldWithHouse, groupField.asset.houses, groupField.asset.hotel, undefined, undefined, _this.scene);
                            });
                            _this.showMessage(_this.currentPlayer + " bought " + action.numHousesOrHotels + (action.actionType === Model.AIActionType.BuyHouse ? " houses." : " hotels."));
                        }
                        if (action.actionType === Model.AIActionType.Surrender) {
                            _this.doSurrender();
                        }
                        if (action.actionType === Model.AIActionType.GetOutOfJail) {
                            _this.getOutOfJail();
                        }
                    });
                    // give other players time to catch up with computer's actions
                    this.timeoutService(function () {
                        computerActions.resolve();
                    }, 3000);
                }
                else {
                    if (this.gameService.anyFlyByEvents) {
                        // give other players time to catch up with computer's actions
                        this.timeoutService(function () {
                            computerActions.resolve();
                        }, 3000);
                    }
                    else {
                        computerActions.resolve();
                    }
                }
                var that = this;
                $.when(computerActions).done(function () {
                    if (actions.length > 0 && actions.every(function (a) { return a.actionType !== Model.AIActionType.GetOutOfJail; })) {
                        // if any action, beside getting out of jail, has been processed, repeat until there are no more actions for the computer to perform
                        that.processComputerActions(allActionsProcessed);
                    }
                    else {
                        allActionsProcessed.resolve(actions.length > 0 && actions.some(function (a) { return a.actionType === Model.AIActionType.GetOutOfJail; }));
                    }
                });
            };
            // animate game camera by following board fields from player current field to its movement destination field; this animation occurs at the same time that the player is moving
            GameController.prototype.followBoardFields = function (positionIndex, positionsLeftToMove, drawingService, scene, camera, gameController, followBoardAnimation, fast, backwards) {
                if (positionsLeftToMove > 0) {
                    var numFrames = 0;
                    var processedEvent;
                    do {
                        if (backwards) {
                            positionIndex--;
                            if (positionIndex < 0) {
                                positionIndex = 40 + positionIndex;
                            }
                        }
                        else {
                            positionIndex = (positionIndex + 1) % 40;
                        }
                        positionsLeftToMove--;
                        var numFramesOneField = positionIndex % 10 === 0 ? drawingService.framesToMoveOneBoardField * 2 : drawingService.framesToMoveOneBoardField;
                        if (fast) {
                            numFramesOneField = Math.floor(numFramesOneField / 2);
                        }
                        numFrames += numFramesOneField;
                        processedEvent = gameController.gameService.processFlyBy(positionIndex, backwards);
                    } while (positionIndex % 10 !== 0 && positionsLeftToMove > 0 && processedEvent === Model.ProcessingEvent.None);
                    var cameraMoveCompleted = drawingService.returnCameraToMainPosition(scene, camera, positionIndex, numFrames, true);
                    $.when(cameraMoveCompleted).done(function () {
                        if (processedEvent !== Model.ProcessingEvent.None) {
                            gameController.timeoutService(function () {
                                gameController.scope.$apply(function () {
                                    gameController.updatePlayersForView();
                                });
                            });
                        }
                        gameController.showMessageForEvent(processedEvent);
                        gameController.followBoardFields(positionIndex, positionsLeftToMove, drawingService, scene, camera, gameController, followBoardAnimation, fast, backwards);
                    });
                }
                else {
                    followBoardAnimation.resolve();
                }
            };
            GameController.prototype.buy = function () {
                var bought = this.gameService.buy();
                if (bought) {
                    var boardField = this.gameService.getCurrentPlayerPosition();
                    this.drawingService.setBoardFieldOwner(this.boardFields.filter(function (f) { return f.index === boardField.index; })[0], boardField.asset, this.scene);
                    this.showMessage(this.currentPlayer + " bought " + boardField.asset.name + " for M" + boardField.asset.price + ".");
                    this.updatePlayersForView();
                }
                this.setAvailableActions();
            };
            GameController.prototype.manage = function () {
                if (!this.manageMode) {
                    this.manageMode = true;
                    this.actionButtonsVisible = false;
                    this.focusedAssetGroupIndex = this.gameService.manage();
                    this.setupManageHighlight();
                    this.scene.activeCamera = this.manageCamera;
                    //var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
                    //this.manageCamera.attachControl(canvas, true);
                    this.setAvailableActions();
                    $("#commandPanel").hide();
                    $("#manageCommandPanel").show();
                }
            };
            GameController.prototype.returnFromManage = function () {
                this.manageMode = false;
                //$(window).off("click", this.handleClickEvent);
                this.closeAssetManagementWindow();
                this.scene.activeCamera = this.gameCamera;
                this.gameService.returnFromManage();
                this.drawingService.returnFromManage(this.scene);
                //var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
                //this.manageCamera.detachControl(canvas);            
                this.setAvailableActions();
                this.actionButtonsVisible = false;
                this.toggleManageCommandPanel(true);
                // show command panel in the next event loop iteration to avoid its mouse event handler to process this event by highlighting one of its buttons
                this.timeoutService(function () {
                    $("#commandPanel").show();
                });
            };
            GameController.prototype.endTurn = function () {
                if (this.gameService.canEndTurn) {
                    this.gameService.endTurn();
                    this.gameService.saveGame();
                    var that = this;
                    this.showMessage(this.currentPlayer + " is starting his turn.");
                    this.timeoutService(function () {
                        that.scope.$apply(function () {
                            that.setAvailableActions();
                        });
                    });
                    $.when(this.drawingService.returnCameraToMainPosition(this.scene, this.gameCamera, this.gameService.getCurrentPlayerPosition().index)).done(function () {
                        if (that.gameService.isComputerMove) {
                            var computerActions = $.Deferred();
                            that.processComputerActions(computerActions);
                            $.when(computerActions).done(function () {
                                that.updatePlayersForView();
                                that.timeoutService(function () {
                                    that.setupThrowDice();
                                }, 700);
                            });
                        }
                    });
                }
            };
            GameController.prototype.pause = function () {
                this.gameService.saveGame();
                this.stateService.go("pause");
            };
            GameController.prototype.closeAssetManagementWindow = function () {
                $("#assetManagement").hide();
                this.toggleManageCommandPanel();
            };
            GameController.prototype.executeConfirmAction = function (data) {
                this.confirmButtonCallback(data);
            };
            GameController.prototype.executeCancelAction = function (data) {
                this.cancelButtonCallback(data);
            };
            GameController.prototype.showMessageForEvent = function (processingEvent) {
                if (processingEvent === Model.ProcessingEvent.None) {
                    return;
                }
                else if (processingEvent === Model.ProcessingEvent.PassGoAward) {
                    this.showMessage(this.gameService.getCurrentPlayer() + " passed GO and received M200.");
                }
            };
            GameController.prototype.toggleMortgageConfirm = function () {
                if (this.gameService.canMortgage(this.assetToManage)) {
                    var that = this;
                    if (!this.assetToManage.mortgage) {
                        $("#mortgageConfirmText").text("Do you wish to mortgage " + this.assetToManage.name + " for M" + this.assetToManage.valueMortgage + "?");
                    }
                    else {
                        $("#mortgageConfirmText").text("Do you wish to pay off mortgage " + this.assetToManage.name + " for M" + (Math.floor(this.assetToManage.valueMortgage * 1.1)) + "?");
                    }
                    $("#mortgageConfirmDialog").dialog({
                        autoOpen: true,
                        dialogClass: "no-close",
                        width: 300,
                        buttons: [
                            {
                                text: "Yes",
                                click: function () {
                                    $(this).dialog("close");
                                    if (!that.toggleMortgageAsset(that.assetToManage)) {
                                        that.showConfirmationPopup("Sorry, you do not have enough money!");
                                    }
                                    that.scope.$apply(function () {
                                        that.updatePlayersForView();
                                    });
                                }
                            },
                            {
                                text: "No",
                                click: function () {
                                    $(this).dialog("close");
                                }
                            }
                        ]
                    });
                }
            };
            GameController.prototype.toggleMortgageAsset = function (asset) {
                var success = this.gameService.toggleMortgageAsset(asset);
                if (success) {
                    var viewBoardField = this.boardFields.filter(function (boardField) { return boardField.assetName && boardField.assetName === asset.name; })[0];
                    this.drawingService.setBoardFieldMortgage(viewBoardField, asset, this.scene);
                    if (asset.mortgage) {
                        this.showMessage(this.currentPlayer + " mortgaged " + asset.name + ".");
                    }
                    else {
                        this.showMessage(this.currentPlayer + " released mortgage on " + asset.name + ".");
                    }
                }
                return success;
            };
            GameController.prototype.showConfirmationPopup = function (text) {
                $("#generalPopupDialog").text(text);
                $("#generalPopupDialog").dialog({
                    autoOpen: true,
                    dialogClass: "no-close",
                    width: 300,
                    buttons: [
                        {
                            text: "Ok",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    ]
                });
            };
            GameController.prototype.showActionPopup = function (text, onConfirm, onCancel) {
                $("#generalPopupDialog").text(text);
                $("#generalPopupDialog").dialog({
                    autoOpen: true,
                    dialogClass: "no-close",
                    width: 300,
                    buttons: [
                        {
                            text: "Yes",
                            click: function () {
                                $(this).dialog("close");
                                onConfirm();
                            }
                        },
                        {
                            text: "No",
                            click: function () {
                                $(this).dialog("close");
                                onCancel();
                            }
                        }
                    ]
                });
            };
            GameController.prototype.canMortgageSelected = function () {
                return this.gameService.canMortgage(this.assetToManage);
            };
            GameController.prototype.getOutOfJail = function () {
                this.gameService.getOutOfJail();
                this.showMessage(this.currentPlayer + " paid " + this.gameService.gameParams.jailBail + " to bail out of jail.");
                this.setAvailableActions();
                if (this.gameService.lastDiceResult) {
                    this.movePlayer();
                }
            };
            GameController.prototype.surrender = function () {
                var that = this;
                if (this.gameService.canSurrender) {
                    this.showActionPopup("Are you sure you wish to surrender?", function () {
                        that.doSurrender();
                    }, function () { });
                }
            };
            GameController.prototype.doSurrender = function () {
                if (this.gameService.canSurrender) {
                    this.gameService.surrender();
                    this.showMessage(this.currentPlayer + " has surrendered!");
                    this.setAvailableActions();
                    if (this.gameService.gameState === Model.GameState.EndOfGame) {
                        this.showConfirmationPopup(this.gameService.winner + " has won the game!");
                    }
                }
            };
            GameController.prototype.createScene = function () {
                var canvas = document.getElementById("renderCanvas");
                var engine = new BABYLON.Engine(canvas, true);
                var d = this.createBoard(engine, canvas);
                //BABYLON.Scene.MaxDeltaTime = 30.0;
                var that = this;
                engine.runRenderLoop(function () {
                    if (that.gameService.gameState === Model.GameState.Move || that.gameService.gameState === Model.GameState.Process) {
                        that.scene.render();
                    }
                    else {
                        // not sure why, but the input handlers starve unless the render loop is re-inserted in the queue using a timeout service
                        that.timeoutService(function () {
                            if (that.gameService.gameState === Model.GameState.ThrowDice && that.diceThrowCompleted) {
                                // if the game is at the dice throw state and the dice throw has been triggered, verify if it is done, otherwise just follow with the camera
                                if (that.drawingService.isDiceAtRestAfterThrowing(that.scene)) {
                                    that.diceThrowCompleted.resolve();
                                }
                                else {
                                    var dicePhysicsLocation = that.drawingService.getDiceLocation(that.scene);
                                    if (dicePhysicsLocation) {
                                        that.resetOverboardDice(dicePhysicsLocation);
                                        that.gameCamera.setTarget(new BABYLON.Vector3(dicePhysicsLocation.x, dicePhysicsLocation.y, dicePhysicsLocation.z));
                                    }
                                }
                            }
                            that.scene.render();
                        }, 1, false);
                    }
                });
                window.addEventListener("resize", function () {
                    engine.resize();
                });
                // Watch for browser/canvas resize events
                window.addEventListener("resize", function () {
                    engine.resize();
                });
                return d;
            };
            GameController.prototype.createBoard = function (engine, canvas) {
                var d = $.Deferred();
                // This creates a basic Babylon Scene object (non-mesh)
                this.scene = new BABYLON.Scene(engine);
                this.scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
                this.scene.setGravity(new BABYLON.Vector3(0, -10, 0));
                // This creates and positions a free camera (non-mesh)
                this.gameCamera = new BABYLON.FreeCamera("camera1", BABYLON.Vector3.Zero(), this.scene);
                this.drawingService.setGameCameraInitialPosition(this.gameCamera);
                this.manageCamera = new BABYLON.ArcRotateCamera("camera2", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
                this.scene.activeCamera = this.gameCamera;
                // This attaches the camera to the canvas
                //this.gameCamera.attachControl(canvas, true);
                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
                // default intensity is 1
                light.intensity = 1;
                this.drawingService.createBoard(this.scene);
                this.initPlayers();
                var meshLoads = this.drawingService.loadMeshes(this.players, this.scene, this);
                var that = this;
                $.when.apply($, meshLoads).done(function () {
                    that.setupPlayerPositions(that);
                    that.setupBoardFields();
                    d.resolve();
                });
                return d;
            };
            GameController.prototype.initPlayers = function () {
                var _this = this;
                this.players = [];
                var that = this;
                var index = 0;
                this.gameService.players.forEach(function (player) {
                    var playerModel = new MonopolyApp.Viewmodels.Player();
                    playerModel.name = player.playerName;
                    playerModel.money = player.money;
                    playerModel.index = index;
                    playerModel.color = _this.getColor(player.color);
                    that.playerModels.push(playerModel);
                    index++;
                });
            };
            GameController.prototype.getColor = function (playerColor) {
                if (playerColor === Model.PlayerColor.Blue) {
                    return "#4C4CFF";
                }
                else if (playerColor === Model.PlayerColor.Red) {
                    return "#FF4C4C";
                }
                else if (playerColor === Model.PlayerColor.Green) {
                    return "#4CFF4C";
                }
                else if (playerColor === Model.PlayerColor.Yellow) {
                    return "#FFFF4C";
                }
                return "#000000";
            };
            GameController.prototype.setupBoardFields = function () {
                var _this = this;
                this.boardFields = [];
                for (var i = 0; i < 40; i++) {
                    var boardField = new MonopolyApp.Viewmodels.BoardField();
                    boardField.index = i;
                    this.boardFields.push(boardField);
                }
                for (var assetGroup = Model.AssetGroup.First; assetGroup <= Model.AssetGroup.Railway; assetGroup++) {
                    var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                    groupBoardFields.forEach(function (groupBoardField) {
                        var viewBoardField = _this.boardFields.filter(function (f) { return f.index === groupBoardField.index; })[0];
                        viewBoardField.assetName = groupBoardField.asset.name;
                        if (!groupBoardField.asset.unowned) {
                            _this.drawingService.setBoardFieldOwner(viewBoardField, groupBoardField.asset, _this.scene);
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
                this.availableActions.endTurn = !this.gameService.isComputerMove && this.gameService.canEndTurn;
                this.availableActions.throwDice = !this.gameService.isComputerMove && this.gameService.canThrowDice;
                this.availableActions.buy = !this.gameService.isComputerMove && this.gameService.canBuy;
                this.availableActions.manage = !this.gameService.isComputerMove && this.gameService.canManage;
                this.availableActions.getOutOfJail = !this.gameService.isComputerMove && this.gameService.canGetOutOfJail;
                this.availableActions.surrender = !this.gameService.isComputerMove && this.gameService.canSurrender;
                this.availableActions.pause = !this.gameService.isComputerMove && this.gameService.canPause;
            };
            GameController.prototype.animateMove = function (oldPosition, newPosition, fast, backwards) {
                var _this = this;
                var playerModel = this.players.filter(function (p) { return p.name === _this.gameService.getCurrentPlayer(); })[0];
                return this.drawingService.animatePlayerMove(oldPosition, newPosition, playerModel, this.scene, fast, backwards);
            };
            GameController.prototype.processDestinationField = function () {
                var d = $.Deferred();
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Asset) {
                    $.when(this.processAssetField(this.gameService.getCurrentPlayerPosition())).done(function () { d.resolve(); });
                }
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Treasure || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Event) {
                    $.when(this.processCardField(this.gameService.getCurrentPlayerPosition())).done(function () {
                        d.resolve();
                    });
                }
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Tax || this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.TaxIncome) {
                    $.when(this.processTaxField(this.gameService.getCurrentPlayerPosition().type)).done(function () {
                        d.resolve();
                    });
                }
                if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.GoToPrison) {
                    $.when(this.processGoToPrisonField()).done(function () {
                        d.resolve();
                    });
                }
                else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.PrisonAndVisit) {
                    this.processPrisonField();
                    d.resolve();
                }
                else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.FreeParking) {
                    d.resolve();
                }
                else if (this.gameService.getCurrentPlayerPosition().type === Model.BoardFieldType.Start) {
                    d.resolve();
                }
                return d;
            };
            GameController.prototype.processAssetField = function (position) {
                var d = $.Deferred();
                this.assetToBuy = this.gameService.getCurrentPlayerPosition().asset;
                if (!position.asset.unowned && position.asset.owner !== this.gameService.getCurrentPlayer()) {
                    var result = this.gameService.processOwnedFieldVisit();
                    if (result.message) {
                        this.showMessage(result.message);
                        if (this.gameService.isComputerMove) {
                            // give other players time to catch up with computer's actions
                            this.timeoutService(function () {
                                d.resolve();
                            }, 3000);
                        }
                        else {
                            d.resolve();
                        }
                    }
                    else {
                        d.resolve();
                    }
                    this.updatePlayersForView();
                }
                else {
                    d.resolve();
                }
                return d;
            };
            GameController.prototype.showMessage = function (message) {
                $("#messageOverlay").stop();
                $("#messageOverlay").css({ opacity: 1, top: 0 });
                var overlayOffset = Math.floor(jQuery(window).height() * 0.15);
                $("#messageOverlay").html(message).show().animate({
                    top: "-=" + overlayOffset + "px",
                    opacity: 0
                }, 5000, function () {
                    $("#messageOverlay").hide();
                    $("#messageOverlay").css({ opacity: 1, top: 0 });
                });
                this.messages.push(message);
                this.refreshMessageHistory();
            };
            GameController.prototype.handleSwipe = function (left) {
                if (this.manageMode) {
                    this.focusedAssetGroupIndex = this.gameService.manageFocusChange(left);
                    this.setupManageHighlight();
                }
            };
            GameController.prototype.setupManageHighlight = function () {
                this.drawingService.setManageCameraPosition(this.manageCamera, this.focusedAssetGroupIndex, this.scene);
                if (this.gameService.hasMonopoly(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex)) {
                    this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
                }
            };
            GameController.prototype.handleClickEvent = function (eventObject) {
                var data = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    data[_i - 1] = arguments[_i];
                }
                var thisInstance = eventObject.data;
                var mouseEventObject;
                if (thisInstance.tutorialService.isActive && thisInstance.tutorialService.canAdvanceByClick && $("#tutorialMessage:visible").length > 0) {
                    thisInstance.scope.$apply(function () {
                        thisInstance.tutorialService.advanceToNextStep();
                    });
                    return;
                }
                if (thisInstance.manageMode && !thisInstance.swipeInProgress) {
                    mouseEventObject = eventObject.originalEvent;
                    var pickedObject = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                    if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.BoardField) {
                        var groupFields = thisInstance.gameService.getBoardFieldsInGroup(thisInstance.focusedAssetGroupIndex);
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
                if (thisInstance.gameService.gameState === Model.GameState.ThrowDice && !thisInstance.swipeInProgress && !thisInstance.gameService.isComputerMove) {
                    mouseEventObject = eventObject.originalEvent;
                    var pickedObject2 = thisInstance.drawingService.pickBoardElement(thisInstance.scene, mouseEventObject && mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0 ? { x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY } : undefined);
                    if (pickedObject2 && pickedObject2.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.Dice) {
                        thisInstance.throwDice(pickedObject2.pickedPoint);
                    }
                }
            };
            GameController.prototype.manageField = function (asset) {
                this.assetToManage = asset;
                this.toggleManageCommandPanel();
                $("#assetManagement").show();
            };
            GameController.prototype.toggleManageCommandPanel = function (hide) {
                if (hide) {
                    $("#manageCommandPanel").hide();
                    return;
                }
                $("#manageCommandPanel").toggle();
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
                    this.drawingService.showHouseButtons(0, this.scene, this.gameService.getAssetGroup(position));
                }
            };
            GameController.prototype.removeHousePreview = function (position) {
                if (this.gameService.removeHousePreview(this.gameService.getCurrentPlayer(), position)) {
                    this.setupActionButtonsForHousePreview(position);
                    this.drawingService.showHouseButtons(0, this.scene, this.gameService.getAssetGroup(position));
                }
            };
            GameController.prototype.setupActionButtonsForHousePreview = function (position) {
                var assetGroup = this.gameService.getBoardFieldGroup(position);
                var groupBoardFields = this.gameService.getGroupBoardFields(assetGroup);
                var hasUncommittedUpgrades = false;
                groupBoardFields.forEach(function (field) {
                    hasUncommittedUpgrades = hasUncommittedUpgrades || field.asset.hasUncommittedUpgrades();
                });
                this.refreshBoardFieldGroupHouses(0, assetGroup);
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
            GameController.prototype.refreshBoardFieldGroupHouses = function (focusedAssetGroupIndex, assetGroup) {
                var fields;
                if (!assetGroup) {
                    var firstFocusedBoardField = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
                    fields = this.gameService.getGroupBoardFields(firstFocusedBoardField.asset.group);
                }
                else {
                    fields = this.gameService.getGroupBoardFields(assetGroup);
                }
                var fieldIndexes = $.map(fields, function (f) { return f.index; });
                var viewGroupBoardFields = this.boardFields.filter(function (viewBoardField) { return $.inArray(viewBoardField.index, fieldIndexes) >= 0; });
                var that = this;
                viewGroupBoardFields.forEach(function (f) {
                    var asset = fields.filter(function (field) { return f.index === field.index; })[0].asset;
                    that.drawingService.setBoardFieldHouses(f, asset.houses, asset.hotel, asset.uncommittedHouses, asset.uncommittedHotel, that.scene);
                });
            };
            GameController.prototype.commitHouses = function (data) {
                this.gameService.commitHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
                this.actionButtonsVisible = false;
                this.refreshBoardFieldGroupHouses(this.focusedAssetGroupIndex);
                this.updatePlayersForView();
                this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
            };
            GameController.prototype.rollbackHouses = function (data) {
                this.gameService.rollbackHouseOrHotel(this.gameService.getCurrentPlayer(), this.focusedAssetGroupIndex);
                this.actionButtonsVisible = false;
                this.refreshBoardFieldGroupHouses(this.focusedAssetGroupIndex);
                this.updatePlayersForView();
                this.drawingService.showHouseButtons(this.focusedAssetGroupIndex, this.scene);
            };
            GameController.prototype.updatePlayersForView = function () {
                var that = this;
                this.gameService.players.forEach(function (p) {
                    var viewPlayer = that.playerModels.filter(function (model) { return model.name === p.playerName; })[0];
                    viewPlayer.money = p.money;
                });
            };
            GameController.prototype.processCardField = function (position) {
                var _this = this;
                var d = $.Deferred();
                var card;
                if (position.type === Model.BoardFieldType.Treasure) {
                    card = this.gameService.getNextTreasureCard();
                }
                else {
                    card = this.gameService.getNextEventCard();
                }
                var that = this;
                $.when(this.showCard(card, position.type === Model.BoardFieldType.Treasure ? "COMMUNITY CHEST" : "EVENT")).done(function () {
                    that.gameService.processCard(card);
                    that.showMessage(that.getMessageForCard(card, position));
                    var addAction = $.Deferred();
                    if (card.cardType === Model.CardType.AdvanceToField) {
                        $.when(that.movePlayer(card.boardFieldIndex)).done(function () {
                            addAction.resolve();
                        });
                    }
                    else if (card.cardType === Model.CardType.AdvanceToRailway) {
                        var nextRailwayIndex = position.index >= 35 ? 5 : (position.index >= 25 ? 35 : (position.index >= 15 ? 25 : (position.index >= 5 ? 15 : 5)));
                        $.when(that.movePlayer(nextRailwayIndex, false, true)).done(function () {
                            addAction.resolve();
                        });
                    }
                    else if (card.cardType === Model.CardType.RetractNumFields) {
                        var newPositionIndex = that.gameService.getCurrentPlayerPosition().index - card.boardFieldCount;
                        if (newPositionIndex < 0) {
                            newPositionIndex = 40 + newPositionIndex;
                        }
                        $.when(that.movePlayer(newPositionIndex, true)).done(function () {
                            addAction.resolve();
                        });
                    }
                    else if (card.cardType === Model.CardType.JumpToField) {
                        if (card.boardFieldIndex === 10) {
                            _this.processGoToPrisonField();
                            addAction.resolve();
                        }
                    }
                    else {
                        addAction.resolve();
                    }
                    $.when(addAction).done(function () {
                        d.resolve();
                        that.timeoutService(function () {
                            that.scope.$apply(function () {
                                that.updatePlayersForView();
                            });
                        });
                    });
                });
                return d;
            };
            GameController.prototype.processTaxField = function (boardFieldType) {
                var d = $.Deferred();
                var paid = this.gameService.processTax(boardFieldType);
                this.updatePlayersForView();
                this.showMessage(this.currentPlayer + " paid M" + paid + " of income tax.");
                if (this.gameService.isComputerMove) {
                    // give time to other players to catch up with computer's actions
                    this.timeoutService(function () {
                        d.resolve();
                    }, 3000);
                }
                else {
                    d.resolve();
                }
                return d;
            };
            GameController.prototype.processGoToPrisonField = function () {
                var _this = this;
                var d = $.Deferred();
                var newPosition = this.gameService.moveCurrentPlayer(10);
                var playerModel = this.players.filter(function (p) { return p.name === _this.gameService.getCurrentPlayer(); })[0];
                var moveToPrison = this.drawingService.animatePlayerPrisonMove(newPosition, playerModel, this.scene, this.gameCamera);
                var that = this;
                $.when(moveToPrison).done(function () {
                    that.showMessage(that.currentPlayer + " landed in prison.");
                    that.gameService.processPrison(true);
                    if (that.gameService.isComputerMove) {
                        // give time to other players to catch up with computer's actions
                        that.timeoutService(function () {
                            d.resolve();
                        }, 3000);
                    }
                    else {
                        d.resolve();
                    }
                });
                return d;
            };
            GameController.prototype.processPrisonField = function () {
                if (this.gameService.processPrison(false)) {
                    this.showMessage(this.currentPlayer + " remains in prison.");
                }
            };
            GameController.prototype.showCard = function (card, title) {
                var _this = this;
                var d = $.Deferred();
                this.currentCard.title = title;
                this.currentCard.message = card.message;
                $("#card").show("fold", { size: "30%" }, 800, function () {
                    _this.timeoutService(4000).then(function () {
                        $("#card").hide("fold", { size: "30%" }, 800, function () {
                            d.resolve();
                        });
                    });
                });
                return d;
            };
            GameController.prototype.getMessageForCard = function (card, position) {
                var type = position.type === Model.BoardFieldType.Treasure ? "community chest" : "event";
                if (card.cardType === Model.CardType.ReceiveMoney) {
                    return this.gameService.getCurrentPlayer() + " received M" + card.money + " from " + type + ".";
                }
                else if (card.cardType === Model.CardType.PayMoney) {
                    return this.gameService.getCurrentPlayer() + " paid M" + card.money + (position.type === Model.BoardFieldType.Treasure ? " to " : " for ") + type + ".";
                }
                else if (card.cardType === Model.CardType.AdvanceToField) {
                    return this.gameService.getCurrentPlayer() + " is advancing to " + this.getBoardFieldName(card.boardFieldIndex) + ".";
                }
                else if (card.cardType === Model.CardType.RetractNumFields) {
                    return this.gameService.getCurrentPlayer() + " is moving back " + card.boardFieldCount + " fields.";
                }
                else if (card.cardType === Model.CardType.ReceiveMoneyFromPlayers) {
                    return this.gameService.getCurrentPlayer() + " received M" + card.money + " from each player.";
                }
                else if (card.cardType === Model.CardType.PayMoneyToPlayers) {
                    return this.gameService.getCurrentPlayer() + " paid M" + card.money + " to each player.";
                }
                else if (card.cardType === Model.CardType.Maintenance || card.cardType === Model.CardType.OwnMaintenance) {
                    return this.gameService.getCurrentPlayer() + " paid M" + card.money + " for maintenance.";
                }
                else if (card.cardType === Model.CardType.AdvanceToRailway) {
                    return this.gameService.getCurrentPlayer() + " is advancing to the next railway station.";
                }
                return this.gameService.getCurrentPlayer() + " landed on " + type + ".";
            };
            GameController.prototype.getBoardFieldName = function (boardFieldIndex) {
                if (boardFieldIndex === 0) {
                    return "GO";
                }
                var group = this.gameService.getBoardFieldGroup(boardFieldIndex);
                if (group) {
                    var fields = this.gameService.getGroupBoardFields(group);
                    if (fields && fields.length > 0) {
                        var field = fields.filter(function (f) { return f.index === boardFieldIndex; })[0];
                        return field.asset.name;
                    }
                }
                return "";
            };
            GameController.prototype.highlightCommandButtons = function (coords) {
                var elem = $(document.elementFromPoint(coords.x, coords.y));
                this.unhighlightCommandButton($(".highlightedButton"));
                //$(".highlightedButton").addClass("unhighlightedButton").removeClass("highlightedButton");
                if (elem.hasClass("commandButton")) {
                    this.highlightCommandButton(elem);
                }
            };
            GameController.prototype.highlightCommandButton = function (button) {
                button.addClass("highlightedButton").removeClass("unhighlightedButton");
                button.parent().children().children(".commandButtonOverlayText").show();
            };
            GameController.prototype.unhighlightCommandButton = function (button) {
                button.addClass("unhighlightedButton").removeClass("highlightedButton");
                button.parent().children().children(".commandButtonOverlayText").hide();
            };
            GameController.prototype.bindInputEvents = function () {
                var _this = this;
                //$(window).on("click", null, this, this.handleClickEvent);
                if (window.navigator && window.navigator.pointerEnabled) {
                    //$("#renderCanvas").bind("MSPointerDown", this, this.handleClickEvent);
                    //$("#renderCanvas").bind("pointerdown", this, this.handleClickEvent);
                    $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
                    $("#tutorialMessage").bind("touchend", this, this.handleClickEvent);
                }
                else {
                    $("#renderCanvas").bind("touchend", this, this.handleClickEvent);
                    $("#tutorialMessage").bind("touchend", this, this.handleClickEvent);
                }
                this.swipeService.bind($("#renderCanvas"), {
                    'move': function (coords) { _this.swipeMove(coords); },
                    'end': function (coords, event) { _this.swipeEnd(coords, event); },
                    'cancel': function (event) { _this.swipeCancel(event); }
                });
                $("#commandPanel").mousedown(function (e) {
                    _this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
                });
                $("#commandPanel").bind("touchstart", this, function (e) {
                    var mouseEventObject = e.originalEvent;
                    if (mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0) {
                        var thisInstance = e.data;
                        thisInstance.highlightCommandButtons({ x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY });
                    }
                });
                $("#manageCommandPanel").mousedown(function (e) {
                    _this.highlightCommandButtons({ x: e.clientX, y: e.clientY });
                });
                $("#manageCommandPanel").bind("touchstart", this, function (e) {
                    var mouseEventObject = e.originalEvent;
                    if (mouseEventObject.changedTouches && mouseEventObject.changedTouches.length > 0) {
                        var thisInstance = e.data;
                        thisInstance.highlightCommandButtons({ x: mouseEventObject.changedTouches[0].clientX, y: mouseEventObject.changedTouches[0].clientY });
                    }
                });
                $("#commandPanel").mouseup(function (e) {
                    if (!_this.swipeInProgress) {
                        _this.unhighlightCommandButton($(".commandButton"));
                    }
                });
                $("#manageCommandPanel").mouseup(function (e) {
                    if (!_this.swipeInProgress) {
                        _this.unhighlightCommandButton($("#buttonReturnFromManage"));
                    }
                });
                this.swipeService.bind($("#commandPanel"), {
                    'move': function (coords) {
                        if (!_this.manageMode) {
                            _this.swipeInProgress = true;
                            _this.highlightCommandButtons(coords);
                        }
                    },
                    'end': function (coords, event) {
                        if (!_this.manageMode) {
                            if (!_this.swipeInProgress) {
                                return;
                            }
                            var elem = $(document.elementFromPoint(coords.x, coords.y));
                            if (elem.hasClass("commandButton")) {
                                _this.unhighlightCommandButton(elem);
                                //elem.addClass("unhighlightedButton").removeClass("highlightedButton");
                                elem.click();
                            }
                            _this.timeoutService(function () { return _this.swipeInProgress = false; }, 100, false);
                        }
                    },
                    'cancel': function (event) {
                        if (!_this.manageMode) {
                            _this.swipeInProgress = false;
                        }
                    }
                });
            };
            GameController.prototype.resetOverboardDice = function (diceLocation) {
                if (diceLocation.y < (this.drawingService.diceHeight / 2) * 0.8) {
                    diceLocation.y = (this.drawingService.diceHeight / 2) * 2;
                    diceLocation.x = 0;
                    diceLocation.z = 0;
                    this.drawingService.moveDiceToPosition(diceLocation, this.scene);
                }
            };
            GameController.prototype.refreshMessageHistory = function () {
                $("#messageHistory").empty();
                var lastMessages = this.messages.length > 5 ? this.messages.slice(this.messages.length - 5) : this.messages;
                $.each(lastMessages, function (i, message) {
                    if (i === lastMessages.length - 1) {
                        $("#messageHistory").append("<option value='" + i + "' selected>" + message + "</option>");
                    }
                    else {
                        $("#messageHistory").append("<option value='" + i + "' disabled>" + message + "</option>");
                    }
                });
                var messageHistory = $("#messageHistory");
                messageHistory.selectmenu("refresh");
            };
            GameController.prototype.initMessageHistory = function () {
                this.messages = [];
                var messageHistory = $("#messageHistory");
                messageHistory.selectmenu();
                messageHistory.selectmenu("instance")._renderItem = function (ul, item) {
                    var li = $("<li>");
                    if (item.disabled) {
                        li.addClass("ui-state-disabled");
                    }
                    li.addClass("messageHistoryItem");
                    this._setText(li, item.label);
                    return li.appendTo(ul);
                };
                if (this.gameService.gameState === Model.GameState.BeginTurn) {
                    this.messages.push(this.currentPlayer + " is starting his turn.");
                    this.refreshMessageHistory();
                }
            };
            GameController.prototype.isBlockedByTutorial = function (action) {
                return this.tutorialService.isActive && !this.tutorialService.canExecuteAction(action);
            };
            GameController.prototype.executeTutorialCallback = function (action) {
                if (this.tutorialService.isActive) {
                    this.tutorialService.executeActionCallback(action);
                }
            };
            GameController.prototype.initTutorial = function (loadGame) {
                this.tutorialData = new Model.TutorialData();
                if (!loadGame) {
                    this.tutorial = this.settingsService.settings.tutorial;
                    var that = this;
                    this.timeoutService(function () {
                        $("#loadingBar").hide();
                        if (that.tutorial) {
                            that.scope.$apply(function () {
                                that.tutorialService.initialize(that.tutorialData);
                                that.tutorialService.advanceToNextStep();
                            });
                        }
                    }, 3000);
                }
                else {
                    this.timeoutService(function () {
                        $("#loadingBar").hide();
                    }, 3000);
                }
            };
            GameController.$inject = ["$state", "$stateParams", "$swipe", "$scope", "$timeout", "gameService", "drawingService", "aiService", "themeService", "settingsService", "tutorialService"];
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
            function MainMenuController(stateService, themeService) {
                var _this = this;
                this.startNewGame = function () {
                    _this.stateService.go("settings");
                };
                this.themeService = themeService;
                this.stateService = stateService;
                this.title = "Knight MONOPOLY";
                this.chooseGameInitialization = false;
            }
            Object.defineProperty(MainMenuController.prototype, "canLoadGame", {
                get: function () {
                    var localStorageAny = localStorage;
                    return localStorage.length > 0 && localStorageAny[Model.Game.version];
                },
                enumerable: true,
                configurable: true
            });
            MainMenuController.prototype.settings = function () {
                if (this.canLoadGame) {
                    this.chooseGameInitialization = true;
                    $("#buttonContainer").css("width", "340px");
                }
                else {
                    this.startNewGame();
                }
            };
            MainMenuController.prototype.loadGame = function () {
                this.stateService.go("newgame", { loadGame: true });
            };
            MainMenuController.prototype.goBack = function () {
                this.chooseGameInitialization = false;
                $("#buttonContainer").css("width", "575px");
            };
            MainMenuController.$inject = ["$state", "themeService"];
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
        var PauseController = (function () {
            function PauseController(stateService, stateParamsService, scope, timeoutService, themeService) {
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.themeService = themeService;
            }
            PauseController.prototype.goBack = function () {
                this.stateService.go("newgame", { loadGame: true });
            };
            PauseController.prototype.goToGameRules = function () {
                this.stateService.go("rules", { inGame: true });
            };
            PauseController.prototype.saveAndExit = function () {
                this.stateService.go("mainmenu");
            };
            PauseController.$inject = ["$state", "$stateParams", "$scope", "$timeout", "themeService"];
            return PauseController;
        })();
        controllers.PauseController = PauseController;
        monopolyApp.controller("pauseCtrl", PauseController);
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
        var RulesController = (function () {
            function RulesController(stateService, stateParamsService, scope, timeoutService, settingsService, themeService) {
                var _this = this;
                this.stateService = stateService;
                this.stateParamsService = stateParamsService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.settingsService = settingsService;
                this.themeService = themeService;
                this.loadSettings();
                var spService = this.stateParamsService;
                this.inGame = eval(spService.inGame);
                if (this.settings.rules) {
                    this.setInitialCash(this.settings.rules.initialCash);
                    this.setPassStartAward(this.settings.rules.passStartAward);
                }
                $('[id|="initialCash"]').click(function (e) {
                    _this.onButtonClick(e);
                });
                $('[id|="passStart"]').click(function (e) {
                    _this.onButtonClick(e);
                });
            }
            RulesController.prototype.goBack = function () {
                if (this.inGame) {
                    this.stateService.go("pause");
                }
                else {
                    this.saveSettings();
                    this.stateService.go("settings");
                }
            };
            RulesController.prototype.setInitialCash = function (cash) {
                this.settings.rules.initialCash = cash;
                $('[id|="initialCash"]').removeClass("btn-primary").addClass("btn-default");
                if (cash === 1000) {
                    $("#initialCash-1000").removeClass("btn-default").addClass("btn-primary");
                }
                if (cash === 1500) {
                    $("#initialCash-1500").removeClass("btn-default").addClass("btn-primary");
                }
                if (cash === 2000) {
                    $("#initialCash-2000").removeClass("btn-default").addClass("btn-primary");
                }
            };
            RulesController.prototype.setPassStartAward = function (award) {
                this.settings.rules.passStartAward = award;
                $('[id|="passStart"]').removeClass("btn-primary").addClass("btn-default");
                if (award === 0) {
                    $("#passStart-0").removeClass("btn-default").addClass("btn-primary");
                }
                if (award === 100) {
                    $("#passStart-100").removeClass("btn-default").addClass("btn-primary");
                }
                if (award === 200) {
                    $("#passStart-200").removeClass("btn-default").addClass("btn-primary");
                }
                if (award === 300) {
                    $("#passStart-300").removeClass("btn-default").addClass("btn-primary");
                }
            };
            RulesController.prototype.loadSettings = function () {
                this.settings = this.settingsService.loadSettings();
            };
            RulesController.prototype.saveSettings = function () {
                this.settingsService.saveSettings(this.settings);
            };
            RulesController.prototype.onButtonClick = function (jQueryEventObject) {
                var target = $(jQueryEventObject.currentTarget);
                var targetId = target.attr("id");
                var idTokens = targetId.split("-");
                var targetValue = idTokens[1];
                var targetRule = idTokens[0];
                if (targetRule === "initialCash") {
                    this.setInitialCash(parseInt(targetValue));
                }
                if (targetRule === "passStart") {
                    this.setPassStartAward(parseInt(targetValue));
                }
            };
            RulesController.$inject = ["$state", "$stateParams", "$scope", "$timeout", "settingsService", "themeService"];
            return RulesController;
        })();
        controllers.RulesController = RulesController;
        monopolyApp.controller("rulesCtrl", RulesController);
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
            function SettingsController(stateService, scope, timeoutService, settingsService, themeService) {
                this.stateService = stateService;
                this.scope = scope;
                this.timeoutService = timeoutService;
                this.settingsService = settingsService;
                this.themeService = themeService;
                this.loadSettings();
                var that = this;
                $("#numPlayersSlider").slider({
                    value: this.settings.numPlayers,
                    min: 2,
                    max: 4,
                    step: 1,
                    slide: function (event, ui) {
                        $("#numPlayers").val(ui.value);
                        that.adjustNumPlayers(ui.value);
                    }
                });
                that.timeoutService(function () {
                    var playerTypeToggle = $('[id|="playerType"]');
                    playerTypeToggle.bootstrapToggle({
                        on: "Human",
                        off: "Computer"
                    });
                    playerTypeToggle.on("change", function (event) {
                        var toggle = $(event.currentTarget);
                        that.scope.$apply(function () {
                            var i = parseInt(toggle.attr("id").substr(11));
                            that.settings.players[i].human = toggle.prop("checked") === true;
                            that.reassignComputerNames();
                        });
                    });
                }, 1);
            }
            SettingsController.prototype.saveAndClose = function () {
                this.saveSettings();
                this.stateService.go("newgame", { loadGame: false });
            };
            SettingsController.prototype.goToGameRules = function () {
                this.stateService.go("rules", { inGame: false });
            };
            SettingsController.prototype.goBack = function () {
                this.stateService.go("mainmenu");
            };
            SettingsController.prototype.loadSettings = function () {
                this.settings = this.settingsService.loadSettings();
            };
            SettingsController.prototype.saveSettings = function () {
                this.settingsService.saveSettings(this.settings);
            };
            SettingsController.prototype.adjustNumPlayers = function (numPlayers) {
                var that = this;
                this.scope.$apply(function () {
                    while (numPlayers < that.settings.numPlayers) {
                        var playerTypeToggle = $("#playerType-" + (that.settings.players.length - 1));
                        playerTypeToggle.off();
                        playerTypeToggle.bootstrapToggle('destroy');
                        that.settings.players.pop();
                        that.settings.numPlayers--;
                    }
                    while (numPlayers > that.settings.numPlayers) {
                        var numComputers = that.settings.players.filter(function (p) { return !p.human; }).length;
                        that.settings.players.push(new Model.Player("Computer " + (numComputers + 1), false));
                        that.settings.numPlayers++;
                        that.reassignComputerNames();
                        that.timeoutService(function () {
                            var playerTypeToggle = $("#playerType-" + (that.settings.players.length - 1));
                            playerTypeToggle.bootstrapToggle({
                                on: "Human",
                                off: "Computer"
                            });
                            playerTypeToggle.on("change", function () {
                                that.scope.$apply(function () {
                                    var i = parseInt(playerTypeToggle.attr("id").substr(11));
                                    that.settings.players[i].human = playerTypeToggle.prop("checked") === true;
                                    that.reassignComputerNames();
                                });
                            });
                        }, 1);
                    }
                });
            };
            SettingsController.prototype.reassignComputerNames = function () {
                var i = 1;
                this.settings.players.forEach(function (p) {
                    if (!p.human) {
                        p.playerName = "Computer " + i;
                        i++;
                    }
                });
            };
            SettingsController.$inject = ["$state", "$scope", "$timeout", "settingsService", "themeService"];
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
        var Card = (function () {
            function Card() {
            }
            return Card;
        })();
        Viewmodels.Card = Card;
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
            PickedObjectType[PickedObjectType["Dice"] = 4] = "Dice";
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