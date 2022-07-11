// External Dependencies
import { useState } from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

// Internal Dependencies
import DialogConfirmTaskOverride from './DialogConfirmTaskOverride';

const TASK_TYPES = ['clean', 'resupply', 'dance'];

const RobotDetailsToolbar = (props) => {
  const { bot, onAssign, onUnassign } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickShowPopper = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'task-popper' : undefined;

  const handleClickAway = () => setAnchorEl(null);

  const isBotBusy = bot.status === 'busy' || bot.status === 'error';

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{bot?.name}</Typography>
          <Typography variant="subtitle1">Current Task: {bot?.task || 'none'}</Typography>
        </Box>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Button
          disabled={isBotBusy}
          onClick={handleClickShowPopper}
          size="small"
          startIcon={<AddIcon/>}
          sx={{ mr: 2 }}
          variant="contained"
        >
          New Task
        </Button>
      </ClickAwayListener>
      <Button
        disabled={!isBotBusy}
        onClick={() => onUnassign()}
        size="small"
        startIcon={<CancelIcon/>}
        variant="outlined"
      >
        Stop Task
      </Button>
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
