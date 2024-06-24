import { Slot } from "expo-router";
import { DataProviderContext } from "../context/DataContext";
import { ThemeProvider, createTheme } from "@rneui/themed";

const theme = createTheme({
  lightColors: {
    primary: "purple",
    secondary: "red",
  },
  darkColors: {
    primary: "pink",
  },
  components: {
    Button: {
      raised: true,
    },
  },
});

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <DataProviderContext>
      <ThemeProvider theme={theme}>
        <Slot />
      </ThemeProvider>
    </DataProviderContext>
  );
}
