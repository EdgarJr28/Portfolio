export const WIN_FONT = "'Tahoma', 'Segoe UI', Verdana, sans-serif";
export const WIN_BODY_BG = "#ece9d8";

export interface MenuItem {
  type: "item" | "separator";
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export type MenuData = Record<string, MenuItem[]>;
