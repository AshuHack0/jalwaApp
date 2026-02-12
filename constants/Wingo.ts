export const COLOR_MAP = {
    RED: "RED",
    GREEN: "GREEN",
    VIOLET: "VIOLET",
    RED_VIOLET: "RED_VIOLET",
    GREEN_VIOLET: "GREEN_VIOLET",
}

export const BIG_SMALL_MAP = {
    BIG: "BIG",
    SMALL: "SMALL",
}

export const BET_TYPE_BIG_SMALL = "BIG_SMALL";
export const BET_TYPE_NUMBER = "NUMBER";
export const BET_TYPE_COLOR = "COLOR";

export const VALID_BET_TYPES = [BET_TYPE_BIG_SMALL, BET_TYPE_NUMBER, BET_TYPE_COLOR];

export const DURATION_FROM_PATH = {
    "/WinGo_30S": 30,
    "/WinGo_1Min": 60,
    "/WinGo_3Min": 180,
    "/WinGo_5Min": 300,
};

export const WINGO_GAMES = [
  { name: "WinGo 30 sec", durationSeconds: 30, gameCode: "10005" },
  { name: "WinGo 1 min", durationSeconds: 60, gameCode: "10001" },
  { name: "WinGo 3 min", durationSeconds: 180, gameCode: "10003" },
  { name: "WinGo 5 min", durationSeconds: 300, gameCode: "10004" },
];
export const WINGO_NUMBER_COLOR_MAP = [
    { number: 0, color: COLOR_MAP.RED_VIOLET },
    { number: 1, color: COLOR_MAP.GREEN },
    { number: 2, color: COLOR_MAP.RED },
    { number: 3, color: COLOR_MAP.GREEN },
    { number: 4, color: COLOR_MAP.RED },
    { number: 5, color: COLOR_MAP.GREEN_VIOLET },
    { number: 6, color: COLOR_MAP.RED },
    { number: 7, color: COLOR_MAP.GREEN },
    { number: 8, color: COLOR_MAP.RED },
    { number: 9, color: COLOR_MAP.GREEN },
];

export const WINGO_MULTIPLIERS = [ 1, 5, 10, 20, 50, 100 ];

export const WINGO_BALL_IMAGES: { [key: number]: any } = {
  0: require("@/assets/Wingo/Balls/ball_0.webp"),
  1: require("@/assets/Wingo/Balls/ball_1.webp"),
  2: require("@/assets/Wingo/Balls/ball_2.webp"),
  3: require("@/assets/Wingo/Balls/ball_3.webp"),
  4: require("@/assets/Wingo/Balls/ball_4.webp"),
  5: require("@/assets/Wingo/Balls/ball_5.webp"),
  6: require("@/assets/Wingo/Balls/ball_6.webp"),
  7: require("@/assets/Wingo/Balls/ball_7.webp"),
  8: require("@/assets/Wingo/Balls/ball_8.webp"),
  9: require("@/assets/Wingo/Balls/ball_9.webp"),
};

export const WINGO_ANNOUNCEMENT_MESSAGES = [
  "🎉🎉🎉Welcome to join the JALWA platform. We provide a brand new gaming experience and a comprehensive range of popular games. ❤️‍🔥❤️‍🔥❤️‍🔥You are welcome to register at JALWA and participate in the game. Thank you.",
  "Our customer service will never send any links to members—if you receive a link from someone claiming to be JALWA.GAME customer service, please do not click it, as it may lead to hacking or data loss; always verify through our official website.",
  "हमारी कस्टमर सर्विस कभी भी सदस्यों को कोई लिंक नहीं भेजेगी — यदि आपको कोई लिंक किसी ऐसे व्यक्ति से प्राप्त होता है जो खुद को JALWA कस्टमर सर्विस बता रहा है, तो कृपया उस पर क्लिक न करें, क्योंकि यह हैकिंग या डेटा चोरी का कारण बन सकता है। कृपया हमेशा हमारी आधिकारिक वेबसाइट के माध्यम से ही सत्यापित करें।",
];

export const WINGO_ANNOUNCEMENT_ITEM_HEIGHT = 42.42;

export const WINGO_TABS = ["Game history", "Chart", "My history"] as const;

export const WINGO_DEFAULT_TOTAL_PAGES = 50;

export const WINGO_MOCK_RECENT_RESULTS = ["1", "1", "8", "9", "8"];

/** Maps durationSeconds to API path segment for WinGo GET endpoints */
export const WINGO_API_PATH_MAP: Record<number, string> = {
  30: "WinGo_30S",
  60: "WinGo_1Min",
  180: "WinGo_3Min",
  300: "WinGo_5Min",
};

export const CHART_CIRCLE_SIZE = 18;
export const CHART_CIRCLE_GAP = 4;
export const CHART_PERIOD_WIDTH = 145;
export const CHART_NUM_SPACING = CHART_CIRCLE_SIZE + CHART_CIRCLE_GAP;

export const WINGO_MOCK_GAME_HISTORY = [
  { period: "20260125100052218", number: 1, size: "Small", color: "green" },
  { period: "20260125100052217", number: 8, size: "Big", color: "red" },
  { period: "20260125100052216", number: 9, size: "Big", color: "green" },
  { period: "20260125100052215", number: 4, size: "Small", color: "red" },
  { period: "20260125100052214", number: 2, size: "Small", color: "red" },
  { period: "20260125100052213", number: 7, size: "Big", color: "green" },
  { period: "20260125100052212", number: 3, size: "Small", color: "green" },
  { period: "20260125100052211", number: 6, size: "Big", color: "red" },
  { period: "20260125100052210", number: 5, size: "Big", color: "green" },
  { period: "20260125100052209", number: 0, size: "Small", color: "violet" },
];