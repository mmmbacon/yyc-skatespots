import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GraphQLClient } from 'graphql-request';
import { config } from '../../config';
import { SIGN_IN_MUTATION, SIGN_UP_MUTATION } from '../../graphql/mutations';
import { applyAuthSession } from '../../utils/authSession';
import GoogleSignInButton from './GoogleSignInButton';

const AuthDialog = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [mode, setMode] = useState('signIn');
  const [login, setLogin] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setError('');
    setLogin('');
    setUsername('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    setTab(0);
    setMode('signIn');
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const client = new GraphQLClient(config.graphqlHttpUrl);

    try {
      if (mode === 'signUp') {
        const { signUp } = await client.request(SIGN_UP_MUTATION, {
          username,
          email,
          password,
        });
        applyAuthSession(signUp);
      } else {
        const { signIn } = await client.request(SIGN_IN_MUTATION, {
          login,
          password,
        });
        applyAuthSession(signIn);
      }
      handleClose();
    } catch (err) {
      const message =
        err.response?.errors?.[0]?.message ||
        err.message ||
        'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Sign in to skatespot.app</DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, value) => {
            setTab(value);
            setError('');
          }}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Account" />
          <Tab label="Google" />
        </Tabs>

        {tab === 0 && (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {mode === 'signIn' ? (
              <TextField
                label="Username or email"
                fullWidth
                margin="dense"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                autoComplete="username"
              />
            ) : (
              <>
                <TextField
                  label="Username"
                  fullWidth
                  margin="dense"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  helperText="3–30 characters: letters, numbers, underscores"
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="dense"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </>
            )}
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={
                mode === 'signUp' ? 'new-password' : 'current-password'
              }
              helperText={mode === 'signUp' ? 'At least 8 characters' : undefined}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading
                ? 'Please wait…'
                : mode === 'signUp'
                  ? 'Create account'
                  : 'Sign in'}
            </Button>
            <Button
              type="button"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => {
                setMode(mode === 'signUp' ? 'signIn' : 'signUp');
                setError('');
              }}
            >
              {mode === 'signUp'
                ? 'Already have an account? Sign in'
                : 'Need an account? Sign up'}
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box display="flex" flexDirection="column" alignItems="center" py={2}>
            <GoogleSignInButton onSuccess={handleClose} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Use your Google account to sign in.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
