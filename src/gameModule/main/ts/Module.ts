module main {
	export class Module extends ModuleBase {

		public back: GYLite.GYImage
		public btn: GYLite.GYButton

		public mainimg: GYLite.GYImage
		public sideLeft: GYLite.GYImage

		public trumpetTop: TrumpetTopView
		public sideTopRight: SideTopRightView
		public sideTopLeft: SideTopLeftView
		public sideBottomMid: SideBottomMidView


		public constructor() {
			super();
		}

		public modulePreStart(): void {

			TheFirstGame.getInstance().isFirstGame = true
		}
		protected start(): void {
			super.start();
			let s = this;
		}
		private runGame(): void {
		}
		public resize(w: number, h: number): void {
		}
		public dispose(): void {
			super.dispose();
		}
		public show(pr: GYLite.GYSprite = null): void {
			let s = this;
			super.show(pr);


			s.back = SkinManager.createImage(s, 0, 0, URLConf.mainImg + "war_bg_2.jpg");
			s.back.horizonalCenter = s.back.verticalCenter = 0
			// s.back.left = s.back.right = s.back.top = s.back.bottom = 0;

			s.trumpetTop = TrumpetTopView.getInstance()
			s.trumpetTop.horizonalCenter = 0
			s.trumpetTop.y = 200
			s.addElement(s.trumpetTop)

			s.mainimg = SkinManager.createImage(s, 0, 0, 'war_tar_bg_png', URLConf.gameImg + 'w1sheet.png')
			s.mainimg.horizonalCenter = 0
			s.mainimg.verticalCenter = -30
			s.mainimg.touchEnabled = true
			s.mainimg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

				SideBottomMidView.getInstance().bet([
					{
						role: 'h',
						g: 10,
						y: 100
					},
					{
						role: 'j',
						g: 120,
						y: 20309
					}
				])
			}, s)


			s.sideTopLeft = SideTopLeftView.getInstance()
			s.sideTopLeft.left = 280
			s.sideTopLeft.verticalCenter = 0
			s.addElement(s.sideTopLeft)


			s.sideBottomMid = SideBottomMidView.getInstance()
			s.sideBottomMid.bottom = 200
			s.sideBottomMid.horizonalCenter = 0
			s.addElement(s.sideBottomMid)


			s.sideTopRight = SideTopRightView.getInstance()
			s.sideTopRight.right = 280
			s.sideTopRight.verticalCenter = 0
			s.addElement(s.sideTopRight)


			if (UserData.getInstance().token) {

				PersonalModel.getInstance().getMyInfo((res) => {
					s.sideTopLeft.renderPersonvalView(res)
					s.sideTopLeft.notifyChatView(res)
				})

				/*绑定登出按钮*/
				s.sideTopRight.bindLoginOut(s.loginout, s)


				// GameTime.getInstance().run()

			}


			// TemplateTool.openDrag(s)
			// TemplateTool.openDrag(s)

			document.addEventListener('keydown', s.handleKeyborad.bind(s))

		}

		private handleKeyborad(e): void {

			if (e.keyCode == 13) {
				EventTranspond.getInstance().transpond()
			}
		}

		public hide(): void {
			let s = this;
			super.hide();

			TheFirstGame.getInstance().isFirstGame = false
		}


		private handleMessage(e): void {
			let s = this
		}

		private loginout(): void {

			let s = this

			PersonalModel.getInstance().logout(() => {

				UIControl.getInstance().closeCurUI()
				UIControl.getInstance().openUI('login')
			})

		}
	}
}