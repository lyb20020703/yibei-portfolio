export type Locale = "zh" | "en";

export type LocalizedText = Record<Locale, string>;

export type CategoryKey = "home" | "games" | "uiux" | "visual" | "ai-films" | "about";

export type Project = {
  slug: string;
  category: Exclude<CategoryKey, "home" | "about">;
  title: LocalizedText;
  subtitle?: LocalizedText;
  date: string;
  tags: Record<Locale, string[]>;
  excerpt: LocalizedText;
  cover: {
    tone: "cyan" | "green" | "amber" | "violet";
    label: string;
  };
  assets: ProjectAssets;
  meta?: {
    year?: string;
    role?: LocalizedText;
    format?: LocalizedText;
  };
  media?: ProjectMedia;
  playableDemo?: {
    title: LocalizedText;
    url: string;
    note: LocalizedText;
  };
  theme?: {
    background: string;
    text: string;
    underline?: string;
  };
  detailMode?: "default" | "gallery-only";
  gallery?: Array<{
    title?: LocalizedText;
    src?: string;
    images?: string[];
    layout?: "stack" | "grid";
  }>;
  levelFlow?: {
    title: LocalizedText;
    chapters: Array<{
      title: LocalizedText;
      image: string;
    }>;
    sections: Array<{
      title: LocalizedText;
      mapImage: string;
      nodes: LocalizedText[];
      cards: Array<{
        nodeIndex: number;
        title: LocalizedText;
        description: LocalizedText;
        image: string;
      }>;
    }>;
  };
  details?: {
    intro: LocalizedText;
    sections: Array<{
      title: LocalizedText;
      body: LocalizedText;
    }>;
  };
};

export type ProjectAssets = {
  basePath: string;
  cover: string;
  coverImage?: string;
  banner: string;
  bannerImage?: string;
  thumbnails: string;
  gallery: string;
  videos: string;
  gifs: string;
};

export type ProjectMedia = {
  videoEmbed?: {
    provider: "youtube";
    url: string;
    title: LocalizedText;
    aspect?: "wide" | "short";
  };
};

function projectAssets(category: Project["category"], slug: string): ProjectAssets {
  const basePath = `/assets/${category}/${slug}`;

  return {
    basePath,
    cover: `${basePath}/cover`,
    banner: `${basePath}/cover/banner`,
    thumbnails: `${basePath}/thumbnails`,
    gallery: `${basePath}/gallery`,
    videos: `${basePath}/videos`,
    gifs: `${basePath}/videos`
  };
}

function withProjectMedia(assets: ProjectAssets, media: Partial<ProjectAssets>): ProjectAssets {
  return {
    ...assets,
    ...media
  };
}

export type Category = {
  key: CategoryKey;
  label: LocalizedText;
  href: string;
  description?: LocalizedText;
};

export const categories: Category[] = [
  {
    key: "home",
    label: { zh: "主页", en: "Home" },
    href: "/"
  },
  {
    key: "games",
    label: { zh: "游戏", en: "Games" },
    href: "/#games",
    description: {
      zh: "叙事、规则与体验机制的交互作品。",
      en: "Interactive works across narrative, rules, and experience systems."
    }
  },
  {
    key: "uiux",
    label: { zh: "UI/UX", en: "UI/UX" },
    href: "/#uiux",
    description: {
      zh: "产品体验、空间交互与服务设计。",
      en: "Product experience, spatial interaction, and service design."
    }
  },
  {
    key: "visual",
    label: { zh: "视觉", en: "Visual" },
    href: "/#visual",
    description: {
      zh: "角色、世界观、营销视觉与概念表达。",
      en: "Characters, worlds, campaigns, and concept expression."
    }
  },
  {
    key: "ai-films",
    label: { zh: "视频", en: "Videos" },
    href: "/#ai-films",
    description: {
      zh: "使用 AI 影像流程探索短片与公益叙事。",
      en: "Short-form and public-interest stories explored through AI film workflows."
    }
  },
  {
    key: "about",
    label: { zh: "关于我", en: "About" },
    href: "/#about"
  }
];

export const siteCopy = {
  nav: {
    language: { zh: "语言", en: "Language" },
    openMenu: { zh: "打开项目目录", en: "Open project menu" }
  },
  hero: {
    kicker: { zh: "Portfolio system / v0.1", en: "Portfolio system / v0.1" },
    title: {
      zh: "Hi, I'm Yibei",
      en: "Hi, I'm Yibei"
    }
  },
  home: {
    worksTitle: { zh: "我的作品", en: "My Portfolio" }
  },
  about: {
    title: { zh: "关于我", en: "About" },
    body: {
      zh: "跨游戏、UI/UX、视觉与 AI 影像的创作者，关注叙事系统、体验流程与艺术科技表达。",
      en: "A creator across games, UI/UX, visual design, and AI film, focused on narrative systems, experience flows, and art-technology expression."
    },
    email: "lyb20020703@sjtu.edu.cn"
  }
};

export const projects: Project[] = [
  {
    slug: "mulan",
    category: "games",
    title: { zh: "木兰之外", en: "Beyond Mulan" },
    date: "2026.06",
    tags: {
      zh: ["vibe coding", "叙事游戏", "剧情解谜", "个人项目"],
      en: ["Vibe coding", "Narrative game", "Story puzzle", "Personal project"]
    },
    excerpt: {
      zh: "一款以经典乐府诗《木兰辞》为原型的 2D 横版叙事解谜游戏。玩家将扮演现代高中生“许笛”，意外穿越至北魏时期，逐步发现自己正置身于“木兰”的人生轨迹之中。",
      en: "Beyond Mulan is a 2D side-scrolling narrative puzzle game inspired by the classic Yuefu poem The Ballad of Mulan. Players take on the role of Xu Di, a modern high school student who unexpectedly travels back to the Northern Wei dynasty and gradually realizes she has stepped into the life path of Mulan."
    },
    cover: { tone: "cyan", label: "G01" },
    assets: withProjectMedia(projectAssets("games", "mulan"), {
      coverImage: "/assets/games/mulan/cover/banner/mulan-cover.png?v=20260622-2",
      bannerImage: "/assets/games/mulan/cover/banner/mulan-cover.png?v=20260622-2"
    }),
    meta: {
      role: { zh: "叙事 / 游戏系统 / 原型", en: "Narrative / Game system / Prototype" },
      format: { zh: "文字游戏", en: "Text game" }
    },
    levelFlow: {
      title: { zh: "关卡流程设计", en: "Level Flow Design" },
      chapters: [
        { title: { zh: "第一章：织声", en: "Chapter 1: Weaving Voices" }, image: "/assets/games/mulan/gallery/织声.png" },
        { title: { zh: "第二章：辞行", en: "Chapter 2: Departure" }, image: "/assets/games/mulan/gallery/辞行.png" },
        { title: { zh: "第三章：征战", en: "Chapter 3: Campaign" }, image: "/assets/games/mulan/gallery/征战.png" },
        { title: { zh: "第四章：红妆", en: "Chapter 4: Red Attire" }, image: "/assets/games/mulan/gallery/红妆.png" },
        { title: { zh: "第五章：传唱", en: "Chapter 5: Ballad" }, image: "/assets/games/mulan/gallery/传唱.png" }
      ],
      sections: [
        {
          title: { zh: "第一章 织声", en: "Chapter 1: Weaving Voices" },
          mapImage: "/assets/games/mulan/gallery/横向长条场景地图1.png",
          nodes: [
            { zh: "家中", en: "Home" },
            { zh: "布告", en: "Notice" },
            { zh: "土地庙", en: "Earth Temple" },
            { zh: "草料堆", en: "Fodder Stack" },
            { zh: "马市", en: "Horse Market" },
            { zh: "鞍铺", en: "Saddle Shop" }
          ],
          cards: [
            {
              nodeIndex: 0,
              title: { zh: "唧唧复唧唧", en: "Click, Click Again" },
              description: { zh: "初入世界，与 NPC 对话推动剧情发展", en: "Enter the world and advance the story through NPC dialogue." },
              image: "/assets/games/mulan/gallery/唧唧复唧唧.png"
            },
            {
              nodeIndex: 1,
              title: { zh: "木兰当户织", en: "Mulan Weaves at the Door" },
              description: { zh: "通过织布玩法了解古代织布知识", en: "Learn ancient weaving knowledge through an interactive weaving mechanic." },
              image: "/assets/games/mulan/gallery/木兰当户织.png"
            },
            {
              nodeIndex: 3,
              title: { zh: "昨夜见军帖", en: "Last Night, the Draft Notice" },
              description: { zh: "完成解谜关卡，收集破碎军帖", en: "Complete a puzzle stage and collect fragments of the military notice." },
              image: "/assets/games/mulan/gallery/昨夜见军帖.png"
            },
            {
              nodeIndex: 4,
              title: { zh: "东市买骏马", en: "Buying a Steed in the East Market" },
              description: { zh: "购买马匹过程中学习古代装备含义", en: "Learn the meaning of ancient gear while purchasing a horse." },
              image: "/assets/games/mulan/gallery/东市买骏马.png"
            }
          ]
        },
        {
          title: { zh: "第二章 辞行", en: "Chapter 2: Departure" },
          mapImage: "/assets/games/mulan/gallery/横向长条场景地图2.png",
          nodes: [
            { zh: "黄河边", en: "Yellow River Bank" },
            { zh: "马车", en: "Carriage" },
            { zh: "军粮", en: "Rations" },
            { zh: "营帐", en: "Camp Tent" },
            { zh: "中军帐", en: "Command Tent" },
            { zh: "军籍登记区", en: "Military Registry" }
          ],
          cards: [
            {
              nodeIndex: 0,
              title: { zh: "营地生活", en: "Camp Life" },
              description: { zh: "感受古代军营生活", en: "Experience daily life inside an ancient military camp." },
              image: "/assets/games/mulan/gallery/感受古代军营生活.png"
            },
            {
              nodeIndex: 1,
              title: { zh: "马具知识", en: "Horse Gear Knowledge" },
              description: { zh: "解锁成就，了解马匹、马具等知识", en: "Unlock achievements while learning about horses and riding equipment." },
              image: "/assets/games/mulan/gallery/解锁成就，了解马匹、马具等知识.png"
            },
            {
              nodeIndex: 3,
              title: { zh: "沉浸式对话", en: "Immersive Dialogue" },
              description: { zh: "沉浸式对话与选择", en: "Make choices through immersive dialogue scenes." },
              image: "/assets/games/mulan/gallery/沉浸式对话与选择.png"
            },
            {
              nodeIndex: 5,
              title: { zh: "兵器招式", en: "Weapon Forms" },
              description: { zh: "通过解谜，了解古代战场冷兵器招式", en: "Learn ancient battlefield weapon forms through puzzle solving." },
              image: "/assets/games/mulan/gallery/通过解谜，了解古代战场冷兵器招式.png"
            }
          ]
        }
      ]
    },
    media: {
      videoEmbed: {
        provider: "youtube",
        url: "https://www.youtube.com/embed/SiH0cR64w2o",
        title: { zh: "项目视频", en: "Project Video" },
        aspect: "wide"
      }
    },
    playableDemo: {
      title: { zh: "试玩 Demo", en: "Playable Demo" },
      url: "https://yibeilou.itch.io/mulan",
      note: { zh: "建议使用电脑端体验，点击右上角可进入全屏试玩。", en: "Desktop experience recommended. Use the top-right button for fullscreen play." }
    }
  },
  {
    slug: "let-her-talk",
    category: "games",
    title: { zh: "Let Her Talk", en: "Let Her Talk" },
    date: "2024.12",
    tags: { zh: ["桌游", "体验设计", "AR"], en: ["Board game", "Experience design", "AR"] },
    excerpt: {
      zh: "一款以语言为核心机制的互动桌游。玩家通过完成语言与表达相关的挑战，争夺“发声权”。",
      en: "An interactive board game built around language as its core mechanic. Players complete challenges related to language and expression to compete for the right to speak."
    },
    cover: { tone: "green", label: "G02" },
    assets: withProjectMedia(projectAssets("games", "let-her-talk"), {
      coverImage: "/assets/games/let-her-talk/cover/banner/lht-cover.png",
      bannerImage: "/assets/games/let-her-talk/cover/banner/lht-cover.png"
    }),
    meta: {
      role: { zh: "机制设计 / 体验设计", en: "Mechanics / Experience design" },
      format: { zh: "桌游 + AR", en: "Board game + AR" }
    },
    theme: {
      background: "#EBCD96",
      text: "#000000",
      underline: "#561134"
    },
    detailMode: "gallery-only",
    gallery: [
      {
        title: { zh: "设计灵感", en: "Inspiration" },
        src: "/assets/games/let-her-talk/gallery/inspiration.png"
      },
      {
        title: { zh: "设计调研", en: "Research" },
        src: "/assets/games/let-her-talk/gallery/research.png"
      },
      {
        title: { zh: "视觉设计", en: "Visual Design" },
        src: "/assets/games/let-her-talk/gallery/visual%20design.png"
      },
      {
        title: { zh: "AR交互", en: "AR Interaction" },
        src: "/assets/games/let-her-talk/gallery/ar%20interaction.png"
      },
      {
        title: { zh: "设计成果", en: "Outcome" },
        src: "/assets/games/let-her-talk/gallery/outcome.png"
      }
    ]
  },
  {
    slug: "character-design-collection",
    category: "games",
    title: { zh: "角色原画合集", en: "Character Design Collection" },
    date: "2026.04",
    tags: {
      zh: ["原画", "立绘", "角色设计"],
      en: ["Concept Art", "Character Illustration", "Character Design"]
    },
    excerpt: {
      zh: "游戏角色服装设计立绘作品。",
      en: "Character illustration and costume design works for game characters."
    },
    cover: { tone: "violet", label: "G03" },
    assets: withProjectMedia(projectAssets("games", "character-design-collection"), {
      coverImage: "/assets/games/character-design-collection/cover/banner/原画-cover.png",
      bannerImage: "/assets/games/character-design-collection/cover/banner/原画-cover.png"
    }),
    meta: {
      role: { zh: "角色设计 / 服装设计", en: "Character design / Costume design" },
      format: { zh: "角色原画合集", en: "Character art collection" }
    },
    detailMode: "gallery-only",
    gallery: [
      {
        images: [
          "/assets/games/character-design-collection/gallery/0.jpg?v=20260611",
          "/assets/games/character-design-collection/gallery/1.jpg?v=20260611",
          "/assets/games/character-design-collection/gallery/2.jpg?v=20260611",
          "/assets/games/character-design-collection/gallery/3.jpg?v=20260611",
          "/assets/games/character-design-collection/gallery/4.jpg?v=20260611",
          "/assets/games/character-design-collection/gallery/5.jpg?v=20260622"
        ]
      }
    ]
  },
  {
    slug: "vyoga",
    category: "uiux",
    title: { zh: "Vyoga", en: "Vyoga" },
    date: "2025.12",
    tags: { zh: ["UI/UX设计", "品牌形象设计"], en: ["UI/UX design", "Brand identity"] },
    excerpt: { zh: "面向 Z 世代的轻瑜伽学习产品。", en: "A lightweight yoga learning product for Gen Z." },
    cover: { tone: "violet", label: "U01" },
    assets: withProjectMedia(projectAssets("uiux", "vyoga"), {
      coverImage: "/assets/uiux/vyoga/cover/banner/vyoga-cover.png",
      bannerImage: "/assets/uiux/vyoga/cover/banner/vyoga-cover.png"
    }),
    theme: {
      background: "#050505",
      text: "#FFFFFF",
      underline: "#5CF5F8"
    },
    detailMode: "gallery-only",
    gallery: [
      {
        title: { zh: "品牌形象", en: "Brand Identity" },
        src: "/assets/uiux/vyoga/gallery/1-brand.png"
      },
      {
        title: { zh: "软件功能", en: "Software Features" },
        src: "/assets/uiux/vyoga/gallery/2-app.png"
      },
      {
        title: { zh: "页面展示", en: "Interface Showcase" },
        src: "/assets/uiux/vyoga/gallery/3-interface.png"
      },
      {
        title: { zh: "硬件产品", en: "Hardware Product" },
        src: "/assets/uiux/vyoga/gallery/4-hardware.png"
      },
      {
        title: { zh: "展览视觉", en: "Exhibition Visuals" },
        src: "/assets/uiux/vyoga/gallery/5-visual.png"
      },
      {
        title: { zh: "展览落地", en: "Exhibition Launch" },
        src: "/assets/uiux/vyoga/gallery/6-exhibition.png"
      }
    ],
    meta: {
      role: { zh: "产品设计 / 品牌", en: "Product design / Branding" },
      format: { zh: "移动端产品", en: "Mobile product" }
    },
    media: {
      videoEmbed: {
        provider: "youtube",
        url: "https://www.youtube.com/embed/dhnlAxl2xIY",
        title: { zh: "Vyoga 项目视频", en: "Vyoga project video" }
      }
    },
    details: {
      intro: {
        zh: "Vyoga 是一款面向 Z 世代的轻瑜伽学习产品，结合轻量课程、视觉品牌与移动端体验，帮助用户以更低压力进入日常练习。",
        en: "Vyoga is a lightweight yoga learning product for Gen Z, combining approachable courses, visual identity, and mobile experience design."
      },
      sections: [
        {
          title: { zh: "项目介绍", en: "Project Introduction" },
          body: {
            zh: "此处预留项目背景、目标用户、产品定位与设计挑战，后续可继续扩展为完整 case study。",
            en: "Reserved for project context, target users, product positioning, and design challenges for a fuller case study."
          }
        },
        {
          title: { zh: "品牌与 UI 系统", en: "Brand and UI System" },
          body: {
            zh: "此处预留品牌关键词、色彩、字体、组件、页面视觉与移动端界面展示。",
            en: "Reserved for brand keywords, colors, typography, components, screen visuals, and mobile UI presentation."
          }
        },
        {
          title: { zh: "用户流程与动效", en: "User Flow and Motion" },
          body: {
            zh: "此处预留用户旅程、核心流程图、动效视频、GIF 与交互原型展示。",
            en: "Reserved for user journeys, key flows, motion videos, GIFs, and interactive prototypes."
          }
        }
      ]
    }
  },
  {
    slug: "space-time-overlap",
    category: "uiux",
    title: { zh: "时空叠影", en: "Space-Time Overlap" },
    date: "2025.05",
    tags: { zh: ["Vision Pro", "体验流程设计"], en: ["Vision Pro", "Experience flow"] },
    excerpt: {
      zh: "基于 Apple Vision Pro 的 XR 大空间沉浸式交大校史体验设计。",
      en: "An immersive XR campus-history experience for Apple Vision Pro."
    },
    cover: { tone: "cyan", label: "U02" },
    assets: withProjectMedia(projectAssets("uiux", "space-time-overlap"), {
      coverImage: "/assets/uiux/space-time-overlap/cover/banner/skdy-cover.png?v=20260528-2",
      bannerImage: "/assets/uiux/space-time-overlap/cover/banner/skdy-cover.png?v=20260528-2"
    }),
    meta: {
      role: { zh: "XR 流程 / 空间体验", en: "XR flow / Spatial experience" },
      format: { zh: "Vision Pro 概念", en: "Vision Pro concept" }
    },
    media: {
      videoEmbed: {
        provider: "youtube",
        url: "https://www.youtube.com/embed/E-edpWtn3Bg",
        title: { zh: "时空叠影项目视频", en: "Space-Time Overlap project video" },
        aspect: "wide"
      }
    }
  },
  {
    slug: "adapt-u",
    category: "uiux",
    title: { zh: "adapt-U", en: "adapt-U" },
    date: "2024.07",
    tags: { zh: ["服务设计"], en: ["Service design"] },
    excerpt: {
      zh: "帮助来自欠发达地区的“小镇做题家”更好地适应名校的大学生活。",
      en: "A service design project helping students from underdeveloped regions adapt to elite university life."
    },
    cover: { tone: "amber", label: "U03" },
    assets: withProjectMedia(projectAssets("uiux", "adapt-u"), {
      coverImage: "/assets/uiux/adapt-u/cover/banner/adaptu-cover.png",
      bannerImage: "/assets/uiux/adapt-u/cover/banner/adaptu-cover.png"
    }),
    theme: {
      background: "#FFFFFF",
      text: "#000000",
      underline: "#56537D"
    },
    detailMode: "gallery-only",
    gallery: [
      {
        title: { zh: "设计灵感", en: "Inspiration" },
        src: "/assets/uiux/adapt-u/gallery/1-inspiration.png"
      },
      {
        title: { zh: "设计调研", en: "Research" },
        src: "/assets/uiux/adapt-u/gallery/2-research.png"
      },
      {
        title: { zh: "低保真设计", en: "Low-Fidelity Design" },
        src: "/assets/uiux/adapt-u/gallery/3-sketch.png"
      },
      {
        title: { zh: "页面展示", en: "Interface Showcase" },
        src: "/assets/uiux/adapt-u/gallery/4-interface.png"
      },
      {
        title: { zh: "使用场景", en: "Usage Scenario" },
        src: "/assets/uiux/adapt-u/gallery/5-outcome.png"
      }
    ],
    meta: {
      role: { zh: "服务设计 / 用户研究", en: "Service design / User research" },
      format: { zh: "服务系统", en: "Service system" }
    }
  },
  {
    slug: "auralis",
    category: "visual",
    title: { zh: "风起之城", en: "Auralis" },
    date: "2025.11",
    tags: { zh: ["迪士尼挑战赛", "角色原画"], en: ["Disney challenge", "Character concept"] },
    excerpt: { zh: "从无声的荒原，到星球的和鸣。", en: "From a silent wasteland to the harmony of a planet." },
    cover: { tone: "green", label: "V01" },
    assets: withProjectMedia(projectAssets("visual", "auralis"), {
      coverImage: "/assets/visual/auralis/cover/banner/auralis-cover.png",
      bannerImage: "/assets/visual/auralis/cover/banner/auralis-cover.png"
    }),
    theme: {
      background: "#F3ECED",
      text: "#000000",
      underline: "#5A3638"
    },
    detailMode: "gallery-only",
    gallery: [
      {
        title: { zh: "世界观设计", en: "Worldbuilding Design" },
        images: ["/assets/visual/auralis/gallery/1.png", "/assets/visual/auralis/gallery/2.png"]
      },
      {
        title: { zh: "体验设计", en: "Experience Design" },
        images: [
          "/assets/visual/auralis/gallery/3.png",
          "/assets/visual/auralis/gallery/4.png",
          "/assets/visual/auralis/gallery/5.png",
          "/assets/visual/auralis/gallery/6.png"
        ]
      }
    ],
    meta: {
      role: { zh: "概念视觉 / 角色原画", en: "Concept visual / Character art" },
      format: { zh: "世界观视觉", en: "Worldbuilding visual" }
    },
    media: {
      videoEmbed: {
        provider: "youtube",
        url: "https://www.youtube.com/embed/EptzH53731A",
        title: { zh: "概念视频", en: "Concept Video" },
        aspect: "wide"
      }
    }
  },
  {
    slug: "campaign-pages",
    category: "visual",
    title: { zh: "营销页作品", en: "Campaign Pages" },
    date: "2026.04",
    tags: { zh: ["互联网设计"], en: ["Internet design"] },
    excerpt: { zh: "节日营销活动页面设计。", en: "Seasonal campaign landing page design." },
    cover: { tone: "amber", label: "V02" },
    assets: withProjectMedia(projectAssets("visual", "campaign-pages"), {
      coverImage: "/assets/visual/campaign-pages/cover/banner/yxy-cover.png?v=20260601",
      bannerImage: "/assets/visual/campaign-pages/cover/banner/yxy-cover.png?v=20260601"
    }),
    theme: {
      background: "#E0EEF8",
      text: "#000000",
      underline: "#5A3638"
    },
    detailMode: "gallery-only",
    gallery: [
      {
        layout: "grid",
        images: [
          "/assets/visual/campaign-pages/gallery/content1.jpg",
          "/assets/visual/campaign-pages/gallery/content2.jpg",
          "/assets/visual/campaign-pages/gallery/content3.png",
          "/assets/visual/campaign-pages/gallery/content4.jpg",
          "/assets/visual/campaign-pages/gallery/content5.png",
          "/assets/visual/campaign-pages/gallery/content6.png"
        ]
      }
    ],
    meta: {
      role: { zh: "视觉设计 / 页面设计", en: "Visual design / Page design" },
      format: { zh: "营销页面", en: "Campaign pages" }
    }
  },
  {
    slug: "metamorphosis",
    category: "ai-films",
    title: { zh: "变形记", en: "Metamorphosis" },
    date: "2025.04",
    tags: { zh: ["公益广告", "AI短片"], en: ["Public service ad", "AI short film"] },
    excerpt: {
      zh: "上海精神卫生中心-心理热线宣传短片",
      en: "A mental health hotline promotional short film for the Shanghai Mental Health Center."
    },
    cover: { tone: "violet", label: "A01" },
    assets: withProjectMedia(projectAssets("ai-films", "metamorphosis"), {
      coverImage: "/assets/ai-films/metamorphosis/cover/bxj.png",
      bannerImage: "/assets/ai-films/metamorphosis/cover/bxj.png"
    }),
    meta: {
      role: { zh: "AI 视频 / 短片", en: "AI video / Short film" },
      format: { zh: "公益广告", en: "Public service ad" }
    },
    theme: {
      background: "#E5F9F9",
      text: "#000000",
      underline: "#62BEC6"
    },
    detailMode: "gallery-only",
    gallery: [
      {
        title: { zh: "设计策略", en: "Design Strategy" },
        src: "/assets/ai-films/metamorphosis/gallery/1.png"
      },
      {
        title: { zh: "角色设计", en: "Character Design" },
        src: "/assets/ai-films/metamorphosis/gallery/2.png"
      },
      {
        title: { zh: "分镜脚本", en: "Storyboard" },
        src: "/assets/ai-films/metamorphosis/gallery/3.png"
      },
      {
        title: { zh: "流程总结", en: "Process Summary" },
        src: "/assets/ai-films/metamorphosis/gallery/4.png"
      }
    ]
  },
  {
    slug: "one-bar-courage",
    category: "ai-films",
    title: { zh: "一格电的勇气", en: "One Bar of Courage" },
    date: "2025.04",
    tags: { zh: ["公益广告", "AI短片"], en: ["Public service ad", "AI short film"] },
    excerpt: {
      zh: "上海精神卫生中心-心理热线宣传短片",
      en: "A mental health hotline promotional short film for the Shanghai Mental Health Center."
    },
    cover: { tone: "cyan", label: "A02" },
    assets: withProjectMedia(projectAssets("ai-films", "one-bar-courage"), {
      coverImage: "/assets/ai-films/one-bar-courage/cover/banner/fj-cover.png",
      bannerImage: "/assets/ai-films/one-bar-courage/cover/banner/fj-cover.png"
    }),
    meta: {
      role: { zh: "AI 视频 / 短片", en: "AI video / Short film" },
      format: { zh: "公益广告", en: "Public service ad" }
    },
    media: {
      videoEmbed: {
        provider: "youtube",
        url: "https://www.youtube.com/embed/oSuA-SYnlEg",
        title: { zh: "一格电的勇气项目视频", en: "One Bar of Courage project video" },
        aspect: "short"
      }
    }
  },
  {
    slug: "auralis-film",
    category: "ai-films",
    title: { zh: "百分之思", en: "Percent Thought" },
    date: "2024.11",
    tags: { zh: ["广告", "微电影", "导演"], en: ["Advertising", "Microfilm", "Director"] },
    excerpt: { zh: "百分之思矿泉水品牌广告宣传片。", en: "A brand promotional microfilm for Percent Thought mineral water." },
    cover: { tone: "green", label: "A03" },
    assets: withProjectMedia(projectAssets("ai-films", "auralis-film"), {
      coverImage: "/assets/ai-films/auralis-film/cover/banner/bfzs-cover.png",
      bannerImage: "/assets/ai-films/auralis-film/cover/banner/bfzs-cover.png"
    }),
    meta: {
      role: { zh: "导演 / 广告短片", en: "Director / Advertising short" },
      format: { zh: "品牌微电影", en: "Brand microfilm" }
    },
    media: {
      videoEmbed: {
        provider: "youtube",
        url: "https://www.youtube.com/embed/loLpJL4yKBc",
        title: { zh: "百分之思项目视频", en: "Percent Thought project video" },
        aspect: "wide"
      }
    }
  }
];

export function getCategory(key: CategoryKey) {
  return categories.find((category) => category.key === key);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(category: Project["category"]) {
  return projects.filter((project) => project.category === category);
}

export const workCategories = categories.filter(
  (category): category is Category & { key: Project["category"] } =>
    category.key !== "home" && category.key !== "about"
);
