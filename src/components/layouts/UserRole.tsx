import { AuthReduxInterface } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store";
import Colors from "@/utils/assets/colors";
import { FormControl, Select, MenuItem, Typography, useMediaQuery } from "@mui/material"
import useTheme from "@mui/material/styles/useTheme";
import { useRouter } from "next/navigation";
import * as React from 'react';

interface DataUserRole {
  id: number,
  name: string,
  code: string
}

const UserRole = () => {
  const theme = useTheme();
  const dataAuth: AuthReduxInterface = useAppSelector((state: RootState) => state.auth!)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [role, setRole] = React.useState('')
  const [dataRole, setDataRole] = React.useState<DataUserRole[]>([])

  const handleChange = async (event: any) => {
    setRole(event.target.value);
/*     await sessionUpdate({
      role: event.target.value
    }) */
    window.location.reload()
  };

  React.useEffect(() => {
    const fetchAssignUserRole = async () => {
      try {
        const roles: DataUserRole[] = dataAuth.user && dataAuth.user.roles ? dataAuth.user.roles.map((item) => {
          return {
            id: item.id,
            name: item.description,
            code: item.name
          }
        }) : []
        setDataRole(roles)
        setRole(dataAuth.roleActive.name)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAssignUserRole()
  }, [dataAuth]);


  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 170 }} size="small">
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={role || ''}
        label="Roles"
        onChange={handleChange}
      >
        {dataRole.length > 0 && dataRole.map((item, index) => (
          <MenuItem key={index} style={{ backgroundColor: role === item.code ? Colors.primary : 'inherit' }} value={item.code}>
            <Typography component="span" sx={(theme) => ({ color: role === item.code ? isMobile ? 'black' : 'white' : 'black' })}>{item.name}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default UserRole