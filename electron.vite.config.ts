import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5"
import react from "@vitejs/plugin-react"
import autoprefixer from "autoprefixer"
import {bytecodePlugin, defineConfig} from "electron-vite"
import {createRequire} from "node:module"
import path from "path"
import htmlMinifier from "vite-plugin-html-minifier"
import {Mode, plugin as markdown} from "vite-plugin-markdown"
import {viteStaticCopy} from "vite-plugin-static-copy"

const require = createRequire(import.meta.url)
export default defineConfig({
    main: {
        root: "./",
        plugins: [bytecodePlugin()],
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "src"),
                "^": __dirname,
                $hooks: path.resolve(__dirname, "src/hooks"),
                $components: path.resolve(__dirname, "src/views/components"),
                $utils: path.resolve(__dirname, "src/utils"),
                $locales: path.resolve(__dirname, "src/locales"),
                $plugin: path.resolve(__dirname, "src/plugin"),
            },
        },
        build: {
            rollupOptions: {
                input: "src-electron/main.ts",
                output: {
                    entryFileNames: "main.js",
                    dir: "out",
                },
            },
        },
    },
    preload: {
        root: "./",
        plugins: [bytecodePlugin()],
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "src"),
                "^": __dirname,
                $hooks: path.resolve(__dirname, "src/hooks"),
                $components: path.resolve(__dirname, "src/views/components"),
                $utils: path.resolve(__dirname, "src/utils"),
                $locales: path.resolve(__dirname, "src/locales"),
                $plugin: path.resolve(__dirname, "src/plugin"),
            },
        },
        build: {
            emptyOutDir: false,
            rollupOptions: {
                input: "src-electron/preload.ts",
                output: {
                    entryFileNames: "preload.cjs",
                    dir: "out",
                    format: "cjs",
                },
            },
        },
    },
    renderer: {
        root: "./",
        plugins: [
            react(),
            ckeditor5({
                theme: require.resolve("@ckeditor/ckeditor5-theme-lark"),
            }),
            // svgr({ exportAsDefault: true, svgrOptions: { icon: true } }),
            viteStaticCopy({
                targets: [
                    {src: "src-tauri/icons/icon.ico", dest: "./", rename: "favicon.ico"},
                ],
            }),
            htmlMinifier({minify: true}),
            markdown({mode: [Mode.HTML]}),
        ],
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "src"),
                "^": __dirname,
                $hooks: path.resolve(__dirname, "src/hooks"),
                $components: path.resolve(__dirname, "src/views/components"),
                $utils: path.resolve(__dirname, "src/utils"),
                $locales: path.resolve(__dirname, "src/locales"),
                $plugin: path.resolve(__dirname, "src/plugin"),
            },
        },
        // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
        // prevent vite from obscuring rust errors
        clearScreen: true,
        worker: {format: "es"},
        // tauri expects a fixed port, fail if that port is not available
        server: {
            host: "0.0.0.0",
            port: 8888,
            strictPort: true,
            // hmr: {
            // protocol: "ws",
            // host: "0.0.0.0",
            // port: 4444,
            // },
        },
        // to make use of `TAURI_DEBUG` and other env variables
        // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
        envPrefix: ["VITE_", "TAURI_"],
        build: {
            // Tauri supports es2021
            // target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
            target: "chrome105",
            // don't minify for debug builds
            minify: !process.env.TAURI_DEBUG,
            // produce sourcemaps for debug builds
            sourcemap: !!process.env.TAURI_DEBUG,
            modulePreload: true,
            emptyOutDir: false,
            rollupOptions: {
                input: "index.html",
                output: {
                    dir: "out",
                    manualChunks: {
                        react: ["react", "react-dom", "react-dom/client"],
                        antd: ["antd"],
                        icons: ["@ant-design/icons"],
                        utils: ["lodash", "dayjs"],
                        editor: [
                            "@ckeditor/ckeditor5-core",
                            "@ckeditor/ckeditor5-react",
                            "@ckeditor/ckeditor5-ui",
                            "@ckeditor/ckeditor5-markdown-gfm",
                            "@ckeditor/ckeditor5-basic-styles",
                            "@ckeditor/ckeditor5-editor-classic",
                            "@ckeditor/ckeditor5-essentials",
                            "@ckeditor/ckeditor5-heading",
                            "@ckeditor/ckeditor5-horizontal-line",
                            "@ckeditor/ckeditor5-image",
                            "@ckeditor/ckeditor5-link",
                            "@ckeditor/ckeditor5-list",
                            "@ckeditor/ckeditor5-paragraph",
                            "@ckeditor/ckeditor5-autoformat",
                            "@ckeditor/ckeditor5-block-quote",
                            "@ckeditor/ckeditor5-code-block",
                            "@ckeditor/ckeditor5-easy-image",
                            "@ckeditor/ckeditor5-media-embed",
                            "@ckeditor/ckeditor5-paste-from-office",
                            "@ckeditor/ckeditor5-source-editing",
                            "@ckeditor/ckeditor5-table",
                        ],
                    },
                },
            },
        },
        esbuild: {
            pure: process.env.TAURI_DEBUG ? [] : ["console.log", "debugger"],
        },
        css: {
            postcss: {
                plugins: [autoprefixer({})],
            },
        },
    },
})
