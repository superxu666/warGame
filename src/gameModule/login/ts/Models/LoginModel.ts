module login {
    export class LoginModel {

        private static _instance: LoginModel

        public static getInstance(): LoginModel {

            return LoginModel._instance || (LoginModel._instance = new LoginModel)
        }

        /*发送短信*/
        public sendSms(username: string): void {

            HttpMsg.getInstance().sendMsg('/war/user/sendsms', {
                username: username
            }, HTTPConf.M_POST, (res) => {

            })
        }

        /*注册*/
        public register(params): void {

            HttpMsg.getInstance().sendMsg('/war/user/register', params, HTTPConf.M_POST, (res) => {

            })
        }

        /*重置密码*/
        public resetPwd(params): void {

            HttpMsg.getInstance().sendMsg('/war/user/resetPwd', params, HTTPConf.M_POST, (res) => {

            })
        }

        /*密码登录*/
        public loginPwd(username: string, password: string): void {

            HttpMsg.getInstance().sendMsg('/war/user/loginPwd', {
                username,
                password
            }, HTTPConf.M_POST, (res) => {

                if (res.code == 200) {

                    UserData.getInstance().token = res.token
                }

            })
        }

        /*验证码登录*/
        public loginCode(username: string, code: string): void {

            HttpMsg.getInstance().sendMsg('/war/user/loginCode', {
                username,
                code
            }, HTTPConf.M_POST, (res) => {

            })
        }

        /*退出*/
        public logout(params): void {

            HttpMsg.getInstance().sendMsg('/logout', params, HTTPConf.M_POST, (res) => {

            })
        }

    }
}