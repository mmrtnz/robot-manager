// External Dependencies
import { useState } from 'react';
import { Button, styled, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Internal Dependencies
import { ReactComponent as RobotHead1 } from './assets/robot-head-1.svg';
import { postLogin } from './api';

const AppTitle = styled(Typography)(`
	color: ${props => props.color};
	display: inline;
	margin-left: .25em;
	vertical-align: top;

	@media (max-width: 480px) {
		display: block;
	}
`);

const defaultForm = {
	username: '',
	usernameError: null,
	password: '',
	passwordError: null,
	submitError: null
};

const validateForm = form => {
	let hasError = false;
	const updatedForm = { ...form };

	if (!form.username) {
		updatedForm.usernameError = 'Username is required';
		hasError = true;
	}

	if (!form.password) {
		updatedForm.passwordError = 'Password is required';
		hasError = true;
	}

	return [updatedForm, hasError];
};

const LoginTextField = ({ form, formKey, ...props}) => {
	const fieldError = form[`${formKey}Error`];
	const fieldValue = form[formKey];
	const capitalizedFormKey = formKey[0].toUpperCase() + formKey.slice(1);
	return (
		<TextField
			error={Boolean(fieldError)}
			helperText={fieldError}
			id={formKey}
			label={capitalizedFormKey}
			required
			sx={{ mb: 1 }}
			value={fieldValue}
			{...props}
		/>
	);
};

const Login = props => {
	const theme = useTheme();
	const primaryColor = theme.palette.primary.main;
	const [form, setForm] = useState(defaultForm);
	const navigate = useNavigate();

	// Update state and reset related error message
	const handleChange = ({ target: { id, value } }) => {
		setForm({
			...form,
			[id]: value,
			[`${id}Error`]: null,
			submitError: null
		})
	};

	const handleSubmit = () => {
		const [updatedForm, hasError] = validateForm(form);
		if (hasError) {
			setForm(updatedForm);
			return;
		}

		postLogin(form)
			.then(res => {
				navigate('/dashboard', { replace: true });
			})
			.catch(err => {
				setForm({...form, submitError: 'Invalid login'})
			});
	};

	return (
		<Container sx={{ display: 'flex', flexDirection: 'column' }}>
			<Container sx={{ mb: 1, mt: 4, textAlign: 'center' }}>
				<RobotHead1 fill={primaryColor} height='2.5em' width='2.5em' />
				<AppTitle color={primaryColor} variant="h1">
					Rad Robo Wrangler
				</AppTitle>
      </Container>
			<LoginTextField
				form={form}
				formKey="username"
				onChange={handleChange}
			/>
			<LoginTextField
				form={form}
				formKey="password"
				onChange={handleChange}
				type="password"
			/>
			<Button
				onClick={handleSubmit}
				variant="contained"
			>
				Login
			</Button>
			{form.submitError && (
				<Typography variant="subtitle1" sx={{ color: theme.palette.error.main, mt: 2 }}>
					Invalid username and  password 
				</Typography>
			)}
		</Container>
	);
}

export default Login;
