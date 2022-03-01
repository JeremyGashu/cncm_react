import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Navigate, useNavigate } from 'react-router-dom';
import image from '../../assets/login_image.png'
import { loginButtonStyle } from '../../theme/button_style';
import { kGreenColor } from '../../theme/colors';
import cncm_logo from '../../assets/cncm_logo.svg'
import { Lock } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useMediaQuery, useTheme } from '@mui/material'
import { loginRequest } from '../../controllers/auth';
import { useMutation } from 'react-query';
import { useAuth } from '../../contexts/auth';
import { useEffect } from 'react';
import FullPageLoading from '../../components/LoadingPage';


const LoginPage = () => {




    const navigate = useNavigate()

    const { control, handleSubmit } = useForm()
    const theme = useTheme()
    const query = useMediaQuery(theme.breakpoints.down(1000))
    const { setAuthData, authData, loadingAuthState } = useAuth()

    useEffect(() => {

        return () => {

        }
    }, [])


    const { mutate, isLoading } = useMutation(loginRequest, {
        onError: (error, variables, context) => {
            console.log(error)
            console.log(variables)
            console.log(context)
        },
        onSuccess: (data, variables, context) => {
            if (data.code === 200) {
                setAuthData(data.results)
                navigate('/dashboard')
            }
        },
    })

    const handleLogin = async (data) => {
        mutate({ username: data.username, password: data.password },)
    };

    if (loadingAuthState) {
        return <FullPageLoading />
    }

    if (!loadingAuthState && authData) {
        return <Navigate to='/dashboard' />
    }


    return (

        <Grid container alignItems='center' justifyContent='space-between' >
            <CssBaseline />
            <Grid item lg={5} sm={12} >
                <img style={{ height: query ? '70vh' : '100vh', width: query ? '100vw' : '50vw' }} src={image} alt='Login' />
            </Grid>
            <Grid item lg={5} sm={12}>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img height={50} style={{ padding: 5, margin: 3, textAlign: 'center', cursor: 'pointer' }} src={cncm_logo} alt='CNCM Logo' />

                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                    <Box sx={{ width: 60, height: 60, backgroundColor: kGreenColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock sx={{ color: 'white' }} />
                    </Box>

                </Box>

                <Container component="main" maxWidth="xs">

                    <Box
                        sx={{
                            // marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ mt: 3 }}>

                            <form onSubmit={handleSubmit(handleLogin)}>
                                <Controller
                                    control={control}
                                    name='username'
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            id="email"
                                            siz='small'
                                            label="Email"
                                            autoComplete="email"
                                            sx={{ my: 2 }}
                                        />
                                    )}
                                    rules={{ required: true }}
                                />

                                <Controller
                                    control={control}
                                    name='password'
                                    render={({ field }) => (

                                        <TextField
                                            {...field}
                                            fullWidth
                                            siz='small'
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            sx={{ my: 2 }}
                                        />
                                    )}
                                    rules={{ required: true }}
                                />


                                <Button
                                    fullWidth
                                    type='submit'
                                    disabled={isLoading}
                                    sx={loginButtonStyle}
                                >
                                    Login
                                </Button>
                            </form>

                            <Typography sx={{ fontSize: 12, my: 2, textAlign: 'center', fontWeight: 'bold' }} >
                                Don't have an Account? <Link onClick={() => {
                                    navigate('/register')
                                }} sx={{ color: kGreenColor, textDecoration: 'none', cursor: 'pointer' }} >Signup</Link>
                            </Typography>

                            <Typography sx={{ fontSize: 12, my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                                <Link onClick={() => {
                                }} sx={{ color: kGreenColor, textDecoration: 'none', cursor: 'pointer', textAlign: 'center' }} >Forgot Password</Link>
                            </Typography>

                        </Box>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    );
}

export default LoginPage