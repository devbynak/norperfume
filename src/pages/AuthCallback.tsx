import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback, clearTokens } from "@/lib/shopify/customer-account";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { signalAuthenticated } = useCustomerAuth();
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    const search = window.location.search;
    
    if (ran.current) return;
    ran.current = true;

    // Surface OAuth errors returned by Shopify directly in the URL
    const params = new URLSearchParams(search);
    const oauthError = params.get("error");
    if (oauthError) {
      const desc = params.get("error_description") || oauthError;
      console.error("❌ OAuth provider error:", oauthError, desc);
      setError("Sign-in was cancelled or rejected");
      setDetails(`${oauthError}: ${desc}`);
      return;
    }

    handleCallback(search)
      .then((returnTo) => {
        signalAuthenticated();
        const safe =
          !returnTo ||
          returnTo.startsWith("/login") ||
          returnTo.startsWith("/auth/callback")
            ? "/account"
            : returnTo;
        navigate(safe, { replace: true });
      })
      .catch((e) => {
        console.error("❌ Auth Callback Failed:", e);
        setError("Unable to complete sign-in");
        setDetails(e.message || "Unknown error occurred during authentication.");
      });
  }, [navigate, signalAuthenticated]);

 const handleRetry = () => {
 clearTokens();
 sessionStorage.clear();
 navigate("/login", { replace: true });
 };

 return (
 <div className="min-h-dvh bg-[#020202] flex items-center justify-center px-6 text-center text-white">
 {error ? (
 <div className="max-w-md w-full space-y-8 p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
 <div className="space-y-4">
 <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
 <span className="text-2xl">⚠️</span>
 </div>
 <h1 className="text-2xl font-display uppercase tracking-wider text-white">{error}</h1>
 <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-left">
 <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2 font-bold font-display">Error Details</p>
 <p className="text-xs text-red-400/80 font-mono break-words leading-relaxed">{details}</p>
 </div>
 <p className="text-sm text-white/40 leading-relaxed italic">
 This can happen due to expired sessions or domain mismatches. Try clearing your session and starting again.
 </p>
 </div>
 
 <div className="flex flex-col gap-4">
 <Button 
 onClick={handleRetry}
 className="w-full py-6 rounded-full bg-primary text-black font-bold uppercase tracking-[0.2em] hover:scale-[1.02] transition-all"
 >
 Clear Session & Retry
 </Button>
 <button
 onClick={() => navigate("/", { replace: true })}
 className="text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors font-bold"
 >
 Back to Home
 </button>
 </div>
 </div>
 ) : null}
    </div>
  );
};

export default AuthCallback;