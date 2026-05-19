import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "@/features/auth/api/authApi.js";
import { AuthContext } from "@/features/auth/context/AuthContextValue.js";
import { tokenStore } from "@/shared/api/client.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [profile, setProfile] = useState(null);
  const [hasBootstrapped, setHasBootstrapped] = useState(
    () => !tokenStore.get(),
  );

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setProfile(null);
    setHasBootstrapped(true);
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
      } finally {
        setHasBootstrapped(true);
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

  const requestPasswordReset = useCallback((payload) => {
    return authApi.requestPasswordReset(payload);
  }, []);

  const verifyPasswordResetCode = useCallback((payload) => {
    return authApi.verifyPasswordResetCode(payload);
  }, []);

  const confirmPasswordReset = useCallback((payload) => {
    return authApi.confirmPasswordReset(payload);
  }, []);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isActive = true;

    refreshMe()
      .catch(() => {
        if (isActive) {
          clearSession();
        }
      })
      .finally(() => {
        if (isActive) {
          setHasBootstrapped(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [clearSession, refreshMe, token]);

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
      isBootstrapping: Boolean(token && !hasBootstrapped),
      login,
      confirmPasswordSetup,
      confirmPasswordReset,
      requestAccess,
      requestPasswordReset,
      verifyPasswordResetCode,
      refreshMe,
      logout: clearSession,
    }),
    [
      clearSession,
      confirmPasswordReset,
      confirmPasswordSetup,
      hasBootstrapped,
      login,
      profile,
      refreshMe,
      requestAccess,
      requestPasswordReset,
      token,
      verifyPasswordResetCode,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
