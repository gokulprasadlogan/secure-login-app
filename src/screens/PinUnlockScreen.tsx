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
      const storedPin = await getPIN();

      if (!email || !storedPin) {
        throw new Error("Missing stored credentials");
      }

      if (input !== storedPin) {
        setError("Incorrect PIN. Please try again.");
        return;
      }

      const { accessToken } = await AuthService.pinLogin(email, input);
      if (accessToken) {
        onUnlock(); // navigate to home
      } else {
        setError("PIN login failed.");
      }
    } catch (err) {
      console.error("PIN unlock failed", err);
      setError("An error occurred. Please try again.");
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
          pattern="\d*"
          inputMode="numeric"
          style={styles.input}
          placeholder="Enter 4-digit PIN"
        />
        <br />
        <button onClick={handleUnlock} style={styles.unlockButton}>
          Unlock
        </button>
        <br />
        <button onClick={onForgotPin} style={styles.forgotButton}>
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
    width: "300px",
    textAlign: "center" as const,
  },
  input: {
    padding: "10px",
    width: "100%",
    fontSize: "18px",
    marginTop: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  unlockButton: {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  forgotButton: {
    backgroundColor: "transparent",
    border: "1px solid #007bff",
    color: "#007bff",
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default PinUnlockScreen;
