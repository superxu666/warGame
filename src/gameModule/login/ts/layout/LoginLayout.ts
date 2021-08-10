module login {
    export class LoginLayout {

        public static _instance: LoginLayout

        public phone: string
        public passw: string
        public code: string
        public nicknameInput: GYLite.GYTextInput
        public loginBtn: GYLite.GYButton

        /*游客*/
        public visitor: GYLite.GYText
        /*注册*/
        public registry: GYLite.GYText

        /*登录方式切换: 1: 验证码, 2: 密码, 3: 找回密码, 4: 注册*/
        public mod: any
        public curMod: string = '1'
        public switchMod: GYLite.GYText

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

            const iframe = SkinManager.createScaleImage(ui, 100, 200, 'rms_view_bg_png', Conf.main + 'img/d1sheet.png', new GYLite.Scale9GridRect(100, 100, 100, 100))
            iframe.width = 680
            iframe.height = 410
            iframe.horizonalCenter = 0


            s.phone_c(iframe, 66, 70, 452, 78)
            s.passw_c(iframe, 66, 70 + 78 + 10, 452, 78)
            // s.code_c(iframe, 66, 70 + 78 + 10, 452, 78)

            s.loginBtn = SkinManager.createBtn(iframe, 210, 250, 'rms_login_btn_bg_png', null, null, Conf.main + 'img/d1sheet.png')
            s.loginBtn.label = '登录'
            s.loginBtn.labelDisplay.size = 26
            s.loginBtn.labelDisplay.textColor = 0xffffff

            s.visitor = SkinManager.createText(iframe, 66, 300, '游客登录', 0xffffff, 26)
            s.registry = SkinManager.createText(iframe, 510, 300, '快速注册', 0xffffff, 26)

            s.switchMod = SkinManager.createText(iframe, 240, 450, s.listenMod(), 0xffffff, 26)
            s.switchMod.touchEnabled = true

            s.bindEvent()

            // s.openDrag(iframe, false)
            s.test(ui)
        }

        /*密码登录布局*/
        private passwLayout(): void {
            let s = this;

        }

        /*验证码登录布局*/
        private codeLayout(): void {

        }

        /*忘记密码布局*/
        private gotPasswLayout(): void {

        }

        /*注册布局*/
        private registryLayout(): void {

        }

        private bindEvent(): void {

            let s = this
            s.switchMod.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleSwitch, s)
        }

        private handleSwitch(): void {

            let s = this
            if (s.curMod == '1') {/*去密码登录*/

                s.curMod = '2'

            } else if (s.curMod == '2') {/*去验证码登录*/

                s.curMod = '1'

            } else {/*返回登录页面*/

                s.curMod = '1'
            }
            s.switchMod.text = s.listenMod()
        }

        public listenMod(): string {

            let s = this
            // s.passwInput.visible = s.curMod == '2'
            // s.codeInput.visible = !s.passwInput.visible
            return s.mod[s.curMod]
        }

        public bindLogin(cb: Function, thisobj: any): void {
            let s = this
            s.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, cb, thisobj)
        }

        private sendCallback: Function
        private sendThisobj: any
        public bindSend(cb: Function, thisobj: any): void {
            let s = this
            s.sendCallback = cb
            s.sendThisobj = thisobj
        }

        public phone_c(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number) {

            const s = this;
            const parent = new GYLite.GYUIComponent
            const t = SkinManager.createText(parent, x, 0, '手机号', 0xffffff, 30)
            t.y = (h - t.height) / 2 + y
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 10, y, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, function () {
                s.phone = p.text
            }, s)
            p.paddingLeft = 60
            p.paddingRight = 60
            pr.addElement(parent)

        }

        public code_c(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number) {

            const s = this;
            const parent = new GYLite.GYUIComponent
            const t = SkinManager.createText(parent, x, 0, '验证码', 0xffffff, 30)
            t.y = (h - t.height) / 2 + y
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 10, y, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.addEventListener(egret.Event.CHANGE, () => {
                s.code = p.text
            }, s)
            p.textInput.y = 10
            p.paddingLeft = 60
            p.paddingRight = 160

            const send = SkinManager.createBtn(parent, 490, y + 12, 'rms_login__send_vitify_code_png', null, null, Conf.main + 'img/d1sheet.png')
            send.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                s.sendCallback && s.sendCallback.call(s.sendThisobj)
            }, s)
            send.label = '发送'
            send.labelDisplay.size = 22

            pr.addElement(parent)

        }

        public passw_c(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number) {

            const s = this;
            const parent = new GYLite.GYUIComponent
            const t = SkinManager.createText(parent, x, 0, '密码', 0xffffff, 30)
            t.y = (h - t.height) / 2 + y
            const p = TemplateTool.createTextInput(parent, t.x + t.width + 40, y, 452, 78, null, 30)
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
            const hidePs = SkinManager.createBtn(parent, 520, y + 26, 'rms_login__hide_password_png', null, null, Conf.main + 'img/d1sheet.png')
            hidePs.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                selected = !selected
                p.textInput.displayAsPassword = !selected;
                p.textInput.inputType = !selected ? egret.TextFieldInputType.TEXT : egret.TextFieldInputType.PASSWORD
            }, s)
            
            pr.addElement(parent)

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