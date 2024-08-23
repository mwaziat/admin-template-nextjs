import { Box, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface ExpendedProps {
  open: boolean,
  isApplicable: boolean,
  label: string,
  component: React.ReactNode,
  data?: any,
  handleCheckbook?: (val: any) => void
}

const Expanded = (props: ExpendedProps) => {
  const [open, setOpen] = useState(!!props.open)
  const [openCheckbook, setOpenCheckbook] = useState(!!props.open)

  const handleCheckbook = () => {
    setOpenCheckbook(!openCheckbook)
    if (typeof props.handleCheckbook === 'function') {
      const data = props.data
      const updatedData = { ...data, open: !open, isApplicable: !openCheckbook }
      props.handleCheckbook(updatedData)
    }
  }

  useEffect(() => {
    if (
      props.isApplicable === false &&
      openCheckbook === false &&
      open === true
    ) {
      setOpen(false)
    }
  }, [open, openCheckbook, props.isApplicable])

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{ display: 'flex', flexDirection: 'row', cursor: props.isApplicable === false && openCheckbook === false ? 'auto' : 'pointer' }}
          onClick={
            props.isApplicable === false && openCheckbook === false
              ? undefined
              : () => setOpen(!open)
          }
        >
          {!open && (
            <ChevronRightIcon
              color='primary'
              onClick={
                props.isApplicable === false && openCheckbook === false
                  ? undefined
                  : () => setOpen(true)
              }
            />
          )}
          {open && (
            <ExpandMoreIcon
              color='primary'
              onClick={
                props.isApplicable === false && openCheckbook === false
                  ? undefined
                  : () => setOpen(false)
              }
            />
          )}
          <Typography component="h2" variant="body1" color="primary" gutterBottom>
            {props.label}
          </Typography>
        </div>
        <div>
          {props.isApplicable === false && (
            <Checkbox
              color='primary'
              inputProps={{ 'aria-label': props.label }}
              checked={openCheckbook}
              onChange={() => handleCheckbook()}
            />
          )}
        </div>
      </div>
      {open && props.component}
    </div>
  )
}

export default Expanded
