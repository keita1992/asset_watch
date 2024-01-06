// Muiのテーマを定義する
import { PaletteColor, PaletteColorOptions, createTheme } from "@mui/material";

// PalleteOptionsとPaletteの両方を拡張
declare module "@mui/material/styles" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface PaletteOptions {
    link?: PaletteColorOptions;
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Palette {
    link: PaletteColor;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2e8b57",
    },
    link: {
      main: "#00bfff",
    },
    mode: "dark",
  },
});
