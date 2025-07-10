// src/App.tsx
import React, { useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import PinSetupScreen from "./screens/PinSetupScreen";
import PinUnlockScreen from "./screens/PinUnlockScreen";
import { getPIN, clearPIN } from "./storage/SecureStorage";
import { Preferences } from "@capacitor/preferences";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pinExists, setPinExists] = useState(false);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  // Load login + PIN state on startup
  useEffect(() => {
    (async () => {
      const loginStatus = await Preferences.get({ key: "logged_in" });
      setLoggedIn(loginStatus.value === "true");

      const pin = await getPIN();
      setPinExists(!!pin);

      setReady(true);
    })();
  }, []);

  const handleLoginSuccess = async () => {
    await Preferences.set({ key: "logged_in", value: "true" });
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await Preferences.remove({ key: "logged_in" });
    await clearPIN(); // Optional: reset PIN too
    setLoggedIn(false);
    setPinExists(false);
    setPinUnlocked(false);
  };

  if (!ready) return <p>Loading...</p>;

  if (!loggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (loggedIn && !pinExists) {
    return <PinSetupScreen onPINSet={() => setPinExists(true)} />;
  }

  if (loggedIn && pinExists && !pinUnlocked) {
    return <PinUnlockScreen onUnlock={() => setPinUnlocked(true)} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>✅ Logged in with PIN!</h1>
        <p>Welcome to your secure dashboard.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  card: {
    padding: "24px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};

export default App;
