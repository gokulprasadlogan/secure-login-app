import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

// ========== PIN ==========
export const savePIN = async (pin: string) => {
  await SecureStoragePlugin.set({ key: "user_pin", value: pin });
};

export const getPIN = async (): Promise<string | null> => {
  try {
    const { value } = await SecureStoragePlugin.get({ key: "user_pin" });
    return value;
  } catch (err) {
    console.warn("PIN not found:", err);
    return null;
  }
};

export const clearPIN = async () => {
  try {
    await SecureStoragePlugin.remove({ key: "user_pin" });
  } catch (err) {
    console.warn("No PIN to clear:", err);
  }
};

// ========== EMAIL (Optional) ==========
export const saveEmail = async (email: string) => {
  await SecureStoragePlugin.set({ key: "email", value: email });
};

export const getEmail = async (): Promise<string | null> => {
  const { value } = await SecureStoragePlugin.get({ key: "email" });
  return value;
};

export const clearEmail = async () => {
  try {
    await SecureStoragePlugin.remove({ key: "user_email" });
  } catch (err) {
    console.warn("Email not found on clear:", err);
  }
};

// ========== TOKENS ==========
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStoragePlugin.set({ key: "access_token", value: accessToken });
  await SecureStoragePlugin.set({ key: "refresh_token", value: refreshToken });
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const { value } = await SecureStoragePlugin.get({ key: "access_token" });
    return value;
  } catch (err) {
    console.warn("Access token not found:", err);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const { value } = await SecureStoragePlugin.get({ key: "refresh_token" });
    return value;
  } catch (err) {
    console.warn("Refresh token not found:", err);
    return null;
  }
};

export const clearTokens = async () => {
  try {
    await SecureStoragePlugin.remove({ key: "access_token" });
  } catch (err) {
    console.warn("Access token not found on remove:", err);
  }

  try {
    await SecureStoragePlugin.remove({ key: "refresh_token" });
  } catch (err) {
    console.warn("Refresh token not found on remove:", err);
  }
};

// ========== CLEAR ALL ==========
export const clearAllSecureData = async () => {
  await clearPIN();
  await clearEmail();
  await clearTokens();
};
