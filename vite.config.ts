import path from "path"

import react from "@vitejs/plugin-react"
import { internalIpV4 } from "internal-ip"
import { defineConfig } from "vite"
import htmlMinifier from "vite-plugin-html-minifier"
import { plugin as markdown, Mode } from "vite-plugin-markdown"
import { viteStaticCopy } from "vite-plugin-static-copy"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const host = await internalIpV4()

  return {
    base: "./",
    plugins: [
      react(),
      svgr({ exportAsDefault: true, svgrOptions: { icon: true } }),
      viteStaticCopy({
        targets: [
          { src: "src-tauri/icons/icon.ico", dest: "./", rename: "favicon.ico" },
        ],
      }),
      htmlMinifier({ minify: true }),
      markdown({ mode: [Mode.HTML] }),
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
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          esbuildPluginMonacoEditorNls({
            locale: Languages.zh_hans,
            localeData: zh_CN.contents,
          }),
        ],
      },
    },
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // prevent vite from obscuring rust errors
    clearScreen: true,
    worker: { format: "es" },
    // tauri expects a fixed port, fail if that port is not available
    server: {
      host: "0.0.0.0",
      port: 8888,
      strictPort: true,
      hmr: {
        protocol: "ws",
        host,
        port: 4444,
      },
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri supports es2021
      target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? true : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
      modulePreload: true,
      rollupOptions: {
        // external: ["antd", "react", "react-dom", "lodash"],
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-dom/client"],
            antd: ["antd"],
            icons: ["@ant-design/icons"],
            utils: ["lodash", "dayjs"],
          },
        },
      },
    },
  }
})
