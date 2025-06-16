
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../redux/slice/authSlice";

const PublicRoute = () => {
  const user = useSelector(selectCurrentUser);
  const token = user?.accessToken;
  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
