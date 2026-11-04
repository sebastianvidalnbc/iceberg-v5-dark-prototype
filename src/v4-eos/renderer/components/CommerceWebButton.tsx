import React from "react";

// Preview-local Commerce Web Button — a faithful reconstruction of the verified
// Streamly Commerce UI Kit "Web Button" (Buttons canvas 43240:4373):
//   WebButtonPrimary   59078:3556  — brand-gradient bg, #000 label   [VERIFIED]
//   WebButtonSecondary 59078:3568  — #323538 @64% + material blur     [VERIFIED]
//   WebButtonTertiary  59078:3585  — text button, #fff @ ~80% label   [VERIFIED]
//
// This is NOT an Eos/CMS component. It belongs to the customer-facing preview
// renderer ONLY, and renders a semantic <button>. Interaction states hover /
// active are CSS-driven (:hover / :active); Outline and Disabled are explicit.
//
// VERIFIED vs APPROX (styling in brand.css → ".pk-btn"):
//   [VERIFIED]  brand gradient, primary label #000, secondary fill #323538@64%,
//               tertiary label #fff@~80%, pill radius, uppercase Bold label,
//               compact label 10/16 (client/small/label/s uppercase, ls 0).
//   [APPROX]    per-size heights reuse the Commerce button set geometry
//               (Desktop 48 / Tablet-Mobile 40 / Compact 36) as the closest
//               verified measurement; horizontal padding, icon gap/size,
//               hover/active/outline tints and the desktop/tablet label sizes
//               are flagged approximations pending a per-size dev-mode inspect
//               of the current Web Button component.

export type CommerceButtonType = "primary" | "secondary" | "tertiary";
export type CommerceButtonSize = "compact" | "tablet-mobile" | "desktop";
export type CommerceButtonVariant = "default" | "outline";

export interface CommerceWebButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary | secondary | tertiary (verified Web Button types). */
  buttonType?: CommerceButtonType;
  /** compact | tablet-mobile | desktop (verified size variants). */
  size?: CommerceButtonSize;
  /** default | outline (State=Outline). Hover/Active are CSS-driven. */
  variant?: CommerceButtonVariant;
  /** Optional leading/trailing icon (Commerce icon vector). */
  icon?: React.ReactNode;
  iconPosition?: "leading" | "trailing";
  /** Full-width (used by the product-card CTA). */
  block?: boolean;
  /** Optional destination. When set, the CTA renders as a semantic <a> so the
   *  authored "Primary CTA HREF" is honoured (announced by assistive tech). */
  href?: string;
}

export function CommerceWebButton({
  buttonType = "primary",
  size = "desktop",
  variant = "default",
  icon,
  iconPosition = "leading",
  block = false,
  className,
  children,
  type = "button",
  href,
  ...rest
}: CommerceWebButtonProps) {
  const classes = [
    "pk-btn",
    `pk-btn--${buttonType}`,
    `pk-btn--${size}`,
    variant === "outline" ? "pk-btn--outline" : null,
    block ? "pk-btn--block" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {icon && iconPosition === "leading" ? (
        <span className="pk-btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children ? <span className="pk-btn__label">{children}</span> : null}
      {icon && iconPosition === "trailing" ? (
        <span className="pk-btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  );

  // With an href, render an anchor so the authored destination is real markup.
  // Navigation is suppressed inside the preview iframe so a click never carries
  // the author away from what they're building.
  if (href) {
    return (
      <a
        className={classes}
        href={href}
        onClick={(e) => e.preventDefault()}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}
