class VersionCompUtil {
  public constructor() {
  }
  /**
   * 当前版本是否大于或等于比较版本
   * @param curV 当前版本
   * @param reqV 比较版本
   */
  public static compare(curV: string, reqV: string): boolean {
    if (!curV || !reqV) return false;
    if (curV == reqV) return true;
    if (curV && reqV) {
      //将两个版本号拆成数字
      let arr1 = curV.split('.');
      let arr2 = reqV.split('.');
      let minLength = Math.min(arr1.length, arr2.length);
      let position = 0;
      let diff = 0;
      //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
      while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {
        position++;
      }
      diff = (diff != 0) ? diff : (arr1.length - arr2.length);
      //若curV大于reqV，则返回true
      return diff > 0;
    } else {
      //输入为空
      return false;
    }
  }
}

