// External Dependencies
import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  Typography,
  CircularProgress,
} from '@mui/material';

// Internal Dependencies
import { GlobalContext } from '../App';
import { getTasksForBot } from '../api';

const RobotTaskHistory = (props) => {
  const { bot, ...other } = props;
  const { globalStore } = useContext(GlobalContext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTasksForBot(globalStore.user, bot.id)
      .then(res => setTasks(res))
      .finally(() => setIsLoading(false));
  }, [bot]);

  if (isLoading) {
    return (
      <>
        <Typography variant="subtitle1">Loading history...</Typography>
        <CircularProgress />
      </>
    );
  }

  if (!tasks.length) {
    return (
      <Paper variant='outlined' sx={{ p: 3, ...other?.sx }} {...other}>
        <Typography variant='subtitle1'>
          No tasks have been assigned to {bot.name}
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper variant='outlined' {...other}>
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>Assigned By</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(({ date, type, userName}, idx) => (
              <TableRow key={`task-row-${idx}`}>
                <TableCell>{type}</TableCell>
                <TableCell>{userName}</TableCell>
                <TableCell>{new Date(date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
};

export default RobotTaskHistory;
