import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        panel: "#0b0d10",
        line: "rgba(255,255,255,0.1)",
        mist: "rgba(255,255,255,0.68)",
        glow: "#82d9ff",
        aurora: "#b7ffdd",
        ember: "#ffb899"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 32px rgba(130, 217, 255, 0.18)",
        card: "0 24px 90px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "radial-noise":
          "radial-gradient(circle at 22% 18%, rgba(130,217,255,0.18), transparent 28%), radial-gradient(circle at 76% 6%, rgba(255,184,153,0.12), transparent 30%), radial-gradient(circle at 50% 88%, rgba(183,255,221,0.08), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
