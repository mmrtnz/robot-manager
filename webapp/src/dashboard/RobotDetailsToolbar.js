// External Dependencies
import { useState } from 'react';
import {
  ClickAwayListener,
  Box,
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const RobotDetailsToolbar = (props) => {
  const { bot, onAssign } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickShowPopper = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'task-popper' : undefined;

  const handleClickAway = () => setAnchorEl(null);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{bot?.name}</Typography>
          <Typography variant="subtitle1">Current Task: {bot?.task || 'none'}</Typography>
        </Box>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Button
          disabled={bot.task}
          onClick={handleClickShowPopper}
          size="small"
          startIcon={<AddIcon/>}
          variant="contained"
        >
          New Task
        </Button>
      </ClickAwayListener>
      </Box>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Paper>
            <List>
              <ListItem onClick={() => onAssign('clean')}>
                <ListItemText>Clean</ListItemText>
              </ListItem>
              <ListItem onClick={() => onAssign('resupply')}>
                <ListItemText>Resupply</ListItemText>
              </ListItem>
              <ListItem onClick={() => onAssign('dance')}>
                <ListItemText>Dance</ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Popper>
    </>
  );
};

export default RobotDetailsToolbar;
