/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../modules/monopolyApp.ts" />
/// <reference path="../../../scripts/typings/angular-ui-router/angular-ui-router.d.ts" />
module MonopolyApp.controllers {
    declare var sweetAlert: any;
    export class MainMenuController {
        scope: angular.IScope;
        stateService: angular.ui.IStateService;
        themeService: Interfaces.IThemeService;
        timeoutService: angular.ITimeoutService;
        drawingService: Interfaces.IDrawingService;
        settingsService: Interfaces.ISettingsService;
        static $inject = ["$state", "$scope", "$timeout", "themeService", "drawingService", "settingsService"];
        constructor(stateService: angular.ui.IStateService, scope: angular.IScope, timeoutService: angular.ITimeoutService, themeService: Interfaces.IThemeService, drawingService: Interfaces.IDrawingService, settingsService: Interfaces.ISettingsService) {
            this.scope = scope;
            this.timeoutService = timeoutService;
            this.themeService = themeService;
            this.stateService = stateService;
            this.drawingService = drawingService;
            this.settingsService = settingsService;
            this.title = "Knight MONOPOLY";
            this.chooseGameInitialization = false;
            //var windowWidth = Math.min(window.screen.width, 575);
            //if (windowWidth < 575) {
            //    $("#buttonContainer").css("width", windowWidth + "px");
            //}
            $("#mainMenuTitleImage").attr("src", this.themeService.theme.imagesFolder + this.themeService.theme.mainMenuTitleImage);
            $("#mainMenuExitImage").attr("src", "images/ReturnToEarth2.png");
            $("#earthImage").attr("src", "images/Earth.png");
            $("#earthImage").hover(() => {
                $("#earthImage").attr("src", "images/EarthHighlight.png");
            }, () => {
                $("#earthImage").attr("src", "images/Earth.png");
            });
            var that = this;
            this.timeoutService(() => {
                that.initAudio();
                if (that.settingsService.options.music) {
                    that.playMusic();
                } else {
                    that.stopMusic();
                }
            });
            this.createScene();
            this.rotateAnimation("earthImage", 30, 0);
            this.scope.$on("$destroy", () => {
                window.removeEventListener("resize", that.resizeEventListener);
                var windowAny: any = window;
                windowAny.menuEngine = undefined;
                that.scene.stopAnimation(that.menuCamera);
                that.menuEngine.stopRenderLoop();
                that.menuEngine.dispose();
            });
        }
        private scene: BABYLON.Scene;
        private menuCamera: BABYLON.FreeCamera;
        private menuEngine: BABYLON.Engine;
        private ratingCounterTrigger: number = 3;

        title: string;
        chooseGameInitialization: boolean;

        get canLoadGame(): boolean {
            var localStorageAny: any = localStorage;
            return localStorage.length > 0 && localStorageAny[Model.Game.version];
        }

        startNewGame = () => {
            //var x: any = navigator;
            //x.app.exitApp();
            this.stateService.go("settings");
        }

        public settings() {
            if (this.canLoadGame) {
                this.chooseGameInitialization = true;
                $("#buttonContainer").css("width", "340px");
            } else {
                this.startNewGame();
            }
        }

        public options() {
            this.stateService.go("options");
        }

        public help() {
            this.stateService.go("help");
        }

        public stats() {
            this.stateService.go("stats");
        }

        public loadGame() {
            this.stateService.go("newgame", { loadGame: true });
        }

        public goBack() {
            this.chooseGameInitialization = false;
            $("#buttonContainer").css("width", "575px");
        }

        public exit() {
            sweetAlert({
                title: "Leaving MOONopoly",
                text: "Are you sure you wish to exit?",
                type: "info",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No"
            },
                isConfirm => {
                    if (isConfirm) {
                        this.notifyRatingAndClose();
                    }
                });            
        }

        private createScene() {
            var canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
            this.menuEngine = new BABYLON.Engine(canvas, true);
            var windowAny: any = window;
            windowAny.menuEngine = this.menuEngine;
            this.scene = new BABYLON.Scene(this.menuEngine);
            this.menuCamera = new BABYLON.FreeCamera("menuCamera", BABYLON.Vector3.Zero(), this.scene);
            this.scene.activeCamera = this.menuCamera;
            var light = new BABYLON.HemisphericLight("menuLight", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 1;
            var tableMaterial = new BABYLON.StandardMaterial("boardTexture", this.scene);
            if (this.themeService.theme.skyboxFolder) {
                var skybox = BABYLON.Mesh.CreateBox("menuSkyBox", 1000, this.scene);
                tableMaterial.backFaceCulling = false;
                tableMaterial.reflectionTexture = new BABYLON.CubeTexture(this.themeService.theme.imagesFolder + this.themeService.theme.skyboxFolder, this.scene);
                tableMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                tableMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                tableMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skybox.material = tableMaterial;
                var animationCameraRotation = new BABYLON.Animation("cameraMenuRotateAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                var keysRotation = [];
                this.menuCamera.position = new BABYLON.Vector3(0, 2, 0);
                this.menuCamera.setTarget(new BABYLON.Vector3(0, 0, 3));
                keysRotation.push({
                    frame: 0,
                    value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(0.01, 0.01, 3), this.menuCamera)
                });
                this.menuCamera.setTarget(new BABYLON.Vector3(0, 0, -3));
                keysRotation.push({
                    frame: 300,
                    value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(0.01, 0.01, -3), this.menuCamera)
                });
                keysRotation.push({
                    frame: 450,
                    value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(-3, 0.01, 0.01), this.menuCamera)
                });
                this.menuCamera.setTarget(new BABYLON.Vector3(0, 0, 3));
                keysRotation.push({
                    frame: 600,
                    value: this.drawingService.getCameraRotationForTarget(new BABYLON.Vector3(0.01, 0.01, 3), this.menuCamera)
                });
                keysRotation[2].value.y = keysRotation[1].value.y * 1.5;
                keysRotation[3].value.y = keysRotation[1].value.y * 2;
                animationCameraRotation.setKeys(keysRotation);
                this.menuCamera.animations = [];
                this.menuCamera.animations.push(animationCameraRotation);
                this.scene.beginAnimation(this.menuCamera, 0, 600, true, undefined, () => { });
                this.initRocketMesh();
            }
            var that = this;
            this.menuEngine.runRenderLoop(() => {
                {
                    // not sure why, but the input handlers starve unless the render loop is re-inserted in the queue using a timeout service
                    that.timeoutService(() => {
                        that.scene.render();
                    }, 1, false);
                }
            });
            // Watch for browser/canvas resize events
            window.addEventListener("resize", this.resizeEventListener);
        }

        private resizeEventListener() {
            //this.menuEngine.resize();
            var windowAny: any = window;
            var menuEngine: any = windowAny.menuEngine;
            if (menuEngine) {
                menuEngine.resize();
            }
        }

        private initRocketMesh() {
            var that = this;
            BABYLON.SceneLoader.ImportMesh(null, this.themeService.theme.meshFolder, this.themeService.theme.playerMesh, this.scene, function (newMeshes, particleSystems) {
                if (newMeshes != null) {
                    var rocketMesh = newMeshes[that.themeService.theme.playerSubmeshIndex];
                    var mat = new BABYLON.StandardMaterial("menu_rocket_material", that.scene);
                    mat.diffuseColor = BABYLON.Color3.Yellow();
                    mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                    that.themeService.theme.playerColoredSubmeshIndices.forEach(i => {
                        newMeshes[i].material = mat;
                    });
                    var mat2 = new BABYLON.StandardMaterial("menu_rocket_material2", that.scene);
                    mat2.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                    mat2.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
                    newMeshes[1].material = mat2;
                    newMeshes[2].material = mat2;
                    newMeshes[3].material = mat2;
                    newMeshes[7].material = mat2;
                    newMeshes[8].material = mat2;
                    rocketMesh.visibility = 0;
                    mat2.alpha = 0;
                    mat.alpha = 0;
                    rocketMesh.position = new BABYLON.Vector3(0, 0.6, 1);
                    that.timeoutService(() => {
                        rocketMesh.position = new BABYLON.Vector3(3, 0.6, 0);
                        mat2.alpha = 1;
                        mat.alpha = 1;
                        rocketMesh.visibility = 1;
                        var animationplayerPosition = new BABYLON.Animation("menuplayerPositionAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        var animationplayerRotation = new BABYLON.Animation("menuplayerRotationAnimation", "rotationQuaternion", 30, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                        var keysPosition = [];
                        var keysRotation = [];
                        for (var i = 0; i <= 40; i++) {
                            var frame = Math.floor((i / 40) * 620);
                            //var x = Math.cos((i / 40) * 360 * (3.14 / 180)) * 3;
                            //var z = Math.sin((i / 40) * 360 * (3.14 / 180)) * 3;
                            var x = Math.cos((-90 + (i / 40) * 360) * (3.14 / 180)) * 3;
                            var z = Math.sin((-90 + (i / 40) * 360) * (3.14 / 180)) * 3;
                            keysPosition.push({
                                frame: frame,
                                value: new BABYLON.Vector3(x, 0.6, z)
                            });
                        }
                        var theme = that.themeService.theme;
                        keysRotation.push({
                            frame: 0,
                            value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[2][0], theme.playerMeshRotationQuaternion[2][1], theme.playerMeshRotationQuaternion[2][2], theme.playerMeshRotationQuaternion[2][3])
                        });
                        keysRotation.push({
                            frame: 150,
                            value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[1][0], theme.playerMeshRotationQuaternion[1][1], theme.playerMeshRotationQuaternion[1][2], theme.playerMeshRotationQuaternion[1][3])
                        });
                        keysRotation.push({
                            frame: 300,
                            value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[0][0], theme.playerMeshRotationQuaternion[0][1], theme.playerMeshRotationQuaternion[0][2], theme.playerMeshRotationQuaternion[0][3])
                        });
                        keysRotation.push({
                            frame: 450,
                            value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[3][0], theme.playerMeshRotationQuaternion[3][1], theme.playerMeshRotationQuaternion[3][2], theme.playerMeshRotationQuaternion[3][3])
                        });
                        keysRotation.push({
                            frame: 620,
                            value: new BABYLON.Quaternion(theme.playerMeshRotationQuaternion[2][0], theme.playerMeshRotationQuaternion[2][1], theme.playerMeshRotationQuaternion[2][2], theme.playerMeshRotationQuaternion[2][3])
                        });
                        animationplayerPosition.setKeys(keysPosition);
                        animationplayerRotation.setKeys(keysRotation);
                        rocketMesh.animations = [];
                        rocketMesh.animations.push(animationplayerPosition);
                        rocketMesh.animations.push(animationplayerRotation);
                        var particleSystem = that.drawingService.addParticle(rocketMesh, that.scene);
                        particleSystem.targetStopDuration = undefined;
                        that.scene.beginAnimation(rocketMesh, 0, 620, true, undefined, () => { });
                        particleSystem.start();
                    }, 4000);
                }
            });            
        }

        private initAudio() {
            var that = this;
            $(".backgroundMusic").off("ended");
            $(".backgroundMusic").on("ended", e => {
                var next = $(e.currentTarget).nextAll(".backgroundMusic.stopped");
                if (next.length === 0) {
                    next = $(".backgroundMusic.stopped").first();
                } else {
                    next = next.first();
                }
                $(e.currentTarget).removeClass("playing").addClass("stopped");
                next.removeClass("stopped").addClass("playing");
                that.playMusic();
            });
        }

        private playMusic() {
            if (this.settingsService.options.music) {
                var musicToPlay = $(".backgroundMusic.playing");
                if (musicToPlay.length === 0) {
                    musicToPlay = $(".backgroundMusic");
                }
                musicToPlay = musicToPlay.first();
                musicToPlay.removeClass("stopped").addClass("playing");
                var musicElementToPlay: any = musicToPlay[0];
                musicElementToPlay.play();
            }
        }

        private stopMusic() {
            var musicPlaying = $(".backgroundMusic.playing");
            if (musicPlaying.length > 0) {
                var musicElement: any = musicPlaying.first()[0];
                musicElement.pause();
                musicElement.currentTime = 0;
                musicPlaying.removeClass("playing").addClass("stopped");
            }
        }

        private rotateAnimation(el, speed, degrees) {
            var elem = document.getElementById(el);
            if (elem) {
                var elemStyle: any = elem.style;
                elemStyle.WebkitTransform = "rotate(" + degrees + "deg)";
                elemStyle.MozTransform = "rotate(" + degrees + "deg)";
                elemStyle.msTransform = "rotate(" + degrees + "deg)";
                elemStyle.OTransform = "rotate(" + degrees + "deg)";
                elemStyle.transform = "rotate(" + degrees + "deg)";
                degrees++;
                if (degrees > 360) {
                    degrees = 1;
                }
                var that = this;
                this.timeoutService((elName, sp, deg) => {
                    that.rotateAnimation(elName, sp, deg);
                }, speed, false, el, speed, degrees);
            }
        }

        private notifyRatingAndClose() {
            var localStorageAny: any = localStorage;
            var ratingNotificationCounter = this.ratingCounterTrigger;
            if (localStorage.getItem("ratingNotificationCounter")) {
                ratingNotificationCounter = JSON.parse(localStorageAny.ratingNotificationCounter) + 1;
            }
            if (ratingNotificationCounter >= this.ratingCounterTrigger) {
                ratingNotificationCounter = 0;
                sweetAlert.close();
                this.timeoutService(() => {
                    sweetAlert({
                            title: "Leaving MOONopoly",
                            text: "Please rate this game to help improve it in the future. Thanks!",
                            type: "info",
                            showCancelButton: false,
                            confirmButtonText: "Ok"
                        },
                        isConfirm => {
                            if (isConfirm) {
                                localStorageAny.ratingNotificationCounter = ratingNotificationCounter;
                                window.close();
                            }
                        });
                }, 100);
            } else {
                localStorageAny.ratingNotificationCounter = ratingNotificationCounter;
                window.close();
            }
        }
    }

    monopolyApp.controller("mainMenuCtrl", MainMenuController);
} 