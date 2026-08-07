import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

import { Navigate } from "react-router-dom";

export default function Home() {
  return (
    <>
      <SignedOut>
        <div className="auth-page">
          <div className="auth-card">

            <div className="auth-logo">
              <div className="logo-icon">✓</div>
              <span>TrackHire</span>
            </div>

            <h1>Welcome Back</h1>

            <p className="auth-subtitle">
              Login to continue tracking your applications
            </p>

            <SignInButton mode="modal">
              <button className="primary auth-button">
                Sign In
              </button>
            </SignInButton>

            <div className="auth-divider">
              <span>Or</span>
            </div>

            <SignUpButton mode="modal">
              <button className="auth-button secondary">
                Create an Account
              </button>
            </SignUpButton>

            <p className="auth-footer">
              Don't have an account?{" "}
              <SignUpButton mode="modal">
                <button className="signup-link">
                  Sign up
                </button>
              </SignUpButton>
            </p>

          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
    </>
  );
}