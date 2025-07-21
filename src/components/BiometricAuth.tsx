// import React, { useEffect } from "react";
// import {
//   NativeBiometric,
//   BiometryType,
// } from "@capgo/capacitor-native-biometric";
// import { Capacitor } from "@capacitor/core";

// interface Props {
//   onSuccess: () => void;
//   onFailure?: () => void;
//   autoStart?: boolean;
// }

// const BiometricAuth: React.FC<Props> = ({
//   onSuccess,
//   onFailure,
//   autoStart = true,
// }) => {
//   const performBiometricAuth = async () => {
//     const platform = Capacitor.getPlatform();
//     const isPlatformiOS = platform === "ios";

//     const bioAvailable = await NativeBiometric.isAvailable();
//     console.log("Biometric availability:", bioAvailable);

//     if (!bioAvailable.isAvailable) {
//       onFailure?.();
//       return;
//     }

//     try {
//       if (isPlatformiOS) {
//         console.log("Attempting Face ID on iOS");
//         await NativeBiometric.verifyIdentity({
//           reason: "For secure access",
//           title: "Biometric Login",
//           subtitle: "Use Face ID",
//           description: "Scan your face to unlock",
//         });
//       } else {
//         console.log("Attempting Fingerprint on Android");
//         await NativeBiometric.verifyIdentity({
//           reason: "For secure access",
//           title: "Biometric Login",
//           subtitle: "Use Fingerprint",
//           description: "Touch the sensor to unlock",
//           maxAttempts: 3,
//           allowedBiometryTypes: [BiometryType.FINGERPRINT],
//         });
//       }
//       console.log("[BIO] Authentication success");
//       onSuccess(); // success only called once
//     } catch (err) {
//       console.warn("Biometric verification failed:", err);
//       onFailure?.();
//     }
//   };

//   useEffect(() => {
//     if (autoStart) performBiometricAuth();
//   }, []);

//   return null;
// };

// export default BiometricAuth;
import React, { useEffect, useState } from "react";
import {
  NativeBiometric,
  BiometryType,
} from "@capgo/capacitor-native-biometric";

const getBiometryTypeDisplay = (type: BiometryType): string => {
  switch (type) {
    case BiometryType.TOUCH_ID:
      return "Touch ID";
    case BiometryType.FACE_ID:
      return "Face ID";
    case BiometryType.FINGERPRINT:
      return "Fingerprint";
    case BiometryType.FACE_AUTHENTICATION:
      return "Face Authentication";
    case BiometryType.IRIS_AUTHENTICATION:
      return "Iris Authentication";
    case BiometryType.MULTIPLE:
      return "Multiple Biometric Types";
    default:
      return "Biometric";
  }
};

const getBiometryIcon = (type: BiometryType): string => {
  switch (type) {
    case BiometryType.FACE_ID:
      return "👤";
    case BiometryType.TOUCH_ID:
      return "👆";
    case BiometryType.FINGERPRINT:
      return "👆";
    case BiometryType.FACE_AUTHENTICATION:
      return "👤";
    case BiometryType.IRIS_AUTHENTICATION:
      return "👁️";
    default:
      return "🔒";
  }
};

const getBiometryTitle = (type: BiometryType): string => {
  switch (type) {
    case BiometryType.FACE_ID:
      return "Unlock with Face ID";
    case BiometryType.TOUCH_ID:
      return "Unlock with Touch ID";
    case BiometryType.FINGERPRINT:
      return "Unlock with Fingerprint";
    case BiometryType.FACE_AUTHENTICATION:
      return "Unlock with Face Authentication";
    case BiometryType.IRIS_AUTHENTICATION:
      return "Unlock with Iris Authentication";
    default:
      return "Unlock with Biometric";
  }
};

const getBiometrySubtitle = (type: BiometryType): string => {
  switch (type) {
    case BiometryType.FACE_ID:
      return "Look at your device to unlock quickly";
    case BiometryType.TOUCH_ID:
      return "Touch the sensor to unlock quickly";
    case BiometryType.FINGERPRINT:
      return "Touch the fingerprint sensor to unlock quickly";
    case BiometryType.FACE_AUTHENTICATION:
      return "Look at your device to unlock quickly";
    case BiometryType.IRIS_AUTHENTICATION:
      return "Look at your device to unlock quickly";
    default:
      return "Use your biometric to unlock quickly";
  }
};

const getBiometryButtonText = (
  type: BiometryType,
  attemptCount: number
): string => {
  const action = attemptCount > 0 ? "Try" : "Use";
  switch (type) {
    case BiometryType.FACE_ID:
      return `${action} Face ID${attemptCount > 0 ? " Again" : ""}`;
    case BiometryType.TOUCH_ID:
      return `${action} Touch ID${attemptCount > 0 ? " Again" : ""}`;
    case BiometryType.FINGERPRINT:
      return `${action} Fingerprint${attemptCount > 0 ? " Again" : ""}`;
    case BiometryType.FACE_AUTHENTICATION:
      return `${action} Face Authentication${attemptCount > 0 ? " Again" : ""}`;
    case BiometryType.IRIS_AUTHENTICATION:
      return `${action} Iris Authentication${attemptCount > 0 ? " Again" : ""}`;
    default:
      return `${action} Biometric${attemptCount > 0 ? " Again" : ""}`;
  }
};

interface BiometricAuthProps {
  onSuccess: () => void;
  onFailure: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  reason?: string;
  maxAttempts?: number;
  useFallback?: boolean;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onFailure,
  title = "Biometric Authentication",
  subtitle = "Use your biometric to unlock",
  description = "Authenticate using your fingerprint, face, or other biometric",
  reason = "For secure access to your account",
  maxAttempts = 3,
  useFallback = true,
}) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [biometryType, setBiometryType] = useState<BiometryType>(
    BiometryType.NONE
  );
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [attemptCount, setAttemptCount] = useState<number>(0);

  // Check if biometric authentication is available
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const result = await NativeBiometric.isAvailable({ useFallback });
      console.log("results", result);

      if (result.isAvailable) {
        setIsAvailable(true);
        setBiometryType(result.biometryType);

        // Don't automatically start - let user choose
      } else {
        setError(getBiometricErrorMessage(result.errorCode ?? 0));
        // Don't call onFailure immediately - show the error and let user choose
      }
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      setError("Failed to check biometric availability");
    }
  };

  const startBiometricAuth = async () => {
    if (!isAvailable || isAuthenticating) return;

    setIsAuthenticating(true);
    setError("");

    try {
      const authOptions: any = {
        reason,
        title,
        subtitle,
        description,
        useFallback,
        maxAttempts,
        negativeButtonText: "Cancel",
        fallbackTitle: "Use Passcode",
      };

      // For Android, restrict to fingerprint only
      if (biometryType === BiometryType.MULTIPLE) {
        authOptions.allowedBiometryTypes = [BiometryType.FINGERPRINT];
      }

      await NativeBiometric.verifyIdentity(authOptions);

      // Authentication successful
      onSuccess();
    } catch (error: any) {
      console.error("Biometric authentication failed:", error);

      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (error.code !== undefined) {
        setError(getBiometricErrorMessage(error.code));
      } else {
        setError("Authentication failed");
      }

      // If max attempts reached or user cancelled, call onFailure
      if (
        newAttemptCount >= maxAttempts ||
        error.code === 16 || // User Cancel
        error.code === 11 || // App Cancel
        error.code === 15 || // System Cancel
        error.code === 17 // User Fallback
      ) {
        onFailure();
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricErrorMessage = (errorCode: number): string => {
    switch (errorCode) {
      case 0:
        return "Unknown error occurred";
      case 1:
        return "Biometric authentication is not available on this device";
      case 2:
        return "Too many failed attempts. Please try again later";
      case 3:
        return "No biometric credentials are enrolled. Please set up biometrics in your device settings";
      case 4:
        return "Temporarily locked out. Please try again in 30 seconds";
      case 10:
        return "Authentication failed. Please try again";
      case 11:
        return "Authentication cancelled by app";
      case 12:
        return "Invalid authentication context";
      case 13:
        return "Authentication not interactive";
      case 14:
        return "Device passcode is not set. Please set up a passcode in your device settings";
      case 15:
        return "Authentication cancelled by system";
      case 16:
        return "Authentication cancelled by user";
      case 17:
        return "User chose to use fallback authentication";
      default:
        return "Authentication failed";
    }
  };

  const retryAuthentication = () => {
    setError("");
    setAttemptCount(0);
    startBiometricAuth();
  };

  const skipBiometric = () => {
    onFailure();
  };

  if (!isAvailable && !error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingSpinner}></div>
          <p>Checking biometric availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.biometricIcon}>{getBiometryIcon(biometryType)}</div>

        <h2 style={styles.title}>{getBiometryTitle(biometryType)}</h2>
        <p style={styles.subtitle}>
          {isAvailable
            ? getBiometrySubtitle(biometryType)
            : "Biometric authentication is not available"}
        </p>

        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.error}>{error}</p>
          </div>
        )}

        {isAuthenticating && (
          <div style={styles.authenticatingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>
              Authenticating with{" "}
              {getBiometryTypeDisplay(biometryType).toLowerCase()}...
            </p>
          </div>
        )}

        {attemptCount > 0 &&
          attemptCount < maxAttempts &&
          !isAuthenticating && (
            <p style={styles.attemptCounter}>
              Attempt {attemptCount} of {maxAttempts}
            </p>
          )}

        <div style={styles.buttonContainer}>
          {isAvailable && !isAuthenticating && (
            <button onClick={startBiometricAuth} style={styles.biometricButton}>
              {getBiometryButtonText(biometryType, attemptCount)}
            </button>
          )}

          {!isAuthenticating &&
            error &&
            attemptCount < maxAttempts &&
            attemptCount > 0 && (
              <button onClick={retryAuthentication} style={styles.retryButton}>
                Try Again
              </button>
            )}

          <button onClick={skipBiometric} style={styles.skipButton}>
            {isAuthenticating ? "Cancel" : "Use PIN Instead"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  card: {
    padding: "32px",
    borderRadius: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    maxWidth: "320px",
    width: "90%",
  },
  biometricIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    color: "#333",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    margin: "0 0 16px 0",
  },
  biometryType: {
    fontSize: "14px",
    color: "#888",
    margin: "0 0 16px 0",
    fontStyle: "italic",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "16px",
  },
  error: {
    color: "#c62828",
    fontSize: "14px",
    margin: 0,
  },
  authenticatingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "16px",
  },
  loadingSpinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #2196F3",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "8px",
  },
  attemptCounter: {
    fontSize: "14px",
    color: "#ff9800",
    marginBottom: "16px",
  },
  buttonContainer: {
    display: "flex",
    gap: "12px",
    flexDirection: "column",
  },
  biometricButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  retryButton: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "500",
  },
  skipButton: {
    backgroundColor: "transparent",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default BiometricAuth;
