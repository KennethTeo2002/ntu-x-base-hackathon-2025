import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      500: "#477DFE", // Your custom color
    },
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
});

export default theme;
