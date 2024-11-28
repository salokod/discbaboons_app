// context/DataContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { HOSTNAME } from '../config/config';

export const DataContext = createContext();

// eslint-disable-next-line react/prop-types
export function DataProviderContext({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [savedTheme, setSavedTheme] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [resetCodeValidated, setResetCodeValidated] = useState(false);
  const [userRtToken, setUserRtToken] = useState(null);
  const [tokenTTL, setTokenTTL] = useState(null);
  const [passwordResetCheck, setPasswordResetCheck] = useState(false);
  const [passwordUrlUuid, setPasswordUrlUuid] = useState(null);
  const [passwordResetTTL, setPasswordResetTTL] = useState(null);
  const [userBags, setUserBags] = useState([]);
  const [userDiscs, setUserDiscs] = useState([]);
  const [userRounds, setUserRounds] = useState([]);
  const [userBets, setUserBets] = useState([]);

  const isTokenExpired = () => {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    return currentUnixTime > tokenTTL;
  };

  const withTokenCheck = (fn) => async (...args) => {
    if (isTokenExpired()) {
      return;
    }
    fn(...args);
  };

  // eslint-disable-next-line no-unused-vars
  const fetchUserDataWrapped = withTokenCheck(async () => {
    // Your logic to fetch user data goes here
  });

  useEffect(() => {
    AsyncStorage.getItem('loggedIn').then((loginstate) => {
      setIsLoggedIn(JSON.parse(loginstate));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('savedTheme').then((theme) => {
      setSavedTheme(JSON.parse(theme));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('passwordResetCheck').then((check) => {
      setPasswordResetCheck(JSON.parse(check));
    });

    AsyncStorage.getItem('passwordUrlUuid').then((uuid) => {
      setPasswordUrlUuid(JSON.parse(uuid));
    });

    AsyncStorage.getItem('passwordResetTTL').then((ttl) => {
      setPasswordResetTTL(JSON.parse(ttl));
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const keys = ['userToken', 'tokenTTL', 'userRtToken'];
      try {
        const [fetchedUserToken, fetchedTokenTTL, fetchedUserRtToken] = await Promise.all(
          keys.map((key) => AsyncStorage.getItem(key).then(JSON.parse)),
        );
        const { user, email, id } = jwtDecode(fetchedUserToken);
        setUserName(user);
        setUserEmail(email);
        setUserId(id);
        setUserToken(fetchedUserToken);
        setTokenTTL(fetchedTokenTTL);
        setUserRtToken(fetchedUserRtToken);
      } catch (error) {
        // Intentionally left empty because the error is handled
      }
    };

    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  // use effect to get all bags
  useEffect(() => {
    if (isLoggedIn && userToken) {
      // eslint-disable-next-line
      bagFunctions.findAllBags();
      // eslint-disable-next-line
      discFunctions.findAllDiscs();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, userToken]);

  const baboonHeaders = {
    Authorization: `Bearer ${userToken || AsyncStorage.getItem('userToken').then(JSON.parse)}`,
  };

  const authFunctions = {
    testFunc: () => {
      AsyncStorage.removeItem('passwordResetCheck');
      AsyncStorage.removeItem('passwordUrlUuid');
      AsyncStorage.removeItem('passwordResetTTL');
      setPasswordResetCheck(false);
      setPasswordUrlUuid(null);
      setPasswordResetTTL(null);
    },
    isLoggedInFunc: async (username, password) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/public/auth/login`, { username, password }, {
        headers: {
          'Content-Type': 'application/json', Accept: 'application/json',
        },
      });

      setIsLoggedIn(true);
      AsyncStorage.setItem('userToken', JSON.stringify(response.data.token));
      AsyncStorage.setItem('userRtToken', JSON.stringify(response.data.rt));
      AsyncStorage.setItem('tokenTTL', JSON.stringify(response.data.tokenTTL));
      AsyncStorage.setItem('loggedIn', JSON.stringify(true));

      return response;
    },
    loggedOutFunc: () => {
      setIsLoggedIn(false);
      AsyncStorage.setItem('loggedIn', JSON.stringify(false));
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userRtToken');
      AsyncStorage.removeItem('tokenTTL');

      setUserToken(null);
      setTokenTTL(null);
      setUserRtToken(null);
    },
    registeringFunc: async (username, password, email) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/public/auth/register`, { username, password, email });
      setIsLoggedIn(true);
      AsyncStorage.setItem('userToken', JSON.stringify(response.data.token));
      AsyncStorage.setItem('userRtToken', JSON.stringify(response.data.rt));
      AsyncStorage.setItem('tokenTTL', JSON.stringify(response.data.tokenTTL));
      AsyncStorage.setItem('loggedIn', JSON.stringify(true));
      return response;
    },
    requestUsernameFunc: async (email) => axios.post(`${HOSTNAME}/api/v2/public/auth/forgotuser`, { email }),
    requestPasswordFunc: async (username) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/public/auth/forgotpassword`, { username });
      const { urlUuid } = response.data;
      const ttl = Math.floor(Date.now() / 1000) + 3600;

      AsyncStorage.setItem('passwordResetCheck', JSON.stringify(true));
      AsyncStorage.setItem('passwordUrlUuid', JSON.stringify(urlUuid));
      AsyncStorage.setItem('passwordResetTTL', JSON.stringify(ttl));
      setPasswordResetCheck(true);
      setPasswordResetTTL(ttl);
      setPasswordUrlUuid(urlUuid);
      return response;
    },
    swapPaswordCheckFunc: () => {
      setPasswordResetCheck(false);
    },
    validateResetTokenFunc: async (code, passUrlUUID) => {
      try {
        await axios.post(`${HOSTNAME}/api/v2/public/auth/validatereset`, { code: parseInt(code, 10), requestUUID: passUrlUUID });
        setResetCodeValidated(true);
        return true;
      } catch (error) {
        return false;
      }
    },
    changePasswordFunc: async (code, passUrlUUID, newPassword) => {
      try {
        await axios.post(`${HOSTNAME}/api/v2/public/auth/changepass`, { code: parseInt(code, 10), requestUUID: passUrlUUID, newPassword });
        return true;
      } catch (error) {
        return false;
      }
    },
    toggedThemeContextFunc: () => {
      setSavedTheme(savedTheme === 'dark' ? 'light' : 'dark');
      AsyncStorage.setItem('savedTheme', JSON.stringify(savedTheme === 'dark' ? 'light' : 'dark'));
    },
  };

  const bagFunctions = {
    findAllBags: async () => {
      const response = await axios.get(`${HOSTNAME}/api/v2/protected/bag/findallbags`, { headers: baboonHeaders });
      if (response.status === 200) {
        setUserBags(response.data.bags);
        AsyncStorage.setItem('userBags', JSON.stringify(response.data.bags));
      }
      return response;
    },
    editBagFunc: async (payload) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/protected/bag/editbag`, payload, { headers: baboonHeaders });
      if (response.status === 200) {
        await bagFunctions.findAllBags();
      }
      return response;
    },
    deleteBagFunc: async (payload) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/protected/bag/deletebag`, payload, { headers: baboonHeaders });
      if (response.status === 200) {
        await bagFunctions.findAllBags();
      }
      return response;
    },
    addBagFunc: async (payload) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/protected/bag/addbag`, payload, { headers: baboonHeaders });
      if (response.status === 200) {
        await bagFunctions.findAllBags();
      }
      return response;
    },
  };

  const discFunctions = {
    findAllDiscs: async () => {
      const response = await axios.get(`${HOSTNAME}/api/v2/protected/disc/findalldiscs`, { headers: baboonHeaders });
      if (response.status === 200) {
        setUserDiscs(response.data.discs);
        AsyncStorage.setItem('userDiscs', JSON.stringify(response.data.discs));
      }
      return response;
    },
    removeDiscs: async (discArray) => {
      const deleteDiscPayload = {
        transitionedDiscs: discArray.map((disc) => ({ baboontype: disc.baboontype })),
      };

      const response = await axios.post(`${HOSTNAME}/api/v2/protected/disc/removediscs`, deleteDiscPayload, { headers: baboonHeaders });

      if (response.status === 200) {
        await discFunctions.findAllDiscs();
      }
      return response;
    },
    sendDiscsToBag: async (newBag, selectedDiscs) => {
      const payload = {
        discsToMove: selectedDiscs.map((disc) => ({ baboontype: disc.baboontype })),
        newBagId: newBag,
      };

      const response = await axios.post(`${HOSTNAME}/api/v2/protected/disc/sendtonewbag`, payload, { headers: baboonHeaders });
      if (response.status === 200) {
        await discFunctions.findAllDiscs();
      }
      return response;
    },
    addDiscFunc: async (payload) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/protected/disc/adddisc`, payload, { headers: baboonHeaders });
      if (response.status === 200) {
        await discFunctions.findAllDiscs();
      }
      return response;
    },
    editDiscFunc: async (payload) => {
      const response = await axios.post(`${HOSTNAME}/api/v2/protected/disc/editdisc`, payload, { headers: baboonHeaders });
      if (response.status === 200) {
        await discFunctions.findAllDiscs();
      }
      return response;
    },
    getDiscsFromDatabase: async () => axios.get(`${HOSTNAME}/api/v2/protected/disc/getdiscsfromdatabase`, { headers: baboonHeaders }),
  };

  const roundFunctions = {
    getRounds: async () => {
      const response = await axios.get(`${HOSTNAME}/api/v2/protected/round/getrounds`, { headers: baboonHeaders });
      if (response.status === 200) {
        setUserRounds(response.data.rounds.Items);
        AsyncStorage.setItem('userRounds', JSON.stringify(response.data.rounds.Items));
      }
      return response.data.rounds.Items;
    },
    getBets: async () => {
      const response = await axios.get(`${HOSTNAME}/api/v2/protected/round/getbets`, { headers: baboonHeaders });
      if (response.status === 200) {
        setUserBets(response.data.bets.Items);
        AsyncStorage.setItem('userBets', JSON.stringify(response.data.bets.Items));
      }
      return response.data.bets.Items;
    },
  };

  return (
    <DataContext.Provider
        // eslint-disable-next-line
      value={{
        isLoggedIn,
        resetCodeValidated,
        passwordResetTTL,
        passwordUrlUuid,
        passwordResetCheck,
        savedTheme,
        userRtToken,
        userToken,
        tokenTTL,
        userName,
        userEmail,
        userId,
        userBags,
        userDiscs,
        userRounds,
        userBets,
        ...authFunctions,
        ...bagFunctions,
        ...discFunctions,
        ...roundFunctions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
