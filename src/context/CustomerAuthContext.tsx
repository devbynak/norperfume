/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  beginLogin,
  isAuthenticated as checkAuth,
  logout as oauthLogout,
  getAccessToken,
} from "@/lib/shopify/customer-account";

interface CustomerAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (returnTo?: string) => void;
  logout: () => void;
  signalAuthenticated: () => void;
  accessToken: string | null;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(checkAuth());
    setAccessToken(getAccessToken());
    setIsLoading(false);
  }, []);

  const login = useCallback((returnTo?: string) => {
    void beginLogin(returnTo || window.location.pathname);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAccessToken(null);
    oauthLogout();
  }, []);

  const signalAuthenticated = useCallback(() => {
    setIsAuthenticated(checkAuth());
    setAccessToken(getAccessToken());
  }, []);

  return (
    <CustomerAuthContext.Provider
      value={{ isAuthenticated, accessToken, isLoading, login, logout, signalAuthenticated }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
};
