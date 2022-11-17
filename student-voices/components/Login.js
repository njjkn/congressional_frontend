import React from 'react'
import { useUser } from '@auth0/nextjs-auth0';

const Login = (props) => {
    const { user, error, isLoading } = useUser();
    return (
        <div
            style={{
                backgroundColor: 'black',
                width: '100px',
                height: '100px'
            }}
        >
            hi
        </div>
    )
}

export default Login;