import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  getEmail,
  getPIN,
} from "../storage/SecureStorage";

const API_BASE = "http://192.168.0.211:8080";

export const AuthService = {
  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    const accessToken = res.data.accessToken;
    const refreshToken = res.data.refreshToken || accessToken; // fallback if only 1 token in backend

    await saveTokens(accessToken, refreshToken);
    return { accessToken, refreshToken };
  },

  getValidAccessToken: async (): Promise<string | null> => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken || isTokenExpired(accessToken)) {
        const newToken = await AuthService.refreshAccessToken();
        return newToken;
      }
      return accessToken;
    } catch (error) {
      console.warn("Failed to get valid access token", error);
      return null;
    }
  },

  refreshAccessToken: async (): Promise<string | null> => {
    try {
      const refreshToken = await getRefreshToken();
      console.log("refrsh tokrn", refreshToken);
      if (refreshToken) {
        const res = await axios.post(`${API_BASE}/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken || refreshToken;

        await saveTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      } else {
        console.warn("No refresh token available, attempting PIN fallback");
      }

      // Fallback to PIN-based login
      const email = await getEmail();
      const pin = await getPIN();

      if (email && pin) {
        console.log("Trying PIN-based login...");
        const pinRes = await AuthService.pinLogin(email, pin);

        if (pinRes.accessToken) {
          return pinRes.accessToken;
        } else {
          console.warn("PIN login failed");
        }
      } else {
        console.warn("No email or PIN available for fallback login");
      }

      // If all fails, logout
      await clearTokens();
      return null;
    } catch (err) {
      console.error("Token refresh & PIN fallback both failed", err);
      await clearTokens();
      return null;
    }
  },

  setPIN: async (email: string, pin: string) => {
    const res = await axios.post(`${API_BASE}/set-pin`, { email, pin });
    return res.data;
  },

  pinLogin: async (email: string, pin: string) => {
    const res = await axios.post(`${API_BASE}/pin-login`, { email, pin });
    const accessToken = res.data.accessToken;
    const refreshToken = res.data.refreshToken || accessToken;

    await saveTokens(accessToken, refreshToken);
    return { accessToken, refreshToken };
  },
  logout: async () => {
    await clearTokens();
  },
};

// =====================
// JWT Expiration Check
// =====================
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (e) {
    console.error("Failed to decode token", e);
    return true;
  }
}
