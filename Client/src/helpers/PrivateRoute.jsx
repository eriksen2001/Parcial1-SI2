import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))
    const rol = user?.rol

    // no hay token, redirige al login
    if (!token) {
        return <Navigate to="/" replace />
    }

    // Hay token, pero el rol no coincide → redirige al login o a otro lugar
    if (role && rol !== role) {
        return <Navigate to="/" replace/>
    }

    return children
}

export default PrivateRoute