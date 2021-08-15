module main {
    export class TheFirstGame {

        private static _instance: TheFirstGame

        constructor() { }

        /*第一次进入游戏*/
        public isFirstGame: Boolean

        public static getInstance(): TheFirstGame {
            return TheFirstGame._instance || (TheFirstGame._instance = new TheFirstGame)
        }

    }
}