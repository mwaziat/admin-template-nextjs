'use client'
import GridTableMui from '@/components/table/GridTableMui';
import React, { createContext, useEffect, useState } from 'react'
import AddUser from './form/add';
import { UserColumns } from '@/utils/columns/users-management/user';

interface UserContextType {
  fetchData: () => void;
}

export const UserContext = createContext<UserContextType>({
  fetchData: () => { },
})

const Users = () => {
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


  return (
    <div>
      <UserContext.Provider value={{ fetchData }}>
        <GridTableMui
          // rows={data}
          serverSide={{
            isActive: true,
            path: `${process.env.NEXT_PUBLIC_API_SERVER!}/users-management/users/view-data`,
            exclude: ['password']
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
          toolbarDeleteMany={{ isActive: true, handleClick: () => console.log("Delete") }}
          defaultColumnsAction={{
            isActive: true,
            isShowEditButton: true,
            isModalEdit: true,
            editModalDetails: {
              title: 'Edit User',
              maxWidth: 'xl'
            },
            editModalComponent: (props) => <p>Test</p>
          }}
        />
      </UserContext.Provider>
    </div>
  )
}

export default Users