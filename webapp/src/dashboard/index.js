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
  const [bots, setBots] = useState({ all: {}, current: null });
  // const [currentBot, setCurrentBot] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { globalStore: { user, socket } } = useContext(GlobalContext);
  const theme = useTheme();

  // Updates state with latest changes to bot when it's task updates 
  const refresh = updatedBot => {
    const newBots = { 
      all: { ...bots.all, [updatedBot.id]: updatedBot },
      current: bots.current
    };

    if (bots.current?.id === updatedBot.id) {
      newBots.current = updatedBot;
    }

    setBots(newBots);
  };

  const updateTaskProgress = (task, newProgress) => {
    const updatedBot = {
      ...bots.all[task.botId],
      progress: newProgress,
      status: newProgress >= 100 ? 'idle' : 'busy'
    };
  
    const newBots = {
      all: {
        ...bots.all,
        [task.botId]: updatedBot
      },
      current: bots.current
    };

    if (task.botId === bots.current?.id) {
      newBots.current = updatedBot;
    }

    setBots(newBots);
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('task_created', updatedBot => refresh(updatedBot));
    socket.on('task_stopped', updatedBot => refresh(updatedBot));
    socket.on('task_progress_update', (task, newProgress) => {
      updateTaskProgress(task, newProgress);
    });
  }, [socket, bots.all, bots.current]);
  
  useEffect(() => {
    if (!user) {
      return;
    }

    getBots(user)
      .then(res => {
        setBots({ all: res, current: bots.current });
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
    if (newBot.name !== bots.current?.name) {
      setBots({ all: bots.all, current: newBot });
    }
  };

  return (
    <Container className={css`animation: ${fadeIn} .75s ease 1;`}>
      <RobotTable
        bots={bots.all}
        currentSelection={bots.current?.name}
        onSelect={handleSelect}
        sx={{ mb: 6, mt: 12 }}
      />
      {bots.current && <RobotDetails bot={bots.current} />}
    </Container>
  );
}

export default Dashboard;
