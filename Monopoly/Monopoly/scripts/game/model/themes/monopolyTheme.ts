module Model {
    export class MonopolyTheme implements Interfaces.ITheme {
        private static playerMeshRotation: number[][] = [[0, 0, 0, 1], [0, 0.7071, 0, 0.7071], [0, 1, 0, 0], [0, 0.7071, 0, -0.7071]];

        private static boardFields = ["Start", "Goriška Brda", "Community chest", "Slovenske Gorice", "Income tax", "Železniška postaja Jesenice",
            "Bogenšperk", "Chance", "Predjamski grad", "Otočec", "Prison", "Terme Čatež", "Javna razsvetljava", "Dolenjske toplice",
            "Moravske toplice", "Glavni kolodvor Ljubljana", "Športni park Stožice", "Community chest", "Planica", "Mariborsko Pohorje",
            "Free parking", "Trenta", "Chance", "Rakov Škocjan", "Logarska dolina", "Železniška postaja Zidani most", "Lipica",
            "Volčji potok", "Mestni vodovod", "Postojnska jama", "Go to prison", "Cerkniško jezero", "Bohinj", "Community chest",
            "Bled", "Železniški terminal Koper", "Chance", "Piran", "Tax", "Portorož"];

        private static boardFieldColors = ["", "#723E00", "", "#723E00", "", "#FFFFFF", "#69EEF6", "", "#69EEF6", "#69EEF6",
                                           "", "#FD23BD", "#FFFFFF", "#FD23BD", "#FD23BD", "#FFFFFF", "#F39D37", "", "#F39D37", "#F39D37",
                                           "", "#E50E13", "", "#E50E13", "#E50E13", "#FFFFFF", "#F4F10B", "#F4F10B", "#FFFFFF", "#F4F10B",
                                           "", "#09C123", "#09C123", "", "#09C123", "#FFFFFF", "", "#2231F8", "", "#2231F8"
                                          ];

        get boardFieldName(): Array<string> {
            return MonopolyTheme.boardFields;
        }

        get boardFieldColor(): Array<string> {
            return MonopolyTheme.boardFieldColors;
        }

        get imagesFolder(): string {
            return "images/";
        }

        get gameboardImage(): string {
            return "Gameboard-Model.png";
        }

        get backgroundImage(): string {
            return "wood_texture.jpg";
        }

        get backgroundSize(): number[] {
            return [20, 13.33];
        }

        get gameSetupImage(): string {
            return undefined;
        }

        get gameRulesImage(): string {
            return undefined;
        }

        get gamePauseImage(): string {
            return undefined;
        }

        get gameOptionsImage(): string {
            return undefined;
        }

        get gameHelpImage(): string {
            return undefined;
        }

        get gameStatsImage(): string {
            return undefined;
        }

        get mainMenuImage(): string {
            return undefined;
        }

        get mainMenuTitleImage(): string {
            return undefined;
        }

        get railroadImage(): string {
            return "railroad.png";
        }

        get utility1Image(): string {
            return "lightbulb.png";
        }

        get utility2Image(): string {
            return "faucet.png";
        }

        get skyboxFolder(): string {
            return undefined;
        }

        get meshFolder(): string {
            return "meshes/";
        }

        get playerMesh(): string {
            return "character.babylon";
        }

        get playerSubmeshIndex(): number {
            return 0;
        }

        get playerColoredSubmeshIndices(): Array<number> {
            return [1];
        }

        get playerMeshRotationQuaternion(): number[][] {
            return MonopolyTheme.playerMeshRotation;
        }

        get moneySymbol(): string {
            return "M";
        }

        get house(): string {
            return "house";
        }

        get hotel(): string {
            return "house";
        }

        get railroad(): string {
            return "railway station";
        }

        get utility(): string {
            return "Utility";
        }

        get utilities(): string {
            return "Utilities";
        }

        get communityChestTitle(): string {
            return "COMMUNITY CHEST";
        }

        get eventTitle(): string {
            return "EVENT";
        }

        get prison(): string {
            return "prison";
        }
    }
}