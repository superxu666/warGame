module main {
	export class Module extends ModuleBase {

		public back: GYLite.GYImage
		public btn: GYLite.GYButton

		public sideLeft: GYLite.GYImage

		public gameView: GameView
		public betView: BetView
		public trumpetTop: TrumpetTopView
		public sideTopRight: SideTopRightView
		public sideTopLeft: SideTopLeftView
		public sideBottomMid: SideBottomMidView


		public constructor() {
			super();
		}

		public modulePreStart(): void {
			super.modulePreStart();

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

			/*背景图*/
			s.back = SkinManager.createImage(s, 0, 0, URLConf.mainImg + "war_bg_2.jpg");
			s.back.horizonalCenter = s.back.verticalCenter = 0

			/*轮盘背后的下注数量区*/
			s.betView = BetView.getInstance()
			s.betView.horizonalCenter = 3
			s.betView.bottom = 350
			s.addElement(s.betView)

			/*游戏轮盘*/
			s.gameView = GameView.getInstance()
			s.gameView.horizonalCenter = 0
			s.gameView.bottom = 340
			s.addElement(s.gameView)

			/*中间顶部, 大喇叭*/
			s.trumpetTop = TrumpetTopView.getInstance()
			s.trumpetTop.horizonalCenter = 0
			s.trumpetTop.y = 200
			s.addElement(s.trumpetTop)

			/*左上,用户信息面板*/
			s.sideTopLeft = SideTopLeftView.getInstance()
			s.sideTopLeft.left = 280
			s.sideTopLeft.verticalCenter = 0
			s.addElement(s.sideTopLeft)

			/*中间底部,下注按钮区*/
			s.sideBottomMid = SideBottomMidView.getInstance()
			s.sideBottomMid.bottom = 200
			s.sideBottomMid.horizonalCenter = 0
			s.addElement(s.sideBottomMid)

			/*右上,离开排行榜区*/
			s.sideTopRight = SideTopRightView.getInstance()
			s.sideTopRight.right = 280
			s.sideTopRight.verticalCenter = 0
			s.addElement(s.sideTopRight)


			/*已登录, 请求个人信息*/
			if (UserData.getInstance().token) {

				PersonalModel.getInstance().getMyInfo((res) => {
					s.sideTopLeft.notifyChatView(res)
				})


				/*倒计时开始*/
				GameTime.getInstance().run()

			}

			/*绑定document键盘事件, 调用事件中转类派发事件, 目前只有聊天室用到回车事件*/
			document.addEventListener('keydown', s.handleKeyborad.bind(s))

			// SoundManager.instance.playBGM(Conf.sound + 'gamebgm.mp3')
			
		}

		private handleKeyborad(e): void {

			if (e.keyCode == 13) {
				EventTranspond.getInstance().transpond()
			}
		}

		public hide(): void {
			let s = this;
			super.hide();

			SoundManager.instance.closeBGM()

			TheFirstGame.getInstance().isFirstGame = false
		}


		private handleMessage(e): void {
			let s = this
		}

		private loginout(): void {

			let s = this

			PersonalModel.getInstance().logout()

		}
	}
}