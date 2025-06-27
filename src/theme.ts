// theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";

// Create the system with custom tokens
export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                brand: {
                    50: { value: "#e6f7ff" },
                    100: { value: "#b3e0ff" },
                    200: { value: "#80c9ff" },
                    300: { value: "#4db3ff" },
                    400: { value: "#1a9cff" },
                    500: { value: "#0085e6" },
                    600: { value: "#0068b3" },
                    700: { value: "#004c80" },
                    800: { value: "#00304d" },
                    900: { value: "#00141f" },
                },
                spotify: {
                    green: { value: "#1DB954" },
                    black: { value: "#191414" },
                },
            },
            fonts: {
                heading: { value: '"Circular Std", sans-serif' },
                body: { value: '"Circular Std", sans-serif' },
            },
        },
        recipes: {
            Button: {
                variants: {
                    spotify: {
                        base: {
                            bg: "spotify.green",
                            color: "white",
                        },
                        _hover: {
                            bg: "green.400",
                        },
                    },
                },
            },
        },
        semanticTokens: {
            colors: {
                "bg.default": {
                    value: { base: "white", _dark: "gray.900" },
                },
                "fg.default": {
                    value: { base: "gray.800", _dark: "white" },
                },
                "bg.subtle": {
                    value: { base: "gray.100", _dark: "gray.800" },
                },
                "border.default": {
                    value: { base: "gray.200", _dark: "gray.700" },
                },
                "card.bg": {
                    value: { base: "white", _dark: "gray.800" },
                },
                "card.border": {
                    value: { base: "gray.200", _dark: "gray.700" },
                },
            },
        },
    },
});

export default system;
