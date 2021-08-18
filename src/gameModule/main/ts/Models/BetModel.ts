module main {
    export class BetModel {

        private static _instance: BetModel

        constructor() { }

        public static getInstance(): BetModel {
            return BetModel._instance || (BetModel._instance = new BetModel)
        }
    }
}