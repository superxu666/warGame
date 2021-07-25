class OutlineUtil {
	private static _instance:OutlineUtil;
	public static getInstance():OutlineUtil
	{
		if(OutlineUtil._instance == null)
			new OutlineUtil;
		return OutlineUtil._instance;
	}
	private _rect:egret.Rectangle;
	private _renderTexture:egret.RenderTexture;
	public constructor() {
		let s = this;
		OutlineUtil._instance = s;
		s._rect = new egret.Rectangle;			
	}
	/**获取纹理外轮廓
	 * @param display 显示对象
	 * @param anglePrecision 角度精度 [0,360]，越小描点数越少，推荐10度0.1745329 或者 15度 0.2679491 或者 25度0.466307
	 * @param distancePrecision 距离精度 [1,显示对象尺寸]，越小描点数越少，推荐5
	 * @param 查询点间隔距离 [1,显示对象尺寸/4]，越小越精确，运算性能越低，推荐4
	 * @return number[][] 返回rect轮廓和多边形轮廓 [rectArray,polygonArray]
	*/
	public getDisplayOutLine(display:egret.DisplayObject,anglePrecision:number=0.1745329*0.5,distancePrecision:number=5,step:number=4):number[][]
	{
		let arr:number[],arr2:number[],arr3:number[],arr4:number[];
		let pixels:number[];
		let s = this;			
		if(distancePrecision > display.width / 2 || distancePrecision > display.height / 2)
		{				
			return [[0,0,display.width,0,display.width,display.height,0,display.height],[0,0,display.width,0,display.width,display.height,0,display.height]];
		}
		// let t:number = Date.now();
		if(s._renderTexture == null)
		{
			s._renderTexture = new egret.RenderTexture;
		}			
		s._rect.x = s._rect.y = 0;
		s._rect.width = display.width;
		s._rect.height = display.height;
		s._renderTexture.drawToTexture(display,s._rect);
		pixels = s._renderTexture.getPixels(0,0,display.width,display.height);			
		s._renderTexture.dispose();
		s._renderTexture = null;
		let col:number,row:number;
		let i:number,j:number,len:number,len2:number;
		let leftMinH:number,rightMinH:number,leftMaxH:number,rightMaxH:number;			
		let tx:number,ty:number;
		let lastInd:number,ind:number,temp:number;	
		let in1:boolean,in2:boolean,in3:boolean,in4:boolean;			
		if(display.width > display.height)
		{
			arr = [];
			arr2 = [];
			len = display.width;
			len2 = display.height;
			for(i=0;i<len;i+=step)
			{
				col = i * 4;
				in1 = in2 = false;
				for(j=0;j<len2;)
				{
					row = j * 4;
					ind = row * len;
					if(pixels[col + ind + 3] > 0)
					{
						if(j > 3)
						{
							row = (j - 2) * 4;
							ind = row * len;
							if(pixels[col + ind + 3] > 0)
							{
								row = (j - 3) * 4;
								ind = row * len;
								if(pixels[col + ind + 3] > 0)
								{
									arr[arr.length] = i;
									arr[arr.length] = j - 3;
								}
								else
								{
									arr[arr.length] = i;
									arr[arr.length] = j - 2;

								}
							}
							else
							{
								row = (j - 1) * 4;
								ind = row * len;
								if(pixels[col + ind + 3] > 0)
								{
									arr[arr.length] = i;
									arr[arr.length] = j - 1;
								}
								else
								{
									arr[arr.length] = i;
									arr[arr.length] = j;
								}
							}
						}
						else
						{
							arr[arr.length] = i;
							arr[arr.length] = j;								
						}
						in1 = true;
						break;	
					}
					if(j == len2 - 1)break;
					j+=step;
					if(j >= len2)
						j = len2 - 1;
				}
				for(j=len2;j>-1;)
				{
					row = j * 4;					
					ind = row * len;
					if(pixels[col + ind + 3] > 0)
					{
						if(j < len2 - 3)
						{
							row = (j + 2) * 4;
							ind = row * len;
							if(pixels[col + ind + 3] > 0)
							{
								row = (j + 3) * 4;
								ind = row * len;
								if(pixels[col + ind + 3] > 0)
								{
									arr2[arr2.length] = i;
									arr2[arr2.length] = j + 3;
								}
								else
								{
									arr2[arr2.length] = i;
									arr2[arr2.length] = j + 2;

								}
							}
							else
							{
								row = (j + 1) * 4;
								ind = row * len;
								if(pixels[col + ind + 3] > 0)
								{
									arr2[arr2.length] = i;
									arr2[arr2.length] = j + 1;
								}
								else
								{
									arr2[arr2.length] = i;
									arr2[arr2.length] = j;
								}
							}
						}
						else
						{
							arr2[arr2.length] = i;
							arr2[arr2.length] = j;								
						}
						in1 = false;
						break;
					}
					if(j == 0)break;
					j-=step;
					if(j < 0)
						j = 0;
				}
				lastInd = arr.length > arr2.length?(arr.length - 2):(arr2.length - 2);
				if(in1)
				{
					if(in2)
					{
						if(arr2[lastInd] < arr[lastInd])
						{
							temp = arr[lastInd];
							arr[lastInd] = arr2[lastInd];
							arr2[lastInd] = temp;
						}								
					}
					else
					{
						arr.splice(arr.length - 2,2);
					}
				}
				else
				{
					if(in2)
					{
						arr2.splice(arr2.length - 2,2);
					}						
				}
			}
			lastInd = arr.length - 1;
			len = arr.length / 2 | 0;
			if(len > 0)
			{				
				for(i=1;i<len;i+=2)
				{					
					ind = lastInd - i;					
					tx = arr2[i - 1];
					ty = arr2[i];	
					arr2[i - 1] = arr2[ind];
					arr2[i] = arr2[ind + 1];
					arr2[ind] = tx;
					arr2[ind + 1] = ty;
				}				
			}
			arr = arr.concat(arr2);				
		}
		else
		{
			arr3 = [];
			arr4 = [];
			len = display.height;
			len2 = display.width;
			for(i=0;i<len;i+=step)
			{
				row = i * 4;
				ind = row * len2;
				in3 = in4 = false;
				for(j=0;j<len2;)
				{
					col = j * 4;
					if(pixels[col + ind + 3] > 0)
					{
						if(j > 3)
						{
							col = (j - 2) * 4;
							if(pixels[col + ind + 3] > 0)
							{
								col = (j - 3) * 4;
								if(pixels[col + ind + 3] > 0)
								{
									arr4[arr4.length] = j - 3;
									arr4[arr4.length] = i;	
								}
								else
								{
									arr4[arr4.length] = j - 2;
									arr4[arr4.length] = i;
								}
							}
							else
							{
								col = (j - 1) * 4;
								if(pixels[col + ind + 3] > 0)
								{
									arr4[arr4.length] = j - 1;
									arr4[arr4.length] = i;
								}
								else
								{
									arr4[arr4.length] = j;
									arr4[arr4.length] = i;
								}
							}
						}
						else
						{
							arr4[arr4.length] = j;
							arr4[arr4.length] = i;
						}
						in4 = true;
						break;
					}
					if(j == len2 - 1)break;
					j+=step;
					if(j >= len2)
						j = len2 - 1;
				}
				for(j=len2-1;j>-1;)
				{
					col = j * 4;						
					if(pixels[col + ind + 3] > 0)
					{							
						if(j < len2 - 3)
						{
							col = (j + 2) * 4;
							if(pixels[col + ind + 3] > 0)
							{
								col = (j + 3) * 4;
								if(pixels[col + ind + 3] > 0)
								{
									arr3[arr3.length] = j + 3;
									arr3[arr3.length] = i;	
								}
								else
								{
									arr3[arr3.length] = j + 2;
									arr3[arr3.length] = i;
								}
							}
							else
							{
								col = (j + 1) * 4;
								if(pixels[col + ind + 3] > 0)
								{
									arr3[arr3.length] = j + 1;
									arr3[arr3.length] = i;
								}
								else
								{
									arr3[arr3.length] = j;
									arr3[arr3.length] = i;
								}
							}
						}
						else
						{
							arr3[arr3.length] = j;
							arr3[arr3.length] = i;
						}
						in3 = true;
						break;
					}
					if(j == 0)break;
					j-=step;
					if(j < 0)
						j = 0;
				}
				lastInd = arr3.length > arr4.length?(arr3.length - 2):(arr4.length - 2);
				if(in3)
				{
					if(in4)
					{
						if(arr4[lastInd] < arr3[lastInd])
						{
							temp = arr3[lastInd];
							arr3[lastInd] = arr4[lastInd];
							arr4[lastInd] = temp;
						}
							
					}
					else
					{
						arr3.splice(arr3.length - 2,2);
					}
				}
				else
				{
					if(in4)
					{
						arr4.splice(arr4.length - 2,2);
					}						
				}				
			}
			
			lastInd = arr3.length - 1;
			len = arr3.length / 2 | 0;
			if(len > 0)
			{				
				for(i=0;i<len;i+=2)
				{	
					ind = lastInd - i - 1;
					tx = arr4[i];
					ty = arr4[i + 1];	
					arr4[i] = arr4[ind];
					arr4[i + 1] = arr4[ind + 1];
					arr4[ind] = tx;
					arr4[ind + 1] = ty;						
				}								
			}
			arr = arr3.concat(arr4);				
		}
		// console.log(Date.now() - t);
		// t = Date.now();
		if(arr.length < 8)return [[0,0,display.width,0,display.width,display.height,0,display.height],[0,0,display.width,0,display.width,display.height,0,display.height]];
		//优化描点数量
		let n1:number,n2:number,n3:number;
		let disX:number,disY:number,cx:number,cy:number,disX2:number,disY2:number;
		let disFlag:boolean,disFlag2:boolean;
		let minX:number,maxX:number,minY:number,maxY:number;	
		let rectArr:number[];
		rectArr = [];
		len = arr.length;			
		cx = arr[2];
		cy = arr[3];
		n1 = arr[0] == arr[2]?Math.PI/2:Math.atan2((arr[1] - cy),(arr[0] - cx));
		for(i=4;i<len;)
		{					
			disX = cx - arr[i];
			disY = cy - arr[i + 1];
			n2 = disX == 0?(disY>0?Math.PI/2:-Math.PI/2):Math.atan2(disY , disX);				
			n3 = (n1<n2?n2-n1:n1-n2);
			if((disY<0?-disY:disY) < 2 && (disX<0?-disX:disX) < 2)
			{
				arr.splice(i,2);
				len -= 2;					
			}
			else{
				if(i + 3 < arr.length)
				{
					disX2 = arr[i] - arr[i + 2];
					disY2 = arr[i + 1] - arr[i + 3];
					disFlag2 = (disY2<0?-disY2:disY2) < distancePrecision && (disX2<0?-disX2:disX2) < distancePrecision;
				}
				else
					disFlag2 = true;					
				disFlag = (disY<0?-disY:disY) < distancePrecision && (disX<0?-disX:disX) < distancePrecision;
				if(disFlag && disFlag2)
				{
					arr.splice(i,2);
					len -= 2;
				}
				else if(n3 < anglePrecision)
				{	
					cx = arr[i];
					cy = arr[i + 1];
					disX = arr[i - 2] - cx;
					disY = arr[i - 1] - cy;
					n1 = disX == 0?(disY>0?Math.PI/2:-Math.PI/2):Math.atan2(disY,disX);
					arr.splice(i-2,2);
					len -= 2;	
				}					
				else
				{					
					n1 = n2;
					cx = arr[i];
					cy = arr[i + 1];
					i+=2;
				}
			}				
		}
		minX = minY = Number.MAX_VALUE;
		maxX = maxY = Number.MIN_VALUE;
		len = arr.length;
		for(i=0;i<len;i+=2)
		{
			cx = arr[i];
			cy = arr[i + 1];
			if(minX > cx)
				minX = cx;
			else if(maxX < cx)
				maxX = cx;
			if(minY > cy)
				minY = cy;
			else if(maxY < cy)
				maxY = cy;
		}
		// console.log(Date.now() - t);
		return [[minX,minY,maxX,minY,maxX,maxY,minX,maxY],arr];			
	}
}
