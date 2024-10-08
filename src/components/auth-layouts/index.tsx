import React from 'react'
import { ToastContainer } from 'react-toastify'

interface LayoutAuthProps {
  children: React.ReactNode
}

const LayoutAuth: React.FC<LayoutAuthProps> = ({children}) => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {children}
    </div>
  )
}

export default LayoutAuth
