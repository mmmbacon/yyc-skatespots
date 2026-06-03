import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { googleLogout } from '@react-oauth/google';
import { avatarSrc } from '../../config';
import { signOutUser } from '../../utils/authSession';
import { useAppStore } from '../../stores/useAppStore';

const UserMenu = ({ mobileSize }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSignOut = () => {
    setAnchorEl(null);
    googleLogout();
    signOutUser();
  };

  const displayName = currentUser.username || currentUser.name;

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Account menu"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="inherit"
        sx={{
          ml: 1,
          borderRadius: 1,
          textTransform: 'none',
          minWidth: mobileSize ? 40 : 'auto',
          px: mobileSize ? 0.5 : 1.5,
          py: 0.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {!mobileSize && (
            <Typography variant="h6" color="inherit" noWrap>
              {displayName}
            </Typography>
          )}
          <Avatar
            src={avatarSrc(currentUser.picture)}
            alt={displayName}
            sx={{ width: 35, height: 35 }}
          />
        </Box>
      </Button>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, minWidth: 180 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {displayName}
          </Typography>
          {currentUser.email && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {currentUser.email}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
