import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Badge, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/utils/general-helper';
import { AuthReduxInterface } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store';
import UserRole from './UserRole';

function notificationsLabel(count: number) {
  if (count === 0) {
    return 'Tidak ada notifikasi';
  }
  if (count > 99) {
    return 'Lebih dari 99 notifikasi';
  }
  return `${count} notifikasi`;
}


const MenuAccount = () => {
  const dataAuth: AuthReduxInterface = useAppSelector((state: RootState) => state.auth!)
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElMobile, setAnchorElMobile] = React.useState<null | HTMLElement>(null);
  const [anchorElNotification, setAnchorElNotification] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const openMobile = Boolean(anchorElMobile);
  const openNotifications = Boolean(anchorElNotification);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMobile = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMobile(event.currentTarget);
  };
  const handleCloseMobile = () => {
    setAnchorElMobile(null);
  };

  const handleChangeLogout = async (target: string) => {
    /* const res = await signOut({ redirect: false })
    localStorage.setItem('isLoggedIn', 'false');
    if (!res) {
      router.push('/');
    } */
  }

  const handleClickNotification = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const notification = (
    <Menu
      anchorEl={anchorElNotification}
      id="notification-menu"
      open={openNotifications}
      onClose={handleCloseNotification}
      onClick={handleCloseNotification}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box
        sx={(theme) => ({
          marginX: 2,
          marginY: 1,
          display: 'flex',
          flexDirection: 'row'
        })}
        onClick={handleCloseNotification}>
        <Settings fontSize="small" color='inherit' />
        <Box sx={{ maxWidth: { sm: 300 }, ml: 2 }}>
          <Typography fontWeight={'bold'} variant="body1">
            Judul Notifikasi 1
          </Typography>
          <Typography
            variant='body2'
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              wordWrap: "break-word",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea nam vitae eveniet animi minus error labore possimus excepturi!
            Consectetur, iure iusto libero sint voluptas veniam eaque vitae perspiciatis distinctio recusandae.
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={(theme) => ({
          marginX: 2,
          marginY: 1,
          display: 'flex',
          flexDirection: 'row'
        })}
        onClick={handleCloseNotification}>
        <Settings fontSize="small" color='inherit' />
        <Box sx={{ maxWidth: { sm: 300 }, ml: 2 }}>
          <Typography fontWeight={'bold'} variant="body1">
            Judul Notifikasi 2
          </Typography>
          <Typography
            variant='body2'
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              wordWrap: "break-word",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea nam vitae eveniet animi minus error labore possimus excepturi!
            Consectetur, iure iusto libero sint voluptas veniam eaque vitae perspiciatis distinctio recusandae.
          </Typography>
        </Box>
      </Box>
      <Divider />
      <MenuItem onClick={handleCloseNotification} sx={{ textAlign: 'center' }}>
        Lihat Semua notifikasi
      </MenuItem>
    </Menu >
  )

  return (
    <React.Fragment>
      <Box sx={(theme) => ({ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', textAlign: 'center' })}>
        <UserRole />
        <Tooltip title={notificationsLabel(100)}>
          <IconButton
            color="inherit"
            aria-label={notificationsLabel(100)}
            aria-controls={openNotifications ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openNotifications ? 'true' : undefined}
            onClick={handleClickNotification}
            sx={{ ml: 3}}
          >
            <Badge color="info" badgeContent={100}>
              <NotificationsIcon sx={{ color: 'inherit' }} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 3, border: '1px solid #fff' }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: 'inherit' }}>
              {dataAuth.user !== undefined && dataAuth.user.firstName !== '' && getInitials(dataAuth.user.firstName +' '+ dataAuth.user.lastName)}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar />
            <Box>
              <Typography variant='body1'>
                My account
              </Typography>
              <Typography variant="caption" marginTop={0}>
              {dataAuth.user !== undefined && dataAuth.user.firstName !== '' && dataAuth.user.firstName +' '+ dataAuth.user.lastName}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => handleChangeLogout('web')}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
      {/* Mobile Menu */}
      <Box sx={(theme) => ({ display: { xs: 'block', sm: 'none' } })}>
        <IconButton
          color="inherit"
          aria-label="more"
          id="more-button"
          aria-controls={openMobile ? 'more-menu' : undefined}
          aria-expanded={openMobile ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClickMobile}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElMobile}
          id="account-menu-mobile"
          open={openMobile}
          onClose={handleCloseMobile}
          // onClick={handleCloseMobile}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleCloseMobile}>
            <Avatar /> My account
          </MenuItem>
          <MenuItem onClick={handleClickNotification}>
            <ListItemIcon>
              <Badge color="primary" badgeContent={100}>
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            Notification
          </MenuItem>
          <Divider />
          <MenuItem>
            <UserRole />
          </MenuItem>
          <MenuItem onClick={handleCloseMobile}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => handleChangeLogout('mobile')}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
      {notification}
    </React.Fragment>
  );
}

export default MenuAccount