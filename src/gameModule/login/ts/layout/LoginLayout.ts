module login {
    export class LoginLayout {

        public static _instance: LoginLayout

        public phone: string
        public passw: string
        public code: string
        public nickname: string
        public loginBtn: GYLite.GYButton

        /*游客*/
        public visitor: GYLite.GYText
        /*注册*/
        public registry: GYLite.GYText

        public c_phone: GYLite.GYUIComponent
        public c_passw: GYLite.GYUIComponent
        public c_code: GYLite.GYUIComponent
        public c_nickname: GYLite.GYUIComponent


        /*登录方式切换: 1: 密码 2: 验证码, , 3: 找回密码, 4: 注册*/
        private switchBtnText: Object
        private loginBtnText: Object
        private curMod: string = '2'
        public switchMod: GYLite.GYText
        public forgetPassw: GYLite.GYText
        public frame: GYLite.GYScaleSprite

        public static getInstance(): LoginLayout {
            return LoginLayout._instance ? LoginLayout._instance : (LoginLayout._instance = new LoginLayout)
        }

        constructor() {

            let s = this
            s.switchBtnText = {
                '1': '切换到手机验证码>',
                '2': '切换到密码登录>',
                '3': '返回登录页面>',
                '4': '返回登录页面>'
            }
            s.loginBtnText = {
                '1': '登录',
                '2': '登录',
                '3': '修改',
                '4': '注册'
            }

        }

        public layout(ui: Module): void {

            let s = this;

            let frame = s.frame = SkinManager.createScaleImage(ui, 100, 200, 'rms_view_bg_png', Conf.d1sheetAlias, new GYLite.Scale9GridRect(100, 100, 100, 100))
            frame.width = 680
            frame.height = 410
            frame.horizonalCenter = 0

            s.c_phone = s.phone_c(frame)
            s.c_passw = s.passw_c(frame)
            s.c_code = s.code_c(frame)
            s.c_nickname = s.nickname_c(frame)

            s.loginBtn = SkinManager.createBtn(frame, 210, 250, 'rms_login_btn_bg_png', null, null, Conf.d1sheetAlias)
            s.loginBtn.label = '登录'
            s.loginBtn.labelDisplay.size = 26
            s.loginBtn.labelDisplay.textColor = 0xffffff

            s.forgetPassw = SkinManager.createText(frame, 480, 240, '忘记密码', 0xffffff, 20)
            s.visitor = SkinManager.createText(frame, 66, 300, '游客登录', 0xffffff, 26)
            s.visitor.visible = false
            s.registry = SkinManager.createText(frame, 510, 300, '快速注册', 0xffffff, 26)
            s.switchMod = SkinManager.createText(frame, 250, 450, s.switchBtnText['2'], 0xffffff, 26)
            s.forgetPassw.touchEnabled = s.visitor.touchEnabled = s.registry.touchEnabled = s.switchMod.touchEnabled = true

            s.bindEvent()
            s.getLayout('2')

            // s.openDrag(frame, false)
            // s.test(ui)
        }

        private getLayout(state: string): void {

            let s = this;
            let switText = ''
            const stateObj = {
                '1': () => {
                    /*密码登录布局*/
                    s.c_nickname.visible = false
                    s.c_passw.visible = true
                    s.c_passw.y = s.c_phone.y + s.c_phone.height + 10

                    s.c_code.visible = false

                    s.forgetPassw.visible = true
                    s.forgetPassw.x = 480
                    s.forgetPassw.y = 240

                    // s.visitor.visible = true
                    s.visitor.x = 66
                    s.visitor.y = 300

                    s.registry.visible = true
                    s.registry.x = 510
                    s.registry.y = 300

                    s.loginBtn.y = 250
                    s.frame.height = 410
                    s.switchMod.y = s.frame.height + 20

                },
                '2': () => {
                    /*验证码登录布局*/
                    s.c_nickname.visible = false
                    s.c_code.visible = true
                    s.c_code.y = s.c_phone.y + s.c_phone.height + 10
                    s.c_passw.visible = false

                    s.forgetPassw.visible = false

                    // s.visitor.visible = true
                    s.visitor.x = 66
                    s.visitor.y = 300

                    s.registry.visible = true
                    s.registry.x = 510
                    s.registry.y = 300

                    s.loginBtn.y = 250
                    s.frame.height = 410
                    s.switchMod.y = s.frame.height + 20
                },
                '3': () => {
                    /*忘记密码布局*/
                    s.c_nickname.visible = false
                    s.c_passw.visible = true
                    s.c_passw.y = s.c_phone.y + s.c_phone.height + 10
                    s.c_code.visible = true
                    s.c_code.y = s.c_passw.y + s.c_passw.height + 10


                    s.forgetPassw.visible = false
                    // s.visitor.visible = false
                    s.registry.visible = false

                    s.loginBtn.y = 310
                    s.frame.height = 450
                    s.switchMod.y = s.frame.height + 20
                },
                '4': () => {
                    /*注册布局*/
                    s.c_nickname.visible = true
                    s.c_nickname.y = s.c_phone.y + s.c_phone.height + 10
                    s.c_passw.visible = true
                    s.c_passw.y = s.c_nickname.y + s.c_nickname.height + 10
                    s.c_code.visible = true
                    s.c_code.y = s.c_passw.y + s.c_passw.height + 10


                    s.forgetPassw.visible = false
                    // s.visitor.visible = false
                    s.registry.visible = false

                    s.loginBtn.y = 390
                    s.frame.height = 510
                    s.switchMod.y = s.frame.height + 20
                }
            }

            s.curMod = state
            s.switchMod.text = s.switchBtnText[state]
            s.loginBtn.label = s.loginBtnText[state]
            stateObj[state] && stateObj[state]()
            BaseWar.getInstance().trigger('clear_login_info')
        }

        /*绑定事件*/
        private bindEvent(): void {

            let s = this
            s.switchMod.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleSwitch, s)
            s.forgetPassw.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleForget, s)
            s.registry.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleRegistry, s)
            s.visitor.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleVisitor, s)
        }

        public offEvent(): void {

            let s = this
            s.switchMod.removeEventListener(egret.TouchEvent.TOUCH_TAP, s.handleSwitch, s)
            s.forgetPassw.removeEventListener(egret.TouchEvent.TOUCH_TAP, s.handleForget, s)
            s.registry.removeEventListener(egret.TouchEvent.TOUCH_TAP, s.handleRegistry, s)
            s.visitor.removeEventListener(egret.TouchEvent.TOUCH_TAP, s.handleVisitor, s)
        }

        /*切换按钮事件*/
        private handleSwitch(): void {

            let s = this
            s.getLayout(s.curMod == '1' ? '2' : s.curMod == '2' ? '1' : '2')
        }

        public switchMode(mod: string): void {
            let s = this
            s.getLayout(mod)
        }

        /*忘记密码事件*/
        private handleForget(): void {
            let s = this
            s.getLayout('3')
        }

        /*注册事件*/
        private handleRegistry(): void {
            let s = this
            s.getLayout('4')
        }

        private loginCallback: Function
        private loginThisobj: any
        /*外部绑定登录按钮事件*/
        public bindLogin(cb: Function, thisobj: any): void {
            let s = this
            s.loginCallback = cb
            s.loginThisobj = thisobj
            s.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleLogin, s)
        }

        private handleLogin(): void {
            let s = this
            s.loginCallback && s.loginCallback.call(s.loginThisobj, s.curMod)
        }

        private visitorCallback: Function
        private visitorThisobj: any

        public bindVisitor(cb: Function, thisobj: any): void {
            let s = this
            s.visitorCallback = cb
            s.visitorThisobj = thisobj
        }

        private handleVisitor(): void {
            let s = this
            s.visitorCallback && s.visitorCallback.call(s.visitorThisobj)
        }


        private sendCallback: Function
        private sendThisobj: any
        /*外部绑定发送消息按钮事件*/
        public bindSend(cb: Function, thisobj: any): void {
            let s = this
            s.sendCallback = cb
            s.sendThisobj = thisobj
        }

        /*创建手机号组件*/
        public phone_c(pr: GYLite.GYSprite) {

            const s = this;
            const parent = new GYLite.GYUIComponent
            const t = SkinManager.createText(parent, 0, 0, '手机号', 0xffffff, 30)
            t.y = (78 - t.height) / 2
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 10, 0, 452, 78, '', 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.d2sheetAlias), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, function () {
                s.phone = p.text
            }, s)
            BaseWar.getInstance().bind('clear_login_all_info', () => {
                s.phone = p.text = ''
            }, s)
            p.paddingLeft = 60
            p.paddingRight = 60
            parent.x = 66
            parent.y = 50
            pr.addElement(parent)
            // TemplateTool.setBackGrapics(p, 0xff0000, 0.8)
            // TemplateTool.setBackGrapics(parent, 0xffff00, 0.8)
            return parent

        }

        public code_c(pr: GYLite.GYSprite) {

            const s = this;
            const parent = new GYLite.GYUIComponent
            const t = SkinManager.createText(parent, 0, 0, '验证码', 0xffffff, 30)
            t.y = (78 - t.height) / 2
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 10, 0, 452, 78, '', 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.d2sheetAlias), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, () => {
                s.code = p.text
            }, s)
            BaseWar.getInstance().bind('clear_login_all_info', () => {
                s.code = p.text = ''
            }, s)
            BaseWar.getInstance().bind('clear_login_info', () => {
                s.code = p.text = ''
            }, s)
            p.textInput.y = 10
            p.paddingLeft = 60
            p.paddingRight = 160

            const send = SkinManager.createBtn(parent, 0, 78 - 44 >> 1, 'rms_login__send_vitify_code_png', null, null, Conf.d1sheetAlias)
            send.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                s.sendCallback && s.sendCallback.call(s.sendThisobj)
            }, s)
            send.right = 20
            send.label = '发送'
            send.labelDisplay.size = 22

            parent.x = 66
            parent.y = s.c_phone.y + s.c_phone.height + 10

            parent.visible = false
            pr.addElement(parent)
            // TemplateTool.setBackGrapics(p, 0xff0000, 0.8)
            // TemplateTool.setBackGrapics(parent, 0xffff00, 0.8)

            return parent

        }

        public passw_c(pr: GYLite.GYSprite) {

            const s = this;
            const parent = new GYLite.GYUIComponent
            const t = SkinManager.createText(parent, 0, 0, '密码', 0xffffff, 30)
            t.y = (78 - t.height) / 2
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 40, 0, 452, 78, '', 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.d2sheetAlias), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, () => {
                s.passw = p.text
            }, s)
            BaseWar.getInstance().bind('clear_login_all_info', () => {
                s.passw = p.text = ''
            }, s)
            BaseWar.getInstance().bind('clear_login_info', () => {
                s.passw = p.text = ''
            }, s)
            p.paddingLeft = 60
            p.paddingRight = 60
            p.textInput.displayAsPassword = true;
            p.textInput.inputType = egret.TextFieldInputType.PASSWORD;

            //rms_login_display_password_png
            const hidePs = SkinManager.createBtn2(parent, 0, 78 - 20 >> 1, ['rms_login__hide_password_png', null, null, null, 'rms_login_display_password_png', 'rms_login_display_password_png', 'rms_login_display_password_png', 'rms_login_display_password_png'], Conf.d1sheetAlias)
            hidePs.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                hidePs.selected = !hidePs.selected
                p.textInput.displayAsPassword = !hidePs.selected;
                p.textInput.inputType = hidePs.selected ? egret.TextFieldInputType.TEXT : egret.TextFieldInputType.PASSWORD
            }, s)
            hidePs.right = 30
            parent.visible = false

            parent.x = 66
            parent.y = s.c_phone.y + s.c_phone.height + 10

            pr.addElement(parent)

            // TemplateTool.setBackGrapics(hidePs, 0xffffff, 0.8)
            // TemplateTool.setBackGrapics(p, 0xff0000, 0.8)
            // TemplateTool.setBackGrapics(parent, 0xffff00, 0.8)

            return parent

        }

        /*创建昵称组件*/
        public nickname_c(pr: GYLite.GYSprite) {

            const s = this;
            const parent = new GYLite.GYUIComponent
            const t = SkinManager.createText(parent, 0, 0, '昵称', 0xffffff, 30)
            t.y = (78 - t.height) / 2
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 40, 0, 452, 78, '', 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.d2sheetAlias), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, () => {
                s.nickname = p.text
            }, s)
            BaseWar.getInstance().bind('clear_login_all_info', () => {
                s.nickname = p.text = ''
            }, s)
            BaseWar.getInstance().bind('clear_login_info', () => {
                s.nickname = p.text = ''
            }, s)
            p.paddingLeft = 60
            p.paddingRight = 60

            parent.visible = false
            parent.x = 66
            parent.y = s.c_phone.y + s.c_phone.height + 10

            pr.addElement(parent)

            // TemplateTool.setBackGrapics(p, 0xff0000, 0.8)
            // TemplateTool.setBackGrapics(parent, 0xffff00, 0.8)

            return parent

        }


        public static createScrollGroup(pr: GYLite.GYSprite = null, x: number, y: number, w: number, h: number, canDrag: boolean = false, /**滚动条 1显示 0不显示*/scrollBar: number = 0, /**滚动默认距离:5 */step: number = 5) {

            let scrollG = new GYLite.GYScrollGroup;
            scrollG.x = x;
            scrollG.y = y;
            scrollG.width = w;
            scrollG.height = h;
            scrollG.scrollerViewPort.canDrag = canDrag;
            scrollG.scroller.scrollBarH.alpha = scrollBar;
            scrollG.scroller.scrollBarV.alpha = scrollBar;
            scrollG.scroller.wheelScrollStep = step;

            scrollG.touchEnabled = true;
            let scrollBack = new GYLite.GYSprite;
            let g: egret.Graphics;
            g = scrollBack.graphics;
            g.beginFill(0, 0);
            g.drawRect(0, 0, scrollG.width, 100);
            g.endFill();
            scrollBack.touchEnabled = true;
            scrollG.addElement(scrollBack);

            if (pr)
                pr.addElement(scrollG);
            return scrollG;

        }

        private openDrag(ui: GYLite.GYSprite, touch: Boolean = true): void {
            let s = this;
            let len: number;
            len = ui.numElement;
            while (--len > -1) {
                let sp: GYLite.GYSprite = <any>ui.getElementAt(len);
                sp.touchEnabled = true;

                if (!touch) {

                    GYLite.DraggerHandle.getInstance(sp).addBind(function (d: GYLite.DraggerHandle): void {
                        d.handle.x = (<any>d.handle.parent).mouseX - d.dragMouseX;
                        d.handle.y = (<any>d.handle.parent).mouseY - d.dragMouseY;
                    }, s);
                }
            }

            ui.addEventListener(egret.TouchEvent.TOUCH_END, function (e: any) {

                console.log(e.target.imgname, e.target.width, e.target.height);
                console.log('x: ', e.target.x, 'y: ', e.target.y);
            }, ui);
        }

    }
}