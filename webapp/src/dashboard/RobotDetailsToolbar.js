// External Dependencies
import { useState } from 'react';
import {
  ClickAwayListener,
  Box,
  Button,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TASK_TYPES = ['clean', 'resupply', 'dance'];

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
          disabled={Boolean(bot.task)}
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
              {TASK_TYPES.map(type => (
                <ListItemButton
                  key={`task_list_item_${type}`}
                  onClick={() => onAssign(type)}
                >
                  <ListItem>
                    <ListItemText>
                      {type[0].toUpperCase() + type.slice(1)}
                    </ListItemText>
                  </ListItem>
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
    </>
  );
};

export default RobotDetailsToolbar;
