import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const RoleColumns = () => {
  const RoleColumns: GridColDef[] = [
    { field: "rowIndex", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      type: "date",
      valueGetter: (value) => {
        const dateValue = new Date(value);
        return isNaN(dateValue.getTime()) ? null : dateValue;
      },
    },
  ];
  return RoleColumns
};
