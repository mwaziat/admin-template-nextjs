import { Toolbar, IconButton, Typography, Box, Drawer, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import logo from '@/utils/assets/images/logo1.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ExtraMenu from './ExtraMenu';
import Colors from '@/utils/assets/colors';
import MenuAccount from './account';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  singleScreen?: boolean
  open: boolean;
  setOpen: (val: boolean) => void
}

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'center',
}));


const Navbar = (props: Props) => {
  const route = useRouter();
  const { window, singleScreen } = props;
  const [title] = useState('')
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
    setOpen((prevState) => !prevState);
  };

  useEffect(() => {
    typeof props.setOpen === 'function' && props.setOpen(open)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if(loggedInStatus === 'true'){
      setIsLoggedIn(loggedInStatus === 'true');
      setTimeout(() => {
        setIsLoggedIn(loggedInStatus !== 'true');
        localStorage.setItem('isLoggedIn', 'false');
      }, 1000)
    }
  }, []);

  const drawer = (
    <Box sx={{ textAlign: 'center', }}>
      <DrawerHeader>
        <Image src={logo} className="App-navbar-logo" alt="logo" style={{ padding: 10 }} />
      </DrawerHeader>
      {!isLoggedIn && <ExtraMenu styleBoxMenu={{ paddingTop: 15 }} />}
      
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: open ? `calc(100% - ${drawerWidth}px)` : `calc(100%)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: { xs: Colors.primary },
        }}
      >
        <Toolbar>
          <Tooltip title={'Lihat Menu'}>
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          {!singleScreen && (
            <Tooltip title={'Home'}>
              <IconButton
                color="inherit"
                aria-label="open home"
                edge="start"
                onClick={() => route.push('/')}
                sx={{ mr: 2, }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, }}
          >
            {title}
          </Typography>
          <Box>
            <MenuAccount />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
        
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: Colors.background.light },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', sm: open ? 'block' : 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: Colors.background.light },
          }}
          anchor="left"
          open={open}
        >
          {drawer}
        </Drawer>
      </Box>
    </React.Fragment>
  )
}

export default Navbar
