import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

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
    <main className="page-shell">
      <section className="login-card">
        <header className="hero-copy">
          <p className="eyebrow">React State Management Lab</p>
          <h1>Secure Login Portal</h1>
          <p className="subcopy">
            Client-side validation, controlled inputs, loading feedback, and state-driven alerts.
          </p>
          <p className="hint">Demo credentials: student@college.edu / React@123</p>
        </header>

        {status.type === 'success' && <div className="alert success">{status.message}</div>}
        {status.type === 'error' && <div className="alert error">{status.message}</div>}

        <form className="login-form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
              <label className="field">
                <span>Email</span>
                <input
                  {...field}
                  type="email"
                  autoComplete="username"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <small id="email-error" className="field-error">
                    {errors.email.message}
                  </small>
                )}
              </label>
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
              <label className="field">
                <span>Password</span>
                <div className="password-row">
                  <input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    maxLength={64}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <small id="password-error" className="field-error">
                    {errors.password.message}
                  </small>
                )}
              </label>
            )}
          />

          <Controller
            name="rememberMe"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <label className="remember-row">
                <input
                  {...field}
                  type="checkbox"
                  checked={value}
                  onChange={(event) => onChange(event.target.checked)}
                />
                <span>Remember me on this device</span>
              </label>
            )}
          />

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="session-state">
          {authenticatedUser ? `Logged in as: ${authenticatedUser}` : 'No active authenticated user.'}
        </p>
      </section>
    </main>
  )
}

export default App
