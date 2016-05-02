module Model {
    export class GameParams {
        private _jailBail: number;
        private _rules: Rules;

        constructor() {
            this._jailBail = 50;
            this._rules = new Rules();
        }

        get jailBail(): number {
            return this._jailBail;
        }

        get rules(): Rules {
            return this._rules;
        }

        public loadDataFrom(savedGameParams: GameParams) {
            this._jailBail = savedGameParams._jailBail;
            this._rules.loadDataFrom(savedGameParams._rules);
        }
    }
}