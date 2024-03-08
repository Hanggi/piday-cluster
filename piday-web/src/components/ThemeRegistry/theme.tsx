import { extendTheme } from "@mui/joy/styles";

import { Inter, Source_Code_Pro } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  adjustFontFallback: false, // prevent NextJS from adding its own fallback font
  fallback: ["var(--joy-fontFamily-fallback)"], // use Joy UI's fallback font
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  adjustFontFallback: false, // prevent NextJS from adding its own fallback font
  fallback: [
    // the default theme's fallback for monospace fonts
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ],
  display: "swap",
});

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          100: "#fff2cc",
          200: "#ffe699",
          300: "#ffd966",
          400: "#ffcd33",
          500: "#ffc000",
          600: "#cc9a00",
          700: "#997300",
          800: "#664d00",
          900: "#332600",
        },
      },
    },
  },
  fontFamily: {
    body: inter.style.fontFamily,
    display: inter.style.fontFamily,
    code: sourceCodePro.style.fontFamily,
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "solid" &&
            ownerState.color === "primary" && {
              backgroundColor: "#ffc000",
              color: "#000000",
            }),
          // ...(ownerState.color === "neutral" && {
          //   ":hover": {
          //     backgroundColor: "#ffffffbb",
          //   },
          //   backgroundColor: "#ffffff",
          //   color: "#7030A0",
          // }),
        }),
      },
    },
  },
});

export default theme;
