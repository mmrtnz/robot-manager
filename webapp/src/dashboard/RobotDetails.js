// External Dependencies
import { useState } from 'react';
import {
  Card,
  Typography
} from '@mui/material';

// InternalDependencies
import RobotDetailsToolbar from './RobotDetailsToolbar';

const RobotDetails = (props) => {
  const { bot } = props;

  const handleAssignTask = (type) => {
    console.log('type', type);
    
  }

  return (
    <Card sx={{ p: 2 }}>
      <RobotDetailsToolbar bot={bot} onAssign={handleAssignTask} />
      <Typography variant="subtitle1">History</Typography>
    </Card>
  );
};

export default RobotDetails;
