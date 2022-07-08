// External Dependencies
import { Button, styled, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useTheme } from '@mui/material/styles';

// Internal Dependencies
import { ReactComponent as RobotHead1 } from './assets/robot-head-1.svg';

const AppTitle = styled(Typography)(`
	color: ${props => props.color};
	display: inline;
	margin-left: .25em;
	vertical-align: top;
`);

const Login = () => {
	const theme = useTheme();
	const primaryColor = theme.palette.primary.main;

	return (
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
			<Container sx={{ mb: 1, textAlign: 'center' }}>
				<RobotHead1
					fill={primaryColor}
					height='2.5em'
					width='2.5em'
				/>
				<AppTitle
					color={primaryColor}
					variant="h1"
				>
					Rad Robo Wrangler
				</AppTitle>
      </Container>
			<TextField
				id="username"
				label="Username"
				required
				sx={{ mb: 1 }}
			/>
			<TextField
				id="password"
				label="Password"
				required
				sx={{ mb: 1 }}
				type="password"
			/>
			<Button variant="contained">
				Login
			</Button>
		</Container>
	);
}

export default Login;
