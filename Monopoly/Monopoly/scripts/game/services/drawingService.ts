/// <reference path="../interfaces/serviceInterfaces.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../monopolyApp/modules/monopolyApp.ts" />
module Services {
    export class DrawingService implements Interfaces.IDrawingService {
        httpService: ng.IHttpService;
        gameService: Interfaces.IGameService;
        private boardFieldsInQuadrant: number = 11;
        private quadrantStartingCoordinate: MonopolyApp.Viewmodels.Coordinate[]; // top left corners of the individual board quadrants
        private boardGroupLeftCoordinate: MonopolyApp.Viewmodels.Coordinate[]; // top left corners of the individual board groupa
        private boardGroupRightCoordinate: MonopolyApp.Viewmodels.Coordinate[]; // top right corners of the individual board groupa
        private boardFieldWidth: number;
        private boardFieldHeight: number;
        private boardFieldEdgeWidth: number;
        private highlightMeshes: BABYLON.Mesh[];
        private highlightLight: BABYLON.SpotLight;
        private groundMeshName = "board";

        static $inject = ["$http", "gameService"];
        constructor($http: ng.IHttpService, gameService: Interfaces.IGameService) {
            this.httpService = $http;
            this.gameService = gameService;
            this.boardFieldWidth = this.boardSize / (this.boardFieldsInQuadrant + 2); // assuming the corner fields are double the width of the rest of the fields
            this.boardFieldHeight = this.boardFieldWidth * 2;
            this.boardFieldEdgeWidth = this.boardFieldWidth * 2;
            this.initQuadrantStartingCoordinates();            
        }

        /// board dimenzion in both, X and Z directions
        get boardSize(): number {
            return 10;
        }

        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player) {
            var player = this.gameService.players.filter((player, index) => { return player.playerName === playerModel.name; })[0];
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
        }

        animatePlayerMove(oldPositionIndex: Model.BoardField, newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player) {
            this.positionPlayer(playerModel);
        }

        setGameCameraPosition(camera: BABYLON.FreeCamera) {
            camera.position.x = 0;
            camera.position.y = 5;
            camera.position.z = -10;
            camera.setTarget(BABYLON.Vector3.Zero());
        }

        setManageCameraPosition(camera: BABYLON.ArcRotateCamera, group: Model.AssetGroup, scene: BABYLON.Scene) {
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

            this.highlightGroupFields(group, groupQuadrant, centerVector, scene);
        }

        returnFromManage(scene: BABYLON.Scene) {
            this.cleanupHighlights(scene);
        }

        pickBoardElement(scene: BABYLON.Scene): number {
            var pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.hit) {
                if (pickResult.pickedMesh && pickResult.pickedMesh.name === this.groundMeshName) {
                    return this.getBoardElementAt(pickResult.pickedPoint);
                }
            }
            return undefined;
        }

        createBoard(scene: BABYLON.Scene) {
            var board = BABYLON.Mesh.CreateGround(this.groundMeshName, this.boardSize, this.boardSize, 2, scene);
            var boardMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            boardMaterial.emissiveTexture = new BABYLON.Texture("images/Gameboard.png", scene);
            boardMaterial.diffuseTexture = new BABYLON.Texture("images/Gameboard.png", scene);
            board.material = boardMaterial;
        }

        setBoardFieldOwner(boardField: MonopolyApp.Viewmodels.BoardField, asset: Model.Asset, scene: BABYLON.Scene) {
            if (boardField.ownerMesh) {
                scene.removeMesh(boardField.ownerMesh);
                boardField.ownerMesh.dispose();
            }

            var fieldQuadrant = Math.floor(boardField.index / (this.boardFieldsInQuadrant - 1));
            var playerColor = this.gameService.players.filter(p => p.playerName === this.gameService.getCurrentPlayer())[0].color;
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
            } else if (fieldQuadrant === 2) {
                boardField.ownerMesh.rotation.y = Math.PI;
            } else if (fieldQuadrant === 3) {
                boardField.ownerMesh.rotation.y = Math.PI * 3 / 2;
            }
        }

        private initQuadrantStartingCoordinates() {
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
        }

        private getQuadrantRunningCoordinate(quadrantIndex: number): string {
            if (quadrantIndex === 0) {
                return "x";
            } else if (quadrantIndex === 1) {
                return "z";
            } else if (quadrantIndex === 2) {
                return "x";
            } else {
                return "z";
            }
        }

        private getQuadrantRunningDirection(quadrantIndex: number): number {
            if (quadrantIndex === 0) {
                return -1;
            } else if (quadrantIndex === 1) {
                return 1;
            } else if (quadrantIndex === 2) {
                return 1;
            } else {
                return -1;
            }
        }

        private initBoardGroupCoordinates() {
            this.boardGroupLeftCoordinate = [];
            this.boardGroupRightCoordinate = [];

            var group: Model.AssetGroup;
            for (group = Model.AssetGroup.First; group <= Model.AssetGroup.Eighth; group++) {
                var groupBoardFields = this.gameService.getGroupBoardFields(group);
                var groupBoardPositions = $.map(groupBoardFields, (f, i) => f.index);
                var position = Math.max.apply(this, groupBoardPositions);
                var leftCoordinate = this.getPositionCoordinate(position);
                position = Math.min.apply(this, groupBoardPositions);
                var rightCoordinate = this.getPositionCoordinate(position);
                this.boardGroupLeftCoordinate[group] = leftCoordinate;
                this.boardGroupRightCoordinate[group] = rightCoordinate;
            }
        }

        // returns the coordinate of top center of the board field with a given index
        private getPositionCoordinate(position: number, returnTopLeftCorner?: boolean): MonopolyApp.Viewmodels.Coordinate {
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
        }

        private highlightGroupFields(assetGroup: Model.AssetGroup, groupQuadrantIndex: number, groupCenter: BABYLON.Vector3, scene: BABYLON.Scene) {
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
            var groupBoardPositions = $.map(groupBoardFields, (f, i) => f.index);
            var highlightBoxWidth = 0.03;
            var cornerLength = 0.05;
            var that = this;
            groupBoardPositions.forEach(position => {
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
                } else if (groupQuadrantIndex === 2) {
                    extruded.rotation.y = Math.PI;
                } else if (groupQuadrantIndex === 3) {
                    extruded.rotation.y = Math.PI*3/2;
                }

                var topLeft = this.getPositionCoordinate(position, true);
                extruded.position.x = topLeft.x;
                extruded.position.z = topLeft.z;
                extruded.material = mat;
                meshes.push(extruded);
            });

            this.highlightMeshes = meshes;
        }

        private cleanupHighlights(scene: BABYLON.Scene) {
            if (this.highlightMeshes) {
                this.highlightMeshes.forEach(mesh => {
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
        }

        private getBoardElementAt(pickedPoint: BABYLON.Vector3): number {
            var boardFieldIndex: number;
            this.quadrantStartingCoordinate.forEach((quadrant, index) => {
                var topRightCorner = quadrant[this.getQuadrantRunningCoordinate(index)] + this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index) * -1;
                var topLeftCorner = topRightCorner + (this.boardSize - this.boardFieldEdgeWidth) * this.getQuadrantRunningDirection(index);
                var heightCoordinate = this.getQuadrantRunningCoordinate(index) === "x" ? "z" : "x";
                var heightDirection = index === 0 || index === 1 ? -1 : 1;
                if (pickedPoint[this.getQuadrantRunningCoordinate(index)] < topRightCorner && pickedPoint[this.getQuadrantRunningCoordinate(index)] > topLeftCorner &&
                    pickedPoint[heightCoordinate] < quadrant[heightCoordinate] && pickedPoint[heightCoordinate] > quadrant[heightCoordinate] + this.boardFieldHeight * heightDirection) {
                    var quadrantOffset = pickedPoint[this.getQuadrantRunningCoordinate(index)] > topRightCorner + this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index) ? 0 :
                        Math.ceil(Math.abs((pickedPoint[this.getQuadrantRunningCoordinate(index)] - (topRightCorner + this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index))) / this.boardFieldWidth));
                    boardFieldIndex = index * (this.boardFieldsInQuadrant - 1) + quadrantOffset;
                }
            }, this);
            return boardFieldIndex;
        }

        private getColor(playerColor: Model.PlayerColor, diffuse: boolean): BABYLON.Color3 {
            if (playerColor === Model.PlayerColor.Blue) {
                return diffuse ? new BABYLON.Color3(0.3, 0.3, 1) : new BABYLON.Color3(0.1, 0, 0.7);
            } else if (playerColor === Model.PlayerColor.Red) {
                return diffuse ? new BABYLON.Color3(1, 0.3, 0.3) : new BABYLON.Color3(0.7, 0, 0.1);
            } else if (playerColor === Model.PlayerColor.Green) {
                return diffuse ? new BABYLON.Color3(0.3, 1, 0.3) : new BABYLON.Color3(0.1, 0.7, 0);
            } else if (playerColor === Model.PlayerColor.Yellow) {
                return diffuse ? new BABYLON.Color3(1, 1, 0.3) : new BABYLON.Color3(0.7, 0.7, 0.1);
            }

            return BABYLON.Color3.White();
        }
    }

    monopolyApp.service("drawingService", DrawingService);
} 