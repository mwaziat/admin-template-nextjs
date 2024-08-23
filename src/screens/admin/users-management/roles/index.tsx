"use client"
import GridTableMui from '@/components/table/GridTableMui';
import { RoleColumns } from '@/utils/columns/users-management/role';
import React, { createContext, useEffect, useState } from 'react'
import AddRole from './form/add';
import EditRole from './form/edit';
import { DeleteConfirm } from '@/utils/sweet-alert';
import { RoleAttributes } from '@/types/roles';
import { DeleteData } from './queries';

interface RoleContextType {
  fetchData: () => void;
}

export const RoleContext = createContext<RoleContextType>({
  fetchData: () => { },
})

const Roles = () => {
  const [data, setData] = useState<any>([])

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (row: RoleAttributes) => {
    try {
      const response = await DeleteData(row)
      if(response.status){
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Error deleting:", error);
      return false;
    }
  }


  return (
    <div>
      <RoleContext.Provider value={{ fetchData }}>
        <GridTableMui
          // rows={data}
          serverSide={{
            isActive: true,
            path: `${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/roles/view-data`,
            exclude: ['password'],
            defaultFilters: [
              {field: 'deleted_at', op: 'IS NULL', value: 'null', type: 'string'}
            ]
          }}
          columns={RoleColumns()}
          toolbarAdd={{
            isActive: true,
            modalDetails: {
              title: 'Form Add Role',
              maxWidth: 'sm'
            },
            modalComponent: <AddRole />
          }}
          toolbarFilter={{ isActive: true }}
          toolbarRefresh={{ isActive: true }}
          checkboxSelection
          toolbarDeleteMany={{ isActive: true, handleClick: () => console.log("Delete") }}
          defaultColumnsAction={{
            isActive: true,
            isShowEditButton: true,
            isModalEdit: true,
            editModalDetails: {
              title: 'Edit Role',
              maxWidth: 'sm'
            },
            editModalComponent: (props) => <EditRole />,
            isShowDeleteButton: true,
            onDeleteClick: (row: RoleAttributes) => DeleteConfirm('Delete Data Role', () => handleDelete(row))
          }}
        />
      </RoleContext.Provider>
    </div>
  )
}

export default Roles
