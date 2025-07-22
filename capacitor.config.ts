import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.securelogin",
  appName: "secure-login",
  webDir: "build",
  server: {
    url: `http://192.168.0.211:3000/`,
    cleartext: true,
    // hostname: 'localhost',
  },
};

export default config;
