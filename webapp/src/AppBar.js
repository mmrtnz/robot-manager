// External Dependencies
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';

// Internal Dependencies
import { GlobalContext } from './App';
import { postLogout } from './api';
import { ReactComponent as RobotHead1 } from './assets/robot-head-1.svg';

const AppBar = () => {
  const { globalStore } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    postLogout().then(() => {
      // Delete cookie
      Cookies.remove('user')

      navigate('/', { replace: true });
    })
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar>
        <Toolbar variant="dense">
          <RobotHead1 fill='white' height='2em' width='2em' />
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'end', mr: 6 }}>
            Welcome {globalStore?.user?.name }
          </Typography>
          <Button sx={{ color: 'white' }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};

export default AppBar; 