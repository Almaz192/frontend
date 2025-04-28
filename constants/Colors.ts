/**
 * Application color palette
 * This file defines all colors used throughout the application
 */

// Primary brand colors
export const PRIMARY = {
    GREEN: "#6C873A", // Main brand green
    LIGHT_GREEN: "#9DB276", // Secondary lighter green
    BROWN: "#74533A", // Accent brown
    RED: "#E63946", // Used for alerts/errors
};

// Neutral colors
export const NEUTRAL = {
    WHITE: "#FFFFFF",
    BLACK: "#000000",
    LIGHT_GRAY: "#F3F3F3", // Used in input backgrounds
    GRAY: "#CCCCCC", // Used in borders
};

// Transparent colors
export const TRANSPARENT = {
    WHITE_10: "rgba(255, 255, 255, 0.1)",
    WHITE_15: "rgba(255, 255, 255, 0.15)",
    WHITE_20: "rgba(255, 255, 255, 0.2)",
    WHITE_30: "rgba(255, 255, 255, 0.3)",
    WHITE_50: "rgba(255, 255, 255, 0.5)",
    WHITE_80: "rgba(255, 255, 255, 0.8)",
    BLACK_30: "rgba(0, 0, 0, 0.3)",
    BLACK_50: "rgba(0, 0, 0, 0.5)",
    GREEN_30: "rgba(157, 178, 118, 0.3)",
    BROWN_20: "rgba(116, 83, 58, 0.2)",
};

// Social media colors
export const SOCIAL = {
    FACEBOOK: "#4267B2",
    GOOGLE_BG: "#F5F5F5",
    APPLE: "#000000",
};

// Special colors
export const SPECIAL = {
    GOLD: "#D4AF37", // For premium features
    PREMIUM_BG: "#FFFDF2", // Background for premium cards
};

// Shadow settings
export const SHADOW = {
    REGULAR: {
        shadowColor: NEUTRAL.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ELEVATED: {
        shadowColor: NEUTRAL.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
};

// Text shadow
export const TEXT_SHADOW = {
    REGULAR: {
        textShadowColor: TRANSPARENT.BLACK_30,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
};

// Theme configuration for light/dark mode (currently only using light)
export const Colors = {
    light: {
        text: NEUTRAL.BLACK,
        background: NEUTRAL.WHITE,
        primary: PRIMARY.GREEN,
        secondary: PRIMARY.LIGHT_GREEN,
        accent: PRIMARY.BROWN,
        error: PRIMARY.RED,
        card: NEUTRAL.WHITE,
        border: NEUTRAL.GRAY,
    },
    dark: {
        text: NEUTRAL.WHITE,
        background: "#1A1A1A",
        primary: PRIMARY.GREEN,
        secondary: PRIMARY.LIGHT_GREEN,
        accent: PRIMARY.BROWN,
        error: PRIMARY.RED,
        card: "#2A2A2A",
        border: "#444444",
    },
};
