import type { ReactNode } from "react";
import { analytics } from "../../lib/analytics"

type ButtonProps = {
  children: ReactNode,
  onClick?: () => void,
  type?: string,
  classes?: string,
  href?: string,
  trackLabel?: string,
  htmlType?: "button" | "submit" | "reset",
  disabled?: boolean,
}

const Button = ({ children, type = "primary", classes="", onClick, href, trackLabel, htmlType = "button", disabled = false }: ButtonProps) => {
  const handleClick = () => {
    if (disabled) {
      return
    }

    if (trackLabel) {
      analytics.trackEvent("Button Clicked", {
        label: trackLabel,
        href,
        buttonType: type,
      })
    }
    onClick?.()
  }

  let colorClasses = "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2";
  switch (type) {
    case "secondary":
      colorClasses = "border-primary/30 text-primary hover:bg-primary/5 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2";
      break;
    case "ghost":
      colorClasses = "border-transparent text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50";
      break;
    case "primary-inverted":
      colorClasses = "border-transparent bg-white text-primary hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary";
      break;
    case "secondary-inverted":
      colorClasses = "border-white/40 text-white hover:bg-white/10 hover:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/50";
      break;
    default:
      break;
  }

  const classNames = `py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border transition-colors ${disabled ? "cursor-not-allowed opacity-60" : ""} ${colorClasses} ${classes}`

  if (href && !disabled) {
    return (
      <a
        onClick={handleClick}
        className={classNames}
        href={href}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={htmlType}
      onClick={handleClick}
      className={classNames}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
