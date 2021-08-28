module main {
    export class CardEffect extends GYLite.GYUIComponent {

        private static _instance: CardEffect

        public static getInstance(): CardEffect {
            return CardEffect._instance || (CardEffect._instance = new CardEffect)
        }


        private card: GYLite.GYImage
        private tween: GYLite.GYTween
        private mulit: GYLite.GYText
        private cardName: GYLite.GYText
        private starAry: any[]

        constructor() {
            super()
            const s = this
            s.starAry = []

            s.width = 400
            s.height = 500
            s.anchorOffsetX = s.width / 2
            s.anchorOffsetY = s.height / 2
            s.card = SkinManager.createImage(s, 0, 0, '')
            s.card.width = 330
            s.card.height = 426
            s.card.x = s.width - s.card.width >> 1
            s.card.y = s.height - s.card.height >> 1

            for (let i = 0; i < 5; i++) {
                let star = SkinManager.createImage(s, 0, 336, 'war_res_card_start_png', URLConf.gameImg + 'w3sheet.png')
                star.visible = false
                star.scaleX = 0.6
                star.scaleY = 0.6
                s.starAry.push(star)
            }

            s.cardName = SkinManager.createText(s, 0, 294, '战士', 0xffffff, 18, 'center', 150, 50)
            s.cardName.x = s.width - s.cardName.width >> 1
            s.cardName.stroke = 2
            s.cardName.strokeColor = 0x7D3C26

            s.mulit = SkinManager.createText(s, 0, 0, '', 0xffffff, 16, 'center', 46, 40)
            s.mulit.x = s.width - s.mulit.width >> 1
            s.mulit.y = 388

        }

        public show(pr: GYLite.GYSprite, paran: any): void {

            const s = this
            pr.addElement(s);

            let {
                x,
                y,
                cardUrl,
                alias,
                starNum,
                cardName,
                mulit
            } = paran

            // 倍数
            s.mulit.text = 'x' + mulit

            // 文字
            s.cardName.text = cardName

            // 卡片
            s.card.source = Main.instance.getRes(cardUrl, alias)

            // 星星
            let w = starNum * s.starAry[0].width * s.starAry[0].scaleX
            for (let i = 0; i < starNum; i++) {
                let star = s.starAry[i]
                star.x = i * (star.width * star.scaleX) + (s.width - w >> 1)
                star.visible = true
            }

            // 动画
            s.tween = GYLite.GYTween.to(s, [
                GYLite.TweenData.getInstance('scaleX', 1, 0),
                GYLite.TweenData.getInstance('scaleY', 1, 0),
                GYLite.TweenData.getInstance('x', pr.width >> 1, x),
                GYLite.TweenData.getInstance('y', pr.height >> 1, y)
            ], 800, 0, null, null, null, null, true, false)

        }

        public hide(): void {

            const s = this;
            if (s.parent) {
                (<any>s.parent).removeElement(s)
            }

            for (let i = 0, len = s.starAry.length; i < len; i++) {
                s.starAry[i].visible = false
            }

        }
    }
}