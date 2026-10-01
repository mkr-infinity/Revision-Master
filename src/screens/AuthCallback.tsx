import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { decodeJwt } from "../utils/auth";
import appLogo from "../assets/logo.svg";

/**
 * `/auth/callback` — landing point for redirect-style OAuth responses.
 *
 * The default flows use popups (Google token client, Apple `usePopup: true`),
 * so users normally never see this screen. It exists for:
 *   • Google Identity Services redirect mode (`#id_token=…`)
 *   • Apple `form_post` / server round-trips that come back with a `code`
 *     (those need a backend token exchange — see AUTH_SETUP.md).
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { state, signIn } = useAppContext();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Finishing sign-in…");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const idToken = hash.get("id_token") || query.get("id_token");
    const email = query.get("email") || "";

    const finish = (profile: Parameters<typeof signIn>[0]) => {
      signIn(profile);
      setStatus("ok");
      setMessage("Signed in! Taking you to your study dashboard…");
      setTimeout(() => {
        // wipe the token out of the URL
        window.history.replaceState(null, "", window.location.pathname.replace(/\/auth\/callback.*/, "/"));
        navigate(state.user.onboardingCompleted ? "/" : "/onboarding/1", { replace: true });
      }, 900);
    };

    if (idToken) {
      try {
        const claims = decodeJwt(idToken);
        finish({
          provider: "google",
          providerId: claims.sub,
          email: claims.email,
          name: claims.name || claims.email,
          picture: claims.picture,
        });
        return;
      } catch {
        setStatus("error");
        setMessage("The sign-in response could not be read. Please try again.");
        return;
      }
    }

    if (query.get("code")) {
      setStatus("error");
      setMessage(
        "This OAuth response uses the authorisation-code flow, which needs a backend exchange. Configure popup mode instead — see AUTH_SETUP.md.",
      );
      return;
    }

    if (email) {
      finish({ provider: "apple", email, name: email });
      return;
    }

    setStatus("error");
    setMessage("No sign-in response was found in this link.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center anime-sky px-8 text-center">
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={appLogo}
        alt="Revision Master"
        className="size-20 rounded-3xl shadow-glow"
      />
      <div className="mt-6 flex flex-col items-center gap-3">
        {status === "working" && (
          <Loader2 size={22} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        )}
        {status === "ok" && <CheckCircle2 size={22} style={{ color: "var(--color-primary)" }} />}
        {status === "error" && <AlertCircle size={22} style={{ color: "#ff3b5c" }} />}
        <p className="text-[13px] font-bold text-primary-fg max-w-[300px] leading-relaxed">{message}</p>
        {status === "error" && (
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="anime-cta mt-2 px-5 h-11 rounded-2xl font-bold text-sm"
          >
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
