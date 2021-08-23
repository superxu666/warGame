module main {
    export class PersonalModel {


        private static _instance: PersonalModel

        constructor() { }

        public static getInstance(): PersonalModel {
            return PersonalModel._instance || (PersonalModel._instance = new PersonalModel)
        }

        public avatar: string
        public black: string
        public exp: number
        public gold: number
        public nickName: string
        public privacy: string
        public silver: number
        public userId: number
        public grade: string

        private setData(d: any): void {

            let s = this
            for (let key in d) {
                s[key] = d[key]
            }
            s.grade = UtilTool.getGrade(s.exp)
        }

        /*隐私开关*/
        public updatePrivacy(privacy: string | number): void {

            HttpMsg.getInstance().sendMsg('/war/user/updatePrivacy', {
                privacy
            }, HTTPConf.M_POST, (res) => {

            })
        }

        /*左上角个人中心*/
        public getMyInfo(cb: Function): void {

            let s = this
            BaseHttp.getInstance().sendMsg('/war/user/getMyInfo', {}, HTTPConf.M_GET, (res) => {
                s.setData(res.data)
                cb && cb(res)
            })
        }


        /*左上角个人中心*/
        public getInfoById(userId: string | number): void {
            HttpMsg.getInstance().sendMsg('/war/user/getInfoById', {
                userId
            }, HTTPConf.M_GET, (res) => {

            })
        }


        /*退出*/
        public logout(cb: Function): void {

            BaseHttp.getInstance().sendMsg('/logout', {}, HTTPConf.M_POST, (res) => {
                UserData.getInstance().token = ''
                sessionStorage.removeItem('token')
                cb && cb(res)
            })
        }

    }
}