// External Dependencies
import { useContext } from 'react';
import {
  Card,
  Typography
} from '@mui/material';

// InternalDependencies
import RobotDetailsToolbar from './RobotDetailsToolbar';
import { postTask } from '../api';
import { GlobalContext } from '../App';

const RobotDetails = (props) => {
  const { bot } = props;
  const { globalStore } = useContext(GlobalContext);

  const handleAssignTask = (task) => {
    postTask(globalStore.user, bot, task);
  }

  return (
    <Card sx={{ p: 2 }}>
      <RobotDetailsToolbar bot={bot} onAssign={handleAssignTask} />
      <Typography variant="subtitle1">History</Typography>
    </Card>
  );
};

export default RobotDetails;
