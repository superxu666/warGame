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


        /*登录方式切换: 1: 验证码, 2: 密码, 3: 找回密码, 4: 注册*/
        public mod: any
        public curMod: string = '1'
        public switchMod: GYLite.GYText
        public forgetPassw: GYLite.GYText
        public frame: GYLite.GYScaleSprite

        public static getInstance(): LoginLayout {
            return LoginLayout._instance ? LoginLayout._instance : (LoginLayout._instance = new LoginLayout)
        }

        constructor() {

            let s = this
            s.mod = {
                '1': '切换到密码登录>',
                '2': '切换到手机验证码>',
                '3': '返回登录页面>',
                '4': '返回登录页面>'
            }
        }

        public layout(ui: Module): void {

            let s = this;

            console.log('layout - ');

            let frame = s.frame = SkinManager.createScaleImage(ui, 100, 200, 'rms_view_bg_png', Conf.main + 'img/d1sheet.png', new GYLite.Scale9GridRect(100, 100, 100, 100))
            frame.width = 680
            frame.height = 410
            frame.horizonalCenter = 0


            s.c_phone = s.phone_c(frame)
            s.c_passw = s.passw_c(frame)
            s.c_code = s.code_c(frame)
            s.c_nickname = s.nickname_c(frame)

            s.loginBtn = SkinManager.createBtn(frame, 210, 250, 'rms_login_btn_bg_png', null, null, Conf.main + 'img/d1sheet.png')
            s.loginBtn.label = '登录'
            s.loginBtn.labelDisplay.size = 26
            s.loginBtn.labelDisplay.textColor = 0xffffff


            s.forgetPassw = SkinManager.createText(frame, 480, 240, '忘记密码', 0xffffff, 20)
            s.visitor = SkinManager.createText(frame, 66, 300, '游客登录', 0xffffff, 26)
            s.registry = SkinManager.createText(frame, 510, 300, '快速注册', 0xffffff, 26)
            s.switchMod = SkinManager.createText(frame, 250, 450, s.mod[s.curMod], 0xffffff, 26)
            s.forgetPassw.touchEnabled = s.visitor.touchEnabled = s.registry.touchEnabled = s.switchMod.touchEnabled = true

            s.bindEvent()

            s.codeLayout()

            s.openDrag(frame, false)
            s.test(ui)
        }

        /*密码登录布局*/
        private passwLayout(): void {
            let s = this;
            s.c_nickname.visible = false
            s.c_passw.visible = true
            s.c_passw.y = s.c_phone.y + s.c_phone.height + 10

            s.c_code.visible = false

            s.forgetPassw.visible = true
            s.forgetPassw.x = 480
            s.forgetPassw.y = 240

            s.visitor.visible = true
            s.visitor.x = 66
            s.visitor.y = 300

            s.registry.visible = true
            s.registry.x = 510
            s.registry.y = 300

            s.loginBtn.y = 250
            s.frame.height = 410
            s.switchMod.y = s.frame.height + 20

        }

        /*验证码登录布局*/
        private codeLayout(): void {
            let s = this;
            s.c_nickname.visible = false
            s.c_code.visible = true
            s.c_code.y = s.c_phone.y + s.c_phone.height + 10
            s.c_passw.visible = false

            s.forgetPassw.visible = false

            s.visitor.visible = true
            s.visitor.x = 66
            s.visitor.y = 300

            s.registry.visible = true
            s.registry.x = 510
            s.registry.y = 300

            s.loginBtn.y = 250
            s.frame.height = 410
            s.switchMod.y = s.frame.height + 20
        }

        /*忘记密码布局*/
        private gotPasswLayout(): void {

            let s = this;
            s.c_nickname.visible = false
            s.c_passw.visible = true
            s.c_passw.y = s.c_phone.y + s.c_phone.height + 10
            s.c_code.visible = true
            s.c_code.y = s.c_passw.y + s.c_passw.height + 10


            s.forgetPassw.visible = false
            s.visitor.visible = false
            s.registry.visible = false

            s.loginBtn.y = 310
            s.frame.height = 450
            s.switchMod.y = s.frame.height + 20

        }

        /*注册布局*/
        private registryLayout(): void {

            let s = this;
            s.c_nickname.visible = true
            s.c_nickname.y = s.c_phone.y + s.c_phone.height + 10
            s.c_passw.visible = true
            s.c_passw.y = s.c_nickname.y + s.c_nickname.height + 10
            s.c_code.visible = true
            s.c_code.y = s.c_passw.y + s.c_passw.height + 10


            s.forgetPassw.visible = false
            s.visitor.visible = false
            s.registry.visible = false

            s.loginBtn.y = 390
            s.frame.height = 510
            s.switchMod.y = s.frame.height + 20

        }

        /*绑定事件*/
        private bindEvent(): void {

            let s = this
            s.switchMod.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleSwitch, s)
            s.forgetPassw.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleForget, s)
            s.registry.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleRegistry, s)
        }

        public offEvent(): void {

        }

        /*切换按钮事件*/
        private handleSwitch(): void {

            let s = this
            if (s.curMod == '1') {/*去密码登录*/

                s.curMod = '2'
                s.passwLayout()

            } else if (s.curMod == '2') {/*去验证码登录*/

                s.curMod = '1'
                s.codeLayout()

            } else {/*返回登录页面*/

                s.curMod = '1'
                s.codeLayout()
            }
            s.switchMod.text = s.mod[s.curMod]
        }

        /*忘记密码事件*/
        private handleForget(): void {
            let s = this

            s.curMod = '3'
            s.switchMod.text = s.mod[s.curMod]
            s.gotPasswLayout()
        }

        /*注册事件*/
        private handleRegistry(): void {
            let s = this
            s.curMod = '4'
            s.switchMod.text = s.mod[s.curMod]
            s.registryLayout()
        }

        /*外部绑定登录按钮事件*/
        public bindLogin(cb: Function, thisobj: any): void {
            let s = this
            s.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, cb, thisobj)
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
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 10, 0, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, function () {
                s.phone = p.text
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
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 10, 0, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, () => {
                s.code = p.text
            }, s)
            p.textInput.y = 10
            p.paddingLeft = 60
            p.paddingRight = 160

            const send = SkinManager.createBtn(parent, 0, 78 - 44 >> 1, 'rms_login__send_vitify_code_png', null, null, Conf.main + 'img/d1sheet.png')
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
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 40, 0, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, () => {
                s.passw = p.text
            }, s)
            p.paddingLeft = 60
            p.paddingRight = 60
            p.textInput.displayAsPassword = true;
            p.textInput.inputType = egret.TextFieldInputType.PASSWORD;

            //rms_login_display_password_png
            let selected = false
            const hidePs = SkinManager.createBtn2(parent, 0, 78 - 20 >> 1, ['rms_login__hide_password_png', null, null, null, 'rms_login_display_password_png', 'rms_login_display_password_png', 'rms_login_display_password_png', 'rms_login_display_password_png'], Conf.main + 'img/d1sheet.png')
            hidePs.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                selected = !selected
                p.textInput.displayAsPassword = !selected;
                p.textInput.inputType = !selected ? egret.TextFieldInputType.TEXT : egret.TextFieldInputType.PASSWORD
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
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 40, 0, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, () => {
                s.nickname = p.text
            }, s)
            p.paddingLeft = 60
            p.paddingRight = 60
            p.textInput.displayAsPassword = true;
            p.textInput.inputType = egret.TextFieldInputType.PASSWORD;

            parent.visible = false
            parent.x = 66
            parent.y = s.c_phone.y + s.c_phone.height + 10

            pr.addElement(parent)

            // TemplateTool.setBackGrapics(p, 0xff0000, 0.8)
            // TemplateTool.setBackGrapics(parent, 0xffff00, 0.8)

            return parent

        }





        public test(ui: Module): void {

            let s = this;
            let t = LoginLayout.createScrollGroup(ui, 0, 800, ui.width, 620, true, 1, 50);
            t.horizonalCenter = 0;
            ui.addElement(t);
            let f = (<any>GYLite.GYLoader)._resDataDict['d1sheet.json']['res']['frames']
            let f2 = (<any>GYLite.GYLoader)._resDataDict['d2sheet.json']['res']['frames']
            let f3 = (<any>GYLite.GYLoader)._resDataDict['d3sheet.json']['res']['frames']
            let x = 0
            let y = 0
            for (var key in f) {
                let img = SkinManager.createImage(t, 0, 0, key, 'd1sheet.png')
                img.x = x
                img.y = y
                x += img.width
                img['imgname'] = key
            }
            x = 0
            y += 400
            for (var key in f2) {
                let img = SkinManager.createImage(t, 0, 0, key, 'd2sheet.png')
                img.x = x
                img.y = y
                x += img.width
                img['imgname'] = key
            }
            x = 0
            y += 400
            for (var key in f3) {
                let img = SkinManager.createImage(t, 0, 0, key, 'd3sheet.png')
                img.x = x
                img.y = y
                x += img.width
                img['imgname'] = key
            }

            s.openDrag(t)
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