/* eslint-disable react-hooks/exhaustive-deps */
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCookie, setCookie  } from 'cookies-next';
import { RouteData } from "@/routes/RouteData";
import { AuthReduxInterface } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store";
import { LayoutAdminContext } from ".";

interface props {
  styleBoxMenu?: React.CSSProperties
}

const ExtraMenu = (props: props) => {
  const {setRouteAccess} = useContext(LayoutAdminContext)
  const router = useRouter()
  const pathname = usePathname()
  const dataAuth: AuthReduxInterface = useAppSelector((state: RootState) => state.auth!)
  const [openKey, setOpenKey] = useState<{key: string, parentKey: string }>({key: 'dashboard', parentKey: ''});
  const [userRole, setUserRole] = useState<string>(getCookie('userRole') as string);

  useEffect(() => {
    const role = getCookie('userRole') as string;
    if (role) {
      setUserRole(role);
    } else {
      setCookie('userRole', dataAuth.roleActive.name)
      setUserRole(dataAuth.roleActive.name);
    }
  }, [dataAuth]);

  useEffect(() => {

    const storedOpenKey = getCookie('openKey') as string;
    if (storedOpenKey) {
      setOpenKey(JSON.parse(storedOpenKey));
    } else {
      const defaultOpenKey = { key: 'dashboard', parentKey: '' }
      setCookie('openKey', JSON.stringify(defaultOpenKey));
      RouteData.forEach((route) => {
        if(route.key === 'dashboard'){
          router.push(route.path!)
        }
      })
    }
  }, [router]);

  useEffect(() => {
    const syncMenuWithPathname = () => {
      RouteData.forEach((route) => {
        if (route.path === pathname) {
          setOpenKey({ key: route.key, parentKey: '' });
          setCookie('openKey', JSON.stringify({ key: route.key, parentKey: '' }));
        } else if (route.children) {
          route.children.forEach((child) => {
            if (child.path === pathname) {
              setOpenKey({ key: child.key!, parentKey: route.key });
              setCookie('openKey', JSON.stringify({ key: child.key!, parentKey: route.key }));
            }
          });
        }
      });
    };

    syncMenuWithPathname();
  }, [pathname]);

  useEffect(() => {
    const fetchMenuAndSetTimeout = async () => {
      try {
        const currentPath = pathname !== null ? pathname : '';

        const filteredRoutes = RouteData.filter(route => {
          const hasUserRole = Array.isArray(route.accessRole) && route.accessRole.includes(userRole);
          if (hasUserRole) {
            if (route.children) {
              route.children = route.children.filter(child =>
                Array.isArray(child.accessRole) && child.accessRole.includes(userRole)
              );
              const hasCurrentPathInChildren = route.children.some(child => {
                if (child.path && child.path.includes('/:')) {
                  const basePath = child.path.split('/:')[0];
                  return currentPath.startsWith(basePath);
                } else {
                  return child.path === currentPath;
                }
              });
              if (hasCurrentPathInChildren) {
                return true;
              }
            }
            return route.path === currentPath;
          }
          return false;
        });

        setRouteAccess(filteredRoutes.length > 0)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMenuAndSetTimeout()
  }, [userRole, pathname]);

  const memoizedRouteData = useMemo(() => {
    return RouteData.filter((route) => route.accessRole.includes(userRole));
  }, [userRole]);

  const handleClick = useCallback((key: string) => {
    if (openKey.parentKey === key && openKey.key === key) {
      // Don't close the parent if it's the same key as the child being clicked
      setOpenKey({ key: key, parentKey: '' });
    } else if (openKey.parentKey === key) {
      // Keep parent open if it has children that are being clicked
      setOpenKey({ key: openKey.key, parentKey: key });
    } else {
      // Toggle open/close state for the menu
      setOpenKey({ key: key, parentKey: key });
    }
  
    setCookie('openKey', JSON.stringify({ key, parentKey: openKey.parentKey === key ? '' : key }));
  }, [openKey]);
  

  const handleClickMenu = (path: string, key: string, parentKey: string | undefined) => {
    setOpenKey({ key: key, parentKey: parentKey ? parentKey : openKey.parentKey });
    setCookie('openKey', JSON.stringify({ key: key, parentKey: parentKey ? parentKey : openKey.parentKey }));
    router.push(path);
  };

  const renderListItems = useCallback((data: any[], depth: number = 1) => {
    return data.map((route) => {
      if (!route.renderInMenu) {
        return null;
      }
  
      const isActive = route.path === pathname || (route.children && route.children.some((child: any) => child.path === pathname));
  
      if (route.children && route.children.length > 0) {
        return (
          <React.Fragment key={route.key}>
            <ListItemButton
              onClick={() => handleClick(route.key)}
              sx={{
                pl: depth * 2,
                backgroundColor: isActive ? "#f0f0f0" : "transparent", // Warna latar belakang untuk parent yang aktif
                "&:hover": { backgroundColor: "#e0e0e0" }
              }}
            >
              <ListItemIcon style={{ minWidth: '35px' }}>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
              {openKey.parentKey === route.key ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openKey.parentKey === route.key} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ backgroundColor: "#fafafa" }}>
                {renderListItems(route.children, depth + 1)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }
  
      return (
        <ListItemButton
          key={route.key}
          onClick={() => handleClickMenu(route.path!, route.key, route.parentKey)}
          sx={{
            pl: depth * 2,
            backgroundColor: isActive ? "#f0f0f0" : "transparent", // Warna latar belakang untuk item yang aktif
            "&:hover": { backgroundColor: "#e0e0e0" }
          }}
        >
          <ListItemIcon style={{ minWidth: '35px' }}>{route.icon}</ListItemIcon>
          <ListItemText primary={route.name} />
        </ListItemButton>
      );
    });
  }, [openKey, pathname, handleClick, handleClickMenu]);

  return (
    <React.Fragment>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {renderListItems(memoizedRouteData)}
      </List>
    </React.Fragment>
  )
};

export default ExtraMenu;
