import React, { useState, useEffect } from 'react';
import useSocket from '../socket'; // Ensure the path is correct
import {
  Container,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatComponent = () => {
  const socket = useSocket('http://localhost:4000'); // Replace with your WebSocket server URL
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      // Listen for 'chat message' events from the server
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off('chat message');
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Chat Room
        </Typography>
        <Divider />
        <List sx={{ maxHeight: '300px', overflow: 'auto', marginBottom: 2 }}>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: 'flex-start',
                '&:nth-of-type(odd)': {
                  justifyContent: 'flex-end',
                },
              }}
            >
              <ListItemText
                primary={msg}
                sx={{
                  textAlign: 'left',
                  '&:nth-of-type(odd)': {
                    textAlign: 'right',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <IconButton color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatComponent;
