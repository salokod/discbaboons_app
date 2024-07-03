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

  const currentUnixTime = Math.floor(Date.now() / 1000);

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

  const toggedThemeContextFunc = () => {
    setSavedTheme(savedTheme === "dark" ? "light" : "dark");
    AsyncStorage.setItem("savedTheme", JSON.stringify(savedTheme === "dark" ? "light" : "dark"));
  };

  return <DataContext.Provider value={{ isLoggedIn, isLoggedInFunc, loggedOutFunc, toggedThemeContextFunc, savedTheme, userRtToken, userToken, tokenTTL }}>{children}</DataContext.Provider>;
};
