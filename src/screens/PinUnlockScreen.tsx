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
    <div>
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
  );
};

export default PinUnlockScreen;
