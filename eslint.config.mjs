import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Pre-existing any usage — downgrade to warn to unblock migration
      "@typescript-eslint/no-explicit-any": "warn",
      // New react-hooks rules not in old config — warn for now
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      // Style preference — off
      "react/no-unescaped-entities": "off",
      // New require rule — warn
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
];
