/**
 * 排行榜
 */

module main {
    export class RankDialogView extends GYLite.GYUIComponent {

        private static _instance: RankDialogView

        public static getInstance(): RankDialogView {

            return RankDialogView._instance || (RankDialogView._instance = new RankDialogView)
        }

        private back: GYLite.GYScaleSprite
        private close: GYLite.GYButton
        private list: GYLite.GYListV
        private myrankText: GYLite.GYText
        private myrankNum: GYLite.GYText
        private myicon: GYLite.GYImage
        private type: number = 1

        constructor() {
            super()
            const s = this

            s.horizonalCenter = 0
            s.verticalCenter = 0

            s.back = SkinManager.createScaleImage(s, 0, 0, 'rms_view_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(60, 60, 60, 60))
            s.back.width = 1046
            s.back.height = 536

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close['eventname'] = 'close'
            s.close.top = -20
            s.close.right = -20

            let toptitbg = SkinManager.createImage(s, 0, 0, 'rms_view_title_bg_png', URLConf.mainImg + 'd1sheet.png')
            toptitbg.horizonalCenter = 0
            toptitbg.y = -toptitbg.height / 2
            let toptit = SkinManager.createImage(s, 0, 0, 'rms_top_list_title_png', URLConf.mainImg + 'd1sheet.png')
            toptit.horizonalCenter = 0
            toptit.y = toptitbg.y + (toptitbg.height - toptit.height >> 1)

            let vline = SkinManager.createScaleImage(s, 240, 0, 'rms_view_line_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(0, 0, 52, 52))
            vline.height = s.back.height


            let btnAry = [{
                source: 'rms_top_list_tab_today_gold_winner_png',
                sourceSel: 'rms_top_list_tab_today_gold_winner_selected_png',
            }, {
                source: 'rms_top_list_tab_today_silver_winner_png',
                sourceSel: 'rms_top_list_tab_today_silver_winner_selected_png',

            }, {
                source: 'rms_top_list_tab_yestoday_gold_medal_png',
                sourceSel: 'rms_top_list_tab_yestodat_gold_medal_selected_png',
            }, {
                source: 'rms_top_list_tab_testoday_silver_winner_png',
                sourceSel: 'rms_top_list_tab_yestoday_silver_winner_selected_png',

            }, {
                source: 'VIP2.png',
                sourceSel: 'VIP1.png',

            }]

            let radioGroup = new GYLite.GYRadioGroup
            for (let i = 0; i < 5; i++) {

                if (i < 4) {

                    let btn = <GYLite.GYRadioButton>SkinManager.createBtn2(s, 28, 0, [btnAry[i].source, null, null, null, btnAry[i].sourceSel, btnAry[i].sourceSel, btnAry[i].sourceSel, btnAry[i].sourceSel], URLConf.mainImg + 'd1sheet.png', null, GYLite.GYRadioButton, MyRadioButtonSkin)
                    btn.y = i * (btn.height + 30) + 100
                    btn.radioGroup = radioGroup
                    btn['eventname'] = 'btn_' + i
                    if (i == 0) {
                        btn.radioGroup.selectedButton = btn
                    }
                    let bg = SkinManager.createImage(s, 20, btn.y + btn.height, 'rms_top_list_tab_line_png', URLConf.mainImg + 'd1sheet.png')
                } else {

                    let btn = <GYLite.GYRadioButton>SkinManager.createBtn2(s, 28, 0, [Conf.img + btnAry[i].source, null, null, null, Conf.img + btnAry[i].sourceSel, Conf.img + btnAry[i].sourceSel, Conf.img + btnAry[i].sourceSel, Conf.img + btnAry[i].sourceSel], null, null, GYLite.GYRadioButton, MyRadioButtonSkin)
                    btn.y = i * (btn.height + 30) + 100
                    btn.radioGroup = radioGroup
                    btn['eventname'] = 'btn_' + i
                    if (i == 0) {
                        btn.radioGroup.selectedButton = btn
                    }

                    let bg = SkinManager.createImage(s, 20, btn.y + btn.height, 'rms_top_list_tab_line_png', URLConf.mainImg + 'd1sheet.png')
                }

            }

            s.list = SkinManager.createListV(s, 290, 60, 716, 330, RankDialogItem)
            s.list.canDrag = true

            let myrankbg = SkinManager.createScaleImage(s, 290, s.list.y + s.list.height + 35, 'rms_top_list_my_info_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(24, 24, 24, 24))
            myrankbg.width = s.list.width
            let myranktit = SkinManager.createImage(s, 0, 0, 'rms_top_list_my_info_title_png', URLConf.mainImg + 'd1sheet.png')
            myranktit.x = (122 - myranktit.width >> 1) + myrankbg.x
            myranktit.y = (myrankbg.height - myranktit.height >> 1) + myrankbg.y

            s.myicon = SkinManager.createImage(s, 900, myranktit.y, 'game_cion_gold_small_png', URLConf.mainImg + 'd1sheet.png')

            s.myrankText = SkinManager.createText(s, myrankbg.x + 140, 0, '????')
            s.myrankText.y = (myrankbg.height - s.myrankText.height >> 1) + myrankbg.y + 2
            s.myrankNum = SkinManager.createText(s, s.myicon.x + s.myicon.width + 5, s.myrankText.y, '0')

            s.bindEvent()

        }

        private bindEvent(): void {
            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(e: egret.Event): void {
            const s = this
            if (e.target['eventname']) {

                switch (e.target['eventname']) {
                    case 'btn_0':
                        s.type = 1

                        break
                    case 'btn_1':
                        s.type = 2
                        break
                    case 'btn_2':
                        s.type = 1
                        break
                    case 'btn_3':
                        s.type = 2
                        break
                    case 'btn_4':
                        s.type = 1
                        break
                    case 'close':
                        s.hide()
                        break
                }

                s.myicon.source = Main.instance.getRes('game_cion_silver_small_png', URLConf.mainImg + 'd1sheet.png')
            }
        }

        /**
         * 更新列表数据
         */
        public updateRankList(d): void {
            const s = this
            if (d.length == 0) return
            s.list.dataProvider = d
        }

        public show(): void {

            let s = this

            LayerManager.getInstance().setTopMask(true);
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

            // GameModel.getInstance().selectWinRank({
            //     type: 1,
            //     today: 1
            // })

            let ary = []
            for (let i = 0; i < 10; i++) {

                let o = {
                    "userId": 81342587,
                    "nickName": "新用户1",
                    "avatar": "a",
                    "type": "2",
                    "num": "100000",
                    "rank": i + 1
                }
                ary.push(o)
            }

            s.list.dataProvider = ary
        }

        public hide(): void {

            let s = this
            LayerManager.getInstance().setTopMask(false);
            (s.parent as any).removeElement(s);

        }
    }

    export class RankDialogItem extends GYLite.ItemRender {


        private rankImg: GYLite.GYImage
        private rankText: GYLite.GYText
        private head: GYLite.GYImage
        private nickname: GYLite.GYText
        private money: GYLite.GYText
        private icon: GYLite.GYImage

        constructor() {
            super()
            const s = this

            s.width = 716
            s.height = 330 / 5
            s.rankImg = SkinManager.createImage(s, 0, 0, '')
            s.rankImg.visible = false
            s.rankText = SkinManager.createText(s, 0, 0, '')
            s.rankText.width = 122
            s.rankText.textAlign = 'center'
            s.rankText.visible = false

            let bg = SkinManager.createImage(s, 140, 0, 'user_head_bg_84_76_png', URLConf.mainImg + 'd1sheet.png')
            let scale = bg.width / bg.height
            bg.width = s.height - 10
            bg.height = (s.height - 10) / scale
            bg.y = (s.height - 10) - bg.height >> 1
            s.head = SkinManager.createImage(s, bg.x + 9, bg.y + 6, '')
            s.head.width = s.height - 29
            s.head.height = s.height - 29
            TemplateTool.setBorderRadius(s.head)

            s.icon = SkinManager.createImage(s, 610, 0, '')
            s.icon.verticalCenter = 0

            s.nickname = SkinManager.createText(s, bg.x + bg.width + 5, 0, '')
            s.nickname.verticalCenter = 0

            s.money = SkinManager.createText(s, 0, 0, '')
            s.money.verticalCenter = 2

        }

        public setData(d: any): void {

            const s = this
            if (!d) {
                s.visible = false;
                return;
            }
            s.visible = true;

            if (d.rank <= 3) {

                let filename = d.rank == 1 ? '1st' : d.rank == 2 ? '2nd' : '3rd'
                s.rankImg.source = Main.instance.getRes(`rms_top_list_${filename}_png`, URLConf.mainImg + 'd1sheet.png')
                s.rankImg.visible = true
                s.rankText.visible = false
            } else {
                s.rankImg.visible = false
                s.rankText.text = d.rank + 'TH'
                s.rankText.y = s.height - s.rankText.height >> 1
                s.rankText.visible = true
            }

            s.head.source = Main.instance.getRes(d.avatar, Conf.img + 'head.png')
            s.nickname.text = d.nickName
            s.icon.source = Main.instance.getRes(d.type == 1 ? 'game_cion_gold_small_png' : 'game_cion_silver_small_png', URLConf.mainImg + 'd1sheet.png')
            s.money.text = UtilTool.formatBet(Number(d.num))
            s.money.x = s.icon.x + s.icon.width + 5

        }
    }
}