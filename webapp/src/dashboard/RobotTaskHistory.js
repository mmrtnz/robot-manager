// External Dependencies
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

const RobotTaskHistory = (props) => {
  const {
    bot,
    isLoading,
    tasks,
    ...other
  } = props;

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
