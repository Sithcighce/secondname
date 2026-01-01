export interface VideoItem {
  id: string;
  url: string;
  username: string;
  description: string;
  likes: number;
  quizId: string;
  layout?: 'portrait' | 'landscape';
}

export const VIDEOS: VideoItem[] = [
  {
    id: "1",
    url: "/videos/367185444.mp4",
    username: "@美妆小天才",
    description: "只需芦荟胶+眼影，教你自制超自然睫毛膏！纯天然无添加 ✨ #DIY #美妆 #省钱小妙招",
    likes: 3421,
    quizId: "lesson_1",
    layout: "portrait", 
  },
  {
    id: "2",
    url: "/videos/791893779.mp4",
    username: "@烘焙日记",
    description: "爆浆预警！零失败的巧克力熔岩蛋糕，一口沦陷 🍫 做法在评论区！ #甜品 #治愈 #下午茶",
    likes: 12800,
    quizId: "lesson_2",
    layout: "portrait", 
  },
  {
    id: "3",
    url: "/videos/899497638.mp4",
    username: "@深夜小酒馆",
    description: "今晚喝点什么？教你调一杯‘蓝色夏威夷’，致敬自由与远方。🍸 #调酒 #微醺 #生活",
    likes: 5600,
    quizId: "lesson_3",
    layout: "portrait",
  },
  {
    id: "4",
    url: "/videos/4.mp4", 
    username: "@数学汤姆",
    description: "积分其实就是切披萨？3分钟带你听懂微积分本质！Tom的奇妙数学之旅 🍕➕C #英语学习 #数学",
    likes: 1205,
    quizId: "lesson_4",
    layout: "landscape", 
  },
];

// --- Lesson Structure ---

export type LessonItemType = 'story' | 'quiz' | 'match';

export interface LessonItem {
  id: string;
  type: LessonItemType;
  content: any;
}

export interface Lesson {
  id: string;
  title: string;
  items: LessonItem[];
}

// --- Data Definitions ---

// Placeholder for Video 1 (Makeup)
const LESSON_1_DATA: LessonItem[] = [
  {
    id: "l1_s1",
    type: "story",
    content: {
      english: "Waiting for content...",
      chinese: "等待内容...",
      audio: "mock_audio_l1_s1"
    }
  }
];

// Content for Video 2 (Edible Lava / Baking)
const LESSON_2_DATA: LessonItem[] = [
  {
    id: "l2_s1",
    type: "story",
    content: {
      english: "Aya saw an AI-generated “edible lava” video on Bilibili. She giggled: “Humans copying AI copying humans? Same.” So she grabbed her biggest jar of local wild honey. Added red food coloring. Stirred it. “No way—this looks legit!”",
      chinese: "阿雅在B站刷到一个AI生成的“可食用岩浆”视频。她笑出声：“人类模仿AI模仿人类？我也是。”于是她翻出家里最大的一罐土蜂蜜。加了红色食用色素，搅一搅：“不会吧，这也太像了！”",
      audio: "mock_audio_l2_s1"
    }
  },
  {
    id: "l2_q1",
    type: "quiz",
    content: {
      question: "“这也太像（岩浆）了！”最自然的英文是？",
      options: [
        "This is too expensive",
        "This looks so fake",
        "No way—this looks legit!",
        "I don’t like the color"
      ],
      correctAnswer: "No way—this looks legit!",
      explanation: "原文中提到 'No way—this looks legit!'，其中 legit 是 slang，表示超真实、正宗。"
    }
  },
  {
    id: "l2_s2",
    type: "story",
    content: {
      english: "No electric lights inside—just safe, edible ingredients. She put a tiny LED under the glass bowl. Turn off the lights… BOOM! It’s glowing like real lava!",
      chinese: "里面不放电路灯——只用能吃的东西。她在玻璃碗底下放了个迷你LED灯。关灯——哇！真的在发光，像岩浆本浆！",
      audio: "mock_audio_l2_s2"
    }
  },
  {
    id: "l2_q2",
    type: "quiz",
    content: {
      question: "What does “legit” mean in this story?",
      options: [
        "合法的",
        "很贵的",
        "超真实 / 超像真的",
        "很辣的"
      ],
      correctAnswer: "超真实 / 超像真的",
      explanation: "在口语中 legit (legitimate) 常用来形容某物非常地道、真实或很棒。"
    }
  },
  {
    id: "l2_s3",
    type: "story",
    content: {
      english: "For “volcanic rocks,” she crushed chocolate cookies by hand. Then came the dark chocolate—so hard, like a textbook! She tried to break it… failed. So she dropped it on the counter. Melted it slowly. Poured it over the honey “lava.” Into the fridge it goes—to set for 2 hours.",
      chinese: "“火山石”？她亲手把巧克力饼干捏碎。接着是黑巧克力——硬得像大学高数课本！她用力掰……失败。干脆往料理台一摔。小心融化，慢慢倒在蜂蜜“岩浆”上。放进冰箱，冷藏两小时定型。",
      audio: "mock_audio_l2_s3"
    }
  },
  {
    id: "l2_s4",
    type: "story",
    content: {
      english: "She filmed the whole process for her next Xiaohongshu post. Caption: “AI said ‘edible volcano.’ I said ‘I got this.’” Her little sister peeked in: “Can I help eat it?” Aya winked: “Only if you promise not to tell Mom I used her good honey.”",
      chinese: "她录下全过程，准备发小红书。配文：“AI说‘可食用火山’，我说‘这题我会’。”妹妹探头：“我能帮忙吃掉它吗？”阿雅眨眨眼：“只要你答应别告诉妈妈，我用了她珍藏的那罐蜂蜜。”",
      audio: "mock_audio_l2_s4"
    }
  },
  {
    id: "l2_q3",
    type: "quiz",
    content: {
      question: "Why does Aya say “don’t tell Mom”?",
      options: [
        "Because the honey was expired",
        "Because she used expensive or special honey without asking",
        "Because her mom hates chocolate",
        "Because the dish is too messy"
      ],
      correctAnswer: "Because she used expensive or special honey without asking",
      explanation: "文中提到她用了 'biggest jar of local wild honey' 和 'Mom\'s good honey'，暗示这是珍贵的蜂蜜。"
    }
  },
  {
    id: "l2_m1",
    type: "match",
    content: {
      pairs: [
        { id: "p1", left: "edible", right: "可食用的" },
        { id: "p2", left: "food coloring", right: "食用色素" },
        { id: "p3", left: "legit", right: "超真实" },
        { id: "p4", left: "LED light", right: "LED灯" },
        { id: "p5", left: "crushed", right: "捏碎" },
        { id: "p6", left: "melted", right: "融化的" },
        { id: "p7", left: "set", right: "凝固" },
        { id: "p8", left: "I got this", right: "这题我会" }
      ]
    }
  }
];

// Content for Video 3 (Bartending)
const LESSON_3_DATA: LessonItem[] = [
  {
    id: "l3_s1",
    type: "story",
    content: {
      english: "Leo just got a home bartending kit from JD.com. His goal? Impress his friends at the weekend hangout. He watches a Bilibili tutorial: no talking, just sounds.",
      chinese: "小林刚在京东下单了一套家用调酒套装。目标？周末聚会镇住全场。他打开B站视频：全程没台词，只有声音。",
      audio: "mock_audio_l3_s1"
    }
  },
  {
    id: "l3_q1",
    type: "quiz",
    content: {
      question: "视频里只有摇酒、搅拌和倒酒的声音”最自然的英文是？",
      options: [
        "Only music plays in the video",
        "Only sounds: shaking, stirring, pouring",
        "The bartender explains every step",
        "People are chatting loudly"
      ],
      correctAnswer: "Only sounds: shaking, stirring, pouring",
      explanation: "对应原文描述 'no talking, just sounds'。"
    }
  },
  {
    id: "l3_s2",
    type: "story",
    content: {
      english: "Shake-shake-shake! Ice rattles in the shaker. Then swirl-swirl—he stirs the gin and vermouth slowly. Finally, glug-glug—he pours the liquid into a chilled glass.",
      chinese: "哗啦哗啦！”冰块在摇酒壶里碰撞。接着“唰唰”——他慢慢搅拌金酒和苦艾酒。最后“咕噜咕噜”——把酒液倒进冰过的杯子。",
      audio: "mock_audio_l3_s2"
    }
  },
  {
    id: "l3_q2",
    type: "quiz",
    content: {
      question: "What does “chilled glass” mean?",
      options: [
        "装了冰块的玻璃杯",
        "提前冷冻过的杯子",
        "杯子上有水珠",
        "用来喝热酒的杯子"
      ],
      correctAnswer: "提前冷冻过的杯子",
      explanation: "Chilled 意为冷却的、冰镇的。"
    }
  },
  {
    id: "l3_s3",
    type: "story",
    content: {
      english: "He tries it. The drink is smooth, cold, perfect. He films himself doing the same moves. Posts it on Xiaohongshu: “My first martini. No voice, just vibes.” His crush comments: “Wait… you can make drinks?!” Leo’s heart races faster than his shaker. He texts his buddy: “Dude, the kit was worth it.”",
      chinese: "他尝了一口：顺滑、冰凉、绝了。他录下自己复刻全过程。发到小红书：“人生第一杯马天尼。无台词，纯氛围。”他暗恋的人评论：“等等……你还会调酒？！”小林心跳比摇酒壶还快。他火速发消息给兄弟：“兄弟，这套装血赚。”",
      audio: "mock_audio_l3_s3"
    }
  },
  {
    id: "l3_s4",
    type: "story",
    content: {
      english: "But later, alone in his room, he stares at the empty glass. His cat jumps on the table, sniffs the shaker. Leo sighs: “Sorry, Mimi. You’re not 18. No cocktail for you.”",
      chinese: "可夜深人静，他盯着空酒杯发呆。猫跳上桌子，闻了闻摇酒壶。小林叹气：“抱歉咪咪，你还没成年，不能喝酒。”",
      audio: "mock_audio_l3_s4"
    }
  },
  {
    id: "l3_q3",
    type: "quiz",
    content: {
      question: "Why does Leo say his cat “isn’t 18”?",
      options: [
        "Because cats can’t drink alcohol",
        "Because he’s joking that cats need ID to drink in China",
        "Because the law says pets must be adults to consume alcohol",
        "Because his cat looks like a teenager"
      ],
      correctAnswer: "Because he’s joking that cats need ID to drink in China",
      explanation: "这是幽默的说法，将人类饮酒年龄限制套用在猫身上。"
    }
  },
  {
    id: "l3_s5",
    type: "story",
    content: {
      english: "Mimi meows, knocks over the ice bucket, and walks away like a tiny, judgmental bartender.",
      chinese: "咪咪“喵”了一声，打翻冰桶，像个迷你又傲娇的调酒师，扬长而去。",
      audio: "mock_audio_l3_s5"
    }
  },
  {
    id: "l3_m1",
    type: "match",
    content: {
      pairs: [
        { id: "p1", left: "shaker", right: "摇酒壶" },
        { id: "p2", left: "stir", right: "搅拌" },
        { id: "p3", left: "pour", right: "倒" },
        { id: "p4", left: "chilled glass", right: "冰过的杯子" },
        { id: "p5", left: "home bartending kit", right: "调酒套装" },
        { id: "p6", left: "vibes", right: "氛围感" },
        { id: "p7", left: "martini", right: "马天尼" },
        { id: "p8", left: "worth it", right: "值了" }
      ]
    }
  }
];

// Content for Video 4 (Math/Integration) - Existing
const LESSON_4_DATA: LessonItem[] = [
  // --- Story Segment 1 ---
  {
    id: "s1",
    type: "story",
    content: {
      english: "Tom is a college student who only leaves his dorm for bubble tea and pizza.",
      chinese: "汤姆是个大学生，除了买奶茶和披萨，根本不出宿舍。",
      audio: "mock_audio_1"
    }
  },
  {
    id: "s2",
    type: "story",
    content: {
      english: "One night, while doomscrolling, he sees a viral math video: “What is integration?”",
      chinese: "某天深夜刷手机，他刷到一个爆款视频：《积分到底是什么？》",
      audio: "mock_audio_2"
    }
  },
  {
    id: "s3",
    type: "story",
    content: {
      english: "He watches. “Wait… it’s just adding tiny bits to get the whole?”",
      chinese: "他点开一看：“等等……不就是把无数小碎片加起来，得到整体吗？”",
      audio: "mock_audio_3"
    }
  },
  
  // --- Quiz Segment 1 ---
  {
    id: "q1",
    type: "quiz",
    content: {
      question: "“把很多小部分加起来得到整体”用英语最自然的说法是？",
      options: [
        "Multiply big numbers",
        "Add up tiny pieces to find the whole",
        "Subtract the change",
        "Count the pizza slices"
      ],
      correctAnswer: "Add up tiny pieces to find the whole",
      explanation: "原文中提到 'adding tiny bits to get the whole'，对应选项 B。Integration 的核心思想就是累加（Add up）。"
    }
  },

  // --- Story Segment 2 ---
  {
    id: "s4",
    type: "story",
    content: {
      english: "His brain lights up. “So if I know how cheese changes on the pizza… I can find the total cheese?!”",
      chinese: "他突然开窍：“所以，如果我知道芝士在披萨上怎么‘分布’的，就能算出总共用了多少？！”",
      audio: "mock_audio_4"
    }
  },
  {
    id: "s5",
    type: "story",
    content: {
      english: "He texts his math-savvy friend Luna: “Bro, is this real?”",
      chinese: "他火速发微信给数学大神露娜：“姐妹，这玩意儿靠谱吗？”",
      audio: "mock_audio_5"
    }
  },

   // --- Quiz Segment 2 ---
   {
    id: "q2",
    type: "quiz",
    content: {
      question: "In the story, what does “+C” mean?",
      options: [
        "Cheese type",
        "An unknown constant",
        "Red packet amount",
        "Pizza price"
      ],
      correctAnswer: "An unknown constant",
      explanation: "在数学中 +C 代表不定积分的常数（Constant）。在故事结尾汤姆用它来双关‘红包’。"
    }
  },

  // --- Final Story Segment (The Punchline) ---
  {
    id: "s6",
    type: "story",
    content: {
      english: "“And don’t worry—the +C is my red packet for you.”",
      chinese: "“放心，那个 +C 就是我给你的红包。”",
      audio: "mock_audio_6"
    }
  },

  // --- Matching Game ---
  {
    id: "m1",
    type: "match",
    content: {
      pairs: [
        { id: "p1", left: "Integration", right: "积分" },
        { id: "p2", left: "Viral Video", right: "爆款视频" },
        { id: "p3", left: "Red Packet", right: "红包" },
        { id: "p4", left: "Constant", right: "常数" }
      ]
    }
  }
];

export const LESSONS: Record<string, Lesson> = {
  "lesson_1": {
    id: "lesson_1",
    title: "Homemade Mascara",
    items: LESSON_1_DATA
  },
  "lesson_2": {
    id: "lesson_2",
    title: "Edible Lava",
    items: LESSON_2_DATA
  },
  "lesson_3": {
    id: "lesson_3",
    title: "Home Bartending",
    items: LESSON_3_DATA
  },
  "lesson_4": {
    id: "lesson_4",
    title: "Integration Story",
    items: LESSON_4_DATA
  }
};
