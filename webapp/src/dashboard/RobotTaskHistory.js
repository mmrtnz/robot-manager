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
  
  return (
    <Paper variant='outlined' {...other}>
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Assigned By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(({ date, type, userName}) => (
              <TableRow>
                <TableCell>{new Date(date).toLocaleString()}</TableCell>
                <TableCell>{type}</TableCell>
                <TableCell>{userName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
};

export default RobotTaskHistory;
