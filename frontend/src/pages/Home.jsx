import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <>
      <SignedOut>
        <div className="auth-page">
          {/* LEFT SIDE */}
          <section className="auth-left">
            <div className="auth-brand">
              <div className="auth-brand-icon">✓</div>
              <span>TrackHire</span>
            </div>

            <div className="auth-hero">
              <span className="auth-eyebrow">
                YOUR CAREER, ORGANIZED
              </span>

              <h1>
                Land your next
                <span> dream job.</span>
              </h1>

              <p>
                Keep every application, interview, deadline, and
                opportunity organized in one simple place.
              </p>
            </div>

            {/* Dashboard Preview */}
            <div className="auth-preview">
              <div className="preview-header">
                <div>
                  <strong>Application Overview</strong>
                  <small>Your job search at a glance</small>
                </div>

                <span className="preview-status">Active</span>
              </div>

              <div className="preview-stats">
                <div>
                  <small>Applications</small>
                  <strong>24</strong>
                  <span>+6 this week</span>
                </div>

                <div>
                  <small>Interviews</small>
                  <strong>6</strong>
                  <span>+2 this week</span>
                </div>

                <div>
                  <small>Offers</small>
                  <strong>2</strong>
                  <span>Keep going!</span>
                </div>
              </div>

              <div className="preview-pipeline">
                <div className="pipeline-heading">
                  <strong>Application Pipeline</strong>
                  <span>View all</span>
                </div>

                <div className="pipeline-row">
                  <span>Applied</span>
                  <div className="pipeline-bar">
                    <i style={{ width: "82%" }} />
                  </div>
                  <b>14</b>
                </div>

                <div className="pipeline-row">
                  <span>Screening</span>
                  <div className="pipeline-bar">
                    <i style={{ width: "52%" }} />
                  </div>
                  <b>5</b>
                </div>

                <div className="pipeline-row">
                  <span>Interview</span>
                  <div className="pipeline-bar">
                    <i style={{ width: "32%" }} />
                  </div>
                  <b>3</b>
                </div>

                <div className="pipeline-row">
                  <span>Offer</span>
                  <div className="pipeline-bar">
                    <i style={{ width: "20%" }} />
                  </div>
                  <b>2</b>
                </div>
              </div>
            </div>

            <div className="auth-floating-card floating-one">
              ✓ Application tracked
            </div>

            <div className="auth-floating-card floating-two">
              📅 Interview tomorrow
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="auth-right">
            <div className="auth-card">
              <div className="auth-card-header">
                <div className="mobile-logo">
                  <div className="auth-brand-icon">✓</div>
                  <span>TrackHire</span>
                </div>

                <h2>Welcome back</h2>

                <p>
                  Sign in to continue tracking your applications.
                </p>
              </div>

              <div className="auth-actions">
                <SignInButton mode="modal">
                  <button className="auth-primary">
                    Sign In
                  </button>
                </SignInButton>

                <div className="auth-divider">
                  <span />
                  <p>or</p>
                  <span />
                </div>

                <SignUpButton mode="modal">
                  <button className="auth-secondary">
                    Create an Account
                  </button>
                </SignUpButton>
              </div>

              <p className="auth-footer">
                Don't have an account?{" "}
                <SignUpButton mode="modal">
                  <button className="signup-link">
                    Sign up
                  </button>
                </SignUpButton>
              </p>

              <p className="auth-terms">
                By continuing, you agree to our Terms of Service
                and Privacy Policy.
              </p>
            </div>
          </section>
        </div>
      </SignedOut>

      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
    </>
  );
}