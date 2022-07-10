// External Dependencies
import { useContext } from 'react';
import {
  Card,
  Typography
} from '@mui/material';

// InternalDependencies
import RobotDetailsToolbar from './RobotDetailsToolbar';
import RobotTaskHistory from './RobotTaskHistory';
import { postTask, stopTask } from '../api';
import { GlobalContext } from '../App';

const RobotDetails = (props) => {
  const { bot } = props;
  const { globalStore } = useContext(GlobalContext);

  const handleAssignTask = (task) => {
    postTask(globalStore.user, bot, task);
  }

  const handleUnassignTask = () => {
    stopTask(globalStore.user, bot);
  };

  return (
    <Card sx={{ p: 2 }}>
      <RobotDetailsToolbar
        bot={bot}
        onAssign={handleAssignTask}
        onUnassign={handleUnassignTask}
      />
      <Typography variant="subtitle1">History</Typography>
      <RobotTaskHistory bot={bot}/>
    </Card>
  );
};

export default RobotDetails;
