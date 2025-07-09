// src/screens/PinSetupScreen.tsx
import React, { useState } from "react";
import { savePIN } from "../storage/SecureStorage";

interface Props {
  onPINSet: () => void;
}

const PinSetupScreen: React.FC<Props> = ({ onPINSet }) => {
  const [pin, setPin] = useState("");

  const handleSetPIN = async () => {
    if (pin.length === 4) {
      await savePIN(pin);
      onPINSet();
    } else {
      alert("PIN must be 4 digits");
    }
  };

  return (
    <div>
      <h2>Set Your PIN</h2>
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="4-digit PIN"
        maxLength={4}
      />
      <br />
      <button onClick={handleSetPIN}>Save PIN</button>
    </div>
  );
};

export default PinSetupScreen;
