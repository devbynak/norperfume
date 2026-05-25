import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback } from "@/lib/shopify/customer-account";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { signalAuthenticated } = useCustomerAuth();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    handleCallback(window.location.search)
      .then((returnTo) => {
        signalAuthenticated();
        navigate(returnTo || "/account", { replace: true });
      })
      .catch((e) => {
        setError("Unable to complete sign-in. Please try again.");
      });
  }, [navigate, signalAuthenticated]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6 text-center">
      {error ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Login error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="text-sm underline underline-offset-4"
          >
            Back to home
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-10 h-10 mx-auto border-t-2 border-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground tracking-wide">Signing you in…</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;