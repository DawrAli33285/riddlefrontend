import { useState, useEffect, useRef } from "react";
import { Compass, Lock, Shield, Zap } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../baseurl";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";

const C = "#00a2ce";
const CGLOW = "rgba(0,162,206,0.5)";

const TERMINAL_LINES = [
  { text: "> loading_missions.exe ..........", suffix: " OK", delay: 0 },
  { text: "> encrypting_codes ...............", suffix: " OK", delay: 800 },
  { text: "> awaiting_operative .............", suffix: " █", delay: 1600 },
];

function TerminalWidget() {
  const [visibleLines, setVisibleLines] = useState(0);
  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay + 400);
    });
  }, []);

  return (
    <div
      className="glass glow-border scanline"
      style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(0,162,206,0.2)",
          background: "rgba(0,0,0,0.3)",
          flexWrap: "wrap",
          gap: 6,
        }}
      ></div>
      <div
        style={{
          background: "rgba(240,245,250,0.95)",
          margin: 16,
          borderRadius: 8,
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 4C20.95 4 12 12.95 12 24c0 16 20 36 20 36s20-20 20-36C52 12.95 43.05 4 32 4z"
            fill="#1a3a5c"
          />
          <circle cx="32" cy="24" r="10" fill="white" />
          <circle cx="32" cy="24" r="6" fill="#1a3a5c" />
          <path d="M26 24 Q32 18 38 24" stroke="#1a3a5c" strokeWidth="1.5" fill="none" />
          <line x1="32" y1="18" x2="32" y2="14" stroke="#1a3a5c" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ color: "#1a3a5c", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 18, letterSpacing: "2px" }}>
          SpotHunt
        </span>
        <span style={{ color: "rgba(26,58,92,0.55)", fontSize: 11, letterSpacing: "2px" }}>
          Explore. Discover. Play.
        </span>
      </div>
    </div>
  );
}

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "PAY & DEPLOY",
    desc: "One entry fee. Instant access to all five mission briefings. No waiting, no delays.",
  },
  {
    num: "02",
    title: "DECODE & TRAVEL",
    desc: "Read the riddle, find the real-world location, recover the secret code hidden at the spot.",
  },
  {
    num: "03",
    title: "CRACK THE CODE",
    desc: "Each spot hides a secret. Type it in to unlock the next mission and advance your rank.",
  },
];

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(0,162,206,0.07)",
  border: `1px solid rgba(0,162,206,0.35)`,
  borderRadius: 6,
  color: "#fff",
  fontSize: 12,
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: "1px",
  outline: "none",
  boxSizing: "border-box",
};

const RESPONSIVE_CSS = `
  .sh-hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }
  .sh-steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 96px;
  }
  .sh-hero-title { font-size: 56px; }
  .sh-features-row { display: flex; gap: 12px; }
  .sh-terminal-wrap { display: block; }
  @media (max-width: 768px) {
    .sh-hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .sh-steps-grid { grid-template-columns: 1fr; margin-top: 56px; gap: 12px; }
    .sh-hero-title { font-size: 36px; }
    .sh-features-row { flex-wrap: wrap; }
    .sh-features-row > * { flex: 1 1 calc(33% - 8px); min-width: 80px; }
    .sh-nav-inner { padding: 12px 16px !important; }
    .sh-page-wrap { padding: 48px 16px !important; }
  }
  @media (max-width: 400px) {
    .sh-hero-title { font-size: 28px; }
  }
`;

export default function LandingPage({
  totalMissionLoading,
  unlocked,
  onJoin,
  onResume,
  totalMissions = 5,
}) {
  const FEATURES = [
    { icon: Compass, label: `${totalMissionLoading ? "...." : totalMissions} SPOTS` },
    { icon: Lock, label: "SECRET CODES" },
    { icon: Shield, label: "1 WINNER MINDSET" },
  ];

  const [paying, setPaying] = useState(false);
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [cardError, setCardError] = useState("");
  const [pendingToken, setPendingToken] = useState(null);

  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canUseWalletPay, setCanUseWalletPay] = useState(false);

  const pendingTokenRef = useRef(null);
  useEffect(() => {
    pendingTokenRef.current = pendingToken;
  }, [pendingToken]);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const id = "sh-responsive-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = RESPONSIVE_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    console.log("[SpotHunt] stripe instance ready?", !!stripe);
    if (!stripe) return;

    console.log("[SpotHunt] Creating paymentRequest...");
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "SpotHunt Challenge Entry",
        amount: 900,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      // result is null if nothing is available.
      // result can be: { applePay: true }, { googlePay: true }, { link: true }, or combinations.
      console.log("[SpotHunt] canMakePayment() result:", result);
      console.log("[SpotHunt] Browser:", navigator.userAgent);
      console.log("[SpotHunt] Protocol:", window.location.protocol);

      if (!result) {
        console.warn(
          "[SpotHunt] ❌ No wallet available. Reasons could be:\n" +
          "  • Not on HTTPS (current: " + window.location.protocol + ")\n" +
          "  • Apple Pay: domain not registered in Stripe Dashboard\n" +
          "  • Apple Pay: not on Safari with a card in Apple Wallet\n" +
          "  • Google Pay: not on Chrome with a saved card in Google account"
        );
        return;
      }

      if (result.applePay) {
        console.log("[SpotHunt] ✅ Apple Pay is available");
      }
      if (result.googlePay) {
        console.log("[SpotHunt] ✅ Google Pay is available");
      }
      if (result.link) {
        console.log("[SpotHunt] ℹ️ Stripe Link is available (not shown — Link-only renders blank button)");
      }

      if (result.applePay || result.googlePay) {
        console.log("[SpotHunt] ✅ Showing wallet button");
        setPaymentRequest(pr);
        setCanUseWalletPay(true);
      } else {
        console.warn("[SpotHunt] ❌ Only Stripe Link detected — hiding wallet button");
      }
    });

    pr.on("paymentmethod", async (ev) => {
      console.log("[SpotHunt] paymentmethod event fired, type:", ev.paymentMethod.type);
      const token = pendingTokenRef.current;
      if (!token) {
        console.error("[SpotHunt] No pendingToken — cannot complete payment");
        ev.complete("fail");
        return;
      }
      setPaying(true);
      setCardError("");

      try {
        await axios.post(
          `${BASE_URL}/user/pay`,
          { payment_method_id: ev.paymentMethod.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        ev.complete("success");
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("auth-changed"));
        setPaying(false);
        setShowPayModal(false);
        onJoin();
      } catch (err) {
        console.error("[SpotHunt] Payment error:", err.response?.data || err.message);
        ev.complete("fail");
        setCardError(err.response?.data?.error || "Payment failed, please try again");
        setPaying(false);
      }
    });

    return () => {
      pr.off("paymentmethod");
    };
  }, [stripe]);

  const handleJoin = async () => {
    if (!email.trim() || !teamName.trim()) return;
    setPaying(true);
    setCardError("");

    try {
      const authRes = await axios.post(`${BASE_URL}/user/auth`, {
        email,
        team_name: teamName,
      });

      const { token, game_unlocked } = authRes.data;

      if (game_unlocked) {
        localStorage.setItem("token", token);
        window.dispatchEvent(new Event("auth-changed"));
        setPaying(false);
        onJoin();
      } else {
        setPendingToken(token);
        setPaying(false);
        setShowPayModal(true);
      }
    } catch (err) {
      setCardError(err.response?.data?.error || "Something went wrong");
      setPaying(false);
    }
  };

  const handlePay = async () => {
    if (!stripe || !elements || !pendingToken) return;
    setPaying(true);
    setCardError("");

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: { email },
    });

    if (error) {
      setCardError(error.message);
      setPaying(false);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/user/pay`,
        { payment_method_id: paymentMethod.id },
        { headers: { Authorization: `Bearer ${pendingToken}` } }
      );

      localStorage.setItem("token", pendingToken);
      window.dispatchEvent(new Event("auth-changed"));
      setPaying(false);
      setShowPayModal(false);
      onJoin();
    } catch (err) {
      setCardError(err.response?.data?.error || "Payment failed, please try again");
      setPaying(false);
    }
  };

  const CARD_STYLE = {
    style: {
      base: {
        color: "#fff",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "13px",
        letterSpacing: "1px",
        "::placeholder": { color: "#64748b" },
      },
      invalid: { color: "#f87171" },
    },
  };

  const PAYMENT_REQUEST_BUTTON_STYLE = {
    paymentRequestButton: {
      type: "default",
      theme: "dark",
      height: "48px",
    },
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <nav
        className="glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
        }}
      >
        <div
          className="sh-nav-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "rgba(255,255,255,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
                <path
                  d="M32 4C20.95 4 12 12.95 12 24c0 16 20 36 20 36s20-20 20-36C52 12.95 43.05 4 32 4z"
                  fill="#1a3a5c"
                />
                <circle cx="32" cy="24" r="10" fill="white" />
                <circle cx="32" cy="24" r="6" fill="#1a3a5c" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: C, letterSpacing: "3px" }}>
                SPOTHUNT
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                THE CHALLENGE
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a
              href="#home"
              style={{
                fontSize: 11,
                letterSpacing: "2px",
                color: C,
                fontFamily: "'JetBrains Mono', monospace",
                textDecoration: "none",
                fontWeight: 700,
                textShadow: `0 0 10px ${CGLOW}`,
              }}
            >
              HOME
            </a>
            {unlocked && (
              <button
                onClick={onResume}
                style={{
                  fontSize: 11,
                  letterSpacing: "2px",
                  color: "#64748b",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                PLAY
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div
        className="sh-page-wrap"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}
      >
        <div className="sh-hero-grid">
          <div className="animate-slide-up">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: `1px solid rgba(0,162,206,0.4)`,
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 24,
              }}
            >
              <Zap size={12} color={C} />
              <span style={{ fontSize: 11, color: C, letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                LIVE OPERATION
              </span>
            </div>

            <div style={{ marginBottom: 24 }}>
              {["SPOTHUNT", "THE", "CHALLENGE"].map((word, i) => (
                <div
                  key={word}
                  className="sh-hero-title"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "2px",
                    color: i === 0 ? C : "#fff",
                    textShadow: i === 0 ? `0 0 20px ${CGLOW}` : undefined,
                  }}
                >
                  {word}
                </div>
              ))}
            </div>

            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, maxWidth: 420, marginBottom: 32, fontFamily: "'JetBrains Mono', monospace" }}>
              Five cryptic missions. Five hidden spots in the real world. Decode
              the riddle, find the location, recover the secret code. Only the
              sharpest reach the final spot.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {!unlocked ? (
                <>
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                  {email.trim() && (
                    <input
                      type="text"
                      placeholder="ENTER YOUR TEAM NAME"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      style={inputStyle}
                    />
                  )}
                  {email.trim() && teamName.trim() && (
                    <button
                      onClick={handleJoin}
                      disabled={paying}
                      className="animate-pulse-glow"
                      style={{
                        padding: "14px 28px",
                        background: C,
                        color: "#0a1628",
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: "2px",
                        border: "none",
                        borderRadius: 6,
                        cursor: paying ? "not-allowed" : "pointer",
                        fontFamily: "'Orbitron', sans-serif",
                        opacity: paying ? 0.7 : 1,
                        width: "100%",
                      }}
                    >
                      {paying ? "PROCESSING..." : "JOIN THE HUNT — $9"}
                    </button>
                  )}
                </>
              ) : (
                <button
                  className="animate-pulse-glow"
                  onClick={onResume}
                  style={{
                    padding: "14px 28px",
                    background: C,
                    color: "#0a1628",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "2px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "'Orbitron', sans-serif",
                    width: "100%",
                  }}
                >
                  RESUME MISSION
                </button>
              )}
            </div>

            <div className="sh-features-row">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass"
                  style={{
                    borderRadius: 8,
                    padding: "12px 8px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    animation: "capsuleGlow 2s ease-in-out infinite",
                    minWidth: 0,
                  }}
                >
                  <Icon size={16} color={C} />
                  <span style={{ fontSize: 9, letterSpacing: "1.5px", color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textAlign: "center", wordBreak: "break-word" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sh-terminal-wrap animate-fade-in">
            <TerminalWidget />
          </div>
        </div>

        <div className="sh-steps-grid">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.num} className="glass" style={{ borderRadius: 12, padding: 24 }}>
              <div
                className="animate-num-glow"
                style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 32, fontWeight: 900, color: C, textShadow: `0 0 12px ${CGLOW}`, marginBottom: 12 }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "1px", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                {s.title}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PAY MODAL ── */}
      {showPayModal && (
        <div
          onClick={() => setShowPayModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass"
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 16,
              padding: "28px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              boxSizing: "border-box",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: C, letterSpacing: "2px", marginBottom: 4 }}>
                JOIN THE HUNT
              </div>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px" }}>
                ONE-TIME ENTRY — $9
              </div>
            </div>

            <div
              style={{
                background: "rgba(0,162,206,0.07)",
                border: "1px solid rgba(0,162,206,0.2)",
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  SPOTHUNT CHALLENGE
                </div>
                <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {totalMissions} MISSIONS · TEAM: {teamName || "—"}
                </div>
              </div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900, color: C, flexShrink: 0 }}>
                $9
              </div>
            </div>

            {canUseWalletPay && paymentRequest && (
              <div>
                <div style={{ minHeight: 48 }}>
                  <PaymentRequestButtonElement
                    options={{
                      paymentRequest,
                      style: PAYMENT_REQUEST_BUTTON_STYLE,
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                  <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px" }}>
                    OR PAY WITH CARD
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px", marginBottom: 8 }}>
                CARD DETAILS
              </div>
              <div
                style={{
                  background: "rgba(0,162,206,0.07)",
                  border: "1px solid rgba(0,162,206,0.35)",
                  borderRadius: 6,
                  padding: "14px 16px",
                }}
              >
                <CardElement options={CARD_STYLE} />
              </div>
              {cardError && (
                <div style={{ fontSize: 11, color: "#f87171", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>
                  {cardError}
                </div>
              )}
            </div>

            <button
              onClick={handlePay}
              disabled={paying || !stripe}
              className="animate-pulse-glow"
              style={{
                padding: "14px",
                background: C,
                color: "#0a1628",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "2px",
                border: "none",
                borderRadius: 6,
                cursor: paying ? "not-allowed" : "pointer",
                fontFamily: "'Orbitron', sans-serif",
                opacity: paying ? 0.7 : 1,
                width: "100%",
              }}
            >
              {paying ? "PROCESSING..." : "PAY NOW — $9"}
            </button>

            <button
              onClick={() => setShowPayModal(false)}
              style={{
                fontSize: 11,
                color: "#64748b",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "1px",
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}