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

        get boardFieldName(): Array<string> {
            return MoonopolyTheme.boardFields;
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

        get house(): string {
            return "habitat";
        }

        get hotel(): string {
            return "settlement dome";
        }
    }
}