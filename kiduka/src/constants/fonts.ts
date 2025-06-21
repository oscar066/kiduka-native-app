// src/constants/fonts.ts
export const Fonts = {
  // Font Families
  families: {
    poppins: {
      regular: "Poppins_400Regular",
      medium: "Poppins_500Medium",
      semiBold: "Poppins_600SemiBold",
      bold: "Poppins_700Bold",
    },
    roboto: {
      regular: "Roboto_400Regular",
      medium: "Roboto_500Medium",
      bold: "Roboto_700Bold",
    },
    robotoMono: {
      regular: "RobotoMono_400Regular",
      medium: "RobotoMono_500Medium",
    },
  },
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;
