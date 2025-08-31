// src/components/Button.tsx
import * as React from "react";

// src/utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/Button.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-dark-200 dark:text-gray-100 dark:hover:bg-dark-300",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-dark-200",
      destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700"
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-lg"
    };
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref,
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        ),
        disabled: loading || disabled,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "animate-spin -ml-1 mr-2 h-4 w-4",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              children: [
                /* @__PURE__ */ jsx(
                  "circle",
                  {
                    className: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    strokeWidth: "4"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    className: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  }
                )
              ]
            }
          ),
          children
        ]
      }
    );
  }
);
Button.displayName = "Button";

// src/components/Input.tsx
import * as React2 from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Input = React2.forwardRef(
  ({ className, label, error, helperText, icon, type = "text", ...props }, ref) => {
    const inputId = React2.useId();
    const baseStyles = "w-full px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-100 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const borderStyles = error ? "border-red-500 focus:ring-red-500 dark:border-red-400" : "border-gray-300 dark:border-dark-300 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400";
    return /* @__PURE__ */ jsxs2("div", { className: "w-full", children: [
      label && /* @__PURE__ */ jsx2(
        "label",
        {
          htmlFor: inputId,
          className: "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300",
          children: label
        }
      ),
      /* @__PURE__ */ jsxs2("div", { className: "relative", children: [
        icon && /* @__PURE__ */ jsx2("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400", children: icon }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            ref,
            id: inputId,
            type,
            className: cn(
              baseStyles,
              borderStyles,
              icon && "pl-10",
              className
            ),
            "aria-invalid": !!error,
            "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0,
            ...props
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx2("p", { id: `${inputId}-error`, className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error }),
      helperText && !error && /* @__PURE__ */ jsx2("p", { id: `${inputId}-helper`, className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: helperText })
    ] });
  }
);
Input.displayName = "Input";

// src/components/Card.tsx
import * as React3 from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var Card = React3.forwardRef(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const baseStyles = "bg-white dark:bg-dark-100 rounded-xl transition-all duration-200";
    const variants = {
      default: "shadow-sm",
      elevated: "shadow-lg",
      bordered: "border border-gray-200 dark:border-dark-300"
    };
    const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : "";
    return /* @__PURE__ */ jsx3(
      "div",
      {
        ref,
        className: cn(
          baseStyles,
          variants[variant],
          hoverStyles,
          className
        ),
        ...props,
        children
      }
    );
  }
);
Card.displayName = "Card";
var CardHeader = React3.forwardRef(
  ({ className, children, ...props }, ref) => {
    return /* @__PURE__ */ jsx3(
      "div",
      {
        ref,
        className: cn("px-6 py-4 border-b border-gray-200 dark:border-dark-300", className),
        ...props,
        children
      }
    );
  }
);
CardHeader.displayName = "CardHeader";
var CardBody = React3.forwardRef(
  ({ className, children, ...props }, ref) => {
    return /* @__PURE__ */ jsx3(
      "div",
      {
        ref,
        className: cn("px-6 py-4", className),
        ...props,
        children
      }
    );
  }
);
CardBody.displayName = "CardBody";
var CardFooter = React3.forwardRef(
  ({ className, children, ...props }, ref) => {
    return /* @__PURE__ */ jsx3(
      "div",
      {
        ref,
        className: cn("px-6 py-4 border-t border-gray-200 dark:border-dark-300", className),
        ...props,
        children
      }
    );
  }
);
CardFooter.displayName = "CardFooter";

// src/components/Modal.tsx
import * as React4 from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var Modal = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  closeOnBackdrop = true,
  closeOnEscape = true
}) => {
  const modalRef = React4.useRef(null);
  React4.useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);
  if (!isOpen) return null;
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  };
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in",
      onClick: handleBackdropClick,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": title ? "modal-title" : void 0,
      children: /* @__PURE__ */ jsxs3(
        "div",
        {
          ref: modalRef,
          className: cn(
            "w-full bg-white dark:bg-dark-100 rounded-xl shadow-2xl animate-slide-up",
            sizes[size]
          ),
          onClick: (e) => e.stopPropagation(),
          children: [
            title && /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-300", children: [
              /* @__PURE__ */ jsx4("h2", { id: "modal-title", className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: title }),
              /* @__PURE__ */ jsx4(
                "button",
                {
                  onClick: onClose,
                  className: "p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors",
                  "aria-label": "Close modal",
                  children: /* @__PURE__ */ jsx4(
                    "svg",
                    {
                      className: "w-6 h-6",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsx4(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M6 18L18 6M6 6l12 12"
                        }
                      )
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsx4("div", { className: "px-6 py-4 max-h-[70vh] overflow-y-auto", children })
          ]
        }
      )
    }
  );
};
Modal.displayName = "Modal";
var ModalFooter = ({ className, children, ...props }) => {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className: cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-dark-300",
        className
      ),
      ...props,
      children
    }
  );
};
ModalFooter.displayName = "ModalFooter";

// src/components/Toast.tsx
import * as React5 from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var Toast = ({
  id,
  type = "info",
  title,
  message,
  duration = 5e3,
  onClose
}) => {
  const [progress, setProgress] = React5.useState(100);
  const [isExiting, setIsExiting] = React5.useState(false);
  React5.useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            handleClose();
            return 0;
          }
          return prev - 100 / (duration / 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [duration]);
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };
  const icons = {
    success: /* @__PURE__ */ jsx5("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx5("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
    error: /* @__PURE__ */ jsx5("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx5("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }),
    warning: /* @__PURE__ */ jsx5("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx5("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
    info: /* @__PURE__ */ jsx5("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx5("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) })
  };
  const colors = {
    success: "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    info: "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
  };
  const progressColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      className: cn(
        "relative w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300",
        colors[type],
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      ),
      role: "alert",
      children: [
        /* @__PURE__ */ jsx5("div", { className: "p-4", children: /* @__PURE__ */ jsxs4("div", { className: "flex items-start", children: [
          /* @__PURE__ */ jsx5("div", { className: "flex-shrink-0", children: icons[type] }),
          /* @__PURE__ */ jsxs4("div", { className: "ml-3 flex-1", children: [
            /* @__PURE__ */ jsx5("p", { className: "text-sm font-medium", children: title }),
            message && /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm opacity-90", children: message })
          ] }),
          /* @__PURE__ */ jsx5(
            "button",
            {
              onClick: handleClose,
              className: "ml-4 inline-flex text-current opacity-70 hover:opacity-100 transition-opacity",
              "aria-label": "Close",
              children: /* @__PURE__ */ jsx5("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx5("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
            }
          )
        ] }) }),
        duration > 0 && /* @__PURE__ */ jsx5("div", { className: "absolute bottom-0 left-0 w-full h-1 bg-black/10 dark:bg-white/10", children: /* @__PURE__ */ jsx5(
          "div",
          {
            className: cn("h-full transition-all duration-100", progressColors[type]),
            style: { width: `${progress}%` }
          }
        ) })
      ]
    }
  );
};
Toast.displayName = "Toast";
var ToastContainer = ({
  toasts,
  position = "top-right"
}) => {
  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4"
  };
  return /* @__PURE__ */ jsx5("div", { className: cn("fixed z-50 flex flex-col gap-3", positions[position]), children: toasts.map((toast) => /* @__PURE__ */ jsx5(Toast, { ...toast }, toast.id)) });
};
ToastContainer.displayName = "ToastContainer";
export {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Modal,
  ModalFooter,
  Toast,
  ToastContainer,
  cn
};
//# sourceMappingURL=index.mjs.map