import { Button } from '@mui/material'
import React from 'react'
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  isActive?: boolean
  modalComponent?: React.ReactNode
  modalDetails?: { title: string, maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs', fullWidth?: boolean }
  path?: string
  param?: any
  customComponent?: React.ReactNode
  handleClick?: () => void
}

const CustomToolbarRefresh: React.FC<Props> = (props) => {
  const handleClick = () => {
    typeof props.handleClick === 'function' && props.handleClick()
  }
  return (
    <div>
      {props.customComponent ? props.customComponent : (
        <React.Fragment>
          <Button startIcon={<RefreshIcon />} onClick={() => handleClick()}>
            Refresh
          </Button>
        </React.Fragment>
      )}
    </div>
  )
}

export default CustomToolbarRefresh
