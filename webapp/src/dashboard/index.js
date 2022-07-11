// External Dependencies
import {
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { css, keyframes } from '@emotion/css';
import React, { useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';

// Internal Dependencies
import { getBots } from '../api';
import { GlobalContext } from '../App';
import { useEffect } from 'react';
import RobotDetails from './RobotDetails';
import RobotTable from './RobotTable';

const errorMessage = 'Error loading robots. Please try again later';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(32px); 
  }
  to {
    opacity: 1;
  }
`;

const Dashboard = () => {
  const [bots, setBots] = useState({});
  const [currentBot, setCurrentBot] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { globalStore: { user, socket } } = useContext(GlobalContext);
  const theme = useTheme();

  // Updates state with latest changes to bot when its task updates 
  const refresh = updatedBot => {
    setBots({ ...bots, [updatedBot.id]: updatedBot });
    if (currentBot?.id === updatedBot.id) {
      setCurrentBot(updatedBot);
    }
  };

  const updateTaskProgress = (task, newProgress) => {
    console.log('task', task);
    
    // console.log(`${task.id} progress ${newProgress}`);

    const updatedBot = {
      ...bots[task.botId],
      progress: newProgress,
      status: newProgress >= 100 ? 'idle' : 'busy'
    };
  
    setBots({
      ...bots,
      [task.botId]: updatedBot
    });

    if (task.botId === currentBot?.id) {
      setCurrentBot(updatedBot);
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('task_created', refresh);
    socket.on('task_stopped', refresh);
    socket.on('task_progress_update', updateTaskProgress);
  }, [socket, bots, currentBot]);
  
  useEffect(() => {
    if (!user) {
      return;
    }

    getBots(user)
      .then(res => {
        setBots(res);
      })
      .catch(err => {
        console.log('err', err);
        setApiError(errorMessage)
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="body2">Loading robots...</Typography>
      </Container>
    );
  }

  if (apiError) {
    return (
      <Container>
        <Typography variant="subtitle1" sx={{ color: theme.palette.error.main }}>
					{apiError}
				</Typography>
      </Container>
    );
  }

  const handleSelect = newBot => {
    if (newBot.name !== currentBot?.name) {
      setCurrentBot(newBot);
    }
  };

  return (
    <Container className={css`animation: ${fadeIn} .75s ease 1;`}>
      <RobotTable
        bots={bots}
        currentSelection={currentBot?.name}
        onSelect={handleSelect}
        sx={{ mb: 6, mt: 12 }}
      />
      {currentBot && <RobotDetails bot={currentBot} />}
    </Container>
  );
}

export default Dashboard;
