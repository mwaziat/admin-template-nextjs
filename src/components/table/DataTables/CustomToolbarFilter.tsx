import { Box, Button, FormControl, InputLabel, Menu, MenuItem, Select } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList';
import React from 'react'
import FormFilter from './component-filter/FormFilter';
import { GridColDef } from '@mui/x-data-grid';

interface Props {
  columns: GridColDef[]
  onFilterChange: (val: any) => void
}

const CustomToolbarFilter: React.FC<Props> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button startIcon={<FilterListIcon />} onClick={handleClick}>
        Filters
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{ padding: 2 }}
      >
        <FormFilter columns={props.columns} onFilterChange={(val) => props.onFilterChange(val)} filters={{
          items: []
        }} />
      </Menu>
    </React.Fragment>
  )
}

export default CustomToolbarFilter
