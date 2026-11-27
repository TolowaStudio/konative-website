"use client";

import React, { useState } from "react";
import { NewsletterConsentCheckbox } from "@/components/NewsletterConsentCheckbox";

interface NewsletterSignupProps {
  variant: "inline" | "banner" | "modal";
  source?: string;
}

export default function NewsletterSignup({
  variant,
  source,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, consent }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed!");
        setEmail("");
        setConsent(false);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };


  const consentBox = (
    <NewsletterConsentCheckbox
      className="newsletter-signup__consent"
      checked={consent}
      onChange={setConsent}
      style={{ marginTop: 8 }}
    />
  );

  if (variant === "banner") {
    return (
      <section className="newsletter-signup newsletter-signup--banner">
        <div className="newsletter-signup__banner-inner">
          <h2 className="newsletter-signup__heading">Stay ahead of the market</h2>
          <p className="newsletter-signup__subtext">
            Weekly intelligence on data center development, power markets, and
            investment flows.
          </p>
          {status === "success" ? (
            <p className="newsletter-signup__success">{message}</p>
          ) : (
            <form className="newsletter-signup__form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="newsletter-signup__input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {consentBox}
              <button
                type="submit"
                className="newsletter-signup__button newsletter-signup__button--banner"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="newsletter-signup__error">{message}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="newsletter-signup newsletter-signup--inline">
      {status === "success" ? (
        <p className="newsletter-signup__success">{message}</p>
      ) : (
        <form className="newsletter-signup__form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter-signup__input"
            placeholder="Enter your email for weekly intelligence"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="newsletter-signup__button"
            disabled={status === "loading"}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
          {consentBox}
        </form>
      )}
      {status === "error" && (
        <p className="newsletter-signup__error">{message}</p>
      )}
    </div>
  );
}
