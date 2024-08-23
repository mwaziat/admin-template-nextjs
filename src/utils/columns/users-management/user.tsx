import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

export const UserColumns = () => {
  const UserColumns: GridColDef[] = [
    { field: "rowIndex", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
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
    {
      field: "isActive",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            {params.value === true && (
              <Chip
                label="active"
                color="success"
                size="small"
                variant="outlined"
              />
            )}
            {params.value === 0 && (
              <Chip
                label="disabled"
                color="default"
                size="small"
                variant="outlined"
              />
            )}
          </>
        );
      },
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   type: "actions",
    //   width: 80,
    //   getActions: (params) => [
    //     <GridActionsCellItem
    //       key="edit-action"
    //       icon={<EditIcon />}
    //       label="Edit"
    //       onClick={undefined}
    //       showInMenu
    //     />,
    //   ],
    // },
  ];
  return UserColumns
};
