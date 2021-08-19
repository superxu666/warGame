/*下注类*/
module main {
    export class BetView extends GYLite.GYUIComponent {

        private static _instance: BetView

        public static getInstance(): BetView {
            return BetView._instance || (BetView._instance = new BetView)
        }

        private back: GYLite.GYImage

        private _jettonArr: any[]
        private _btns: Object
        /*选中的图片*/
        private _selected: GYLite.GYImage
        /*映射*/
        private _selectedSets: Object
        /*当前下注*/
        public curBet: number

        public GBtn: BetButton
        public YBtn: BetButton
        public keepingBtn: GYLite.GYButton

        constructor() {
            super()
            const s = this

            s.back = SkinManager.createImage(s, 0, 0, 'war_bet_setting_bg_png', URLConf.gameImg + 'w2sheet.png')

            s._jettonArr = [
                { itemName: '1', num: 1, source: 'war_bet_setting_selected_count_1_png' },
                { itemName: '10', num: 10, source: 'war_bet_setting_selected_count_10_png' },
                { itemName: '100', num: 100, source: 'war_bet_setting_selected_count_100_png' },
                { itemName: '1k', num: 1000, source: 'war_bet_setting_selected_count_1k_png' },
                { itemName: '1w', num: 10000, source: 'war_bet_setting_selected_count_1w_png' },
                { itemName: '5w', num: 50000, source: 'war_bet_setting_selected_count_5w_png' },
                { itemName: '10w', num: 100000, source: 'war_bet_setting_selected_count_10w_png' },
                { itemName: 'all', num: -1, source: 'war_bet_setting_selected_count_all_png' },
            ]
            s._btns = {}
            s._selectedSets = {}

            for (let i = 0; i < s._jettonArr.length; i++) {

                let item = s._jettonArr[i]
                let btnBg = SkinManager.createImage(s, 0, 0, 'war_bet_setting_selected_count__bormal_bg_png', URLConf.gameImg + 'w1sheet.png')
                let selected = SkinManager.createImage(s, 0, 0, 'war_bet_setting_selected_count_bg_png', URLConf.gameImg + 'w1sheet.png')
                btnBg.width = 48
                if (i < 4) {

                    btnBg.x = 106 + i * (btnBg.width + 2)
                    btnBg.y = 30
                } else {

                    let ii = i - 4
                    btnBg.x = 106 + ii * (btnBg.width + 2)
                    btnBg.y = 30 + btnBg.height + 2
                }
                selected.x = btnBg.x
                selected.y = btnBg.y
                selected.visible = false

                let btn = SkinManager.createBtn2(s, 0, 0, [item.source], URLConf.gameImg + 'w1sheet.png')
                btn.x = btnBg.x + (btnBg.width - btn.width >> 1)
                btn.y = btnBg.y + (btnBg.height - btn.height >> 1)
                s.addElement(btn)
                /*按钮名*/
                btn['itemName'] = item['itemName']
                btn['betNum'] = item['num']
                /*真实按钮映射对象*/
                s._btns[item['itemName']] = btn
                /*选中的图片映射对象*/
                s._selectedSets[item['itemName']] = selected
            }


            let selectionGroup = new SelectionGroup
            s.GBtn = new BetButton()
            s.GBtn.touchEnabled = true
            s.GBtn.type = 1
            s.GBtn.selectionGroup = selectionGroup
            selectionGroup.curSelection = s.GBtn
            s.GBtn.x = 320
            s.GBtn.verticalCenter = 0
            s.GBtn.setData({
                background: 'war_bet_setting_selected_count__bormal_bg_png',
                source: 'war_gold_img_png',
                select: 'war_bet_setting_selected_count_bg_png',
                alias: URLConf.gameImg + 'w1sheet.png'
            })
            s.addElement(s.GBtn)

            s.YBtn = new BetButton()
            s.YBtn.touchEnabled = true
            s.GBtn.type = 2
            s.YBtn.selectionGroup = selectionGroup
            s.YBtn.x = s.GBtn.x + s.GBtn.width + 5
            s.YBtn.verticalCenter = 0
            s.YBtn.setData({
                background: 'war_bet_setting_selected_count__bormal_bg_png',
                source: 'war_silver_img_png',
                select: 'war_bet_setting_selected_count_bg_png',
                alias: URLConf.gameImg + 'w1sheet.png'
            })
            s.addElement(s.YBtn)


            s.keepingBtn = SkinManager.createBtn2(s, 0, 0, ['war_bet_setting_continue_btn_png'], URLConf.gameImg + 'w1sheet.png')
            s.keepingBtn.right = 70
            s.keepingBtn.verticalCenter = 0

            s.bindEvent()

            // TemplateTool.openDrag(s)

        }

        private bindEvent(): void {
            const s = this

            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(e: egret.TouchEvent): void {
            const s = this
            if (e.target['itemName']) {
                console.log(e.target['itemName']);
                let itemName = e.target['itemName']
                if (s._selected) s._selected.visible = false
                s._selectedSets[itemName].visible = true
                s._selected = s._selectedSets[itemName]

                console.log(e.target['betNum']);

            }
        }

        /*重置按钮*/
        public resetState(): void {

            const s = this
            if (s._selected) s._selected.visible = false
        }


    }

}