// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "src/configs/auth";

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
} from "./types";
import useLogin from "src/hooks/api/useLogin";
import { useLocalStorage } from "src/hooks/useLocalStorage";
import useRegister from "src/hooks/api/useRegister";
import useFetchShopProfile from "src/hooks/api/shop/useFetchShopProfile";
import useFetchNotify from "src/hooks/api/useFetchNotification";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  fetchShopProfile: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);

  // ** Hooks
  const router = useRouter();
  const [{ data: loginData, loading: loginLoading }, handleLogin] = useLogin();
  const [{ data: registerData, loading: registerLoading }, handleRegister] =
    useRegister();

  const [accessToken, setAccessToken] = useLocalStorage(
    authConfig.storageTokenKeyName,
    ""
  );
  const [refreshToken, setRefreshToken] = useLocalStorage(
    authConfig.onTokenExpiration,
    ""
  );
  const [user, setUser] = useLocalStorage<any | null>(
    authConfig.userData,
    defaultProvider.user
  );

  // fetch profile
  const [{ data: shopProfile }, fetchShopProfile] = useFetchShopProfile();

  //fetch notification
  const [{ data: notify }, fetchNotify] = useFetchNotify();

  useEffect(() => {
    if (!loginData) return;

    setAccessToken(loginData.access_token);
    setRefreshToken(loginData.refresh_token);
    // setUser({
    //   email: "hello",
    // });

    router.replace("/home");
  }, [loginData]);

  useEffect(() => {
    if (!accessToken) return;
    fetchShopProfile();
    fetchNotify();
  }, [accessToken]);

  useEffect(() => {
    if (!shopProfile) return;
    setUser(shopProfile);
  }, [shopProfile]);

  const handleLogout = () => {
    setUser(null);
    setAccessToken("");
    setRefreshToken("");
    setUser(null);

    router.push("/login");
  };

  const values = {
    user: user,
    loading: registerLoading || loginLoading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    fetchShopProfile,
    notify,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
