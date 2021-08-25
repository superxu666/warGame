module main {
    export class GiveGiftDialogView extends GYLite.GYUIComponent {

        private static _instance: GiveGiftDialogView

        public static getInstance(): GiveGiftDialogView {

            return GiveGiftDialogView._instance || (GiveGiftDialogView._instance = new GiveGiftDialogView)
        }

        private back: GYLite.GYScaleSprite
        private close: GYLite.GYButton
        private head: GYLite.GYImage
        private nickname: GYLite.GYText
        private userid: GYLite.GYText
        private gText: GYLite.GYText
        private yText: GYLite.GYText

        private eventSets: any
        private btnSets: any
        private userData: any

        constructor() {
            super()

            const s = this

            s.eventSets = {}
            s.btnSets = {}
            s.userData = {}

            s.width = 846
            s.height = 520
            s.horizonalCenter = 0
            s.verticalCenter = 0

            let back1 = SkinManager.createImage(s, 0, 0, 'rms_userinfo_bg_png', URLConf.mainImg + 'd2sheet.png')
            back1.anchorOffsetX = back1.width
            back1.skewY = 180
            back1.x = (s.width - back1.width * 2) / 2
            back1.y = (s.height - back1.height) / 2
            let back2 = SkinManager.createImage(s, 0, 0, 'rms_userinfo_bg_png', URLConf.mainImg + 'd2sheet.png')
            back2.x = back1.x + back1.width
            back2.y = back1.y

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close['eventname'] = 'close'
            s.close.top = -20
            s.close.right = -20

            let headBg = SkinManager.createImage(s, 0, 40, 'rms_user_head_bg_png', URLConf.mainImg + 'd2sheet.png')
            headBg.x = s.width - headBg.width >> 1
            s.head = SkinManager.createImage(s, 0, 0, 'r', URLConf.mainImg + 'head.png')
            s.head.width = headBg.width - 43
            s.head.height = headBg.height - 43
            s.head.x = s.width - s.head.width >> 1
            s.head.y = headBg.y + 18
            let mask = new GYLite.GYSprite;
            mask.x = s.head.x;
            mask.y = s.head.y;
            mask.width = mask.height = s.head.width;
            let g: egret.Graphics = mask.graphics;
            g.beginFill(0, 1);
            g.drawRoundRect(0, 0, s.head.width, s.head.width, s.head.width);
            g.endFill();
            s.head.mask = mask;
            s.addElement(mask)

            let useridBg = SkinManager.createImage(s, 0, 250, 'rms_userinfo_id_bg_png', URLConf.mainImg + 'd2sheet.png')
            useridBg.x = s.width - useridBg.width >> 1
            s.nickname = SkinManager.createText(s, 0, 226, '', 0xffffff, 18, 'center', 200, 50)
            s.nickname.x = s.width - s.nickname.width >> 1
            s.userid = SkinManager.createText(s, 0, 262, '', 0x946C47, 14, 'center', 110, 25)
            s.userid.x = s.width - s.userid.width >> 1

            s.gText = SkinManager.createText(s, 0, 192, '????', 0xffffff, 16, 'right', 130, 42)
            s.gText.x = 80
            s.yText = SkinManager.createText(s, 0, 192, '????', 0xffffff, 16, 'left', 130, 42)
            s.yText.right = 80

            let gbg = SkinManager.createImage(s, s.gText.x + s.gText.width + 20, s.gText.y - 12, 'game_cion_gold_big_png', URLConf.mainImg + 'd1sheet.png')
            let ybg = SkinManager.createImage(s, 0, gbg.y, 'game_cion_silver_big_png', URLConf.mainImg + 'd1sheet.png')
            ybg.right = 80 + s.yText.width + 20
            let tips = SkinManager.createText(s, 0, 484, '')
            tips.htmlText = `提示: 鲜花每个<font color=0xEFCD02>200金币</font>, 红包每个<font color=0xEFCD02>2000金币</font>, 大便每个<font color=0xEFCD02>200金币</font>`
            tips.x = s.width - tips.width >> 1


            let btnAry = [
                'rms_userinfo_flower_btn_png',
                'rms_userinfo_floredpacket_btn_png',
                'rms_userinfo_shit_btn_png',
                'rms_userinfo_diamond_btn_png',
            ]
            for (let i = 0, len = btnAry.length; i < len; i++) {

                let btn = SkinManager.createBtn2(s, 0, 350, [btnAry[i]], URLConf.mainImg + 'd2sheet.png', null, null, ScaleButtonSkin2)
                btn['eventname'] = 'btn_' + i
                btn.x = 150 + i * (btn.width + 70)
            }

            s.bindEvent()

        }

        /*事件绑定*/
        private bindEvent(): void {

            const s = this

            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
            s.eventSets = {
                close: () => {
                    s.hide()
                },
                btn_0: () => {
                    MainModel.getInstance().giveGift({
                        userId: s.userData.userId,
                        type: 1,
                        num: '200',
                        name: '鲜花'
                    })
                },
                btn_1: () => {
                    MainModel.getInstance().giveGift({
                        userId: s.userData.userId,
                        type: 1,
                        num: '2000',
                        name: '红包'
                    })
                },
                btn_2: () => {
                    MainModel.getInstance().giveGift({
                        userId: s.userData.userId,
                        type: 1,
                        num: '200',
                        name: '大便'
                    })
                },
                btn_3: () => {
                    GiveGoldDialogView.getInstance().show(s.userData)
                }
            }

        }

        /*点击事件*/
        private handleClick(e: egret.Event): void {
            const s = this
            s.eventSets[e.target.eventname] && s.eventSets[e.target.eventname]()
        }

        public setData(d: any): void {
            const s = this

            s.head.source = Main.instance.getRes(d.avatar, URLConf.mainImg + 'head.png')
            s.nickname.text = d.nickName
            s.userid.text = `ID ${d.userId}`
            s.gText.text = d.privacy == 0 ? '????' : d.gold
            s.yText.text = d.privacy == 0 ? '????' : d.silver

        }

        public show(d: any): void {

            let s = this

            LayerManager.getInstance().setTopMask(true, 0.5, 1);
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

            s.userData = d
            s.setData(d)

        }

        public hide(): void {

            let s = this
            LayerManager.getInstance().setTopMask(true, 0.5, 0);
            (s.parent as any).removeElement(s);

        }
    }
}