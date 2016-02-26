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
        private houseMeshTemplate: BABYLON.AbstractMesh; // "template" for houses
        private houseButtonMeshTemplate: BABYLON.Mesh; // "template" for house buttons
        private houseRemoveButtonMeshTemplate: BABYLON.Mesh; // "template" for removing house buttons
        private houseButtonMeshes: BABYLON.AbstractMesh[]; // meshes of currently available house buttons
        private houseRemoveButtonMeshes: BABYLON.AbstractMesh[]; // meshes of currently available house remove buttons
        private houseButtonMaterial: BABYLON.StandardMaterial;
        private houseRemoveButtonMaterial: BABYLON.StandardMaterial;
        private groundMeshName = "board";
        private diceMesh: BABYLON.AbstractMesh;
        private throwingDice: boolean; // whether the dices are currently being thrown
        private numFramesDiceIsAtRest: number;
        private dicePosition: BABYLON.Vector3; // position of the dice at the beginning of a throw

        static $inject = ["$http", "gameService"];

        constructor($http: ng.IHttpService, gameService: Interfaces.IGameService) {
            this.httpService = $http;
            this.gameService = gameService;
            this.boardFieldWidth = this.boardSize / (this.boardFieldsInQuadrant + 2); // assuming the corner fields are double the width of the rest of the fields
            this.boardFieldHeight = this.boardFieldWidth * 2;
            this.boardFieldEdgeWidth = this.boardFieldWidth * 2;
            this.initQuadrantStartingCoordinates();
            this.dicePosition = new BABYLON.Vector3(0, 3, 0);
        }

        /// board dimenzion in both, X and Z directions
        get boardSize(): number {
            return 10;
        }

        get diceHeight(): number {
            return 0.36;
        }

        // number of frames to animate player move between two neighbouring fields
        get framesToMoveOneBoardField(): number {
            return 10;
        }

        positionPlayer(playerModel: MonopolyApp.Viewmodels.Player) {
            var player = this.gameService.players.filter((player, index) => { return player.playerName === playerModel.name; })[0];
            var playerCoordinate = this.getPlayerPositionOnBoardField(playerModel, player.position.index);
            var playerQuadrant = Math.floor(player.position.index / (this.boardFieldsInQuadrant - 1));
            var playerQuadrantOffset = player.position.index % (this.boardFieldsInQuadrant - 1);
            playerModel.mesh.position.x = playerCoordinate.x;
            playerModel.mesh.position.z = playerCoordinate.z;
            playerModel.mesh.rotationQuaternion = this.getPlayerRotationOnBoardField(playerModel, player.position.index);
        }

        animatePlayerMove(oldPosition: Model.BoardField, newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player, scene: BABYLON.Scene, fast?: boolean, backwards?: boolean): JQueryDeferred<{}> {
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
                        } else {
                            runningFrame += framesForField;
                        }
                    } else {
                        if ((oldPosition.index + runningField) % 10 === 0) {
                            runningFrame += framesForRotation;
                        } else {
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
            scene.beginAnimation(playerModel.mesh, 0, runningFrame, false, undefined, () => { d.resolve() });
            return d;
        }

        animatePlayerPrisonMove(newPosition: Model.BoardField, playerModel: MonopolyApp.Viewmodels.Player, scene: BABYLON.Scene, camera: BABYLON.FreeCamera): JQueryDeferred<{}> {
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
            scene.beginAnimation(playerModel.mesh, 0, 30, false, undefined, () => { firstAnim.resolve() });
            var that = this;
            $.when(firstAnim).done(() => {
                var cameraMovement = that.returnCameraToMainPosition(scene, camera, newPosition.index);
                $.when(cameraMovement).done(() => {
                    var finalPosition = that.getPlayerPositionOnBoardField(playerModel, newPosition.index);
                    playerTopPosition = new BABYLON.Vector3(finalPosition.x, playerTopPosition.y, finalPosition.z);
                    playerPosition = new BABYLON.Vector3(finalPosition.x, playerTopPosition.y - 10, finalPosition.z);
                    positionKeys = [];
                    var rotationKeys = [];
                    positionKeys.push({ frame: 0, value: playerTopPosition });
                    positionKeys.push({ frame: 30, value: playerPosition });
                    rotationKeys.push({ frame: 0, value: playerModel.mesh.rotationQuaternion });
                    rotationKeys.push({ frame: 30, value: this.getPlayerRotationOnBoardField(playerModel, newPosition.index) });
                    animationplayerPosition = new BABYLON.Animation("playerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animationplayerPosition.setKeys(positionKeys);
                    var animationplayerRotation = new BABYLON.Animation("playerRotationAnimation", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animationplayerRotation.setKeys(rotationKeys);
                    playerModel.mesh.animations = [];
                    playerModel.mesh.animations.push(animationplayerPosition);
                    playerModel.mesh.animations.push(animationplayerRotation);
                    scene.beginAnimation(playerModel.mesh, 0, 30, false, undefined, () => { secondAnim.resolve() });
                });
            });
            return secondAnim;
        }

        setupDiceForThrow(scene: BABYLON.Scene) {
            this.diceMesh.position.x = this.dicePosition.x;
            this.diceMesh.position.y = this.dicePosition.y;
            this.diceMesh.position.z = this.dicePosition.z;
            var physicsEngine = scene.getPhysicsEngine();
            physicsEngine._unregisterMesh(this.diceMesh);
        }

        moveDiceToPosition(position: BABYLON.Vector3, scene: BABYLON.Scene) {
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
        }

        moveCameraForDiceThrow(scene: BABYLON.Scene, camera: BABYLON.FreeCamera, currentPlayerPosition: Model.BoardField): JQueryDeferred<{}> {
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
            scene.beginAnimation(camera, 0, 30, false, undefined, () => { d.resolve() });
            return d;
        }

        animateDiceThrow(scene: BABYLON.Scene, impulsePoint?: BABYLON.Vector3) {
            this.numFramesDiceIsAtRest = 0;
            this.diceMesh.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0.1, friction: 0.5, restitution: 0.5 });
            this.diceMesh.checkCollisions = true;
            if (impulsePoint) {
                var dir = impulsePoint.subtract(scene.activeCamera.position);
                dir.normalize();
                this.diceMesh.applyImpulse(dir.scale(0.2), impulsePoint);
            }
            this.throwingDice = true;
        }

        getRandomPointOnDice(): BABYLON.Vector3 {
            var point = new BABYLON.Vector3(this.diceMesh.position.x, this.diceMesh.position.y, this.diceMesh.position.z);
            point.x = point.x - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            point.y = point.y - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            point.z = point.z - this.diceHeight * 0.5 + Math.random() * this.diceHeight;
            return point;
        }

        // animates camera back to the base viewing position; returns the deferred object that will be resolved when the animation finishes
        returnCameraToMainPosition(scene: BABYLON.Scene, camera: BABYLON.FreeCamera, currentPlayerPositionIndex: number, numFrames?: number): JQueryDeferred<{}> {
            var d = $.Deferred();
            var animationCameraPosition = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var animationCameraRotation = new BABYLON.Animation("myAnimation2", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var finalCameraPosition = this.getGameCameraPosition(currentPlayerPositionIndex);
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
            keysRotation.push({
                frame: numFrames ? numFrames : 30,
                value: this.getCameraRotationForTarget(new BABYLON.Vector3(0, 0, 0), camera, finalCameraPosition)
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
            scene.beginAnimation(camera, 0, numFrames ? numFrames : 30, false, speedRatio, () => {
                d.resolve();
            });
            return d;
        }

        isDiceAtRestAfterThrowing(scene: BABYLON.Scene): boolean {
            if (this.throwingDice) {
                var physicsEngine = scene.getPhysicsEngine();
                var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
                if (Math.abs(body.velocity.x) > BABYLON.PhysicsEngine.Epsilon * 10 || Math.abs(body.velocity.y) > BABYLON.PhysicsEngine.Epsilon * 10 || Math.abs(body.velocity.z) > BABYLON.PhysicsEngine.Epsilon * 10) {
                    this.numFramesDiceIsAtRest -= 5;
                    if (this.numFramesDiceIsAtRest < 0) {
                        this.numFramesDiceIsAtRest = 0;
                    }
                    return false;
                }
                this.numFramesDiceIsAtRest++;
                if (this.numFramesDiceIsAtRest < 90) {
                    return false;
                }
                this.throwingDice = false;
                return true;
            }
            return false;
        }

        getDiceLocation(scene: BABYLON.Scene): BABYLON.Vector3 {
            //var physicsEngine = scene.getPhysicsEngine();
            //var body = physicsEngine.getPhysicsBodyOfMesh(this.diceMesh);
            //if (body) {
            //    return <BABYLON.Vector3>body.position;
            //}
            return this.diceMesh.position;
        }

        setGameCameraInitialPosition(camera: BABYLON.FreeCamera) {
            camera.position = this.getGameCameraPosition(this.gameService.getCurrentPlayerPosition().index, true);
            camera.setTarget(BABYLON.Vector3.Zero());
        }

        setManageCameraPosition(camera: BABYLON.ArcRotateCamera, focusedAssetGroupIndex: number, scene: BABYLON.Scene) {
            var firstFocusedBoardField = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex)[0];
            if (!this.boardGroupLeftCoordinate) {
                this.initBoardGroupCoordinates();
            }
            var group = firstFocusedBoardField.asset.group;
            var centerVector: BABYLON.Vector3;
            if (group !== Model.AssetGroup.Railway) {
                var groupLeftCoordinate = this.boardGroupLeftCoordinate[group];
                var groupRightCoordinate = this.boardGroupRightCoordinate[group];
                centerVector = BABYLON.Vector3.Center(new BABYLON.Vector3(groupLeftCoordinate.x, 0, groupLeftCoordinate.z), new BABYLON.Vector3(groupRightCoordinate.x, 0, groupRightCoordinate.z));
            } else {
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
        }

        returnFromManage(scene: BABYLON.Scene) {
            this.cleanupHighlights(scene);
            this.cleanupHouseButtons(scene);
        }

        pickBoardElement(scene: BABYLON.Scene, coords?: any): MonopolyApp.Viewmodels.PickedObject {
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
                if (pickResult.pickedMesh && (pickResult.pickedMesh.name.substring(0, 6) === "Boole_" || pickResult.pickedMesh.name === "Dice_obj")) {
                    pickedObject.pickedObjectType = MonopolyApp.Viewmodels.PickedObjectType.Dice;
                    pickedObject.pickedPoint = pickResult.pickedPoint;
                }
                return pickedObject;
            }
            return undefined;
        }

        createBoard(scene: BABYLON.Scene) {
            var board = BABYLON.Mesh.CreateGround(this.groundMeshName, this.boardSize, this.boardSize, 2, scene);
            var boardMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            boardMaterial.emissiveTexture = new BABYLON.Texture("images/Gameboard-Model.png", scene);
            boardMaterial.diffuseTexture = new BABYLON.Texture("images/Gameboard-Model.png", scene);
            board.material = boardMaterial;
            board.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.4, restitution: 0.5 });
            board.checkCollisions = true;
            var table = BABYLON.Mesh.CreateGround("tableMesh", 20, 13.33, 2, scene);
            var tableMaterial = new BABYLON.StandardMaterial("boardTexture", scene);
            tableMaterial.emissiveTexture = new BABYLON.Texture("images/wood_texture.jpg", scene);
            tableMaterial.diffuseTexture = new BABYLON.Texture("images/wood_texture.jpg", scene);
            table.material = tableMaterial;
            table.position.y = -0.01;
            table.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.5 });
            table.checkCollisions = true;
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

        setBoardFieldHouses(viewBoardField: MonopolyApp.Viewmodels.BoardField, houses: number, hotel: boolean, scene: BABYLON.Scene) {
            if (viewBoardField.hotelMesh) {
                scene.removeMesh(viewBoardField.hotelMesh);
                viewBoardField.hotelMesh.dispose();
            }
            if (viewBoardField.houseMeshes && viewBoardField.houseMeshes.length > 0) {
                viewBoardField.houseMeshes.forEach(h => {
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
                    var houseMesh = BABYLON.Mesh.CreateBox(hotel ? `hotel_${viewBoardField.index}` : `house_${viewBoardField.index}_${houses}`, houseSize, scene);
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
                    } else {
                        houses--;
                    }
                }
            }
        }

        loadMeshes(players: MonopolyApp.Viewmodels.Player[], scene: BABYLON.Scene, gameController: MonopolyApp.controllers.GameController): JQueryDeferred<{}>[] {
            var meshLoads = [];
            this.gameService.players.forEach((player) => {
                var playerModel = players.filter(p => p.name === player.playerName)[0];
                playerModel.name = player.playerName;
                var d = $.Deferred();
                meshLoads.push(d);
                var that = this;
                BABYLON.SceneLoader.ImportMesh(null, "meshes/", "character.babylon", scene, function(newMeshes, particleSystems) {
                    if (newMeshes != null) {
                        var mesh = newMeshes[0];
                        playerModel.mesh = mesh;
                        var mat = new BABYLON.StandardMaterial(`player_${player.color}_material`, scene);
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
            var that = this;
            BABYLON.SceneLoader.ImportMesh(null, "meshes/", "house2.babylon", scene, (newMeshes, particleSystems) => {
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
            BABYLON.SceneLoader.ImportMesh(null, "meshes/", "dice.babylon", scene, (newMeshes, particleSystems) => {
                if (newMeshes != null) {
                    var mesh = newMeshes[0];
                    mesh.position.x = 0;
                    mesh.position.z = 0;
                    mesh.position.y = this.diceHeight / 2;
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
        }

        showHouseButtons(focusedAssetGroupIndex: number, scene: BABYLON.Scene) {
            var focusedFields = this.gameService.getBoardFieldsInGroup(focusedAssetGroupIndex);
            var focusedAssetGroup = focusedFields[0].asset.group;
            this.cleanupHouseButtons(scene);
            var groupBoardFields = this.gameService.getGroupBoardFields(focusedAssetGroup);
            var that = this;
            groupBoardFields.forEach(field => {
                var topLeft = that.getPositionCoordinate(field.index, true);
                var boardFieldQuadrant = Math.floor(field.index / (that.boardFieldsInQuadrant - 1));
                var runningCoordinate = that.getQuadrantRunningCoordinate(boardFieldQuadrant);
                var heightCoordinate = that.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
                var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
                if (that.gameService.canUpgradeAsset(field.asset, that.gameService.getCurrentPlayer())) {
                    var houseButtonMesh = that.houseButtonMeshTemplate.clone(`houseButton_${field.index}`);
                    houseButtonMesh.material = that.houseButtonMaterial;
                    scene.addMesh(houseButtonMesh);
                    houseButtonMesh.position[runningCoordinate] = topLeft[runningCoordinate] + (0.5 * this.getQuadrantRunningDirection(boardFieldQuadrant) * -1);
                    houseButtonMesh.position[heightCoordinate] = topLeft[heightCoordinate] + (that.boardFieldHeight - 0.2) * heightDirection;
                    if (boardFieldQuadrant === 1) {
                        houseButtonMesh.rotation.y = Math.PI / 2;
                    } else if (boardFieldQuadrant === 2) {
                        houseButtonMesh.rotation.y = Math.PI;
                    } else if (boardFieldQuadrant === 3) {
                        houseButtonMesh.rotation.y = Math.PI * 3 / 2;
                    }
                    //houseButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1.5, 1, 1.5), 100));
                    //houseButtonMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, houseButtonMesh, "scaling", new BABYLON.Vector3(1, 1, 1), 100));
                    that.houseButtonMeshes.push(houseButtonMesh);
                }

                if (that.gameService.canDowngradeAsset(field.asset, that.gameService.getCurrentPlayer())) {
                    var houseRemoveButtonMesh = that.houseRemoveButtonMeshTemplate.clone(`houseRemoveButton_${field.index}`);
                    houseRemoveButtonMesh.material = that.houseRemoveButtonMaterial;
                    scene.addMesh(houseRemoveButtonMesh);
                    houseRemoveButtonMesh.position[runningCoordinate] = topLeft[runningCoordinate] + (0.2 * that.getQuadrantRunningDirection(boardFieldQuadrant) * -1);
                    houseRemoveButtonMesh.position[heightCoordinate] = topLeft[heightCoordinate] + (that.boardFieldHeight - 0.2) * heightDirection;
                    houseRemoveButtonMesh.actionManager = new BABYLON.ActionManager(scene);
                    that.houseRemoveButtonMeshes.push(houseRemoveButtonMesh);
                    if (boardFieldQuadrant === 1) {
                        houseRemoveButtonMesh.rotation.y = Math.PI / 2;
                    } else if (boardFieldQuadrant === 2) {
                        houseRemoveButtonMesh.rotation.y = Math.PI;
                    } else if (boardFieldQuadrant === 3) {
                        houseRemoveButtonMesh.rotation.y = Math.PI * 3 / 2;
                    }
                }
            });
        }

        onSwipeMove(scene: BABYLON.Scene, coords: any) {
            if (this.houseButtonMeshes && this.houseButtonMeshes.length > 0) {
                var pickedObject = this.pickBoardElement(scene, coords);
                if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                    pickedObject.pickedMesh.scaling = new BABYLON.Vector3(1.5, 1, 1.5);
                } else {
                    this.houseButtonMeshes.forEach(m => {
                        if (m.scaling.x > 1) {
                            m.scaling = new BABYLON.Vector3(1, 1, 1);
                        }
                    });
                }
            }
        }

        onSwipeEnd(scene: BABYLON.Scene, coords: any): MonopolyApp.Viewmodels.PickedObject {
            var pickedObject = this.pickBoardElement(scene, coords);
            if (pickedObject && pickedObject.pickedObjectType === MonopolyApp.Viewmodels.PickedObjectType.AddHouse) {
                pickedObject.pickedMesh.scaling = new BABYLON.Vector3(1, 1, 1);
            }
            return pickedObject;
        }

        showActionButtons() {
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

        private highlightGroupFields(focusedAssetGroupIndex: number, groupQuadrantIndex: number, groupCenter: BABYLON.Vector3, scene: BABYLON.Scene) {
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
            groupBoardFields = groupBoardFields.filter(f => Math.floor(f.index / 10) === groupQuadrantIndex);
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
                    extruded.rotation.y = Math.PI * 3 / 2;
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
                var upperBound = topRightCorner >= topLeftCorner ? topRightCorner : topLeftCorner;
                var lowerBound = topRightCorner >= topLeftCorner ? topLeftCorner : topRightCorner;
                var heightCoordinate = this.getQuadrantRunningCoordinate(index) === "x" ? "z" : "x";
                var heightDirection = index === 0 || index === 1 ? -1 : 1;
                var heightTop = quadrant[heightCoordinate];
                var heightBottom = quadrant[heightCoordinate] + this.boardFieldHeight * heightDirection;
                if (heightTop < heightBottom) {
                    var temp = heightTop;
                    heightTop = heightBottom;
                    heightBottom = temp;
                }
                if (pickedPoint[this.getQuadrantRunningCoordinate(index)] < upperBound && pickedPoint[this.getQuadrantRunningCoordinate(index)] > lowerBound &&
                    pickedPoint[heightCoordinate] < heightTop && pickedPoint[heightCoordinate] > heightBottom) {
                    var quadrantOffset = 0;
                    if (index === 0 || index === 3) {
                        quadrantOffset = pickedPoint[this.getQuadrantRunningCoordinate(index)] > topRightCorner + this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[this.getQuadrantRunningCoordinate(index)] - (topRightCorner + this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index))) / this.boardFieldWidth));
                    } else if (index === 1) {
                        quadrantOffset = pickedPoint[this.getQuadrantRunningCoordinate(index)] < topRightCorner - this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[this.getQuadrantRunningCoordinate(index)] - (topRightCorner + this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index))) / this.boardFieldWidth));                        
                    } else if (index === 2) {
                        quadrantOffset = pickedPoint[this.getQuadrantRunningCoordinate(index)] < topRightCorner - this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index) ? 0 :
                            Math.ceil(Math.abs((pickedPoint[this.getQuadrantRunningCoordinate(index)] - (topRightCorner + this.boardFieldEdgeWidth * this.getQuadrantRunningDirection(index))) / this.boardFieldWidth));
                    }
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

        private cleanupHouseButtons(scene: BABYLON.Scene) {
            if (this.houseButtonMeshes && this.houseButtonMeshes.length > 0) {
                this.houseButtonMeshes.forEach(mesh => {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
            }
            this.houseButtonMeshes = [];
            if (this.houseRemoveButtonMeshes && this.houseRemoveButtonMeshes.length > 0) {
                this.houseRemoveButtonMeshes.forEach(mesh => {
                    scene.removeMesh(mesh);
                    mesh.dispose();
                });
            }
            this.houseRemoveButtonMeshes = [];
        }

        private getPlayerPositionOnBoardField(playerModel: MonopolyApp.Viewmodels.Player, positionIndex: number): MonopolyApp.Viewmodels.Coordinate {
            var playerQuadrant = Math.floor(positionIndex / (this.boardFieldsInQuadrant - 1));
            var playerQuadrantOffset = positionIndex % (this.boardFieldsInQuadrant - 1);
            var playerCoordinate = this.getPositionCoordinate(positionIndex);
            var heightCoordinate = this.getQuadrantRunningCoordinate(playerQuadrant) === "x" ? "z" : "x";
            var heightDirection = playerQuadrant === 0 || playerQuadrant === 1 ? -1 : 1;
            playerCoordinate[heightCoordinate] += this.boardFieldHeight / 5 * (playerModel.index + 1) * heightDirection;
            return playerCoordinate;
        }

        private getPlayerRotationOnBoardField(playerModel: MonopolyApp.Viewmodels.Player, positionIndex: number): BABYLON.Quaternion {
            var playerQuadrant = Math.floor(positionIndex / (this.boardFieldsInQuadrant - 1));
            var rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
            if (playerQuadrant === 1) {
                rotationQuaternion = new BABYLON.Quaternion(0, 0.7071, 0, 0.7071);
            } else if (playerQuadrant === 2) {
                rotationQuaternion = new BABYLON.Quaternion(0, 1, 0, 0);
            } else if (playerQuadrant === 3) {
                rotationQuaternion = new BABYLON.Quaternion(0, 0.7071, 0, -0.7071);
            }
            return rotationQuaternion;
        }

        /* 
        This has been coded with the help of http://www.euclideanspace.com/maths/discrete/groups/categorise/finite/cube/
        */
        getDiceResult(): number {
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
        }

        // get the rotation required for the camera to face the target; position determines the camera position, if it is not equal to its current position
        getCameraRotationForTarget(target: BABYLON.Vector3, camera: BABYLON.FreeCamera, position?: BABYLON.Vector3): BABYLON.Vector3 {
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
        }

        private epsilonCompare(v1: number, v2: number): boolean {
            if (Math.abs(v1 - v2) < 0.02) {
                return true;
            }
            return false;
        }

        private getGameCameraPosition(currentPlayerPositionIndex: number, center?: boolean): BABYLON.Vector3 {
            var boardFieldQuadrant = Math.floor(currentPlayerPositionIndex / (this.boardFieldsInQuadrant - 1));
            var runningCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant);
            var heightCoordinate = this.getQuadrantRunningCoordinate(boardFieldQuadrant) === "x" ? "z" : "x";
            var heightDirection = boardFieldQuadrant === 0 || boardFieldQuadrant === 1 ? -1 : 1;
            var position = new BABYLON.Vector3(0, 5, -10);
            position[heightCoordinate] = 10 * heightDirection;
            position[runningCoordinate] = center ? 0 : this.getPositionCoordinate(currentPlayerPositionIndex)[runningCoordinate];
            return position;
        }
    }

    monopolyApp.service("drawingService", DrawingService);
} 