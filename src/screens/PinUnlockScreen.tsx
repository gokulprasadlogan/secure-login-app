// src/screens/PinUnlockScreen.tsx
import React, { useState } from "react";
import { getPIN } from "../storage/SecureStorage";

interface Props {
  onUnlock: () => void;
}

const PinUnlockScreen: React.FC<Props> = ({ onUnlock }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = async () => {
    const savedPIN = await getPIN();
    if (input === savedPIN) {
      onUnlock();
    } else {
      setError("Incorrect PIN");
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
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // full height of viewport
    backgroundColor: "#f9f9f9",
  },
  card: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default PinUnlockScreen;
