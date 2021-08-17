/*下注类*/
module main {
    export class Bet {

        private static _instance: Bet

        public static getInstance(): Bet {
            return Bet._instance || (Bet._instance = new Bet)
        }

        
    }
}