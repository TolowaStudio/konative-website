"use client";

import Link from "next/link";
import { CONSENT_WORDING } from "@/lib/newsletter/consent";

type NewsletterConsentCheckboxProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  linkStyle?: React.CSSProperties;
};

export function NewsletterConsentCheckbox({
  checked,
  onChange,
  className,
  style,
  labelStyle,
  linkStyle,
}: NewsletterConsentCheckboxProps) {
  const [before, after] = CONSENT_WORDING.split("Privacy Policy");
  return (
    <label
      className={className}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        fontSize: 12,
        lineHeight: 1.5,
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        style={{ marginTop: 3, flexShrink: 0 }}
      />
      <span style={labelStyle}>
        {before}
        <Link href="/privacy" style={linkStyle}>
          Privacy Policy
        </Link>
        {after}
      </span>
    </label>
  );
}