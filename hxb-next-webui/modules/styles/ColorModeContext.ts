import { createContext } from "react";

type TColorModeContext = {
  darkMode: boolean;
  setDarkMode: (newMode: boolean) => void;
};

const ColorModeContext = createContext<TColorModeContext>({
  darkMode: true,
  setDarkMode: () => null,
});

export default ColorModeContext;
