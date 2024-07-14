import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HOSTNAME } from "../config/config";

export const DataContext = createContext();

export const DataProviderContext = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedTheme, setSavedTheme] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userRtToken, setUserRtToken] = useState(null);
  const [tokenTTL, setTokenTTL] = useState(null);
  const [passwordResetCheck, setPasswordResetCheck] = useState(false);
  const [passwordUrlUuid, setPasswordUrlUuid] = useState(null);
  const [passwordResetTTL, setPasswordResetTTL] = useState(null);

  const isTokenExpired = () => {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    return currentUnixTime > tokenTTL;
  };

  // Higher-order function to wrap any function with token expiration check
  const withTokenCheck = (fn) => {
    return async (...args) => {
      if (isTokenExpired()) {
        console.log("Token has expired.");
        // Handle the expired token case here
        // For example, refresh the token or redirect to login
        return;
      }
      // If the token is not expired, proceed to call the original function
      return await fn(...args);
    };
  };

  if (passwordResetTTL !== null && passwordResetTTL < Date.now() / 1000) {
    AsyncStorage.removeItem("passwordResetCheck");
    AsyncStorage.removeItem("passwordUrlUuid");
    AsyncStorage.removeItem("passwordResetTTL");
    setPasswordResetCheck(false);
    setPasswordUrlUuid(null);
    setPasswordResetTTL(null);
  }

  // Example usage with an async function that needs the token check
  const fetchUserDataWrapped = withTokenCheck(async () => {
    console.log("Fetching user data...");
    // Your logic to fetch user data goes here
  });

  useEffect(() => {
    AsyncStorage.getItem("loggedIn").then((loginstate) => {
      setIsLoggedIn(JSON.parse(loginstate));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("savedTheme").then((theme) => {
      setSavedTheme(JSON.parse(theme));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("passwordResetCheck").then((check) => {
      setPasswordResetCheck(JSON.parse(check));
    });

    AsyncStorage.getItem("passwordUrlUuid").then((uuid) => {
      setPasswordUrlUuid(JSON.parse(uuid));
    });

    AsyncStorage.getItem("passwordResetTTL").then((ttl) => {
      setPasswordResetTTL(JSON.parse(ttl));
    });
  }, []);

  //set the default shit
  useEffect(() => {
    const loadData = async () => {
      const keys = ["userToken", "tokenTTL", "userRtToken"];
      try {
        const [userToken, tokenTTL, userRtToken] = await Promise.all(keys.map((key) => AsyncStorage.getItem(key).then(JSON.parse)));

        setUserToken(userToken);
        setTokenTTL(tokenTTL);
        setUserRtToken(userRtToken);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const isLoggedInFunc = async (username, password) => {
    const response = await axios.post(`${HOSTNAME}/api/v2/public/auth/login`, { username: username, password: password });
    setIsLoggedIn(true);
    AsyncStorage.setItem("userToken", JSON.stringify(response.data.token));
    AsyncStorage.setItem("userRtToken", JSON.stringify(response.data.rt));
    AsyncStorage.setItem("tokenTTL", JSON.stringify(response.data.tokenTTL));
    AsyncStorage.setItem("loggedIn", JSON.stringify(true));
    return response;
  };

  const loggedOutFunc = () => {
    setIsLoggedIn(false);
    AsyncStorage.setItem("loggedIn", JSON.stringify(false));
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userRtToken");
    AsyncStorage.removeItem("tokenTTL");

    setUserToken(null);
    setTokenTTL(null);
    setUserRtToken(null);
  };

  const registeringFunc = async (username, password, email) => {
    const response = await axios.post(`${HOSTNAME}/api/v2/public/auth/register`, { username: username, password: password, email: email });
    setIsLoggedIn(true);
    AsyncStorage.setItem("userToken", JSON.stringify(response.data.token));
    AsyncStorage.setItem("userRtToken", JSON.stringify(response.data.rt));
    AsyncStorage.setItem("tokenTTL", JSON.stringify(response.data.tokenTTL));
    AsyncStorage.setItem("loggedIn", JSON.stringify(true));
    return response;
  };

  const requestUsernameFunc = async (email) => {
    const response = await axios.post(`${HOSTNAME}/api/v2/public/auth/forgotuser`, { email: email });
    return response;
  };
  const requestPasswordFunc = async (username) => {
    const response = await axios.post(`${HOSTNAME}/api/v2/public/auth/forgotpassword`, { username: username });
    const urlUuid = response.data.urlUuid;
    // declare variable unix timestamp plus an hour
    const ttl = Math.floor(Date.now() / 1000) + 3600;

    AsyncStorage.setItem("passwordResetCheck", JSON.stringify(true));
    AsyncStorage.setItem("passwordUrlUuid", JSON.stringify(urlUuid));
    AsyncStorage.setItem("passwordResetTTL", JSON.stringify(ttl));
    setPasswordResetCheck(true);
    setPasswordResetTTL(ttl);
    setPasswordUrlUuid(urlUuid);
    return response;
  };

  const swapPaswordCheckFunc = () => {
    setPasswordResetCheck(false);
  };

  const toggedThemeContextFunc = () => {
    setSavedTheme(savedTheme === "dark" ? "light" : "dark");
    AsyncStorage.setItem("savedTheme", JSON.stringify(savedTheme === "dark" ? "light" : "dark"));
  };

  return <DataContext.Provider value={{ isLoggedIn, registeringFunc, passwordResetTTL, passwordUrlUuid, passwordResetCheck, swapPaswordCheckFunc, isLoggedInFunc, loggedOutFunc, requestPasswordFunc, toggedThemeContextFunc, requestUsernameFunc, savedTheme, userRtToken, userToken, tokenTTL }}>{children}</DataContext.Provider>;
};
