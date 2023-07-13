// vite.config.ts
import { createRequire } from "node:module";
import path from "path";
import ckeditor5 from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/@ckeditor+vite-plugin-ckeditor5@0.1.3/node_modules/@ckeditor/vite-plugin-ckeditor5/dist/index.mjs";
import react from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/@vitejs+plugin-react@3.1.0_vite@4.1.1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import autoprefixer from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/autoprefixer@10.4.14_postcss@8.4.24/node_modules/autoprefixer/lib/autoprefixer.js";
import { internalIpV4 } from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/internal-ip@7.0.0/node_modules/internal-ip/index.js";
import { defineConfig } from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/vite@4.1.1_@types+node@18.13.0_sass@1.58.2/node_modules/vite/dist/node/index.js";
import htmlMinifier from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/vite-plugin-html-minifier@1.0.3_vite@4.1.1/node_modules/vite-plugin-html-minifier/dist/index.mjs";
import { plugin as markdown, Mode } from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/vite-plugin-markdown@2.1.0_vite@4.1.1/node_modules/vite-plugin-markdown/dist/index.js";
import { viteStaticCopy } from "file:///Users/hefang/DevDir/hefang-note/node_modules/.pnpm/vite-plugin-static-copy@0.13.1_vite@4.1.1/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_dirname = "/Users/hefang/DevDir/hefang-note";
var __vite_injected_original_import_meta_url = "file:///Users/hefang/DevDir/hefang-note/vite.config.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var vite_config_default = defineConfig(async () => {
  const host = await internalIpV4();
  return {
    base: "./",
    plugins: [
      react(),
      ckeditor5({
        theme: require2.resolve("@ckeditor/ckeditor5-theme-lark")
      }),
      // svgr({ exportAsDefault: true, svgrOptions: { icon: true } }),
      viteStaticCopy({
        targets: [
          { src: "src-tauri/icons/icon.ico", dest: "./", rename: "favicon.ico" }
        ]
      }),
      htmlMinifier({ minify: true }),
      markdown({ mode: [Mode.HTML] })
    ],
    resolve: {
      alias: {
        "~": path.resolve(__vite_injected_original_dirname, "src"),
        "^": __vite_injected_original_dirname,
        $hooks: path.resolve(__vite_injected_original_dirname, "src/hooks"),
        $components: path.resolve(__vite_injected_original_dirname, "src/views/components"),
        $utils: path.resolve(__vite_injected_original_dirname, "src/utils"),
        $locales: path.resolve(__vite_injected_original_dirname, "src/locales"),
        $plugin: path.resolve(__vite_injected_original_dirname, "src/plugin")
      }
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
        port: 4444
      }
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri supports es2021
      target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
      modulePreload: true,
      rollupOptions: {
        output: {
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
              // "@ckeditor/ckeditor5-adapter-ckfinder",
              "@ckeditor/ckeditor5-autoformat",
              "@ckeditor/ckeditor5-block-quote",
              // "@ckeditor/ckeditor5-build-classic",
              // "@ckeditor/ckeditor5-ckbox",
              // "@ckeditor/ckeditor5-ckfinder",
              "@ckeditor/ckeditor5-code-block",
              "@ckeditor/ckeditor5-easy-image",
              "@ckeditor/ckeditor5-media-embed",
              "@ckeditor/ckeditor5-paste-from-office",
              "@ckeditor/ckeditor5-source-editing",
              // "@ckeditor/ckeditor5-special-characters",
              "@ckeditor/ckeditor5-table"
              // "@ckeditor/ckeditor5-theme-lark",
            ]
          }
        }
      }
    },
    esbuild: {
      pure: process.env.TAURI_DEBUG ? [] : ["console.log", "debugger"]
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGVmYW5nL0RldkRpci9oZWZhbmctbm90ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hlZmFuZy9EZXZEaXIvaGVmYW5nLW5vdGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hlZmFuZy9EZXZEaXIvaGVmYW5nLW5vdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSBcIm5vZGU6bW9kdWxlXCJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcblxuaW1wb3J0IGNrZWRpdG9yNSBmcm9tIFwiQGNrZWRpdG9yL3ZpdGUtcGx1Z2luLWNrZWRpdG9yNVwiXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSBcImF1dG9wcmVmaXhlclwiXG5pbXBvcnQgeyBpbnRlcm5hbElwVjQgfSBmcm9tIFwiaW50ZXJuYWwtaXBcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IGh0bWxNaW5pZmllciBmcm9tIFwidml0ZS1wbHVnaW4taHRtbC1taW5pZmllclwiXG5pbXBvcnQgeyBwbHVnaW4gYXMgbWFya2Rvd24sIE1vZGUgfSBmcm9tIFwidml0ZS1wbHVnaW4tbWFya2Rvd25cIlxuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tIFwidml0ZS1wbHVnaW4tc3RhdGljLWNvcHlcIlxuXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCBpbnRlcm5hbElwVjQoKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYmFzZTogXCIuL1wiLFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICByZWFjdCgpLFxuICAgICAgICAgICAgY2tlZGl0b3I1KHtcbiAgICAgICAgICAgICAgICB0aGVtZTogcmVxdWlyZS5yZXNvbHZlKFwiQGNrZWRpdG9yL2NrZWRpdG9yNS10aGVtZS1sYXJrXCIpLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAvLyBzdmdyKHsgZXhwb3J0QXNEZWZhdWx0OiB0cnVlLCBzdmdyT3B0aW9uczogeyBpY29uOiB0cnVlIH0gfSksXG4gICAgICAgICAgICB2aXRlU3RhdGljQ29weSh7XG4gICAgICAgICAgICAgICAgdGFyZ2V0czogW1xuICAgICAgICAgICAgICAgICAgICB7IHNyYzogXCJzcmMtdGF1cmkvaWNvbnMvaWNvbi5pY29cIiwgZGVzdDogXCIuL1wiLCByZW5hbWU6IFwiZmF2aWNvbi5pY29cIiB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGh0bWxNaW5pZmllcih7IG1pbmlmeTogdHJ1ZSB9KSxcbiAgICAgICAgICAgIG1hcmtkb3duKHsgbW9kZTogW01vZGUuSFRNTF0gfSksXG4gICAgICAgIF0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICAgICAgXCJ+XCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxuICAgICAgICAgICAgICAgIFwiXlwiOiBfX2Rpcm5hbWUsXG4gICAgICAgICAgICAgICAgJGhvb2tzOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9ob29rc1wiKSxcbiAgICAgICAgICAgICAgICAkY29tcG9uZW50czogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvdmlld3MvY29tcG9uZW50c1wiKSxcbiAgICAgICAgICAgICAgICAkdXRpbHM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3V0aWxzXCIpLFxuICAgICAgICAgICAgICAgICRsb2NhbGVzOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9sb2NhbGVzXCIpLFxuICAgICAgICAgICAgICAgICRwbHVnaW46IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3BsdWdpblwiKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFZpdGUgb3B0aW9ucyB0YWlsb3JlZCBmb3IgVGF1cmkgZGV2ZWxvcG1lbnQgYW5kIG9ubHkgYXBwbGllZCBpbiBgdGF1cmkgZGV2YCBvciBgdGF1cmkgYnVpbGRgXG4gICAgICAgIC8vIHByZXZlbnQgdml0ZSBmcm9tIG9ic2N1cmluZyBydXN0IGVycm9yc1xuICAgICAgICBjbGVhclNjcmVlbjogdHJ1ZSxcbiAgICAgICAgd29ya2VyOiB7IGZvcm1hdDogXCJlc1wiIH0sXG4gICAgICAgIC8vIHRhdXJpIGV4cGVjdHMgYSBmaXhlZCBwb3J0LCBmYWlsIGlmIHRoYXQgcG9ydCBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgICAgICAgICBwb3J0OiA4ODg4LFxuICAgICAgICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgICAgICAgIGhtcjoge1xuICAgICAgICAgICAgICAgIHByb3RvY29sOiBcIndzXCIsXG4gICAgICAgICAgICAgICAgaG9zdCxcbiAgICAgICAgICAgICAgICBwb3J0OiA0NDQ0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdG8gbWFrZSB1c2Ugb2YgYFRBVVJJX0RFQlVHYCBhbmQgb3RoZXIgZW52IHZhcmlhYmxlc1xuICAgICAgICAvLyBodHRwczovL3RhdXJpLnN0dWRpby92MS9hcGkvY29uZmlnI2J1aWxkY29uZmlnLmJlZm9yZWRldmNvbW1hbmRcbiAgICAgICAgZW52UHJlZml4OiBbXCJWSVRFX1wiLCBcIlRBVVJJX1wiXSxcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIC8vIFRhdXJpIHN1cHBvcnRzIGVzMjAyMVxuICAgICAgICAgICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5UQVVSSV9QTEFURk9STSA9PT0gXCJ3aW5kb3dzXCIgPyBcImNocm9tZTEwNVwiIDogXCJzYWZhcmkxM1wiLFxuICAgICAgICAgICAgLy8gZG9uJ3QgbWluaWZ5IGZvciBkZWJ1ZyBidWlsZHNcbiAgICAgICAgICAgIG1pbmlmeTogIXByb2Nlc3MuZW52LlRBVVJJX0RFQlVHLFxuICAgICAgICAgICAgLy8gcHJvZHVjZSBzb3VyY2VtYXBzIGZvciBkZWJ1ZyBidWlsZHNcbiAgICAgICAgICAgIHNvdXJjZW1hcDogISFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyxcbiAgICAgICAgICAgIG1vZHVsZVByZWxvYWQ6IHRydWUsXG5cbiAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFjdDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJyZWFjdC1kb20vY2xpZW50XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW50ZDogW1wiYW50ZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25zOiBbXCJAYW50LWRlc2lnbi9pY29uc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzOiBbXCJsb2Rhc2hcIiwgXCJkYXlqc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvcjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1jb3JlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LXJlYWN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LXVpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LW1hcmtkb3duLWdmbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1iYXNpYy1zdHlsZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtZWRpdG9yLWNsYXNzaWNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtZXNzZW50aWFsc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1oZWFkaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LWhvcml6b250YWwtbGluZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1pbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1saW5rXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LWxpc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtcGFyYWdyYXBoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJAY2tlZGl0b3IvY2tlZGl0b3I1LWFkYXB0ZXItY2tmaW5kZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtYXV0b2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1ibG9jay1xdW90ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1idWlsZC1jbGFzc2ljXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJAY2tlZGl0b3IvY2tlZGl0b3I1LWNrYm94XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJAY2tlZGl0b3IvY2tlZGl0b3I1LWNrZmluZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAY2tlZGl0b3IvY2tlZGl0b3I1LWNvZGUtYmxvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtZWFzeS1pbWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1tZWRpYS1lbWJlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1wYXN0ZS1mcm9tLW9mZmljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1zb3VyY2UtZWRpdGluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS1zcGVjaWFsLWNoYXJhY3RlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtdGFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcIkBja2VkaXRvci9ja2VkaXRvcjUtdGhlbWUtbGFya1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZXNidWlsZDoge1xuICAgICAgICAgICAgcHVyZTogcHJvY2Vzcy5lbnYuVEFVUklfREVCVUcgPyBbXSA6IFtcImNvbnNvbGUubG9nXCIsIFwiZGVidWdnZXJcIl0sXG4gICAgICAgIH0sXG4gICAgICAgIGNzczoge1xuICAgICAgICAgICAgcG9zdGNzczoge1xuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFthdXRvcHJlZml4ZXIoe30pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1IsU0FBUyxxQkFBcUI7QUFDaFQsT0FBTyxVQUFVO0FBRWpCLE9BQU8sZUFBZTtBQUN0QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyxVQUFVLFVBQVUsWUFBWTtBQUN6QyxTQUFTLHNCQUFzQjtBQVYvQixJQUFNLG1DQUFtQztBQUErSCxJQUFNLDJDQUEyQztBQVl6TixJQUFNQSxXQUFVLGNBQWMsd0NBQWU7QUFHN0MsSUFBTyxzQkFBUSxhQUFhLFlBQVk7QUFDcEMsUUFBTSxPQUFPLE1BQU0sYUFBYTtBQUVoQyxTQUFPO0FBQUEsSUFDSCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsUUFDTixPQUFPQSxTQUFRLFFBQVEsZ0NBQWdDO0FBQUEsTUFDM0QsQ0FBQztBQUFBO0FBQUEsTUFFRCxlQUFlO0FBQUEsUUFDWCxTQUFTO0FBQUEsVUFDTCxFQUFFLEtBQUssNEJBQTRCLE1BQU0sTUFBTSxRQUFRLGNBQWM7QUFBQSxRQUN6RTtBQUFBLE1BQ0osQ0FBQztBQUFBLE1BQ0QsYUFBYSxFQUFFLFFBQVEsS0FBSyxDQUFDO0FBQUEsTUFDN0IsU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQUEsSUFDbEM7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxRQUNsQyxLQUFLO0FBQUEsUUFDTCxRQUFRLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsUUFDM0MsYUFBYSxLQUFLLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsUUFDM0QsUUFBUSxLQUFLLFFBQVEsa0NBQVcsV0FBVztBQUFBLFFBQzNDLFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxRQUMvQyxTQUFTLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDakQ7QUFBQSxJQUNKO0FBQUE7QUFBQTtBQUFBLElBR0EsYUFBYTtBQUFBLElBQ2IsUUFBUSxFQUFFLFFBQVEsS0FBSztBQUFBO0FBQUEsSUFFdkIsUUFBUTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osS0FBSztBQUFBLFFBQ0QsVUFBVTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLE1BQU07QUFBQSxNQUNWO0FBQUEsSUFDSjtBQUFBO0FBQUE7QUFBQSxJQUdBLFdBQVcsQ0FBQyxTQUFTLFFBQVE7QUFBQSxJQUM3QixPQUFPO0FBQUE7QUFBQSxNQUVILFFBQVEsUUFBUSxJQUFJLG1CQUFtQixZQUFZLGNBQWM7QUFBQTtBQUFBLE1BRWpFLFFBQVEsQ0FBQyxRQUFRLElBQUk7QUFBQTtBQUFBLE1BRXJCLFdBQVcsQ0FBQyxDQUFDLFFBQVEsSUFBSTtBQUFBLE1BQ3pCLGVBQWU7QUFBQSxNQUVmLGVBQWU7QUFBQSxRQUNYLFFBQVE7QUFBQSxVQUNKLGNBQWM7QUFBQSxZQUNWLE9BQU8sQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsWUFDaEQsTUFBTSxDQUFDLE1BQU07QUFBQSxZQUNiLE9BQU8sQ0FBQyxtQkFBbUI7QUFBQSxZQUMzQixPQUFPLENBQUMsVUFBVSxPQUFPO0FBQUEsWUFDekIsUUFBUTtBQUFBLGNBQ0o7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQTtBQUFBLGNBRUE7QUFBQSxjQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FJQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQTtBQUFBLGNBRUE7QUFBQTtBQUFBLFlBRUo7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxNQUFNLFFBQVEsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLGVBQWUsVUFBVTtBQUFBLElBQ25FO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDRCxTQUFTO0FBQUEsUUFDTCxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUFBLE1BQzlCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogWyJyZXF1aXJlIl0KfQo=
