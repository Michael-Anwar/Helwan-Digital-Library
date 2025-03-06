import React from 'react'
import ANav from './Nav/ANav'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <div>
        <ANav/>
        <Outlet/>
    </div>
  )
}

export default Admin