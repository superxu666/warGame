class LessonConf {
	public static CHART_VIDEO: string = "video";
	public static CHART_INTERACTION: string = "interaction";
	public static CHART_SCARTCH: string = "scratch";
	public static CHART_STEP: string = "step";
	public static CHART_TAG: string = "tag";
	public static LESSON_BASE: string = "base";
	public static LESSON_EXPAND: string = "expand";
	// public static LESSON_STATUS_0: string = "unLearned";
	// public static LESSON_STATUS_1: string = "learning";
	// public static LESSON_STATUS_99: string = "finishedLearning";
	public static TYPE_INTERACTION_EGRET: string = "egret";
	public static TYPE_INTERACTION_SIM: string = "simulator";
	public static TYPE_MATHJOB_BASE: string = "baseMathJob";
	public static TYPE_MATHJOB_EXPAND: string = "expandMathJob";
	public static COURSE_TYPE_LK: string = "LK";//幼儿思维课程类型
}

//0-未解锁；1-已解锁；2-未学习；3-学习中；4-已学完
enum LearnState{
	LOCK,
	UNLOCK,
	NOSTUDY,
	STUDYING,
	FINISHED,
}


//0-自由、1-闯关、2-日期、3-周期模式
enum LearnType {
	FREE,
	PASS,
	TIME,
	CYCLE
}
