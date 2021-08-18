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
        private _selected: GYLite.GYImage
        private _selectedSets: Object
        public curBet: number

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
                btn['itemName'] = item['itemName']
                s._btns[item['itemName']] = btn
                s._selectedSets[item['itemName']] = selected
            }

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


            }
        }


    }

}