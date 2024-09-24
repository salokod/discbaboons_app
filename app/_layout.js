import { Slot } from 'expo-router';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { SnackBarProvider } from 'react-native-snackbar-hook';
import { DataProviderContext } from '../context/DataContext';

const theme = createTheme({
  lightColors: {
    primary: '#36399a',
    secondary: 'red',
    font: 'black',
    primaryButton: '#36399a',
    secondaryButton: '#ed008c',
    mainScreenBackground: '#eaeaea',
    topBarBackground: '#d2d2d2',
  },
  darkColors: {
    primary: '#36399a',
    font: 'white',
    primaryButton: '#36399a',
    secondaryButton: '#ed008c',
    mainScreenBackground: '#505050',
    topBarBackground: '#414141',
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
        <SnackBarProvider success={{ color: '#ed008c', duration: 2500 }} error={{ autoHide: true }} info={{ color: '#36399a' }}>
          <Slot />
        </SnackBarProvider>
      </ThemeProvider>
    </DataProviderContext>
  );
}
