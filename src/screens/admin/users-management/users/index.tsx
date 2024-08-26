'use client'
import GridTableMui from '@/components/table/GridTableMui';
import React, { createContext, useEffect, useState } from 'react'
import AddUser from './form/add';
import { UserColumns } from '@/utils/columns/users-management/user';
import { DeleteConfirm } from '@/utils/sweet-alert';
import { UserAttributes } from '@/types/users';
import { DeleteData, DeleteManyData } from './queries';
import EditUser from './form/edit';

interface UserContextType {
  fetchData: () => void;
}

export const UserContext = createContext<UserContextType>({
  fetchData: () => { },
})

const Users = () => {
  const [data, setData] = useState<any>([])
  const [isReloadServer, setIsReloadServer] = useState(false)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (row: UserAttributes) => {
    try {
      const response = await DeleteData(row)

      if(response.status){
        setIsReloadServer(true)
        setTimeout(() => {
          setIsReloadServer(false)
        }, 100)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Error deleting:", error);
      return false;
    }
  }

  const handleDeleteMany = async (ids: number[]) => {
    try {
      const response = await DeleteManyData({ids: ids})

      if(response.status){
        setIsReloadServer(true)
        setTimeout(() => {
          setIsReloadServer(false)
        }, 100)
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
      <UserContext.Provider value={{ fetchData }}>
        <GridTableMui
          // rows={data}
          serverSide={{
            isActive: true,
            path: `${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/users/view-data`,
            exclude: ['password'],
            defaultFilters: [
              {field: 'deleted_at', op: 'IS NULL', value: 'null', type: 'string'}
            ]
          }}
          columns={UserColumns()}
          toolbarAdd={{
            isActive: true,
            modalDetails: {
              title: 'Form Add User',
              maxWidth: 'md'
            },
            modalComponent: <AddUser />
          }}
          toolbarFilter={{ isActive: true }}
          toolbarRefresh={{ isActive: true }}
          checkboxSelection
          isReload={isReloadServer}
          toolbarDeleteMany={{ isActive: true, onDeleteClick: (data: number[]) => handleDeleteMany(data) }}
          defaultColumnsAction={{
            isActive: true,
            isShowEditButton: true,
            isModalEdit: true,
            editModalDetails: {
              title: 'Edit User',
              maxWidth: 'md'
            },
            editModalComponent: (props) => <EditUser />,
            isShowDeleteButton: true,
            onDeleteClick: (row: UserAttributes) => DeleteConfirm('Delete Data User', () => handleDelete(row))
          }}
        />
      </UserContext.Provider>
    </div>
  )
}

export default Users