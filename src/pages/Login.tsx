import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { diagnoseAuthEnvironment } from "@/lib/shopify/customer-account";

const Login = () => {
  const { login } = useCustomerAuth();
  const location = useLocation();

  useEffect(() => {
    diagnoseAuthEnvironment();
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo") || "/account";
    login(returnTo);
  }, [login, location.search]);

  return null;
};

export default Login;