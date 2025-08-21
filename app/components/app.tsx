"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  fetchAuthSession,
  signIn,
  confirmSignIn,
  signOut,
} from "aws-amplify/auth";
import { Status } from "./status";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const checkSession = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Checking session with forceRefresh: ${forceRefresh}`);
      const authSession = await fetchAuthSession({ forceRefresh });
      console.log("Session result:", authSession);

      if (authSession?.tokens) {
        const idToken = authSession.tokens.idToken?.toString();
        const accessToken = authSession.tokens.accessToken?.toString();
        setSession({
          idToken: idToken ? "Present" : "Missing",
          accessToken: accessToken ? "Present" : "Missing",
          idTokenExpiry: authSession.tokens.idToken?.payload?.exp
            ? new Date(
                authSession.tokens.idToken.payload.exp * 1000
              ).toLocaleString()
            : "N/A",
          accessTokenExpiry: authSession.tokens.accessToken?.payload?.exp
            ? new Date(
                authSession.tokens.accessToken.payload.exp * 1000
              ).toLocaleString()
            : "N/A",
        });
      } else {
        console.log("No tokens in session");
        setSession(null);
      }
    } catch (err: any) {
      console.error("Error fetching session:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    console.log("Signing In?");
    try {
      const { nextStep } = await signIn({ username: email, password });
      console.log("Signed In?", nextStep);
      if (
        nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        const res = await confirmSignIn({
          challengeResponse: confirm,
        });
        console.log("Routing: Home");
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Amplify Token Expiry Reproduction</h1>

      <div style={{ marginBottom: "20px" }}>
        {!(session || loading) ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />

            <input
              type="password"
              placeholder="Confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={handleSignIn}>Sign In</button>
          </>
        ) : null}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => checkSession(false)} disabled={loading}>
          Check Session (Normal)
        </button>
        <button
          onClick={() => checkSession(true)}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          Check Session (Force Refresh)
        </button>
        {session ? (
          <button onClick={handleSignOut} style={{ marginLeft: "10px" }}>
            Sign Out
          </button>
        ) : null}
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <Status loading={loading} session={session} />

      <div
        style={{
          marginTop: "30px",
          backgroundColor: "#e6f3ff",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>Reproduction Steps:</h3>
        <ol>
          <li>
            Deploy backend: <code>npm run deploy</code>
          </li>
          <li>Create a user account (use Cognito console or sign up flow)</li>
          <li>Sign in using email/password above</li>
          <li>Use "Check Session (Force Refresh)" - should work initially</li>
          <li>Wait for tokens to expire (5+ minutes)</li>
          <li>
            Use "Check Session (Force Refresh)" again - should fail to refresh
            despite valid refreshToken
          </li>
        </ol>
      </div>
    </div>
  );
}

export default App;
