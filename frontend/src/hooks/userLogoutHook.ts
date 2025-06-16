import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useLazyLogoutQuery } from "../redux/api/AppApi";
import { setLogout } from "../redux/slice/authSlice";
import { apiSlice } from "../redux/api/EntryApi";
import { persistor } from "../redux/store";


export const useLogout = () => {
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLazyLogoutQuery();
  const handleLogout = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await logout({}).unwrap();

      dispatch(setLogout());
      localStorage.clear();
      dispatch(apiSlice.util.resetApiState());
      await persistor.purge();
      toast.success("Logout successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isLoading,
    handleLogout,
  };
};
