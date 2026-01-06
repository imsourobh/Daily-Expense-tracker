# Guide: Converting a React Web App to an Android APK with Offline Storage

This guide provides a comprehensive, step-by-step process for converting a React-based web application into a fully functional, offline-first Android APK using Capacitor.

## Introduction

Capacitor is a tool that allows you to package your web application into a native mobile app (for Android and iOS). It acts as a bridge between your web code and the native device features, allowing you to access functionalities like the camera, GPS, and local storage.

This guide will walk you through the entire process, from setting up your React app for conversion to building the final APK file.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js and npm:** [Download and install Node.js](https://nodejs.org/) (npm is included).
*   **A code editor:** Such as [Visual Studio Code](https://code.visualstudio.com/).
*   **Android Studio:** [Download and install Android Studio](https://developer.android.com/studio). This is necessary for the Android SDK, emulator, and other tools.

---

## Step 1: Prepare Your React App

Capacitor works with a static web build. This means you need to configure your React app to output a `build` or `out` folder with static HTML, CSS, and JavaScript files.

### For Standard React Apps (created with `create-react-app`)

If your project was created with `create-react-app`, you can simply run the build command:

```bash
npm run build
```

This will generate a `build` folder with the static assets.

### For Next.js Apps

If you are using Next.js, you need to configure it for static site generation (SSG).

1.  **Open your `next.config.js` file.**
2.  **Add the `output: 'export'` option:**

    ```javascript
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      output: 'export',
    };

    module.exports = nextConfig;
    ```

3.  **Build your app:**

    ```bash
    npm run build
    ```

    This will generate an `out` folder with the static assets.

---

## Step 2: Integrate Capacitor

Now, you'll add Capacitor to your project.

1.  **Install Capacitor dependencies:**

    Open your terminal in the root of your project and run:

    ```bash
    npm install @capacitor/cli @capacitor/core @capacitor/android
    ```

2.  **Initialize Capacitor:**

    Run the following command to create the Capacitor configuration file (`capacitor.config.json`):

    ```bash
    npx cap init "Your App Name" "com.yourcompany.yourapp" --web-dir "build"
    ```

    *   Replace `"Your App Name"` with the desired name of your app.
    *   Replace `"com.yourcompany.yourapp"` with a unique app ID.
    *   Replace `"build"` with `"out"` if you are using Next.js.

3.  **Add the Android platform:**

    This command will create an `android` folder in your project, which is a native Android project.

    ```bash
    npx cap add android
    ```

---

## Step 3: Build and Sync

Now that Capacitor is set up, you need to build your React app and sync the static assets with the Android project.

1.  **Build your React app:**

    ```bash
    npm run build
    ```

2.  **Sync with Capacitor:**

    This command copies your web assets into the native Android project.

    ```bash
    npx cap sync
    ```

---

## Step 4: Implementing Offline Storage

To make your app work offline, you need to store data locally on the device. While `localStorage` works, it's not recommended for mobile apps as it can be cleared by the operating system. Capacitor's **Preferences API** is a more robust solution.

1.  **Install the Preferences API:**

    ```bash
    npm install @capacitor/preferences
    ```

2.  **Using the Preferences API in your React code:**

    Here's an example of how to save and retrieve data using the `Preferences` API. You can adapt this to your application's needs.

    ```javascript
    import { Preferences } from '@capacitor/preferences';

    // To save data
    const saveData = async () => {
      await Preferences.set({
        key: 'userData',
        value: JSON.stringify({
          name: 'John Doe',
          email: 'john.doe@example.com',
        }),
      });
    };

    // To load data
    const loadData = async () => {
      const { value } = await Preferences.get({ key: 'userData' });
      if (value) {
        const user = JSON.parse(value);
        console.log('Loaded user:', user);
      }
    };
    ```

### Storage Permissions

For the `Preferences` API, **no special permissions are required** on Android. It uses the standard `SharedPreferences` on Android, which is available to all apps by default.

---

## Step 5: Building the APK

You can build the APK in two ways:

### Method 1: Using Android Studio (Recommended for beginners)

1.  **Open your project in Android Studio:**

    ```bash
    npx cap open android
    ```

2.  **Build the APK:**
    *   Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    *   Android Studio will build the APK. When it's done, you'll see a notification with a "locate" link to find the file. The APK will be in `android/app/build/outputs/apk/debug/app-debug.apk`.

### Method 2: Using the Command Line (Gradle)

1.  **Navigate to the `android` directory:**

    ```bash
    cd android
    ```

2.  **Run the Gradle build command:**

    *   On Linux or macOS:
        ```bash
        ./gradlew assembleDebug
        ```
    *   On Windows:
        ```bash
        gradlew.bat assembleDebug
        ```

3.  **Find the APK:**

    The generated APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## Step 6: Installing the APK

You can install the generated APK on your Android device for testing.

1.  **Enable USB debugging on your device:**
    *   Go to **Settings** > **About phone**.
    *   Tap on **Build number** seven times to enable **Developer options**.
    *   Go to **Settings** > **Developer options** and enable **USB debugging**.

2.  **Install the APK:**
    *   Connect your device to your computer via USB.
    *   Run the following command in your terminal:
        ```bash
        adb install android/app/build/outputs/apk/debug/app-debug.apk
        ```

You can also copy the APK file to your device and install it using a file manager.

---

## Conclusion

This guide has shown you how to convert your React web application into an Android APK using Capacitor. You've learned how to set up your project, implement offline storage, and build the final APK. From here, you can explore more of Capacitor's APIs to add more native features to your app.
