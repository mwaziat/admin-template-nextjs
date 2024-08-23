import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'
import CustomDialog from '../../dialog';
import { Encrypt } from '@/utils/crypt';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

interface ToolbarAddContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface Props {
  isActive?: boolean
  modalComponent?: React.ReactNode
  modalDetails?: { title: string, maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs', fullWidth?: boolean }
  path?: string
  param?: any
  customComponent?: React.ReactNode
  handleClick?: () => void
}

export const ToolbarAddContext = createContext<ToolbarAddContextProps>({
  open: false,
  setOpen: () => { },
})

const CustomToolbarAdd: React.FC<Props> = (props) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (props.handleClick !== undefined && typeof props.handleClick === 'function') {
      props.handleClick()
    } else {
      if (typeof props.path === 'string' && props.path !== '' && props.modalComponent === undefined) {
        if (props.param !== undefined) {
          const encryptData = Encrypt(JSON.stringify(props.param))
          setCookie(props.path, encryptData, { secure: true })
        }

        router.push(props.path, { scroll: false });
      } else {
        setOpen(true)
      }
    }
  }

  return (
    <React.Fragment>
      <ToolbarAddContext.Provider value={{
        open, setOpen
      }}>
        {props.customComponent ? props.customComponent : (
          <React.Fragment>
            <Button startIcon={<AddIcon />} onClick={() => handleClick()}>
              Add
            </Button>
          </React.Fragment>
        )}
        {props.modalComponent && (
          <CustomDialog
            title={props.modalDetails?.title ? props.modalDetails.title : ''}
            maxWidth={props.modalDetails?.maxWidth ? props.modalDetails.maxWidth : 'md'}
            fullWidth={props.modalDetails?.fullWidth ? props.modalDetails.fullWidth : true}
            openDialog={open}
            onClose={(val) => setOpen(val)}
            bottomRight={false}
            // children={}
            actions={undefined}
          >
            {props.modalComponent}
          </CustomDialog>
        )}
      </ToolbarAddContext.Provider>
    </React.Fragment>
  )
}

export default CustomToolbarAdd