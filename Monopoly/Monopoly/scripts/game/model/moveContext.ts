module Model {
    export enum ProcessingEvent { None, PassGoAward };

    // context data associated with the current player move
    export class MoveContext {
        constructor() {
            this.reset();
        }

        reset() {
            this.skipGoAward = false;
        }

        skipGoAward: boolean;
    }
} 