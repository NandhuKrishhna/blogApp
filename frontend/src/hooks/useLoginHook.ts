
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/AppApi";
import { setCredentials } from "../redux/slice/authSlice";
import type { ErrorResponse, LoginData } from "../types/user";

const useLoginHook = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const handleLogin = async (data: LoginData) => {
        try {
            const response = await login(data).unwrap();
            toast.success(response.message);
            const userData = response.response;
            dispatch(setCredentials(userData));
            navigate("/home")

        } catch (error) {
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }
        }
    }

    return {
        handleLogin,
        isLoginLoading
    }
}

export default useLoginHook