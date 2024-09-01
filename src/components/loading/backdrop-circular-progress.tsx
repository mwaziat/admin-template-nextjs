import { Backdrop, Box, CircularProgress } from '@mui/material'
import React from 'react'

const BackdropCircularProgress = () => {
  return (
    
    <Backdrop 
        open={true} 
        sx={{ 
          color: '#fff', 
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
        >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
          <CircularProgress color="inherit" />
        </Box>
      </Backdrop>
  )
}

export default BackdropCircularProgress