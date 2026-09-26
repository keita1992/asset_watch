// Muiのテーマを定義する（値は src/styles/tokens.css と同じデザインシステムのトークン）
import { PaletteColor, PaletteColorOptions, createTheme } from "@mui/material";

// PalleteOptionsとPaletteの両方を拡張
declare module "@mui/material/styles" {
  // eslint-disable-next-line
  interface PaletteOptions {
    link?: PaletteColorOptions;
  }
  // eslint-disable-next-line
  interface Palette {
    link: PaletteColor;
  }
}

const tokens = {
  light: {
    canvas: "#eef1f1",
    surface: "#ffffff",
    line: "#dde3e4",
    ink: "#111a1e",
    ink2: "#4a5a61",
    ink3: "#5f6f76",
    accent: "#0b6e6b",
    liability: "#b3431a",
  },
  dark: {
    canvas: "#0d1215",
    surface: "#161d21",
    line: "#263036",
    ink: "#e8eef0",
    ink2: "#a9b7bd",
    ink3: "#8a9aa3",
    accent: "#3fb8b0",
    liability: "#f08a5d",
  },
};

export const fontFamily =
  '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", YuGothic, "Noto Sans JP", sans-serif';

export const createAppTheme = (mode: "light" | "dark") => {
  const t = tokens[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: t.accent },
      error: { main: t.liability },
      link: { main: t.accent },
      background: { default: t.canvas, paper: t.surface },
      text: { primary: t.ink, secondary: t.ink2, disabled: t.ink3 },
      divider: t.line,
    },
    typography: {
      fontFamily,
      h1: { fontSize: 18, lineHeight: "26px", fontWeight: 600 },
      h2: { fontSize: 14, lineHeight: "20px", fontWeight: 600 },
    },
    shape: { borderRadius: 4 },
    components: {
      MuiCssBaseline: {
        styleOverrides: { h1: { margin: 0, fontSize: 18, lineHeight: "26px", fontWeight: 600 } },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: "none", border: `1px solid ${t.line}` } },
      },
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  });
};
