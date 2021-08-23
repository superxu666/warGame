module main {
    export class Rank4 extends GYLite.GYUIComponent {

        private static _instance: Rank4

        public static getInstance(): Rank4 {

            return Rank4._instance || (Rank4._instance = new Rank4)
        }

        private itemSets: Object

        constructor() {
            super()
            const s = this
            let lastHeigth = 0
            s.itemSets = {}
            for (let i = 0; i < 4; i++) {

                if (i % 2 == 1) {
                    let item: Rank4ItemL = new Rank4ItemL
                    s.addElement(item)
                    item.x = 116
                    if (i < 2) {
                        item.y = 128
                    } else {
                        item.y = 188
                        item.reverseback = true
                    }

                    s.itemSets[i - 1] = item
                } else {
                    let item: Rank4ItemR = new Rank4ItemR
                    s.addElement(item)
                    item.x = 395
                    if (i < 2) {
                        item.y = 128
                    } else {
                        item.y = 188
                        item.reverseback = true
                    }
                    s.itemSets[i + 1] = item
                }

            }

        }

        public updateRankView(d: any[]) {

            const s = this
            for (let i = 0, len = d.length; i < len; i++) {

                if (i == 0) {
                    s.itemSets[i].setData(d[i], true)
                } else {
                    s.itemSets[i].setData(d[i])
                }
            }

        }


    }

    export class Rank4ItemL extends GYLite.GYUIComponent {

        public back: GYLite.GYImage
        public head: GYLite.GYImage
        public frame: GYLite.GYImage

        /*奖牌*/
        private medal: GYLite.GYImage
        private GText: GYLite.GYText
        private YText: GYLite.GYText
        private userNameText: GYLite.GYText

        constructor() {
            super()
            const s = this

            s.width = 175
            s.height = 58

            s.back = SkinManager.createImage(s, 0, 0, 'war_medal_top_list_item_bg_png', URLConf.gameImg + 'w1sheet.png')
            s.head = SkinManager.createImage(s, 0, 0, '')
            s.frame = SkinManager.createImage(s, 0, 0, 'war_medal_top_list_item_head_bg_png', URLConf.gameImg + 'w1sheet.png')
            s.head.width = s.frame.width
            s.head.height = s.frame.height
            s.head.verticalCenter = s.frame.verticalCenter = 0
            s.head.left = s.frame.left = 5

            s.medal = SkinManager.createImage(s, 0, 0, 'game_cion_silver_medal_small_png', URLConf.mainImg + 'd1sheet.png')
            s.userNameText = SkinManager.createText(s, s.frame.x + s.frame.width + 10, 5, '', 0xffffff, 14)

            let gbg = SkinManager.createImage(s, s.userNameText.x + 8, 23, 'war_medal_top_list_coin_bg_png', URLConf.gameImg + 'w3sheet.png')
            let ybg = SkinManager.createImage(s, s.userNameText.x + 8, 38, 'war_medal_top_list_coin_bg_png', URLConf.gameImg + 'w3sheet.png')
            let Gbg = SkinManager.createImage(s, s.userNameText.x, 14, 'war_top_gold_png', URLConf.gameImg + 'w1sheet.png')
            let Ybg = SkinManager.createImage(s, s.userNameText.x, 31, 'war_top_silver_png', URLConf.gameImg + 'w1sheet.png')
            s.GText = SkinManager.createText(s, 88, 25, '0', 0xEFCD02, 12)
            s.YText = SkinManager.createText(s, 88, 40, '0', 0xffffff, 12)

        }


        public set reverseback(bol: boolean) {

            const s = this
            if (bol) {
                s.back.anchorOffsetY = s.back.height
                s.back.skewX = 180
            }

        }


        public setData(d: any, isChampion?: any): void {

            const s = this

            if (isChampion) {
                s.medal.source = Main.instance.getRes('game_cion_gold_medal_small_png', URLConf.mainImg + 'd1sheet.png')
            }
            s.head.source = Main.instance.getRes(d.avatar, 'main/img/head.png')
            s.userNameText.text = d.nickName
            s.GText.text = d.wingold
            s.YText.text = d.winsilver
        }
    }

    export class Rank4ItemR extends GYLite.GYUIComponent {

        public back: GYLite.GYImage
        public head: GYLite.GYImage
        public frame: GYLite.GYImage

        /*奖牌*/
        private medal: GYLite.GYImage
        private GText: GYLite.GYText
        private YText: GYLite.GYText
        private userNameText: GYLite.GYText

        constructor() {
            super()
            const s = this

            s.width = 175
            s.height = 58

            s.back = SkinManager.createImage(s, 0, 0, 'war_medal_top_list_item_bg_png', URLConf.gameImg + 'w1sheet.png')
            s.back.anchorOffsetX = s.back.width
            s.back.skewY = 180
            s.head = SkinManager.createImage(s, 0, 0, '')
            s.frame = SkinManager.createImage(s, 0, 0, 'war_medal_top_list_item_head_bg_png', URLConf.gameImg + 'w1sheet.png')
            s.head.width = s.frame.width
            s.head.height = s.frame.height
            s.head.verticalCenter = s.frame.verticalCenter = 0
            s.head.right = s.frame.right = 5

            s.medal = SkinManager.createImage(s, 0, 0, 'game_cion_silver_medal_small_png', URLConf.mainImg + 'd1sheet.png')
            s.medal.right = 0
            s.userNameText = SkinManager.createText(s, 0, 5, '', 0xffffff, 14)
            s.userNameText.right = s.frame.x + s.frame.width + 10


            let gbg = SkinManager.createImage(s, 0, 23, 'war_medal_top_list_coin_bg_png', URLConf.gameImg + 'w3sheet.png')
            gbg.anchorOffsetX = gbg.width
            gbg.skewY = 180
            let ybg = SkinManager.createImage(s, 0, 38, 'war_medal_top_list_coin_bg_png', URLConf.gameImg + 'w3sheet.png')
            ybg.anchorOffsetX = ybg.width
            ybg.skewY = 180
            let Gbg = SkinManager.createImage(s, 0, 14, 'war_top_gold_png', URLConf.gameImg + 'w1sheet.png')
            let Ybg = SkinManager.createImage(s, 0, 31, 'war_top_silver_png', URLConf.gameImg + 'w1sheet.png')
            Gbg.right = Ybg.right = s.userNameText.right
            s.GText = SkinManager.createText(s, 0, 25, '0', 0xEFCD02, 12)
            s.YText = SkinManager.createText(s, 0, 40, '0', 0xffffff, 12)
            s.GText.right = s.YText.right = 88

        }

        public set reverseback(bol: boolean) {

            const s = this
            if (bol) {
                s.back.anchorOffsetY = s.back.height
                s.back.skewX = 180
            }

        }

        public setData(d: any): void {

            const s = this
            s.head.source = Main.instance.getRes(d.avatar, 'main/img/head.png')
            s.userNameText.text = d.nickName
            s.GText.text = d.wingold
            s.YText.text = d.winsilver
        }
    }
}