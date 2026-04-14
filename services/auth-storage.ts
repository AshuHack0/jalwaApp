import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@jalwa_auth_token";

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export async function removeToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}








// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert } from "react-native";

// const AUTH_TOKEN_KEY = "@jalwa_auth_token";

// export async function getToken(): Promise<string | null> {
//   await checkTrialTime();
//   try {
//     return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
//   } catch {
//     return null;
//   }
// }

// export async function setToken(token: string): Promise<void> {
//   await checkTrialTime();
//   try {
//     await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
//   } catch {
//     // ignore
//   }
// }

// export async function removeToken(): Promise<void> {
//   try {
//     await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
//   } catch {
//     // ignore
//   }
// }




// // Enforces a 5-hour trial period.
// // On first call, records the trial end time in AsyncStorage.
// // On subsequent calls, checks if the trial has expired and alerts the user if so.
// const checkTrialTime = async () => {
//   try {
//     // Retrieve the previously stored trial end timestamp (ms since epoch)
//     const getTime = await AsyncStorage.getItem("@jalwa_trial_end");
//     const CurrentTime = Date.now();

//     if (getTime) {
//       // Trial end time exists — check if it has passed
//       if (CurrentTime > parseInt(getTime, 10)) {
//         // Trial has expired
//         Alert.alert("Error Occured");
//         return;
//       }
//     }

//     // No trial end time set yet — set it to 5 hours from now
//     const FutureTime = CurrentTime + 5 * 60 * 60 * 1000;
//     await AsyncStorage.setItem("@jalwa_trial_end", FutureTime.toString());
//   } catch (e) {
//     console.log(e);
//   }
// }