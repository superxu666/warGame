module main {
    export class GameModel {

        private static _instance: GameModel

        constructor() { }

        public static getInstance(): GameModel {
            return GameModel._instance || (GameModel._instance = new GameModel)
        }

        /*获取服务器时间*/
        public getTime(callback: Function, thisobj: any): void {
            let s = this;
            BaseHttp.getInstance().sendMsg('/war/game/getTime', {}, HTTPConf.M_GET, callback, thisobj)
        }

    }
}