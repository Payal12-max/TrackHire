import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  BarChart3,
  CalendarDays,
  KanbanSquare,
  Bell,
  Search,
  Sparkles,
  BriefcaseBusiness,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import "./Landing.css";
import landingImage from "./pic1.jpg";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  const handleGetStarted = () => {
    if (!isLoaded) return;

    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="landing">
      <header className="landing-navbar">
        <div className="landing-navbar-inner">
          <Link to="/" className="landing-logo">
            <div className="landing-logo-mark">T</div>
            <span>TrackHire</span>
          </Link>

          <nav className={`landing-nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              Reviews
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </nav>

          <div className="landing-nav-actions">
            <Link to="/auth" className="landing-signin">
              Sign in
            </Link>
            <button
              type="button"
              className="landing-demo-button"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>

          <button
            type="button"
            className="mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Built for serious job seekers
            </div>

            <h1>
              Your job search,
              <br />
              <span>finally under control.</span>
            </h1>

            <p className="hero-description">
              Track every application, interview, deadline and follow-up in one
              calm, organized workspace. Spend less time managing your job
              search and more time landing the right opportunity.
            </p>

            <div className="hero-actions">
              <Link to="/auth" className="hero-primary">
                Start tracking for free
                <ArrowRight size={18} />
              </Link>

              <a href="#features" className="hero-secondary">
                Explore TrackHire
                <ChevronRight size={17} />
              </a>
            </div>

            <div className="hero-note">
              <Check size={15} />
              No credit card required
              <span />
              <Check size={15} />
              Free to get started
            </div>
          </div>

          <div className="hero-product">
            <div className="product-window">
              <img
                src={landingImage}
                alt="TrackHire job application workspace"
                className="hero-dashboard-image"
              />

              <div className="window-top">
                <div className="window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="window-url">trackhire.app/dashboard</div>
                <div />
              </div>

              <div className="dashboard-preview">
                <aside className="preview-sidebar">
                  <div className="preview-logo">
                    <div>T</div>
                    TrackHire
                  </div>

                  <div className="preview-nav active">
                    <BarChart3 size={14} />
                    Overview
                  </div>
                  <div className="preview-nav">
                    <BriefcaseBusiness size={14} />
                    Applications
                  </div>
                  <div className="preview-nav">
                    <KanbanSquare size={14} />
                    Tracker
                  </div>
                  <div className="preview-nav">
                    <CalendarDays size={14} />
                    Calendar
                  </div>
                  <div className="preview-nav">
                    <BarChart3 size={14} />
                    Analytics
                  </div>
                </aside>

                <div className="preview-main">
                  <div className="preview-header">
                    <div>
                      <div className="preview-small">THURSDAY, AUGUST 7</div>
                      <h3>Good morning, Payal.</h3>
                      <p>Here's what's happening with your job search.</p>
                    </div>
                    <button type="button" className="preview-add">
                      + Add application
                    </button>
                  </div>

                  <div className="preview-stats">
                    <div>
                      <span>Total applications</span>
                      <strong>24</strong>
                      <small>↑ 18% this month</small>
                    </div>
                    <div>
                      <span>In progress</span>
                      <strong>12</strong>
                      <small>Active opportunities</small>
                    </div>
                    <div>
                      <span>Interviews</span>
                      <strong>5</strong>
                      <small>2 this week</small>
                    </div>
                    <div>
                      <span>Offers</span>
                      <strong>2</strong>
                      <small>8.3% offer rate</small>
                    </div>
                  </div>

                  <div className="preview-grid">
                    <div className="preview-card pipeline-card">
                      <div className="preview-card-title">
                        <div>
                          <strong>Application pipeline</strong>
                          <span>Current progress</span>
                        </div>
                        <span className="view-all">View all</span>
                      </div>

                      <div className="pipeline">
                        <div>
                          <span>Wishlist</span>
                          <b>5</b>
                          <em style={{ width: "58%" }} />
                        </div>
                        <div>
                          <span>Applied</span>
                          <b>8</b>
                          <em style={{ width: "82%" }} />
                        </div>
                        <div>
                          <span>Screening</span>
                          <b>4</b>
                          <em style={{ width: "42%" }} />
                        </div>
                        <div>
                          <span>OA</span>
                          <b>3</b>
                          <em style={{ width: "32%" }} />
                        </div>
                        <div>
                          <span>Interview</span>
                          <b>2</b>
                          <em style={{ width: "22%" }} />
                        </div>
                        <div>
                          <span>Offer</span>
                          <b>2</b>
                          <em style={{ width: "22%" }} />
                        </div>
                      </div>
                    </div>

                    <div className="preview-card reminder-card">
                      <div className="preview-card-title">
                        <div>
                          <strong>Upcoming</strong>
                          <span>Next 7 days</span>
                        </div>
                        <CalendarDays size={16} />
                      </div>

                      <div className="preview-reminder">
                        <div className="reminder-date">
                          <b>08</b>
                          <span>Aug</span>
                        </div>
                        <div>
                          <strong>Google OA</strong>
                          <span>Online Assessment</span>
                        </div>
                      </div>
                      <div className="preview-reminder">
                        <div className="reminder-date">
                          <b>10</b>
                          <span>Aug</span>
                        </div>
                        <div>
                          <strong>Microsoft</strong>
                          <span>Interview · Round 1</span>
                        </div>
                      </div>
                      <div className="preview-reminder">
                        <div className="reminder-date">
                          <b>12</b>
                          <span>Aug</span>
                        </div>
                        <div>
                          <strong>Amazon</strong>
                          <span>Follow-up</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <p>Everything you need to stay on top of your applications</p>
          <div className="trust-items">
            <span>APPLICATIONS</span>
            <span>INTERVIEWS</span>
            <span>DEADLINES</span>
            <span>FOLLOW-UPS</span>
            <span>PROGRESS</span>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-label">FEATURES</span>
            <h2>
              Your entire job search.
              <br />
              <span>One organized place.</span>
            </h2>
            <p>
              TrackHire replaces scattered spreadsheets, browser tabs, notes and
              reminders with one focused workspace.
            </p>
          </div>

          <div className="feature-grid">
            <Feature
              icon={<KanbanSquare />}
              title="Visual application pipeline"
              text="Move applications through Wishlist, Applied, Screening, OA, Interviews and Offers with a clear visual workflow."
            />
            <Feature
              icon={<CalendarDays />}
              title="Never miss a deadline"
              text="Keep assessments, interviews, follow-ups and application deadlines organized in one calendar."
            />
            <Feature
              icon={<BarChart3 />}
              title="Understand your progress"
              text="See your application volume, conversion rates, interview progress and offer rate at a glance."
            />
            <Feature
              icon={<Bell />}
              title="Smart reminders"
              text="Know exactly what needs your attention next without keeping another list in your head."
            />
            <Feature
              icon={<Search />}
              title="Keep every detail"
              text="Store job descriptions, links, salary information, notes, sources and application history together."
            />
            <Feature
              icon={<Sparkles />}
              title="AI-ready workspace"
              text="Built with a foundation for intelligent job analysis and personalized insights."
            />
          </div>
        </section>

        <section className="workflow-section" id="how-it-works">
          <div className="workflow-intro">
            <span className="section-label">HOW IT WORKS</span>
            <h2>
              From application
              <br />
              <span>to offer.</span>
            </h2>
            <p>
              A simple workflow designed around the way a real job search
              actually works.
            </p>
            <Link to="/auth" className="text-link">
              Start your journey <ArrowRight size={16} />
            </Link>
          </div>

          <div className="workflow-steps">
            <Step
              number="01"
              title="Add an opportunity"
              text="Save a job in seconds with the company, role, link, deadline and anything else you want to remember."
            />
            <Step
              number="02"
              title="Move through the process"
              text="Keep every opportunity moving through your own application pipeline."
            />
            <Step
              number="03"
              title="Stay ahead"
              text="Use reminders and your calendar to know what needs your attention next."
            />
            <Step
              number="04"
              title="See the bigger picture"
              text="Understand your progress and identify what's working in your job search."
            />
          </div>
        </section>

        <section className="highlight-section">
          <div className="highlight-image">
            <div className="analytics-mock">
              <div className="analytics-top">
                <div>
                  <span>JOB SEARCH OVERVIEW</span>
                  <h3>Your progress</h3>
                </div>
                <span className="period">Last 6 months</span>
              </div>
              <div className="analytics-number">
                <strong>24</strong>
                <span>applications</span>
              </div>
              <div className="chart">
                <div className="chart-line line-one" />
                <div className="chart-line line-two" />
                <div className="chart-bars">
                  <i style={{ height: "30%" }} />
                  <i style={{ height: "48%" }} />
                  <i style={{ height: "40%" }} />
                  <i style={{ height: "66%" }} />
                  <i style={{ height: "54%" }} />
                  <i style={{ height: "82%" }} />
                  <i style={{ height: "72%" }} />
                  <i style={{ height: "94%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="highlight-content">
            <span className="section-label">CLARITY OVER CHAOS</span>
            <h2>
              Stop wondering
              <br />
              <span>where you stand.</span>
            </h2>
            <p>
              Job hunting can quickly become overwhelming. Twenty tabs, five
              spreadsheets and dozens of applications later, it's easy to lose
              track.
            </p>
            <ul>
              <li>
                <Check size={17} />
                Know exactly where every application stands
              </li>
              <li>
                <Check size={17} />
                See what needs your attention today
              </li>
              <li>
                <Check size={17} />
                Measure your progress over time
              </li>
              <li>
                <Check size={17} />
                Keep your job search in one place
              </li>
            </ul>
          </div>
        </section>

        <section className="reviews-section" id="reviews">
          <div className="section-heading centered">
            <span className="section-label">EARLY FEEDBACK</span>
            <h2>
              Built for the
              <br />
              <span>job-search grind.</span>
            </h2>
            <p>A few words from the people TrackHire is designed for.</p>
          </div>

          <div className="review-grid">
            <Review
              text="I stopped maintaining three different spreadsheets for my applications. Having everything in one pipeline makes the whole process feel much less chaotic."
              name="Computer Science Student"
              role="Internship applicant"
            />
            <Review
              text="The biggest difference is knowing what I need to do next. Deadlines and interviews don't disappear into a pile of browser tabs anymore."
              name="Software Engineering Candidate"
              role="New graduate"
            />
            <Review
              text="I like being able to look at my entire search at once. It makes it much easier to understand which applications are actually moving forward."
              name="Product & Analytics Candidate"
              role="Job seeker"
            />
          </div>

          <p className="review-disclaimer">
            Illustrative early-user feedback shown for the product concept.
          </p>
        </section>

        <section className="cta-section">
          <div className="cta-inner">
            <div className="cta-icon">
              <Sparkles size={22} />
            </div>
            <span className="section-label">READY WHEN YOU ARE</span>
            <h2>
              Your next opportunity
              <br />
              starts with <span>being organized.</span>
            </h2>
            <p>
              Stop losing track of opportunities. Start building a job search
              you can actually manage.
            </p>
            <button
              type="button"
              className="hero-primary"
              onClick={handleGetStarted}
            >
              Start tracking for free
              <ArrowRight size={18} />
            </button>
            <div className="cta-note">
              <Check size={14} />
              Free to get started
              <span />
              <ShieldCheck size={14} />
              Your data stays yours
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer" id="about">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <div className="brand-mark">T</div>
              <span>TrackHire</span>
            </Link>
            <p>A calmer, smarter way to manage your job search.</p>
          </div>

          <div className="footer-column">
            <strong>Product</strong>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <Link to="/auth">Get started</Link>
          </div>

          <div className="footer-column">
            <strong>Track</strong>
            <Link to="/dashboard/applications">Applications</Link>
            <Link to="/dashboard/calendar">Calendar</Link>
            <Link to="/dashboard/analytics">Analytics</Link>
          </div>

          <div className="footer-column">
            <strong>Account</strong>
            <Link to="/auth">Sign in</Link>
            <Link to="/auth">Create account</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 TrackHire. Built for people building their careers.
          </span>
          <span>Made with ❤️.</span>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="feature-arrow">
        <ArrowRight size={16} />
      </div>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="workflow-step">
      <span className="step-number">{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Review({ text, name, role }) {
  return (
    <article className="review">
      <div className="stars">★★★★★</div>
      <p>"{text}"</p>
      <div className="review-person">
        <div className="avatar">{name.charAt(0)}</div>
        <div>
          <strong>{name}</strong>
          <span>{role}</span>
        </div>
      </div>
    </article>
  );
}
