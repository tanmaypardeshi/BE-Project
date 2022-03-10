import React from "react";
import KGQARoutes from "./components/KGQARoutes";
import { BrowserRouter } from "react-router-dom";
import {
  MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@material-ui/core";
import SnackbarProvider from 'react-simple-snackbar'

const lightPallete = {
  palette: {
    type: "light",
    primary: { main: '#6C63FF', light: '#FFBE36', contrastText: '#FFFFFF' },
    secondary: { main: '#193B55', light: '#69D2E7', contrastText: '#FFFFFF' },
    background: { paper: '#FCFCFC', default: '#F5F5DC' },
  },
};

function App() {

  const theme = React.useMemo(
    () => (createTheme(lightPallete)), []
  )

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <KGQARoutes />
        </SnackbarProvider>
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default App;
