module login {
	export class Module extends ModuleBase {
		public back: GYLite.GYImage;
		public leftTopBtn: GYLite.GYButton;
		public rightTopBtn: GYLite.GYButton;
		public leftBottomBtn: GYLite.GYButton;
		public rightBottomBtn: GYLite.GYButton;
		// public fireClip: GYMovieClip;


		public loginView: LoginLayout

		public constructor() {
			super();
		}
		public modulePreStart(): void {
			let s = this;
			super.modulePreStart();
			s.back = SkinManager.createImage(s, 0, 0, Conf.img + "rms_login_bg.jpg");
			s.back.left = s.back.right = s.back.top = s.back.bottom = 0;
			s.leftTopBtn = SkinManager.createBtn2(s, 0, 0, ["rms_btn_bg_3"], Conf.atlas);
			s.leftTopBtn.y = -LayerManager.getInstance().gameSpriteTop;
			s.leftTopBtn.x = -LayerManager.getInstance().gameSpriteLeft;
			s.leftTopBtn.label = "y:" + s.leftTopBtn.y;
			s.rightTopBtn = SkinManager.createBtn2(s, 0, 0, ["rms_btn_bg_3"], Conf.atlas);
			s.rightTopBtn.y = -LayerManager.getInstance().gameSpriteTop;
			s.rightTopBtn.x = s.width + LayerManager.getInstance().gameSpriteLeft - s.rightTopBtn.width;
			s.rightTopBtn.label = "y:" + s.rightTopBtn.y;
			s.leftBottomBtn = SkinManager.createBtn2(s, 0, 0, ["rms_btn_bg_3"], Conf.atlas);
			s.leftBottomBtn.y = s.height + LayerManager.getInstance().gameSpriteTop - s.leftBottomBtn.height;
			s.leftBottomBtn.x = -LayerManager.getInstance().gameSpriteLeft;
			s.leftBottomBtn.label = "y:" + s.leftBottomBtn.y;
			s.rightBottomBtn = SkinManager.createBtn2(s, 0, 0, ["rms_btn_bg_3"], Conf.atlas);
			s.rightBottomBtn.y = s.height + LayerManager.getInstance().gameSpriteTop - s.rightBottomBtn.height;
			s.rightBottomBtn.x = s.width + LayerManager.getInstance().gameSpriteLeft - s.rightBottomBtn.width;
			s.rightBottomBtn.label = "y:" + s.rightBottomBtn.y;

			// s.fireClip = new GYMovieClip();
			// s.fireClip.setDataPath(Conf.img + "war_fire_clips.json", Conf.img + "war_fire_clips.png");
			// s.fireClip.setMovieName("fire");
			// s.fireClip.play(-1);
			// s.fireClip.x = 500;
			// s.fireClip.y = 500;
			// s.addElement(s.fireClip);

			this.loginView = LoginLayout.getInstance()
			s.loginView.layout(s)

		}
		protected start(): void {
			let s = this;

			const loginType = {
				/*密码登录*/
				'1': () => {
					LoginModel.getInstance().loginPwd(s.loginView.phone, s.loginView.passw, () => {
						UIControl.getInstance().closeCurUI()
						UIControl.getInstance().openUI('main')
						BaseWar.getInstance().trigger('clear_login_all_info')
					})
				},
				/*验证码登录*/
				'2': () => {
					LoginModel.getInstance().loginCode(s.loginView.phone, s.loginView.code, () => {
						UIControl.getInstance().closeCurUI()
						UIControl.getInstance().openUI('main')
						BaseWar.getInstance().trigger('clear_login_all_info')
					})
				},
				/*找回密码*/
				'3': () => {
					LoginModel.getInstance().resetPwd({
						username: s.loginView.phone,
						password: s.loginView.passw,
						code: s.loginView.code
					}, () => {

						BaseWar.getInstance().trigger('clear_login_info')
						s.loginView.switchMode('1')
					})
				},
				/*注册*/
				'4': () => {
					LoginModel.getInstance().register({
						username: s.loginView.phone,
						password: s.loginView.passw,
						nickname: s.loginView.nickname,
						code: s.loginView.code
					}, () => {

						BaseWar.getInstance().trigger('clear_login_info')
						s.loginView.switchMode('1')
					})
				}
			}

			/*登录*/
			s.loginView.bindLogin((loginBtnType) => {

				console.log(s.loginView.phone);
				console.log(s.loginView.passw);
				console.log(s.loginView.code);
				console.log(loginBtnType);

				loginType[loginBtnType] && loginType[loginBtnType]()

			}, s)

			/*发送验证码*/
			s.loginView.bindSend(() => {

				console.log(s.loginView.phone);
				console.log(s.loginView.code);

				LoginModel.getInstance().sendSms(s.loginView.phone, () => {

				})

			}, s)
		}
		protected ready(): void {

		}
	}
}