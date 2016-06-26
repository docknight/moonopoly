module Model {
    export class MoonopolyTheme implements Interfaces.ITheme {
        private static playerMeshRotation: number[][] = [
            [0, 0, -0.7071, -0.7071],
            [-0.5, -0.5, -0.5, -0.5],
            [0.7071, 0.7071, 0, 0],
            [0.5, 0.5, -0.5, -0.5]
        ];

        private static boardFields = ["Start", "Rima Bradley", "Space debris", "Rima Hadley", "Lunar ecology tax", "Montes Alpes iron mines",
            "Mons Huygens", "Dust cloud", "Mons Hadley", "Mons Penck", "Quarantine", "Vallis Bohr", "Southern sea oil rig", "Vallis Planck",
            "Vallis Alpes", "Montes Cordillera iron mines", "Altai Cliff", "Space debris", "Kelvin Cliff", "Mercator Cliff",
            "Free docking", "Terra Sanitatis", "Dust cloud", "Terra Vigoris", "Terra Vitae", "Montes Carpatus iron mines", "Mare Anguis",
            "Mare Vaporum", "Eastern sea oil rig", "Mare Imbrium", "Go to quarantine", "Mare Nubium", "Mare Serenitatis", "Space debris",
            "Oceanus Procellarum", "Montes Taurus iron mines", "Dust cloud", "Apollo crater", "Lunar energy tax", "Aitken basin"];

        private static boardFieldColors = ["", "#69EEF6", "", "#69EEF6", "", "#FFFFFF", "#723E00", "", "#723E00", "#723E00",
                                           "", "#FD23BD", "#FFFFFF", "#FD23BD", "#FD23BD", "#FFFFFF", "#F39D37", "", "#F39D37", "#F39D37",
                                           "", "#09C123", "", "#09C123", "#09C123", "#FFFFFF", "#F4F10B", "#F4F10B", "#FFFFFF", "#F4F10B",
                                           "", "#2231F8", "#2231F8", "", "#2231F8", "#FFFFFF", "", "#E50E13", "", "#E50E13"
                                          ];

        get boardFieldName(): Array<string> {
            return MoonopolyTheme.boardFields;
        }

        get boardFieldColor(): Array<string> {
            return MoonopolyTheme.boardFieldColors;
        }

        get imagesFolder(): string {
            return "images/Moonopoly/";
        }

        get gameboardImage(): string {
            return "Gameboard4.png";
        }

        get backgroundImage(): string {
            return "pl_stars_milky_way.jpg";
        }

        get backgroundSize(): number[] {
            return [25, 25];
        }

        get gameSetupImage(): string {
            return "GameSetup.png";
        }

        get gameRulesImage(): string {
            return "GameRules.png";
        }

        get gamePauseImage(): string {
            return "GamePause.png";
        }

        get gameOptionsImage(): string {
            return "GameOptions.png";
        }

        get gameHelpImage(): string {
            return "GameHelp.png";
        }

        get gameStatsImage(): string {
            return "GameStats.png";
        }

        get mainMenuImage(): string {
            return "MainMenu.png";
        }

        get mainMenuTitleImage(): string {
            return "MainMenuTitle.png";
        }

        get railroadImage(): string {
            return "ironmine.png";
        }

        get utility1Image(): string {
            return "oil_rig_platform.png";
        }

        get utility2Image(): string {
            return "oil_rig_platform.png";
        }

        get skyboxFolder(): string {
            return "skybox3/skybox";
        }

        get meshFolder(): string {
            return "meshes/Moonopoly/";
        }

        get playerMesh(): string {
            return "rocket2.babylon";
        }

        get playerSubmeshIndex(): number {
            return 0;
        }

        get playerColoredSubmeshIndices(): Array<number> {
            return [/*1, 2, 3, 7, 8*/4, 5, 6, 9];
        }

        get playerMeshRotationQuaternion(): number[][] {
            return MoonopolyTheme.playerMeshRotation;
        }

        get moneySymbol(): string {
            return "⌀";
        }

        get house(): string {
            return "habitat";
        }

        get hotel(): string {
            return "settlement dome";
        }

        get railroad(): string {
            return "iron mine";
        }

        get utility(): string {
            return "Oil Rig";
        }

        get utilities(): string {
            return "Oil Rigs";
        }

        get communityChestTitle(): string {
            return "SPACE DEBRIS";
        }

        get eventTitle(): string {
            return "DUST CLOUD";
        }

        get prison(): string {
            return "quarantine";
        }
    }
}