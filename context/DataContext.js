import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DataContext = createContext();

export const DataProviderContext = ({ children }) => {
  const [testVar, setTestVar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    AsyncStorage.setItem("testVariable", JSON.stringify({ id: 1, hiMom: "hi" }));

    setTestVar({ id: 1, hiMom: "hi" });
  }, []);

  const isLoggedInFunc = () => setIsLoggedIn(!isLoggedIn);

  return <DataContext.Provider value={{ isLoggedIn, isLoggedInFunc }}>{children}</DataContext.Provider>;
};
