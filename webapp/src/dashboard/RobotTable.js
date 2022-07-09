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
} from '@mui/material';
import React from 'react';
import { blue, brown, red, teal } from '@mui/material/colors';

// Internal Dependencies
import { ReactComponent as RobotHead2 } from '../assets/robot-head-2.svg';
import { ReactComponent as Bender } from '../assets/bender.svg';
import { ReactComponent as Toaster } from '../assets/toaster.svg';
import { ReactComponent as Walle } from '../assets/walle.svg';

// Give each bot's data an unique appearance 
const getStylesConfig = name => {
  let IconComponent  = null;
  let color = null;

  switch(name) {
    case 'bot1':
      color = brown;
      IconComponent = Walle;
      break;
    case 'bot2':
      color = teal;
      IconComponent = Bender;
      break;
    case 'bot3':
      color = blue;
      IconComponent = Toaster;
      break;
    default:
      color = red;
      IconComponent = RobotHead2;
      break;
  }

  return {
    color,
    IconComponent
  };
}

const RobotTable = (props) => {
  const {
    bots,
    currentSelection,
    onSelect,
    ...other
  } = props;

  return (
    <TableContainer component={Paper} {...other}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Robot</TableCell>
            <TableCell>Current Task</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(bots).map((botId) => {
            const { name, status, task } = bots[botId];
            const { IconComponent } = getStylesConfig(botId);          
            return (
              <TableRow
                hover
                key={botId}
                onClick={() => onSelect(bots[botId])}
                selected={currentSelection?.name === name}
              >
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <IconComponent height="3em" width="3em"/>
                    <Box sx={{ ml: '2em' }}>
                      <Typography variant="body1">{name}</Typography>
                      <Typography variant="body2">{status}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {task}
                </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RobotTable;
