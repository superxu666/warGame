module main {
    export class MainModel {

        private static _instance: MainModel

        constructor() { }

        public static getInstance(): MainModel {
            return MainModel._instance || (MainModel._instance = new MainModel)
        }

        /*获取机器人数量*/
        public getRobotNum(): void {

            HttpMsg.getInstance().sendMsg('/war/game/robotnum', {}, HTTPConf.M_GET, (res) => {

            })
        }

        /*vip排行榜*/
        public getVipRank(): void {

            HttpMsg.getInstance().sendMsg('/war/game/getVipRank', {}, HTTPConf.M_GET, (res) => {

            })
        }
        /*送礼*/
        public giveGift(userId: string | number, type: string | number, num: string | number, name: string | number): void {

            HttpMsg.getInstance().sendMsg('/war/game/giveGift', {
                userId,
                type,
                num,
                name
            }, HTTPConf.M_POST, (res) => {

            })
        }
        /*发送大喇叭*/
        public addNotice(msg: string): void {

            BaseHttp.getInstance().sendMsg('/war/game/addNotice', {
                msg
            }, HTTPConf.M_POST, (res) => { })

        }
        /*昨今日金银币榜*/
        public selectWinRank(type: string | number, tody: string | number): void {

            HttpMsg.getInstance().sendMsg('/war/accountrecord/selectWinRank', {
                type,
                tody
            }, HTTPConf.M_GET, (res) => {

            })
        }
        /*自己的收支明细*/
        public getMyRecord(): void {

            HttpMsg.getInstance().sendMsg('/war/accountrecord/getMyRecord', {}, HTTPConf.M_GET, (res) => {

            })
        }

    }
}