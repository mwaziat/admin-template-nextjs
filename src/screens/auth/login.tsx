/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardContent, CircularProgress } from '@mui/material';
// import Colors from '@/src/utils/assets/colors';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/navigation';
import { login } from './queries';
import { ToastWarning } from '@/utils/toastAlert';
import { UserAttributes } from '@/types/users';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { AuthReduxInterface, setAuthRedux } from '@/redux/features/auth/authSlice';
import { RootState } from '@/redux/store';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mziad.com/">
        mziad.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is Required'),
  password: yup
    .string()
    .required('Password is Required'),
});

const Login = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const dataAuth: AuthReduxInterface = useAppSelector((state: RootState) => state.auth!)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      const response = await login(values)
      
      if(!response.status){
        ToastWarning("Failed to login, please make sure your email or password")
      } else {
        router.push('/admin/dashboard');
        const user = jwtDecode(response.token!) as UserAttributes
        const activeRole = user.roles && user.roles.length > 0 ? user.roles[0] : {id: 0,  name: "", description: "", createdBy: 0 }
        
        dispatch((dispatch, getState) => {
          dispatch(setAuthRedux({
            ...getState().auth,
            user: user,
            roleActive: activeRole,
            isLogin: true,
            token: response.token!,
            exp: jwtDecode(response.token!).exp! * 1000,
          }));
        });
      }
    }
  })

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, /* bgcolor: Colors.primary */ }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Card sx={{ mt: 2, pb: 3 }}>
            <CardContent>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  size='small'
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={!!formik.errors.username}
                  helperText={formik.errors.username}
                  onBlur={formik.handleBlur}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  size='small'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={!!formik.errors.password}
                  helperText={formik.errors.password}
                  onBlur={formik.handleBlur}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  fullWidth
                  className='button-primary-custom'
                  variant="outlined"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => formik.handleSubmit()}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>

                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>

    </ThemeProvider>
  )
}

export default Login