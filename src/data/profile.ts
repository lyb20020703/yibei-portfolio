import type { LocalizedText } from "@/data/site";

// Content for the home and about pages, taken from the resume.
// Phone number and birthday are intentionally left off the public site.

export const intro: LocalizedText[] = [
  {
    zh: "上海交通大学工业设计工程硕士在读，2028 年 3 月毕业。本科就读视觉传达设计，GPA 3.88/4.3，专业前 15%，曾在莫纳什大学交换。",
    en: "Master's student in Industrial Design Engineering at Shanghai Jiao Tong University, graduating March 2028. BA in Visual Communication Design (GPA 3.88/4.3, top 15%), with an exchange semester at Monash University."
  },
  {
    zh: "在腾讯 AI 效能平台做 AI 产品经理实习生，参与 AI 游戏资产生成平台 GamePilot 的建设，主导 Model Hub 从 0 到 1 设计上线。",
    en: "AI product manager intern on Tencent's AI efficiency platform, working on the AI game-asset platform GamePilot and leading Model Hub from zero to launch."
  },
  {
    zh: "在携程负责礼品卡营销活动的视觉与运营；与字节跳动即梦 AI 合作，导演了 2 支心理热线公益动画短片。",
    en: "Ran visuals and operations for Trip.com gift card campaigns, and directed two animated public-service shorts with ByteDance Jimeng AI."
  },
  {
    zh: "我关注 AI 产品，在工作中深度使用 AI，能从产品构思、交互设计一直做到原型落地。",
    en: "I focus on AI products and use AI deeply in my own work, taking ideas from concept and interaction design through to working prototypes."
  }
];

export type Experience = {
  key: string;
  org: LocalizedText;
  team: LocalizedText;
  role: LocalizedText;
  period: string;
  summary: LocalizedText;
  points: LocalizedText[];
  tags: Record<"zh" | "en", string[]>;
};

export const experiences: Experience[] = [
  {
    key: "tencent",
    org: { zh: "腾讯", en: "Tencent" },
    team: { zh: "AI 效能平台", en: "AI Efficiency Platform" },
    role: { zh: "AI 产品经理实习生", en: "AI Product Manager Intern" },
    period: "2026.07 – 2026.10",
    summary: {
      zh: "GamePilot 是 AI 游戏资产生成平台，支持游戏工作室美术资产生产与工作流升级。参与产品 1–N 建设，负责功能规划与交互设计。",
      en: "GamePilot is an AI platform for generating game assets and upgrading studio art workflows. I worked on its growth from one to many, owning feature planning and interaction design."
    },
    points: [
      {
        zh: "Chat Agent 改版：重构对话与资产并行的工作区交互，打通资产查看、引用到二次编辑的创作流程；规划 Chat Agent 中的 Skills 调用流程，让用户在创作中便捷调用 Market 里的 Skills。",
        en: "Chat Agent redesign: rebuilt the workspace so conversation and assets sit side by side, connecting viewing, referencing, and re-editing assets; planned how Skills from the Market are called inside the chat."
      },
      {
        zh: "Skills/MCP 评测：从游戏研发场景出发，覆盖 2D/3D 美术生产、Unity/UE 引擎开发等管线，推动 14 个高价值 Skills/MCP 接入平台。",
        en: "Skills/MCP evaluation: assessed tools across 2D/3D art and Unity/UE pipelines from real game production needs, and brought 14 high-value Skills/MCPs onto the platform."
      },
      {
        zh: "Model Hub 0–1：主导模型广场从产品设计到上线，为平台 100+ AI 模型搭建统一的发现、选型与接入入口。",
        en: "Model Hub, zero to one: led the model marketplace from design to launch, giving the platform's 100+ AI models one place to discover, compare, and connect."
      }
    ],
    tags: { zh: ["Chat Agent", "Skills/MCP", "Model Hub", "PRD"], en: ["Chat Agent", "Skills/MCP", "Model Hub", "PRD"] }
  },
  {
    key: "trip",
    org: { zh: "携程", en: "Trip.com" },
    team: { zh: "礼品卡", en: "Gift Cards" },
    role: { zh: "视觉与运营实习生", en: "Visual & Operations Intern" },
    period: "2026.01 – 2026.04",
    summary: {
      zh: "独立负责礼品卡营销活动的全流程视觉设计，并参与 App 端产品界面设计与新媒体运营。",
      en: "Owned end-to-end visuals for gift card campaigns, and worked on in-app product UI and social media."
    },
    points: [
      {
        zh: "完成 6 个礼品卡营销活动与 2 个携程通 ToB 平台活动，覆盖主视觉、Banner、H5 落地页与卡面设计，并完成 App 与小程序的配置上线。",
        en: "Delivered 6 gift card campaigns and 2 B2B platform campaigns, from key visuals, banners, and H5 landing pages to card designs, configured and launched across the app and mini program."
      },
      {
        zh: "携程礼品卡 × 魔域游戏春节联名活动获得首页推荐等多点位曝光，总曝光 911 万+，成交 147 单。",
        en: "The Spring Festival collaboration with the game Mo Yu earned homepage placement and more, reaching 9.11M+ impressions and 147 orders."
      },
      {
        zh: "设计「AI 制卡」新功能界面，包括用户输入流程与卡面生成流程。",
        en: "Designed the UI for a new AI card-making feature, covering the input flow and card generation."
      }
    ],
    tags: { zh: ["营销活动", "H5", "AI 制卡", "小红书运营"], en: ["Campaigns", "H5", "AI card maker", "Xiaohongshu"] }
  },
  {
    key: "jimeng",
    org: { zh: "字节跳动即梦 AI × 上海精神卫生中心", en: "ByteDance Jimeng AI × Shanghai Mental Health Center" },
    team: { zh: "心理热线宣传短片", en: "Mental health hotline shorts" },
    role: { zh: "AI 动画短片导演", en: "AI Animation Director" },
    period: "2025.07 – 2025.11",
    summary: {
      zh: "独立负责 2 支公益短片的全流程制作，作品入选 2026 全国优质科普作品征集活动「科普中国优质科普资源」。",
      en: "Made two public-service shorts end to end. Both were selected as national-level quality science outreach resources in 2026."
    },
    points: [
      {
        zh: "对接精神卫生中心医生，把医学上的心理困境转译为宣传片的叙事切入点。",
        en: "Worked with the center's doctors to turn clinical struggles into a story people would watch."
      },
      {
        zh: "搭建多模型协同的动画工作流：文生图、图生视频、角色一致性、TTS 与语音克隆，独立完成分镜、场景、动画、剪辑与配乐。",
        en: "Built a multi-model animation workflow (text-to-image, image-to-video, character consistency, TTS and voice cloning) and did the storyboard, scenes, animation, edit, and music myself."
      },
      {
        zh: "线上累计约 12.2 万次观看；在上海地铁 3 个 S 级与 8 个 A++ 级站台投放，日均客流 1044 万人次，持续 30 天。",
        en: "About 122K online views; shown for 30 days on 11 top-tier Shanghai Metro platforms with 10.44M daily riders."
      }
    ],
    tags: { zh: ["AIGC 工作流", "多模型协同", "导演"], en: ["AIGC workflow", "Multi-model", "Director"] }
  }
];

export type SkillGroup = {
  label: LocalizedText;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  { label: { zh: "AI 工具", en: "AI tools" }, items: ["Codex", "Claude Code", "ComfyUI"] },
  { label: { zh: "设计", en: "Design" }, items: ["Figma", "Photoshop", "Illustrator", "Blender"] },
  { label: { zh: "开发与数据", en: "Build & data" }, items: ["Unity", "Excel"] }
];

export type EducationItem = {
  school: LocalizedText;
  degree: LocalizedText;
  period: string;
  note?: LocalizedText;
};

export const education: EducationItem[] = [
  {
    school: { zh: "上海交通大学", en: "Shanghai Jiao Tong University" },
    degree: { zh: "工业设计工程 硕士", en: "M.Eng. Industrial Design Engineering" },
    period: "2025.09 – 2028.03"
  },
  {
    school: { zh: "莫纳什大学", en: "Monash University" },
    degree: { zh: "学期交换", en: "Exchange semester" },
    period: "2023.07 – 2023.12"
  },
  {
    school: { zh: "上海交通大学", en: "Shanghai Jiao Tong University" },
    degree: { zh: "视觉传达设计 本科", en: "B.A. Visual Communication Design" },
    period: "2021.09 – 2025.06",
    note: { zh: "GPA 3.88/4.3，专业前 15%，优秀毕业生", en: "GPA 3.88/4.3, top 15%, Outstanding Graduate" }
  }
];

export const courses: LocalizedText = {
  zh: "用户体验与商业思维、互联网产品设计、智能设计系统与管理策略、泛娱乐设计、新媒体设计、品牌形象设计",
  en: "UX and Business Thinking, Internet Product Design, Intelligent Design Systems, Entertainment Design, New Media Design, Brand Identity"
};

export const languages: LocalizedText = {
  zh: "CET-4 632，CET-6 600，IELTS 6.5",
  en: "CET-4 632, CET-6 600, IELTS 6.5"
};

export const honors: LocalizedText[] = [
  { zh: "中国高校计算机大赛移动应用创新赛 全国二等奖", en: "China Collegiate Computing Contest, Mobile App Innovation, National 2nd Prize" },
  { zh: "米兰设计周 全国二等奖", en: "Milan Design Week competition, National 2nd Prize" },
  { zh: "詹家骏奖学金（全校 6 人）", en: "Zhan Jiajun Scholarship (6 students university-wide)" },
  { zh: "上海交通大学校级学业奖学金 一等奖", en: "SJTU Academic Scholarship, First Class" },
  { zh: "NCDA 全国高校数字艺术设计大赛 多项奖项", en: "NCDA National Digital Art & Design Competition, several awards" }
];

export type TraitLink = {
  name: string;
  kind: LocalizedText;
  href: string;
};

export type Trait = {
  title: LocalizedText;
  detail: LocalizedText;
  links?: TraitLink[];
};

export const traits: Trait[] = [
  {
    title: { zh: "小红书创作者", en: "Xiaohongshu creator" },
    detail: {
      zh: "从 0 到 1 运营 3 个账号，品牌号 20 天粉丝增长 4000+，视频笔记累计播放 150 万+。",
      en: "Built 3 accounts from scratch: the brand account gained 4,000+ followers in 20 days, and my videos have 1.5M+ views."
    },
    links: [
      {
        name: "幻想型碳水",
        kind: { zh: "绘画与 vlog", en: "Art and vlogs" },
        href: "https://www.xiaohongshu.com/user/profile/64b62416000000001403a7e5"
      },
      {
        name: "我不来上课就别点名了",
        kind: { zh: "交换生活", en: "Exchange life" },
        href: "https://www.xiaohongshu.com/user/profile/64b53f67000000001403a759"
      },
      {
        name: "V Yoga",
        kind: { zh: "品牌账号", en: "Brand account" },
        href: "https://www.xiaohongshu.com/user/profile/61370c360000000002021826"
      }
    ]
  },
  {
    title: { zh: "深度使用 AI", en: "Uses AI every day" },
    detail: { zh: "Codex、Claude Code、ComfyUI", en: "Codex, Claude Code, ComfyUI" }
  },
  {
    title: { zh: "热爱游戏", en: "Loves games" },
    detail: { zh: "也做游戏和桌游", en: "Makes them too, digital and tabletop" }
  },
  {
    title: { zh: "互联网原住民", en: "Internet native" },
    detail: { zh: "热爱创作与互联网文化", en: "Into making things and internet culture" }
  },
  {
    title: { zh: "设计出身", en: "Trained in design" },
    detail: { zh: "视觉传达到工业设计工程", en: "Visual communication, then design engineering" }
  }
];

// Scripted answers for the Agent widget on the home page. No model is
// called: each question maps to a pretend skill call and a fixed answer.
export type AgentReply = {
  key: string;
  question: LocalizedText;
  keywords: string[];
  skill: string;
  answer: LocalizedText;
  link?: { href: string; label: LocalizedText };
};

export const agentReplies: AgentReply[] = [
  {
    key: "tencent",
    question: { zh: "在腾讯做了什么？", en: "What did you do at Tencent?" },
    keywords: ["腾讯", "tencent", "gamepilot", "实习", "intern", "model", "agent"],
    skill: "search_experience",
    answer: {
      zh: "在 AI 效能平台做 GamePilot：改版 Chat Agent 的工作区交互，评测并推动 14 个 Skills/MCP 接入，主导 Model Hub 从 0 到 1 上线。",
      en: "I worked on GamePilot: redesigned the Chat Agent workspace, evaluated and onboarded 14 Skills/MCPs, and led Model Hub from zero to launch."
    },
    link: { href: "/portfolio#ai-product", label: { zh: "看 AI 产品", en: "See AI products" } }
  },
  {
    key: "aigc",
    question: { zh: "有哪些 AIGC 作品？", en: "What AIGC work have you made?" },
    keywords: ["aigc", "视频", "短片", "video", "film", "即梦"],
    skill: "search_portfolio",
    answer: {
      zh: "和即梦 AI、上海精神卫生中心合作的 2 支心理热线公益短片，用多模型协同完成动画。线上约 12.2 万次观看，地铁投放 30 天。",
      en: "Two mental health hotline shorts made with Jimeng AI and the Shanghai Mental Health Center, animated with several models. About 122K views and 30 days on metro screens."
    },
    link: { href: "/portfolio#aigc", label: { zh: "看 AIGC 视频", en: "See AIGC video" } }
  },
  {
    key: "tools",
    question: { zh: "常用哪些 AI 工具？", en: "Which AI tools do you use?" },
    keywords: ["工具", "tool", "skill", "技能", "codex", "claude", "comfyui"],
    skill: "read_skills",
    answer: {
      zh: "写原型用 Codex 和 Claude Code，做图像与视频用 ComfyUI，再搭配文生图、图生视频、角色一致性和语音克隆模型。",
      en: "Codex and Claude Code for prototypes, ComfyUI for images and video, plus text-to-image, image-to-video, character consistency, and voice cloning models."
    }
  },
  {
    key: "contact",
    question: { zh: "怎么联系你？", en: "How can I reach you?" },
    keywords: ["联系", "邮箱", "email", "contact", "mail"],
    skill: "get_contact",
    answer: {
      zh: "发邮件到 lyb20020703@sjtu.edu.cn，我会尽快回复。",
      en: "Email lyb20020703@sjtu.edu.cn and I'll reply soon."
    },
    link: { href: "mailto:lyb20020703@sjtu.edu.cn", label: { zh: "写邮件", en: "Write an email" } }
  }
];

export const agentFallback: LocalizedText = {
  zh: "这个问题我还答不上来。可以试试下面的问题，或者直接发邮件给我。",
  en: "I can't answer that one yet. Try one of the questions below, or email me."
};
