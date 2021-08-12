module main {
	export class Module extends ModuleBase {

		public btn: GYLite.GYButton

		public constructor() {
			super();
		}

		public modulePreStart(): void {

			let s = this

			s.btn = SkinManager.createBtn(s, 500, 500, 'rms_login_input_bg_png', null, null, login.Conf.main + 'img/d2sheet.png')
			s.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){

				login.LoginModel.getInstance().logout((res)=>{

					UIControl.getInstance().closeCurUI()
					UIControl.getInstance().openUI('login')
				})
			}, s)

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
		}

		public hide(): void {
			let s = this;
			super.hide();
		}
	}
}