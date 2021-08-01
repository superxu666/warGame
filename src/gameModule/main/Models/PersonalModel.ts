module main {
    export class PersonalModel {


        /*隐私开关*/
        public updatePrivacy(privacy: string | number): void {

            HttpMsg.getInstance().sendMsg('/war/user/updatePrivacy', {
                privacy
            }, HTTPConf.M_POST, (res) => {

            })
        }

        /*左上角个人中心*/
        public getMyInfo(): void {
            HttpMsg.getInstance().sendMsg('/war/user/getMyInfo', {}, HTTPConf.M_GET, (res) => {

            })
        }


        /*左上角个人中心*/
        public getInfoById(userId: string | number): void {
            HttpMsg.getInstance().sendMsg('/war/user/getInfoById', {
                userId
            }, HTTPConf.M_GET, (res) => {

            })
        }

        
    }
}