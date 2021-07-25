class FilterUtil {
	public constructor() {
	}
	/**使用颜色矩阵改变图片颜色
	 * @param display 显示对象
	 * @param color 16进制颜色值
	 * @param alpha 16进制补偿值
	*/
	public static setDisplayColor(display:egret.DisplayObject, color: number, offset:number=0):void {
		if(color != color)
		{
			display.filters = null;
			return;
		}
		// 将16进制颜色分割成argb值
		let spliceColor = (color) => {
			let result = {r: -1, g: -1, b: -1,a:-1};
			result.b = color & 0xff;
			result.g = (color >>> 8) & 0xff;
			result.r = (color >>> 16) & 0xff;
			result.a = (color >>> 24) & 0xff;
			return result;
		}
		let result = spliceColor(color);
		let offsetResult = spliceColor(offset);
		let colorMatrix = [
			1, 0, 0, 0, 0,
			0, 1, 0, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 0, 1, 0
		];
		colorMatrix[0] = result.r / 255;
		colorMatrix[6] = result.g / 255;
		colorMatrix[12] = result.b / 255;
		colorMatrix[18] = result.a / 255;
		colorMatrix[4] = offsetResult.r / 255;
		colorMatrix[9] = offsetResult.g / 255;
		colorMatrix[14] = offsetResult.b / 255;
		colorMatrix[19] = offsetResult.a / 255;
		let colorFilter = new egret.ColorMatrixFilter(colorMatrix);

		display.filters = [colorFilter];
	}
}