export default {
  theme: {
    extend: {
      maxHeight: {
        0: "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
      },
      inset: {
        px: "1px",
        "1/2": "50%",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",

        // Base colors with light and dark variants
        bitcoin: "#f7931a",

        bitcoinText: "#5b5b5b",

        card: "#1A1210",

        // Black colors
        black: {
          100: "#2b1911",
          90: "#402f28",
          75: "#624d44",
          65: "#7d675e",
          50: "#9f8c82",
          25: "#baada7",
          10: "#eae3df",
          5: "#f4eeeb",
        },

        // Primary colors and their backgrounds
        primary: {
          dark: {
            2: "#963600",
            1: "#c45104",
          },
          main: "#f56522",
          mainTrans: "rgba(245, 101, 34, 0)", // Full transparency
          mild: {
            2: "#ffa171",
            1: "#fcccb6",
          },
          background: {
            dark: {
              color: "#feede5",
              trans: "rgba(254, 237, 229, 0.95)", // 95% transparency
            },
            main: "#fff9f6",
            light: {
              color: "#fffcfa",
              trans: "rgba(255, 252, 250, 0)", // Full transparency
            },
          },
        },

        // Success colors and backgrounds
        success: {
          dark: {
            2: "#246f00",
            1: "#4f910c",
          },
          main: "#65a519",
          mild: {
            2: "#afda73",
            1: {
              color: "#ddefc3",
              trans: "rgba(221, 239, 195, 0.95)", // 95% transparency
            },
          },
          background: {
            dark: {
              color: "#f2f9e7",
              trans: "rgba(242, 249, 231, 0.95)", // 95% transparency
            },
            main: "#fcfef6",
            light: "#fefefb",
          },
        },

        // Warning colors and backgrounds
        warning: {
          dark: {
            2: "#f19e12",
            1: "#f3b71a",
          },
          main: "#f5ce22",
          mild: {
            2: "#f9e96c",
            1: "#fdf6c0",
          },
          background: {
            dark: "#fefce5",
            main: "#fffef5",
            light: "#fffefa",
          },
        },

        // Error colors and backgrounds
        error: {
          dark: "#b01807",
          main: "#df321f",
          light: "#fe5a48",
          mild: "#ffd1ca",
          background: "#ffe6e1",
        },

        // Info colors and backgrounds
        info: {
          dark: "#005e89",
          main: "#037db5",
          light: "#099de2",
          mild: "#93d6f5",
          background: "#d7f2fe",
        },

        // Gradient colors
        gradient: {
          yellow: "#ffa24c",
          orange: "#ff7a50",
          red: "#ff4d42",
        },

        // Custom color associations
        backgroundMain: {
          light: "#fff9f6",
          dark: "#120a07",
        },
        backgroundLight: {
          light: "#fffcfa",
          trans: "rgba(255, 252, 250, 0.95)", // 95% transparency
        },
      },
      fontSize: {
        "6xl": "96px",
        "5xl": "60px",
        "4xl": "48px",
        "3xl": "34px",
        "2xl": "24px",
        xl: "20px",
        lg: "18px",
        base: "16px",
        sm: "15px",
        xs: "14px",
        "2xs": "13px",
        "3xs": "12px",
      },
      lineHeight: {
        "6xl": "112px",
        "5xl": "72px",
        "4xl": "56px",
        "3xl": "42px",
        "2xl": "32px",
        xl: "28px",
        lg: "26px",
        base: "24px",
        sm: "22px",
        xs: "20px",
      },
      letterSpacing: {
        superTightest: "-0.03em",
        tightest: "-0.016em",
        tighter: "-0.01em",
        tight: "0m",
        normal: "0.01em",
        wide: "0.028em",
        wider: "0.036em",
        widest: "0.1em",
      },
      minHeight: {
        10: "40px",
      },
      width: {
        "1/8": "12.5%",
        "2/8": "25%",
        "3/8": "37.5%",
        "4/8": "50%",
        "5/8": "62.5%",
        "6/8": "75%",
        "7/8": "87.5%",
        "8/8": "100%",
      },
      padding: {
        sm: "8px",
        md: "16px",
      },
      margin: {
        sm: "8px",
        md: "16px",
      },
    },
    fontFamily: {
      baloo: ["Baloo2-Regular", "sans-serif"],
      "baloo-medium": ["Baloo2-Medium", "sans-serif"],
      "baloo-semibold": ["Baloo2-SemiBold", "sans-serif"],
      "baloo-bold": ["Baloo2-Bold", "sans-serif"],
      "courier-prime": ["CourierPrime-Regular", "sans-serif"],
      "courier-prime-bold": ["CourierPrime-Bold", "sans-serif"],
    },
    screens: {
      sm: "320px",
      md: "374px",
    },
  },
  darkMode: "class",
  variants: {},
  corePlugins: {},
};
