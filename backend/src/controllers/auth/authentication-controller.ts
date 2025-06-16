import { Request, Response } from "express";
import catchErrors from "../../utils/catchErrors";
import { clearAuthCookies, generateRefreshTokenCookieOptions, getAccessTokenCookieOptions, setAuthCookies } from "../../utils/setAuthCookies";
import { loginSchema, userRegisterSchema } from "../../utils/validation/auth-validation";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http";
import { createAccount, loginUser, logoutUser, setRefreshToken } from "../../services/auth-services";
import appAssert from "../../utils/appAssert";
import { verifyToken } from "../../utils/jwt";





export const registerHandler = catchErrors(async (req: Request, res: Response) => {
    const userData = userRegisterSchema.parse({ ...req.body });
    const { user, accessToken, refreshToken } = await createAccount(userData);
    return setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json({
            success: true,
            message: "Account created successfully",
            response: { ...user, accessToken },
        });

})
export const loginHandler = catchErrors(async (req: Request, res: Response) => {
    const userData = loginSchema.parse({
        ...req.body,
    });
    const { accessToken, refreshToken, user } = await loginUser(userData);
    return setAuthCookies({ res, accessToken, refreshToken })
        .status(OK)
        .json({
            message: "Login successful",
            response: { ...user, accessToken },
        });
});

export const refreshHandler = catchErrors(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token, please log in again");
    const { accessToken, newRefreshToken } = await setRefreshToken(refreshToken);
    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, generateRefreshTokenCookieOptions());
    }
    return res.status(OK).cookie("accessToken", accessToken, getAccessTokenCookieOptions()).json({
        message: "Access token refreshed",
        accessToken,
    });
});


export const logoutHandler = catchErrors(async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    const { payload } = verifyToken(accessToken || "");
    if (payload) {
        await logoutUser(payload);
    }
    return clearAuthCookies(res).status(OK).json({
        message: "Logout successful",
    });
});
