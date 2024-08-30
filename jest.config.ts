import type { Config } from "jest";

// Add any custom config to be passed to Jest
const config: Config = {
    preset: "ts-jest",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};

export default config;
