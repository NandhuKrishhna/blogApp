
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <main className=" font-satoshi">
            <Outlet />
        </main>
    );
};

export default AuthLayout;
