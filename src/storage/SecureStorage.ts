// src/storage/SecureStorage.ts
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export const savePIN = async (pin: string) => {
  await SecureStoragePlugin.set({ key: "user_pin", value: pin });
};

export const getPIN = async (): Promise<string | null> => {
  try {
    const { value } = await SecureStoragePlugin.get({ key: "user_pin" });
    return value;
  } catch {
    return null;
  }
};

export const clearPIN = async () => {
  await SecureStoragePlugin.remove({ key: "user_pin" });
};
