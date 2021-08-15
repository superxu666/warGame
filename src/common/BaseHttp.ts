class BaseHttp {

    private static _instance: BaseHttp

    public static getInstance(): BaseHttp {

        return BaseHttp._instance || (BaseHttp._instance = new BaseHttp)
    }

    public sendMsg(url: string, data: any, method: string = "POST", callBack: Function = null, thisObj: any = null) {

        HttpMsg.getInstance().sendMsg(url, data, method, (res) => {

            if (res.code == 200) {
                callBack && callBack.call(thisObj, res)
            } else {
                throw new Error(url + ': error - ' + res.mes)
            }
        })
    }
}