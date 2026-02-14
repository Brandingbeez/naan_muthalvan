/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1890ff",
        secondary: "#096dd9",
        success: "#52c41a",
        warning: "#faad14",
        error: "#ff4d4f",
        info: "#1890ff",
        text: {
          primary: "rgba(0, 0, 0, 0.85)",
          secondary: "rgba(0, 0, 0, 0.45)",
          disabled: "rgba(0, 0, 0, 0.25)",
        },
      },
      spacing: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        lg: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      fontSize: {
        xs: ["12px", "18px"],
        sm: ["14px", "22px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "30px"],
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: false },
};
