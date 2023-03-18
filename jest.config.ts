import { JestConfigWithTsJest, pathsToModuleNameMapper } from "ts-jest"
import { compilerOptions } from "./tsconfig.json"

export default <JestConfigWithTsJest>{
    preset: 'ts-jest',
    clearMocks: true,
    coverageDirectory: "coverage",
    // testEnvironment: "jsdom",
    moduleFileExtensions: ['ts', 'js', 'json', 'tsx'],
    moduleDirectories: ['node_modules', 'src'],
    roots: ["<rootDir>"],
    modulePaths: ["<rootDir>"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    // setupFiles: ['./test/setup.js'],
    // 引入jest-enzyme扩展断言支持
    // setupFilesAfterEnv: ['./node_modules/jest-enzyme/lib/index.js'],
    transform: {
        "\.tsx?": ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
    },
}  