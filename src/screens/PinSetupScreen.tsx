import React, { useState } from "react";
import { getEmail, savePIN } from "../storage/SecureStorage";
import { AuthService } from "../services/AuthService";

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
    const email = await getEmail();
    await savePIN(pin);
    if (email) {
      await AuthService.setPIN(email, pin); // Send to backend
    }

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

// import React from "react";
// import { useForm } from "react-hook-form";
// import { getEmail, savePIN } from "../storage/SecureStorage";
// import { AuthService } from "../services/AuthService";

// interface Props {
//   onPINSet: () => void;
// }

// type FormData = {
//   pin: string;
//   confirmPin: string;
// };

// const PinSetupScreen: React.FC<Props> = ({ onPINSet }) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = async (data: FormData) => {
//     const { pin } = data;
//     const email = await getEmail();

//     await savePIN(pin); // Save locally
//     if (email) {
//       await AuthService.setPIN(email, pin); // Send to backend
//     }
//     onPINSet();
//   };

//   const pinValue = watch("pin");

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2>Set Your PIN</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <input
//             type="password"
//             placeholder="Enter 4-digit PIN"
//             maxLength={4}
//             {...register("pin", {
//               required: "PIN is required",
//               minLength: { value: 4, message: "PIN must be 4 digits" },
//               maxLength: { value: 4, message: "PIN must be 4 digits" },
//               pattern: { value: /^[0-9]{4}$/, message: "PIN must be numeric" },
//             })}
//           />
//           <div style={styles.error}>{errors.pin?.message}</div>

//           <br />

//           <input
//             type="password"
//             placeholder="Confirm PIN"
//             maxLength={4}
//             {...register("confirmPin", {
//               required: "Confirm PIN is required",
//               validate: (value) => value === pinValue || "PINs do not match",
//             })}
//           />
//           <div style={styles.error}>{errors.confirmPin?.message}</div>

//           <br />

//           <button type="submit">Save PIN</button>
//         </form>

//         <br />
//         <button onClick={() => alert("Forgot PIN clicked (not implemented)")}>
//           Forgot PIN?
//         </button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh",
//     backgroundColor: "#f9f9f9",
//   },
//   card: {
//     padding: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     backgroundColor: "#fff",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//   },
//   error: {
//     color: "red",
//     fontSize: "0.8rem",
//   },
// };

// export default PinSetupScreen;
