import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // added so dev environment and fly.io can be used
    proxy: {
      "/api": {
        target: "http://localhost:3001/",
        changeOrigin: true,
      },
    }, // to run the dev now, go to frontend -> npm run dev, go to backend -> npm run dev , now everything is working.
  },
});
