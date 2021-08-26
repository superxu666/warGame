module main {
    export class SideBottomMidView extends GYLite.GYUIComponent {

        private static _instance: SideBottomMidView

        public static getInstance(): SideBottomMidView {

            return SideBottomMidView._instance || (SideBottomMidView._instance = new SideBottomMidView)
        }

        private items: Object

        constructor() {
            super()
            const s = this

            s.height = 128
            s.items = {}

            //i  a  b  c  d  k  h  g  f  e  j
            const itemArr = [
                { itemName: 'i', source: 'war_bet_item_tribal_png', multiple: 'war_bet_mutiple_2_png' },
                { itemName: 'a', source: 'war_bet_item_orc_png', multiple: 'war_bet_mutiple_6_png' },
                { itemName: 'b', source: 'war_bet_item_warlock_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'c', source: 'war_bet_item_minotaur_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'd', source: 'war_bet_item_chief_png', multiple: 'war_bet_mutiple_12_png' },
                { itemName: 'k', source: 'war_bet_item_dragon_png', multiple: 'war_bet_mutiple_24_99_png' },
                { itemName: 'h', source: 'war_bet_item_king_png', multiple: 'war_bet_mutiple_12_png' },
                { itemName: 'g', source: 'war_bet_item_knight_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'f', source: 'war_bet_item_master_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'e', source: 'war_bet_item_warrior_png', multiple: 'war_bet_mutiple_6_png' },
                { itemName: 'j', source: 'war_bet_item_union_png', multiple: 'war_bet_mutiple_2_png' },
            ]

            let firstItme: BottomMidViewItem = null
            for (let i = 0, len = itemArr.length; i < len; i++) {

                const betItem = new BottomMidViewItem
                s.items[itemArr[i].itemName] = betItem
                s.addElement(betItem)
                if (!firstItme) {
                    firstItme = betItem
                }
                betItem.x = i * firstItme.width
                betItem.setData(itemArr[i])
                betItem.bindChangeNum(s.handleChangeBetItemNum, s)
            }

        }

        public handleChangeBetItemNum(): void {
            const s = this

            let sum_g = 0
            let sum_y = 0
            for (let key in s.items) {

                let item: BottomMidViewItem = s.items[key]
                let g = Number(item.G.text)
                let y = Number(item.Y.text)

                sum_g += g
                sum_y += y
            }

            BetModel.getInstance().setCurrentRoundSum(sum_g, sum_y)

        }


        /*清空下注台*/
        public clearBet() {
            const s = this

            let last_sum = []
            for (let key in s.items) {
                let item: BottomMidViewItem = s.items[key]
                let g = Number(item.G.text)
                let y = Number(item.Y.text)
                if (g || y) {

                    let o = {}
                    o['role'] = key

                    if (g) {
                        if (!o['infos']) {
                            o['infos'] = []
                        }
                        o['infos'].push({
                            type: '1',
                            num: g
                        })
                    }
                    if (y) {
                        if (!o['infos']) {
                            o['infos'] = []
                        }
                        o['infos'].push({
                            type: '2',
                            num: y
                        })
                    }
                    last_sum.push(o)
                }

                item.handleReset()
            }

            BetModel.getInstance().setLastRoundSum(last_sum)
            BetModel.getInstance().setCurrentRoundSum(0, 0)
        }

        /*续压*/
        public keeping(ary: any[]) {
            const s = this
            for (let i = 0, len = ary.length; i < len; i++) {

                let data = ary[i]
                let key = data['role']
                let infos = data['infos']
                let item: BottomMidViewItem = s.items[key]

                for (let j = 0, len_j = infos.length; j < len_j; j++) {

                    let info = infos[j]
                    item.add(info.type, info.num)
                    item.slideUp()
                }

            }
        }

    }

    export class BottomMidViewItem extends GYLite.GYUIComponent {


        private back: GYLite.GYImage
        private itemImg: GYLite.GYImage
        public G: GYLite.GYText
        public Y: GYLite.GYText
        private itemName: string
        private multiple: GYLite.GYImage
        private subItem: GYLite.GYUIComponent

        constructor() {
            super()
            const s = this
            s.width = 74
            s.height = 128

            s.back = SkinManager.createImage(s, 0, 0, 'war_bet_item_coin_bg_png', URLConf.gameImg + 'w1sheet.png')
            s.back.horizonalCenter = 0

            s.G = SkinManager.createText(s, 0, 60 + 24, '0', 0xEFCD02, 12)
            s.Y = SkinManager.createText(s, 0, s.G.y + s.G.height + 5, '0', 0xffffff, 12)
            s.G.horizonalCenter = s.Y.horizonalCenter = 0

            s.subItem = new GYLite.GYUIComponent
            s.subItem.x = 2
            s.subItem.y = 60
            s.addElement(s.subItem)

            s.itemImg = new GYLite.GYImage
            s.itemImg.x = 0
            s.itemImg.y = 0
            s.subItem.addElement(s.itemImg)

            s.multiple = new GYLite.GYImage
            s.multiple.horizonalCenter = 0
            s.multiple.bottom = 10
            s.subItem.addElement(s.multiple)


            // TemplateTool.setBackGrapics(s)
            s.bindEvent()
        }

        private bindEvent(): void {

            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        public handleClick(): void {
            const s = this

            // 锁定中, 不可点击
            if (GameTime.getInstance().timeOut) return
            UtilTool.clickSound()
            s.slideUp()
            // console.log('当前下注: ', s.itemName);
            let result = BetModel.getInstance().setBetSets(s.itemName)
            s.add(result.type, result.num)
        }

        public handleReset(): void {
            const s = this
            s.subItem.y = 60
            s.G.text = '0'
            s.Y.text = '0'
        }

        /*追击下注金额*/
        public add(type, num): void {

            const s = this
            let appendNum = 0
            if (type == 1) {
                appendNum = (Number(s.G.text) + num)
                s.G.text = (Number(s.G.text) + num).toString()
            } else {
                appendNum = (Number(s.Y.text) + num)
                s.Y.text = (Number(s.Y.text) + num).toString()
            }

            s.changeCallback && s.changeCallback.call(s.changeThisobj)
        }

        /*追加之后, 刷新UI*/
        public slideUp(): void {
            const s = this
            s.subItem.y = 0
        }

        private changeCallback: Function
        private changeThisobj: any
        public bindChangeNum(callback: Function, thisobj: any): void {
            const s = this
            s.changeCallback = callback
            s.changeThisobj = thisobj
        }

        public setData(d: any): void {
            const s = this
            s.itemName = d.itemName
            s.itemImg.source = Main.instance.getRes(d.source, URLConf.gameImg + 'w1sheet.png')
            s.multiple.source = Main.instance.getRes(d.multiple, URLConf.gameImg + 'w1sheet.png')
            let len = s.numElement
            while (--len > -1) {
                let child = s.getElementAt(len)
                child.touchEnabled = true
            }
        }

    }
}