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

        bitcoin: "#f7931a",

        bitcoinText: "#5b5b5b",

        card: "#1A1210",

        black: {
          100: "#2B1911",
          90: "#402F28",
          75: "#624D44",
          65: "#7D675E",
          50: "#9F8C82",
          25: "#BAADA7",
          10: "#EAE3DF",
          5: "#F4EEEB",
        },

        primary: {
          dark: {
            2: "#963600",
            1: "#C45104",
          },
          main: "#F56522",
          mainTrans: "rgba(245, 101, 34, 0)",
          mild: {
            2: "#FFA171",
            1: "#FCCCB6",
          },
          background: {
            dark: {
              color: "#FEEDE5",
              trans: "rgba(254, 237, 229, 0.95)",
            },
            main: "#FFF9F6",
            light: {
              color: "#FFFCFA",
              trans: "rgba(255, 252, 250, 0)",
            },
          },
        },

        success: {
          dark: {
            2: "#246F00",
            1: "#4F910C",
          },
          main: "#65A519",
          mild: {
            2: "#AFDA73",
            1: {
              color: "#DDEFC3",
              trans: "rgba(221, 239, 195, 0.95)",
            },
          },
          background: {
            dark: {
              color: "#F2F9E7",
              trans: "rgba(242, 249, 231, 0.95)",
            },
            main: "#FCFEF6",
            light: "#FEFEFB",
          },
        },

        warning: {
          dark: {
            2: "#F19E12",
            1: "#F3B71A",
          },
          main: "#F5CE22",
          mild: {
            2: "#F9E96C",
            1: "#FDF6C0",
          },
          background: {
            dark: "#FEFCE5",
            main: "#FFFEF5",
            light: "#FFFEFA",
          },
        },

        error: {
          dark: "#B01807",
          main: "#DF321F",
          light: "#FE5A48",
          mild: "#FFD1CA",
          background: "#FFE6E1",
        },

        info: {
          dark: "#005E89",
          main: "#037DB5",
          light: "#099DE2",
          mild: "#93D6F5",
          background: "#D7F2FE",
        },

        gradient: {
          yellow: "#FFA24C",
          orange: "#FF7A50",
          red: "#FF4D42",
        },

        backgroundMain: {
          light: "#FFF9F6",
          dark: "#120A07",
        },
        backgroundLight: {
          light: "#FFFCFA",
          trans: "rgba(255, 252, 250, 0.95)",
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
