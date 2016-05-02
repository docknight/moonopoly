module Model {
    export class Rules {
        constructor() {
            this.passStartAward = 200;
            this.initialCash = 1500;
        }
        passStartAward: number;
        initialCash: number;

        public loadDataFrom(savedRules: Rules) {
            this.passStartAward = savedRules.passStartAward;
            this.initialCash = savedRules.initialCash;
        }
    }
} 