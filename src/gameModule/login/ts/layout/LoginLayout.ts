module login {
    export class LoginLayout {

        public static _instance: LoginLayout

        public phoneInput: GYLite.GYTextInput
        public passwInput: GYLite.GYTextInput
        public codeInput: GYLite.GYTextInput
        public loginBtn: GYLite.GYButton

        public static getInstance(): LoginLayout {
            return LoginLayout._instance ? LoginLayout._instance : (LoginLayout._instance = new LoginLayout)
        }

        public layout(ui: Module): void {

            let s = this;

            const iframe = SkinManager.createScaleImage(ui, 100, 200, 'rms_view_bg_png', Conf.main + 'img/d1sheet.png', new GYLite.Scale9GridRect(100, 100, 100, 100))
            iframe.width = 680
            iframe.height = 460
            iframe.horizonalCenter = 0


            // const phone = TemplateTool.createTextInput(iframe, 170, 70, 452, 78, null, 30)
            // phone.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            // phone.paddingLeft = 60
            // phone.paddingRight = 60

            s.phoneInput = s.phone_c(iframe, 66, 70, 452, 78)
            s.passwInput = s.passw_c(iframe, 66, s.phoneInput.y + s.phoneInput.height + 10, 452, 78)

            s.loginBtn = SkinManager.createBtn(iframe, 210, 250, 'rms_login_btn_bg_png', null, null, Conf.main + 'img/d1sheet.png')
            s.loginBtn.label = '登录'
            s.loginBtn.labelDisplay.size = 30


            s.openDrag(iframe, false)

            s.test(ui)
        }

        public bindLogin(cb: Function, thisobj: any) {
            let s = this;
            s.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, cb, thisobj)
        }

        public phone_c(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number): GYLite.GYTextInput {

            const s = this;
            const t = SkinManager.createText(pr, x, 0, '手机号', 0xffffff, 30)
            t.y = (h - t.height) / 2 + y
            const p = TemplateTool.createTextInput(pr, t.x + t.width + 10, y, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.paddingLeft = 60
            p.paddingRight = 60

            return p

        }

        public code_c(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number): GYLite.GYTextInput {

            const s = this;
            const t = SkinManager.createText(pr, x, 0, '验证码', 0xffffff, 30)
            t.y = (h - t.height) / 2 + y
            const p = TemplateTool.createTextInput(pr, t.x + t.width + 10, y, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.textInput.y = 10
            p.paddingLeft = 60
            p.paddingRight = 160

            const send = SkinManager.createBtn(pr, 490, y + 12, 'rms_login__send_vitify_code_png', null, null, Conf.main + 'img/d1sheet.png')
            send.label = '发送'
            send.labelDisplay.size = 22

            return p

        }

        public passw_c(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number): GYLite.GYTextInput {

            const s = this;
            const t = SkinManager.createText(pr, x, 0, '密码', 0xffffff, 30)
            t.y = (h - t.height) / 2 + y
            const p = TemplateTool.createTextInput(pr, t.x + t.width + 40, y, 452, 78, null, 30)
            p.skin = new GYLite.TextInputSkin(Main.instance.getRes('rms_login_input_bg_png', Conf.main + 'img/d2sheet.png'), new GYLite.Scale9GridRect())
            p.paddingLeft = 60
            p.paddingRight = 60
            p.textInput.displayAsPassword = true;
            p.textInput.inputType = egret.TextFieldInputType.PASSWORD;

            //rms_login_display_password_png
            const send = SkinManager.createBtn(pr, 520, y + 26, 'rms_login__hide_password_png', null, null, Conf.main + 'img/d1sheet.png')

            return p

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