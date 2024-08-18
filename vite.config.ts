import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Pages from "vite-plugin-pages";
import getRepoName from "git-repo-name";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
    const isGitHubPages = mode === 'github-pages'
    const base = isGitHubPages ? `/${getRepoName.sync()}/` : '/'
  
    return {
      plugins: [react(), Pages(), VitePWA({ 
        registerType: 'autoUpdate', 
        devOptions: { enabled: true},
        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'My Image Search App',
          short_name: 'ImgSearch',
          description: 'Image Search Application',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })],
      base: base,
      build: {
        target: "esnext",
        outDir: isGitHubPages ? 'dist-github' : 'dist'
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      optimizeDeps: {
        exclude: ['@electric-sql/pglite'],
      },
    }
  })