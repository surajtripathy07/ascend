import React from 'react';
import { TodoProvider } from './context/TodoContext';
import SwimLanes from './components/SwimLanes';
import { Container, Typography } from '@mui/material';

function App() {
  return (
    <TodoProvider>
      <Container>
        <Typography variant="h4" gutterBottom>
          Ascend
        </Typography>
        <SwimLanes />
      </Container>
    </TodoProvider>
  );
}

export default App;

