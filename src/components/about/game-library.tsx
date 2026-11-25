"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";

const games = [
  { zh: "星露谷", en: "Stardew Valley", genre: "simulation", app: 413150 },
  { zh: "胡闹厨房", en: "Overcooked!", genre: "coop", app: 448510 },
  { zh: "泰拉瑞亚", en: "Terraria", genre: "sandbox", app: 105600 },
  { zh: "文明 VI", en: "Civilization VI", genre: "strategy", app: 289070 },
  { zh: "王者荣耀", en: "Honor of Kings", genre: "competitive", app: null },
  { zh: "和平精英", en: "Game for Peace", genre: "competitive", app: null },
  { zh: "代号鸢", en: "Ashes of the Kingdom", genre: "narrative", app: null }
];

const genres = [
  { id: "all", zh: "全部", en: "All" },
  { id: "simulation", zh: "模拟经营", en: "Simulation" },
  { id: "coop", zh: "合作", en: "Co-op" },
  { id: "sandbox", zh: "沙盒", en: "Sandbox" },
  { id: "strategy", zh: "策略", en: "Strategy" },
  { id: "competitive", zh: "竞技", en: "Competitive" },
  { id: "narrative", zh: "剧情", en: "Narrative" }
];

export function GameLibrary() {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [failed, setFailed] = useState<number[]>([]);
  const visible = games.filter((game) =>
    (genre === "all" || game.genre === genre) &&
    (game.zh + game.en).toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="mt-28" aria-labelledby="game-library-title">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h2 id="game-library-title" className="text-2xl font-medium text-white sm:text-3xl">
          {locale === "zh" ? "游戏库" : "Game Library"}
          <span className="ml-3 text-base font-normal tabular-nums text-white/40">{games.length}</span>
        </h2>
        <label className="flex items-center gap-3 border-b border-white/20 py-2 text-white/50">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={locale === "zh" ? "搜索游戏" : "Search games"}
            placeholder={locale === "zh" ? "搜索游戏" : "Search games"}
            className="w-48 bg-transparent text-sm text-white outline-none"
          />
        </label>
      </div>
      <div className="mt-7 flex flex-wrap gap-2" aria-label={locale === "zh" ? "游戏类型" : "Game genres"}>
        {genres.map((entry) => (
          <button key={entry.id} type="button" aria-pressed={genre === entry.id} onClick={() => setGenre(entry.id)}
            className={`focus-ring rounded-lg border px-3 py-2 text-xs transition-colors ${genre === entry.id ? "border-glow/50 bg-glow/10 text-white" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"}`}>
            {entry[locale]}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((game) => (
          <li key={game.en} className="group min-w-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-transform duration-300 group-hover:-translate-y-1">
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className="text-xs uppercase text-glow/70">{genres.find((entry) => entry.id === game.genre)?.[locale]}</span>
                <span className="mt-3 text-xl font-medium leading-relaxed text-white">{game[locale]}</span>
              </div>
              {game.app && !failed.includes(game.app) && (
                // Store artwork is decorative; the game name is available below.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.app}/library_600x900.jpg`}
                  alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover"
                  onError={() => setFailed((current) => [...current, game.app!])} />
              )}
            </div>
            <h3 className="mt-3 text-sm font-medium text-white/85">{game[locale]}</h3>
          </li>
        ))}
      </ul>
      {!visible.length && <p role="status" className="py-16 text-center text-sm text-white/50">{locale === "zh" ? "没有找到相关游戏" : "No games found"}</p>}
    </section>
  );
}
