module Model {
    export class GameParams {
        private _jailBail: number;

        constructor() {
            this._jailBail = 50;
        }

        get jailBail(): number {
            return this._jailBail;
        }

        public loadDataFrom(savedGameParams: GameParams) {
            this._jailBail = savedGameParams._jailBail;
        }
    }
}