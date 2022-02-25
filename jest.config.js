module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
    setupFiles: ['./__tests__/setup.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['./src/components/**/*.vue'],
    coverageReporters: ['text-summary'],
    testMatch: ['<rootDir>/__tests__/unit/**/*.spec.(js|jsx|ts|tsx)']
};
