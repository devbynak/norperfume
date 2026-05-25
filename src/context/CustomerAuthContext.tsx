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
} from "@/lib/shopify/customer-account";

interface CustomerAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (returnTo?: string) => void;
  logout: () => void;
  signalAuthenticated: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(checkAuth());
    setIsLoading(false);
  }, []);

  const login = useCallback((returnTo?: string) => {
    void beginLogin(returnTo || window.location.pathname);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    oauthLogout();
  }, []);

  const signalAuthenticated = useCallback(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  return (
    <CustomerAuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, signalAuthenticated }}
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
