class Dispatcher extends egret.EventDispatcher{
	private static _instance:Dispatcher;	
	public static getInstance():Dispatcher
	{
		if(Dispatcher._instance == null)
			Dispatcher._instance = new Dispatcher;
		return Dispatcher._instance;
	}
	public constructor(target?: egret.IEventDispatcher) {
		super(target)
	}
	/**交互初始化完成*/public static GAME_READY:string = "global_game_ready";
	/**课程视频就绪*/public static VIDEO_READY:string = "global_video_ready";
	/**跳过交互*/public static JUMP_LESSON:string = "global_jump_lesson";
	/*退出教室 */ public static EXIT_ROOM:string = "exit_room";
	/**分支处理回调*/public static BRANCH_CHOOSE:string = "global_branch_choose"; 
}