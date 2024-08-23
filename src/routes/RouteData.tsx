import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/AssignmentInd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MenuIcon from "@mui/icons-material/Menu";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LabelIcon from '@mui/icons-material/Label';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SellIcon from '@mui/icons-material/Sell';
import { RouteDataInterface } from "@/types/routes";


export const RouteData: RouteDataInterface[] = [
  {
    name: "Dashboard",
    path: `/admin/dashboard`,
    key: "admin_dashboard",
    accessRole: ["superadmin", "admin"],
    renderInMenu: true,
    icon: <DashboardIcon />,
  },
  {
    name: "Dashboard",
    path: `/user/dashboard`,
    key: "user_dashboard",
    accessRole: ["member"],
    renderInMenu: true,
    icon: <DashboardIcon />,
  },
  {
    name: 'Users Management',
    key: 'masterUser',
    accessRole: ['admin'],
    renderInMenu: true,
    icon: <PeopleIcon />,
    children: [
      {
        name: 'Users',
        path: '/admin/users-management/users',
        key: 'masterUserOption1',
        accessRole: ['admin'],
        renderInMenu: true,
        icon: <PeopleIcon />,
      },
      {
        name: 'Roles',
        path: '/admin/users-management/roles',
        key: 'masterUserOption2',
        accessRole: ['admin'],
        renderInMenu: true,
        icon: <AssignmentTurnedInIcon />,
      },
    ],
  },
];