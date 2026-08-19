import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "danger" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-gray-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
