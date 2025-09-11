export type PaletteOverrideLike = {
    light?: {
        main?: string;
    };
    dark?: {
        main?: string;
    };
};

export const defaultPalette_urgent = {
    dark: {
        main: "#2C323F",
    },
    light: {
        main: "#F1F0EB",
    },
} satisfies PaletteOverrideLike;
