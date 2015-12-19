module MonopolyApp.Viewmodels {
    export class Coordinate {
        constructor(x?: number, z?: number) {
            if (x) {
                this.x = x;
            }
            if (z) {
                this.z = z;
            }
        }

        x: number;
        z: number;
    }
}