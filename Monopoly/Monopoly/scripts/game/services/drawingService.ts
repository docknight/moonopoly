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

        setManageCameraPosition(camera: BABYLON.ArcRotateCamera, group: Model.AssetGroup) {
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

        private getPositionCoordinate(position: number): MonopolyApp.Viewmodels.Coordinate {
            var fieldQuadrant = Math.floor(position / (this.boardFieldsInQuadrant - 1));
            var fieldQuadrantOffset = position % (this.boardFieldsInQuadrant - 1);
            var coordinate = new MonopolyApp.Viewmodels.Coordinate();
            coordinate.x = this.quadrantStartingCoordinate[fieldQuadrant].x;
            coordinate.z = this.quadrantStartingCoordinate[fieldQuadrant].z;
            coordinate[this.getQuadrantRunningCoordinate(fieldQuadrant)] += fieldQuadrantOffset * this.boardFieldWidth * this.getQuadrantRunningDirection(fieldQuadrant);
            return coordinate;
        }
    }

    monopolyApp.service("drawingService", DrawingService);
} 