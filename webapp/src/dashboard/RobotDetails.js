// External Dependencies
import { useContext, useEffect, useState } from 'react';
import {
  Card,
  Typography
} from '@mui/material';
import { css, keyframes } from '@emotion/css';

// InternalDependencies
import DialogConfirmTaskOverride from './DialogConfirmTaskOverride';
import RobotDetailsToolbar from './RobotDetailsToolbar';
import RobotTaskHistory from './RobotTaskHistory';
import { postTask, stopTask, getTasksForBot } from '../api';
import { GlobalContext } from '../App';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(32px); 
  }
  to {
    opacity: 1;
  }
`;

const RobotDetails = (props) => {
  const { bot } = props;
  const { globalStore } = useContext(GlobalContext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const recentTask = tasks.length ? tasks[0] : null;

  // Load bot data
  useEffect(() => {
    getTasksForBot(globalStore.user, bot.id)
      .then(res => setTasks(res))
      .finally(() => setIsLoading(false));
  }, [bot]);

  const handleAssignTask = (task) => {
    postTask(globalStore.user, bot, task);
  }

  const handleUnassignTask = () => {
    stopTask(globalStore.user, bot, recentTask);
    setOpen(false);
  };


  return (
    <Card sx={{ p: 2 }} className={css`animation: ${fadeIn} .5s ease 1;`}>
      <RobotDetailsToolbar
        bot={bot}
        onAssign={handleAssignTask}
        onUnassign={() => setOpen(true)}
      />
      <Typography variant="subtitle1">History</Typography>
      <RobotTaskHistory
        bot={bot}
        isLoading={isLoading}
        tasks={tasks}
      />
      <DialogConfirmTaskOverride
        open={open}
        onConfirm={handleUnassignTask}
        onClose={() => setOpen(false)}
        botName={recentTask?.botName || ''}
        recentAssignee={recentTask?.userName || ''}
        recentTaskType={recentTask?.type || ''}
      />
    </Card>
  );
};

export default RobotDetails;
