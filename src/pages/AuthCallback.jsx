import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setSessionToken } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const hash = window.location.hash || "";
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const sessionId = params.get("session_id");

    if (!sessionId) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const { data } = await api.post("/auth/google/session", { session_id: sessionId });
        await setSessionToken(data.token, data.user);
        navigate("/");
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate, setSessionToken]);

  return <div className="p-10 text-center text-gray-500">Signing you in...</div>;
}