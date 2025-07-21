// // src/screens/PinSetupScreen.tsx
// import React, { useState } from "react";
// import { savePIN } from "../storage/SecureStorage";

// interface Props {
//   onPINSet: () => void;
// }

// const PinSetupScreen: React.FC<Props> = ({ onPINSet }) => {
//   const [pin, setPin] = useState("");

//   const handleSetPIN = async () => {
//     if (pin.length === 4) {
//       await savePIN(pin);
//       onPINSet();
//     } else {
//       alert("PIN must be 4 digits");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2>Set Your PIN</h2>
//         <input
//           type="password"
//           value={pin}
//           onChange={(e) => setPin(e.target.value)}
//           placeholder="4-digit PIN"
//           maxLength={4}
//         />
//         <br />
//         <button onClick={handleSetPIN}>Save PIN</button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh", // full height of viewport
//     backgroundColor: "#f9f9f9",
//   },
//   card: {
//     padding: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     backgroundColor: "#fff",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//   },
// };

// export default PinSetupScreen;

// src/screens/PinSetupScreen.tsx
import React, { useState } from "react";
import { savePIN } from "../storage/SecureStorage";

interface Props {
  onPINSet: () => void;
}

const PinSetupScreen: React.FC<Props> = ({ onPINSet }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSetPIN = async () => {
    if (pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      alert("PINs do not match");
      return;
    }

    await savePIN(pin);
    onPINSet();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Set Your PIN</h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter 4-digit PIN"
          maxLength={4}
        />
        <br />
        <input
          type="password"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          placeholder="Confirm PIN"
          maxLength={4}
        />
        <br />
        <button onClick={handleSetPIN}>Save PIN</button>
        <br />
        <button
          onClick={() => alert("Forgot PIN clicked (not implemented yet)")}
        >
          Forgot PIN?
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
};

export default PinSetupScreen;
