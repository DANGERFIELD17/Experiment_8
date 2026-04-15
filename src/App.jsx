import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  createTheme,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const VALID_USER = {
  email: 'student@college.edu',
  password: 'React@123',
}

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

function App() {
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [authenticatedUser, setAuthenticatedUser] = useState('')
  const [loading, setLoading] = useState(false)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#0d9488',
          },
          secondary: {
            main: '#0369a1',
          },
          background: {
            default: '#f1f5f9',
          },
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: '"Outfit", "Segoe UI", sans-serif',
          h4: {
            fontWeight: 700,
            letterSpacing: '-0.03em',
          },
        },
      }),
    [],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    mode: 'onTouched',
  })

  const onSubmit = async (formData) => {
    setLoading(true)
    setStatus({ type: 'idle', message: '' })

    await sleep(1200)

    const sanitizedEmail = formData.email.trim().toLowerCase()
    const isValidUser =
      sanitizedEmail === VALID_USER.email && formData.password === VALID_USER.password

    if (isValidUser) {
      setAuthenticatedUser(sanitizedEmail)
      setStatus({
        type: 'success',
        message: 'Authentication successful. Welcome back!',
      })
      reset({ email: sanitizedEmail, password: '', rememberMe: formData.rememberMe })
    } else {
      setAuthenticatedUser('')
      setStatus({
        type: 'error',
        message: 'Authentication failed. Invalid email or password.',
      })
    }

    setLoading(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          px: 2,
          background:
            'radial-gradient(circle at 15% 10%, #a7f3d0 0%, rgba(167, 243, 208, 0) 48%), radial-gradient(circle at 90% 90%, #bae6fd 0%, rgba(186, 230, 253, 0) 45%), linear-gradient(135deg, #ecfeff 0%, #f8fafc 55%, #e0f2fe 100%)',
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Paper
            elevation={5}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 5,
              border: '1px solid rgba(2, 132, 199, 0.15)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Secure Login Portal
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Use your college credentials to access the dashboard.
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Demo credentials: student@college.edu / React@123
                </Typography>
              </Box>

              {status.type === 'success' && (
                <Alert severity="success" role="status">
                  {status.message}
                </Alert>
              )}

              {status.type === 'error' && (
                <Alert severity="error" role="alert">
                  {status.message}
                </Alert>
              )}

              <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.25}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                        message: 'Enter a valid email address',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="email"
                        label="Email"
                        fullWidth
                        autoComplete="username"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        fullWidth
                        autoComplete="current-password"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                        inputProps={{
                          maxLength: 64,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label="toggle password visibility"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={value}
                            onChange={(event) => onChange(event.target.checked)}
                          />
                        }
                        label="Remember me on this device"
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.4, fontWeight: 600 }}
                  >
                    {loading ? (
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <CircularProgress size={18} color="inherit" />
                        <span>Authenticating...</span>
                      </Stack>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {authenticatedUser
                  ? `Logged in as: ${authenticatedUser}`
                  : 'No active authenticated user.'}
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
