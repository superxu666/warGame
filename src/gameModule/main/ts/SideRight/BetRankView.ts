/**
 * 下注排行
 */

module main {
    export class BetRankView extends GYLite.GYUIComponent {

        private static _instance: BetRankView

        public static getInstance(): BetRankView {

            return BetRankView._instance || (BetRankView._instance = new BetRankView)
        }

        private tabBtn: TabButton
        private list: GYLite.GYListV
        private list2: GYLite.GYListV
        private type: any

        constructor() {
            super()
            const s = this

            s.type = 1
            s.tabBtn = new TabButton
            s.tabBtn.x = 62
            s.tabBtn.y = 92
            s.addElement(s.tabBtn)

            let g = SkinManager.createImage(s, 220, 130, 'war_top_gold_png', URLConf.gameImg + 'w1sheet.png')
            let y = SkinManager.createImage(s, g.x + g.width, g.y, 'war_top_silver_png', URLConf.gameImg + 'w1sheet.png')

            s.list = SkinManager.createListV(s, 55, 178, 230, 376, BetRankItem)
            s.list.scrollerPolicy = 2

            s.list2 = SkinManager.createListV(s, 55, 178, 230, 376, BetRankItem)
            s.list2.scrollerPolicy = 2
            s.list2.visible = false

            s.bindEvent()
        }

        private bindEvent(): void {
            const s = this
            s.tabBtn.bindClick(s.handleTabClick, s)
        }

        private handleTabClick(type: number): void {

            const s = this
            s.type = type
            if (type == 1) { // 下注排行

                s.list.visible = true
                s.list2.visible = false

                UtilTool.clickSound()
                GameModel.getInstance().getBettingRank()
            } else { // 上轮赢家

                s.list2.visible = true
                s.list.visible = false

                UtilTool.clickSound()
                let lastWin = GameModel.getInstance().lastWinRank
                lastWin = lastWin.map(item => {
                    return {
                        ...item,
                        betgold: item.wingold,
                        betsilver: item.winsilver
                    }
                })
                s.updateHistoryRankList(lastWin)
            }

        }

        /**
         * 刷新列表数据
         */
        public updateRankList(d: any[]): void {
            const s = this
            s.list.dataProvider = d
        }

        private updateHistoryRankList(d: any[]): void {
            const s = this
            s.list2.dataProvider = d
        }

    }

    export class BetRankItem extends GYLite.ItemRender {

        private head: GYLite.GYImage
        private username: GYLite.GYText
        private money: GYLite.GYText

        constructor() {
            super()
            const s = this

            s.width = 230
            s.height = 376 / 10
            s.head = SkinManager.createImage(s, 0, 0, '', URLConf.gameImg + 'w1sheet.png')
            s.head.width = 34
            s.head.height = 34
            TemplateTool.setBorderRadius(s.head)

            s.username = SkinManager.createText(s, s.head.x + s.head.width + 2, 16, '')
            s.username.size = 12

            s.money = SkinManager.createText(s, s.head.x + s.head.width + 110, s.username.y, '')
            s.money.width = 85
            s.money.size = 13
            s.money.textAlign = 'center'

            s.bindEvent()

        }

        private bindEvent(): void {
            const s = this
            s.touchEnabled = true
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(): void {
            const s = this
            UtilTool.clickSound()
            MainModel.getInstance().getInfoById(s._data.userId)
        }

        public setData(d: any): void {
            const s = this
            if (!d) {
                s.visible = false;
                return;
            }
            s.visible = true;
            s._data = d

            d.avatar && (s.head.source = Main.instance.getRes(d.avatar, Conf.img + 'head.png'))
            let grade = UtilTool.getGrade(d.exp)
            s.username.htmlText = `<font color=${NickNameColor.colorSets[grade]}>${d.nickName}</font>`
            s.money.htmlText = `<font color=0xEFCD02>${UtilTool.formatBet(d.betgold)}</font> ${UtilTool.formatBet(d.betsilver)}`

        }


    }
}