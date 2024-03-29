import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { createTheme } from "@material-ui/core";

const palette: PaletteOptions = {
  type: "dark",
  primary: {
    main: "#FFCD00",
    contrastText: "#242526",
  },
  background: {
    default: "#242526",
  },
};

export const theme = createTheme({
  palette,
});
