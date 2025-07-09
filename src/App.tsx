// src/App.tsx
import React, { useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import PinSetupScreen from "./screens/PinSetupScreen";
import PinUnlockScreen from "./screens/PinUnlockScreen";
import { getPIN } from "./storage/SecureStorage";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pinExists, setPinExists] = useState(false);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const pin = await getPIN();
      setPinExists(!!pin);
      setReady(true);
    })();
  }, []);

  if (!ready) return <p>Loading...</p>;

  if (!loggedIn) {
    return <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />;
  }

  if (loggedIn && !pinExists) {
    return <PinSetupScreen onPINSet={() => setPinExists(true)} />;
  }

  if (loggedIn && pinExists && !pinUnlocked) {
    return <PinUnlockScreen onUnlock={() => setPinUnlocked(true)} />;
  }

  return (
    <div>
      <h1>✅ Logged in with PIN!</h1>
      <p>Welcome to your secure dashboard.</p>
    </div>
  );
};

export default App;
