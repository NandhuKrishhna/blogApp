import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../redux/slice/authSlice";
import { useLogout } from "../hooks/userLogoutHook";



const Header: React.FC = () => {
    const currentUser = useSelector(selectCurrentUser);
    const { handleLogout, isLoading } = useLogout();
    const navigate = useNavigate();

    const handleClickLogout = async () => {
        await handleLogout();
        navigate("/");
    };

    return (
        <header className="w-full px-6 py-4 flex items-center justify-between bg-white shadow">
            <div className="text-2xl font-bold text-gray-800">📝 Blog App</div>

            {currentUser && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={currentUser.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="avatar"
                            className="w-10 h-10 rounded-full border object-cover"
                        />
                        <span className="text-gray-700 font-medium text-sm">{currentUser.name}</span>
                    </div>

                    <button
                        onClick={handleClickLogout}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
