module login {
    export class LoginModel {

        private static _instance: LoginModel

        public static getInstance(): LoginModel {

            return LoginModel._instance || (LoginModel._instance = new LoginModel)
        }

        /*发送短信*/
        public sendSms(username: string, cb: Function): void {

            BaseHttp.getInstance().sendMsg('/war/user/sendsms', {
                username
            }, HTTPConf.M_POST, (res) => {
                cb && cb(res)
            }, this)
        }

        /*注册*/
        public register(params: Object, cb: Function): void {

            BaseHttp.getInstance().sendMsg('/war/user/register', params, HTTPConf.M_POST, (res) => {
                cb && cb(res)
            }, this)
        }

        /*重置密码*/
        public resetPwd(params: Object, cb: Function): void {

            BaseHttp.getInstance().sendMsg('/war/user/resetPwd', params, HTTPConf.M_POST, (res) => {
                cb && cb(res)
            }, this)
        }

        /*密码登录*/
        public loginPwd(username: string, password: string, cb: Function): void {

            BaseHttp.getInstance().sendMsg('/war/user/loginPwd', {
                username,
                password
            }, HTTPConf.M_POST, (res) => {
                UserData.getInstance().token = res.token
                sessionStorage.setItem('token', res.token)
                cb && cb(res)
            }, this)

        }

        /*验证码登录*/
        public loginCode(username: string, code: string, cb: Function): void {

            BaseHttp.getInstance().sendMsg('/war/user/loginCode', {
                username,
                code
            }, HTTPConf.M_POST, (res) => {
                UserData.getInstance().token = res.token
                sessionStorage.setItem('token', res.token)
                cb && cb(res)
            }, this)
        }

    }
}