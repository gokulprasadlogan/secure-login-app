import React, { useState } from "react";
import { AuthService } from "../services/AuthService";
import { getEmail, getPIN } from "../storage/SecureStorage";

interface Props {
  onUnlock: () => void;
  onForgotPin: () => void;
}

const PinUnlockScreen: React.FC<Props> = ({ onUnlock, onForgotPin }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = async () => {
    try {
      const email = await getEmail();
      const pin = await getPIN();

      if (!email || !pin) {
        throw new Error("Missing stored credentials");
      }

      const { accessToken } = await AuthService.pinLogin(email, pin);
      if (accessToken) {
        onUnlock(); // navigate to home
      }
    } catch (err) {
      console.error("PIN unlock failed", err);
      // fallback to full login screen
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Enter PIN</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={4}
        />
        <br />
        <button onClick={handleUnlock}>Unlock</button>
        <br />
        <button onClick={onForgotPin} style={{ ...styles.forgotButton }}>
          Forgot PIN? Login with Email/Password
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  card: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  forgotButton: {
    backgroundColor: "transparent",
    border: "1px solid #007bff",
    color: "#007bff",
    marginTop: "10px",
  },
};

export default PinUnlockScreen;
