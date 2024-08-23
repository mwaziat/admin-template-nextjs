"use client"
import { Alert, AlertTitle, Backdrop, Box, CircularProgress, CssBaseline, Stack, styled } from '@mui/material'
import React, { createContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import Navbar from './navbar';
import { RouteDataInterface } from '@/types/routes';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RouteData } from '@/routes/RouteData';

interface LayoutAdminProps {
  children: React.ReactNode
}
interface LayoutAdminContext {
  routeAccess: boolean, 
  setRouteAccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const LayoutAdminContext = createContext<LayoutAdminContext>({
  routeAccess: false,
  setRouteAccess: () => {}
})
const LayoutAdmin: React.FC<LayoutAdminProps> = ({children}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [routeAccess, setRouteAccess] = React.useState(true)
  const [open, setOpen] = React.useState(true)

  useEffect(() => {
    if (!open) {
      document.body.style.overflowY = 'scroll';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [open]);

  const breadcrumbs = findBreadcrumbs(RouteData, pathname);

  return (
    <div>
      <LayoutAdminContext.Provider value={{routeAccess, setRouteAccess}}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Navbar singleScreen={false} open={open} setOpen={(val: boolean) => setOpen(val)} />
          <Main open={open} style={{ width: `calc(100% - ${drawerWidth}px)` }}>
            <DrawerHeader />
            <nav className="text-gray-700 bg-white p-3 rounded-md border border-gray-300 mb-4">
              {breadcrumbs.map((breadcrumb, index) => (
                <span key={breadcrumb.key}>
                  {index > 0 && <span className="mx-2">|</span>}
                  {breadcrumb.path ? (
                    <Link href={`${breadcrumb.path}${breadcrumb.query ? `?${breadcrumb.query}` : ''}`} className="text-blue-600 hover:underline">
                      {breadcrumb.name}
                    </Link>
                  ) : (
                    <span>{breadcrumb.name}</span>
                  )}
                </span>
              ))}
            </nav>
            <main>
              {status === 'loading' && (
                <Backdrop 
                  open={true} 
                  sx={{ 
                    color: '#fff', 
                    width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100%)`,
                    marginLeft: open ? `${drawerWidth}px` : `0px`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                  }}
                  >
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                    <CircularProgress color="inherit" sx={{marginRight: 3}}/>
                  </Box>
                </Backdrop>
              )}

              {!routeAccess && (
                <Stack sx={{ width: '100%', marginTop: 2 }} spacing={2}>
                  <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                    Sorry, you do not have access to this page.  <strong>Please contact the administration.</strong>
                  </Alert>
                </Stack>
              )}
              {routeAccess && children}
            </main>
          </Main>
        </Box>
      </LayoutAdminContext.Provider>
    </div>
  )
}

export default LayoutAdmin

const findBreadcrumbs = (routes: RouteDataInterface[], pathname: string): RouteDataInterface[] => {
  const breadcrumbs: RouteDataInterface[] = [];
  
  const findRoutes = (routes: RouteDataInterface[], pathname: string): boolean => {
    for (const route of routes) {
      if (route.path === pathname) {
        breadcrumbs.push(route);
        return true;
      }
      if (route.children) {
        for (const child of route.children) {
          if (findRoutes([child], pathname)) {
            breadcrumbs.unshift(route);
            return true;
          }
        }
      }
    }
    return false;
  };
  
  findRoutes(routes, pathname);
  return breadcrumbs;
};