import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DataContext = createContext();

export const DataProviderContext = ({ children }) => {
  const [testVar, setTestVar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("this is the value of isLoggedIn from context: ", isLoggedIn);

  useEffect(() => {
    AsyncStorage.setItem("testVariable", JSON.stringify({ id: 1, hiMom: "hi" }));

    setTestVar({ id: 1, hiMom: "hi" });
  }, []);

  const isLoggedInFunc = () => setIsLoggedIn(!isLoggedIn);

  const testFunc = async () => {
    console.log("this is test variable", await AsyncStorage.getItem("testVariable2"));
  };

  return <DataContext.Provider value={{ testVar, testFunc, isLoggedIn, isLoggedInFunc }}>{children}</DataContext.Provider>;
};
