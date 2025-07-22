# Capacitor Secure Storage Plugin Comparison

This document compares two plugins for securely storing key-value pairs in Capacitor apps.

---

## 1. Plugin Overview

| Feature                         | `capacitor-secure-storage-plugin` (OSS)       | `@capawesome-team/capacitor-secure-preferences` (Premium) |
| ------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| Type                            | Open-source                                   | Commercial (Capawesome Insider)                           |
| Author                          | whitestein                                    | Capawesome Team                                           |
| License                         | MIT                                           | Paid (License key required)                               |
| Capacitor Support               | v2 to v7                                      | v7+                                                       |
| Platforms                       | Android, iOS, Web (fallback via localStorage) | Android, iOS, Web (with warnings)                         |
| Web Support                     | Base64 + localStorage (insecure)              | localStorage (insecure, for dev only)                     |
| Sync Support                    | ✅                                            | ✅                                                        |
| Swift Package Manager Support   | ❌                                            | ✅                                                        |
| Capawesome Cloud Integration    | ❌                                            | ✅                                                        |
| Biometrics & SQLite Integration | ❌                                            | ✅                                                        |

---

## 2. Security & Platform Implementation

| Platform         | `capacitor-secure-storage-plugin`          | `@capawesome-team/capacitor-secure-preferences` |
| ---------------- | ------------------------------------------ | ----------------------------------------------- |
| iOS              | SwiftKeychainWrapper                       | iOS Keychain                                    |
| Android          | AndroidKeyStore + SharedPreferences        | AndroidKeyStore + SharedPreferences             |
| Android < API 18 | Base64 only (⚠️ not secure)                | Not recommended/supported                       |
| Web              | LocalStorage (base64 with `capsec` prefix) | LocalStorage (unsecured, for dev only)          |

> 🔐 **Verdict**: `@capawesome-team/capacitor-secure-preferences` provides more modern and actively maintained secure implementations, especially when paired with biometrics and Capawesome Cloud.

---

## 3. API Comparison

### Shared Methods

Both plugins support:

- `set({ key, value })`
- `get({ key })`
- `remove({ key })`
- `keys()`
- `clear()`

### Differences

| Feature                       | OSS Plugin                               | Capawesome Plugin                             |
| ----------------------------- | ---------------------------------------- | --------------------------------------------- |
| `getPlatform()`               | ✅ Returns `'web'`, `'ios'`, `'android'` | ❌                                            |
| Error handling                | Throws errors on missing keys            | Returns `{ value: null }`                     |
| Type safety                   | Limited                                  | Strong TypeScript typings                     |
| Integration with Biometrics   | ❌                                       | ✅                                            |
| Proguard/Backup Configuration | Optional                                 | Required for full Android security compliance |
| SPM Support (iOS)             | ❌                                       | ✅                                            |
| Custom Keychain naming        | ❌                                       | ✅ Future (via issue request)                 |

---

## 4. Installation & Setup

### `capacitor-secure-storage-plugin`

<pre>
npm install capacitor-secure-storage-plugin
npx cap sync
</pre>

### `@capawesome-team/capacitor-secure-preferences`

<pre>
npm config set @capawesome-team:registry https://npm.registry.capawesome.io
npm config set //npm.registry.capawesome.io/:_authToken &lt;YOUR_LICENSE_KEY&gt;
npm install @capawesome-team/capacitor-secure-preferences
npx cap sync
</pre>

⚠️ Requires Android Manifest changes and Proguard rules for secure setup.

---

## 5. Pros & Cons Summary

| Criteria           | OSS Plugin       | Capawesome Plugin                  |
| ------------------ | ---------------- | ---------------------------------- |
| 🔒 Security        | Moderate         | ✅ Strong (production-ready)       |
| 🛠️ Maintenance     | Community-driven | ✅ Actively maintained             |
| 🌐 Web Support     | Base64 fallback  | Dev-only warning                   |
| 📦 iOS SPM Support | ❌               | ✅                                 |
| 🤝 Ecosystem       | Standalone       | ✅ Part of Capawesome Plugin Suite |
| 💵 Cost            | Free             | Paid (with support & updates)      |

---

## 6. Recommendation

If **cost is not an issue** and **security is your top priority**, prefer:

> ✅ **`@capawesome-team/capacitor-secure-preferences`**

If you’re working on a **free app**, **prototype**, or **non-sensitive use case**, and need something fast:

> ✅ **`capacitor-secure-storage-plugin`** (open-source) is sufficient, but lacks robust enterprise features.

---

## 7. Final Verdict

| Use Case                                            | Recommendation                                  |
| --------------------------------------------------- | ----------------------------------------------- |
| Production app with tokens, passwords, user secrets | `@capawesome-team/capacitor-secure-preferences` |
| Small apps or early-stage prototyping               | `capacitor-secure-storage-plugin`               |

---

## 8. Capawesome insiders FAQs

**1. May I share my license key with my team?**
Polar provides each sponsor with only one license key. We therefore recommend that teams sponsor Capawesome using a single team account and share the license key among the team members. However, it's NOT allowed to share the license key with external parties.

**2. What happens if I cancel my subscription?**
If you cancel your subscription, you will lose access to the private npm registry and the plugins that are part of Insiders.

## 9. Capawesome Insider Pricing

| Plan                   | Price           | Access                                | Usage Rights                                          |
| ---------------------- | --------------- | ------------------------------------- | ----------------------------------------------------- |
| **Individual Insider** | **$15 / month** | ✅ Full access to Sponsorware plugins | 🚫 Non-commercial use only                            |
| **Business Insider**   | **$50 / month** | ✅ Full access to Sponsorware plugins | ✅ Commercial use for businesses with < 100 employees |

[https://capawesome.io/insider](https://capawesome.io/insider)

---

### Notes

- All plugins under Capawesome's Sponsorware model (e.g., `@capawesome-team/capacitor-biometrics`) require an active Insider subscription.
- You get a private npm access token to install premium plugins.
- Cancel anytime via your Capawesome account dashboard.

# Capacitor Biometric Plugins Comparison

This document compares two Capacitor plugins for biometric authentication:

- ✅ [`@capgo/capacitor-native-biometric`](Free, Open Source)
- 🔐 [`@capawesome-team/capacitor-biometrics`](Paid, Premium)

---

## 1. Plugin Overview

| Feature                         | `@capgo/capacitor-native-biometric` (OSS) | `@capawesome-team/capacitor-biometrics` (Premium) |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| Type                            | Open-source                               | Commercial (Capawesome Insider)                   |
| Maintainer                      | Capgo                                     | Capawesome Team                                   |
| License                         | MIT                                       | Paid (License key required)                       |
| Capacitor Support               | v7 only                                   | v7 only                                           |
| Platforms                       | Android, iOS                              | Android, iOS, Web (limited fallback)              |
| Auth Types                      | Face ID, Touch ID, Fingerprint            | Face ID, Touch ID, Fingerprint, Iris              |
| Device Credential Fallback      | ❌                                        | ✅                                                |
| Credential Storage              | ✅ (Keychain / Keystore)                  | ❌ (Auth only)                                    |
| Custom UI                       | Limited                                   | ✅ Fully customizable                             |
| Error Codes                     | ✅ Unified                                | ✅ Rich and detailed                              |
| Biometric Strength Detection    | ❌                                        | ✅                                                |
| Enroll Prompt                   | ❌                                        | ✅ (Android only)                                 |
| Authentication Type Detection   | ❌                                        | ✅ (e.g., Biometric vs PIN)                       |
| Cancel Authentication Support   | ❌                                        | ✅                                                |
| Capawesome Cloud & Plugin Suite | ❌                                        | ✅                                                |
| SPM (iOS) Support               | ❌                                        | ✅                                                |
| Support & Maintenance           | Community                                 | ✅ Priority Support                               |

---

## 2. Security & Platform Capabilities

| Feature                      | Capgo Native Biometric | Capawesome Biometrics        |
| ---------------------------- | ---------------------- | ---------------------------- |
| iOS Storage                  | Keychain               | Native Biometrics            |
| Android Storage              | Keystore               | Native Biometrics            |
| Web Support                  | ❌                     | ✅ (Fallback detection only) |
| Encrypted Credential Storage | ✅                     | ❌                           |
| Auth Prompt Customization    | Basic                  | ✅ Fully customizable        |
| Error Handling               | Basic codes (0–17)     | ✅ ErrorCode enum system     |
| Strength Level Detection     | ❌                     | ✅ STRONG / WEAK             |
| Face ID Usage Description    | Required               | Required                     |
| Android Biometric Permission | Required               | Required                     |
| iOS Fallback Button Text     | ✅                     | ✅                           |
| Android Auth Attempts Limit  | ✅ (maxAttempts)       | ✅ (via strength level)      |

---

## 3. Functional API Comparison

| Capability                    | Capgo Plugin | Capawesome Plugin     |
| ----------------------------- | ------------ | --------------------- |
| `isAvailable()`               | ✅           | ✅                    |
| `verifyIdentity()`            | ✅           | ✅ (`authenticate()`) |
| `getCredentials()`            | ✅           | ❌                    |
| `setCredentials()`            | ✅           | ❌                    |
| `deleteCredentials()`         | ✅           | ❌                    |
| `cancelAuthentication()`      | ❌           | ✅                    |
| `enroll()`                    | ❌           | ✅                    |
| `getBiometricStrengthLevel()` | ❌           | ✅                    |
| `hasDeviceCredential()`       | ❌           | ✅                    |
| `isEnrolled()`                | ✅ (basic)   | ✅ (detailed)         |
| `getAuthenticationType()`     | ❌           | ✅                    |

---

## 4. Installation

### Capgo (Free)

    npm install @capgo/capacitor-native-biometric
    npx cap sync

### Capawesome (Paid)

    npm config set @capawesome-team:registry https://npm.registry.capawesome.io
    npm config set //npm.registry.capawesome.io/:_authToken <YOUR_LICENSE_KEY>
    npm install @capawesome-team/capacitor-biometrics
    npx cap sync

---

## 5. Example Code

### Capgo – Biometric + Credential Flow

    import { NativeBiometric } from "@capgo/capacitor-native-biometric";

    await NativeBiometric.setCredentials({
      username: 'user',
      password: 'pass',
      server: 'example.com'
    });

    const { isAvailable } = await NativeBiometric.isAvailable();
    if (isAvailable) {
      const verified = await NativeBiometric.verifyIdentity({ reason: 'Log in' });
      if (verified) {
        const credentials = await NativeBiometric.getCredentials({ server: 'example.com' });
        console.log(credentials);
      }
    }

### Capawesome – Biometric Auth with Fallback

    import { Biometrics, ErrorCode } from '@capawesome-team/capacitor-biometrics';

    try {
      await Biometrics.authenticate({
        title: 'Authentication Required',
        subtitle: 'Please authenticate to continue',
        cancelButtonText: 'Cancel',
        iosFallbackButtonText: 'Use Passcode',
        allowDeviceCredential: true,
      });
      console.log('Authenticated');
    } catch (error) {
      if (error.code === ErrorCode.USER_CANCELED) {
        console.log('User canceled');
      }
    }

---

## 6. Recommendation

| Use Case                                                                   | Recommended Plugin                         |
| -------------------------------------------------------------------------- | ------------------------------------------ |
| Full biometric login with credential storage                               | ✅ `@capgo/capacitor-native-biometric`     |
| Enterprise-grade biometric auth with fallback and cloud-ready architecture | ✅ `@capawesome-team/capacitor-biometrics` |
| Biometric + PIN fallback authentication                                    | ✅ Capawesome                              |
| Lightweight apps with credential caching                                   | ✅ Capgo                                   |

---

## 7. Final Verdict

If **security and enterprise readiness** are your top priorities and **you don't mind paying**:

> ✅ Use `@capawesome-team/capacitor-biometrics`

If you need **free credential + biometric support** and are okay with limited customization:

> ✅ Use `@capgo/capacitor-native-biometric`

---
