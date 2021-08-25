module main {
    export class MainModel {

        private static _instance: MainModel

        constructor() { }

        public static getInstance(): MainModel {
            return MainModel._instance || (MainModel._instance = new MainModel)
        }

        /*送礼*/
        public giveGift(params: Object, callback?: Function, thisobj?: any): void {

            BaseHttp.getInstance().sendMsg('/war/game/giveGift', params, HTTPConf.M_POST, (res) => {

                // 更新左上角显示的游戏币
                PersonalModel.getInstance().getMyInfo()

                callback && callback.call(thisobj)
            })
        }
        /*发送大喇叭*/
        public addNotice(msg: string): void {

            BaseHttp.getInstance().sendMsg('/war/game/addNotice', {
                msg
            }, HTTPConf.M_POST, (res) => { })

        }
        /*自己的收支明细*/
        public getMyRecord(): void {

            BaseHttp.getInstance().sendMsg('/war/accountrecord/getMyRecord', {}, HTTPConf.M_GET, (res) => {

            })
        }

        /*点击头像查用户信息*/
        public getInfoById(userId: string | number): void {
            BaseHttp.getInstance().sendMsg('/war/user/getInfoById', {
                userId
            }, HTTPConf.M_GET, (res) => {
                GiveGiftDialogView.getInstance().show(res.data)
            })
        }

    }
}