import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, Button, List, ListItem } from '@mui/material';
import Activities from './components/Activities';
import Signup from './components/signup';
import Login from './components/login';
import ChatComponent from './components/chat';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#dc004e', // Custom secondary color
    },
  },
  typography: {
    h2: {
      fontSize: 30,
      marginBottom: 20,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/activities">Activities</Button>
            <Button color="inherit" component={Link} to="/chat">ChatComponent</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/chat" element={<ChatComponent />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}


export default App;
