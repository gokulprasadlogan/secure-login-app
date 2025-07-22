// Updated App.tsx with proper token management
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import PinSetupScreen from "./screens/PinSetupScreen";
import PinUnlockScreen from "./screens/PinUnlockScreen";
import { getPIN, clearPIN, clearTokens } from "./storage/SecureStorage";
import { AuthService } from "./services/AuthService";
import { Preferences } from "@capacitor/preferences";
import BiometricAuth from "./components/BiometricAuth";
import VConsole from "vconsole";

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pinExists, setPinExists] = useState(false);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [biometricTried, setBiometricTried] = useState(false);
  const [ready, setReady] = useState(false);

  const navigate = useNavigate();
  const vconsole = new VConsole();

  // Check authentication status on app start/resume
  const checkAuthStatus = async () => {
    try {
      // 1. Try to get valid access token (will refresh if needed)
      const validToken = await AuthService.getValidAccessToken();

      if (validToken) {
        // We have valid tokens
        setLoggedIn(true);
      } else {
        // No valid tokens, need to login
        setLoggedIn(false);
        await clearTokens();
        await Preferences.remove({ key: "logged_in" });
      }
    } catch (error) {
      // Error getting tokens, treat as not logged in
      setLoggedIn(false);
      await clearTokens();
      await Preferences.remove({ key: "logged_in" });
    }
  };

  // Initial setup
  useEffect(() => {
    (async () => {
      // Check PIN existence
      const pin = await getPIN();
      setPinExists(!!pin);

      // Check authentication status
      await checkAuthStatus();

      setReady(true);
    })();
  }, []);

  // // App resume handler (add this to your app lifecycle if needed)
  // useEffect(() => {
  //   const handleAppResume = async () => {
  //     if (loggedIn && !pinUnlocked) {
  //       // App was backgrounded and resumed, reset PIN unlock state
  //       setPinUnlocked(false);
  //       setBiometricTried(false);

  //       // Optionally recheck tokens
  //       await checkAuthStatus();
  //     }
  //   };

  //   // You would typically add this to Capacitor's App plugin
  //   // App.addListener('appStateChange', handleAppResume);

  //   return () => {
  //     // App.removeListener('appStateChange', handleAppResume);
  //   };
  // }, [loggedIn, pinUnlocked]);

  useEffect(() => {
    if (!ready) return;

    if (!loggedIn) {
      navigate("/login");
    } else if (loggedIn && !pinExists) {
      navigate("/setup-pin");
    } else if (loggedIn && pinExists && !pinUnlocked) {
      navigate("/unlock-pin");
    } else if (loggedIn && pinExists && pinUnlocked) {
      navigate("/home");
    }
  }, [ready, loggedIn, pinExists, pinUnlocked, navigate]);

  const handleLoginSuccess = async () => {
    await Preferences.set({ key: "logged_in", value: "true" });
    setLoggedIn(true);
  };

  const handlePinUnlock = async () => {
    setPinUnlocked(true);

    // When unlocking with PIN, check if we need to refresh tokens
    const validToken = await AuthService.getValidAccessToken();
    if (!validToken) {
      // Tokens expired during PIN lock, need fresh login
      await handleLogout();
      return;
    }
  };

  const handleLogout = async () => {
    await Preferences.remove({ key: "logged_in" });
    await clearPIN();
    await clearTokens();
    await AuthService.logout();

    setLoggedIn(false);
    setPinExists(false);
    setPinUnlocked(false);
    setBiometricTried(false);
    navigate("/login");
  };

  const handleForgotPin = async () => {
    // Clear PIN and force email/password login
    await clearPIN();
    setPinExists(false);
    setPinUnlocked(false);
    setBiometricTried(false);
    navigate("/login");
  };

  if (!ready) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginScreen onLoginSuccess={handleLoginSuccess} />}
      />
      <Route
        path="/setup-pin"
        element={<PinSetupScreen onPINSet={() => setPinExists(true)} />}
      />
      <Route
        path="/unlock-pin"
        element={
          <>
            {!biometricTried && (
              <BiometricAuth
                onSuccess={() => {
                  setPinUnlocked(true);
                  setBiometricTried(true);
                }}
                onFailure={() => setBiometricTried(true)}
              />
            )}
            <PinUnlockScreen
              onUnlock={handlePinUnlock}
              onForgotPin={handleForgotPin}
            />
          </>
        }
      />
      <Route
        path="/home"
        element={
          <div style={styles.container}>
            <div style={styles.card}>
              <h1>✅ Logged in with PIN!</h1>
              <p>Welcome to your secure dashboard.</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        }
      />
      <Route
        path="*"
        element={<Navigate to={loggedIn ? "/home" : "/login"} />}
      />
    </Routes>
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

export default AppWrapper;
