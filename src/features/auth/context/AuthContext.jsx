import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "@/features/auth/api/authApi.js";
import { AuthContext } from "@/features/auth/context/authContextValue.js";
import { tokenStore } from "@/shared/api/client.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [profile, setProfile] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(tokenStore.get()));

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setProfile(null);
    setIsBootstrapping(false);
  }, []);

  const refreshMe = useCallback(async () => {
    const data = await authApi.me();
    setProfile(data);
    return data;
  }, []);

  const establishSession = useCallback(
    async (data) => {
      if (!data?.token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      tokenStore.set(data.token);
      setToken(data.token);

      try {
        await refreshMe();
      } catch {
        setProfile({ user: data.user });
      }
    },
    [refreshMe],
  );

  const login = useCallback(
    async (payload) => {
      const data = await authApi.login(payload);
      await establishSession(data);
      return data;
    },
    [establishSession],
  );

  const confirmPasswordSetup = useCallback(
    async (payload) => {
      const data = await authApi.confirmPasswordSetup(payload);
      await establishSession(data);
      return data;
    },
    [establishSession],
  );

  const requestAccess = useCallback((payload) => {
    return authApi.requestAccess(payload);
  }, []);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isActive = true;

    authApi
      .me()
      .then((data) => {
        if (isActive) {
          setProfile(data);
        }
      })
      .catch(() => {
        if (isActive) {
          clearSession();
        }
      })
      .finally(() => {
        if (isActive) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [clearSession, token]);

  useEffect(() => {
    window.addEventListener("auth:unauthorized", clearSession);
    return () => window.removeEventListener("auth:unauthorized", clearSession);
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user: profile?.user ?? null,
      organization: profile?.organization ?? null,
      role: profile?.role ?? null,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      login,
      confirmPasswordSetup,
      requestAccess,
      refreshMe,
      logout: clearSession,
    }),
    [
      clearSession,
      confirmPasswordSetup,
      isBootstrapping,
      login,
      profile,
      refreshMe,
      requestAccess,
      token,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
