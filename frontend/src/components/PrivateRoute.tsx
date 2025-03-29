//import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children} : any) => {
    let _ud : any = localStorage.getItem('user_data');
    if (!_ud) {return <Navigate to='/login'/>}
    return children;
}

export default PrivateRoute;