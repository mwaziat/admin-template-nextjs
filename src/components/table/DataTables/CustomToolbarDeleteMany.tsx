import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react'

interface Props {
  isActive?: boolean
  modalComponent?: React.ReactNode
  modalDetails?: { title: string, maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs', fullWidth?: boolean }
  path?: string
  param?: any
  customComponent?: React.ReactNode
  handleClick?: () => void
}

const CustomToolbarDeleteMany: React.FC<Props> = (props) => {
  const handleClick = () => {
    typeof props.handleClick === 'function' && props.handleClick()
  }
  return (
    <div>
      {props.customComponent ? props.customComponent : (
        <React.Fragment>
          <Button startIcon={<DeleteIcon />} onClick={() => handleClick()}>
            Delete Many
          </Button>
        </React.Fragment>
      )}
    </div>
  )
}

export default CustomToolbarDeleteMany