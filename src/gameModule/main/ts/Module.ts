module main {
	export class Module extends ModuleBase {
		public constructor() {
			super();
		}

		public modulePreStart(): void {

			let sdf = new SocketModel
			sdf.send('sadfkajsdof')
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