// External Dependencies
import {
  Card,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { blue, brown, red, teal } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';

// Internal Dependencies
import { getBots } from './api';
import { ReactComponent as RobotHead2 } from './assets/robot-head-2.svg';
import { ReactComponent as Bender } from './assets/bender.svg';
import { ReactComponent as Toaster } from './assets/toaster.svg';
import { ReactComponent as Walle } from './assets/walle.svg';
import { useEffect } from 'react';

const errorMessage = 'Error loading robots. Please try again later';

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

const Dashboard = () => {
  const [bots, setBots] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    getBots()
      .then(res => setBots(res))
      .catch(err => setApiError(errorMessage))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Container>
        <CircularProgress /> Loading robots...
      </Container>
    );
  }

  if (apiError) {
    return (
      <Container>
        <Typography variant="subtitle1" sx={{ color: theme.palette.error.main }}>
					{apiError}
				</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5">Robot Dashboard</Typography>
      <List>
        {Object.keys(bots).map((botId) => {
          const { name } = bots[botId];
          const { IconComponent } = getStylesConfig(botId);          
          return (
            <Card sx={{ mb: 1 }} variant="outlined">
              <ListItem>
                <ListItemIcon>
                  <IconComponent height="3em" width="auto"/>
                </ListItemIcon>
                <ListItemText sx={{ ml: '2em' }}>
                  <Typography variant="body1">{name}</Typography>
                </ListItemText>
              </ListItem>
            </Card>
          );
        })}
      </List>
    </Container>
  );
}

export default Dashboard;
