import mongoose from "mongoose";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import SessionModel from "../models/session.model";
import { UserModel } from "../models/user.model";
import appAssert from "../utils/appAssert";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { AccessTokenPayload, RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";


//TODO move types to types.ts
export type CreateAccountParams = {
    name: string,
    email: string,
    password: string,
    profilePicture?: string
}
export type LoginAccountParams = {
    email: string,
    password: string
}
export const createAccount = async (data: CreateAccountParams) => {
    const existingUser = await UserModel.exists({
        email: data.email,
    });
    appAssert(!existingUser, CONFLICT, "Email already in use");
    const user = await UserModel.create({
        name: data.name,
        email: data.email,
        password: data.password,
        profilePicture: data.profilePicture

    });
    const session = await SessionModel.create({
        userId: user._id,
        expiresAt: oneYearFromNow()
    });
    const refreshToken = signToken(
        {
            sessionId: session._id,
        },
        refreshTokenSignOptions
    );
    const accessToken = signToken({
        userId: user._id as mongoose.Types.ObjectId,
        sessionId: session._id,
    });
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };


}

export const loginUser = async (data: LoginAccountParams) => {
    const user = await UserModel.findOne({ email: data.email });
    appAssert(user, UNAUTHORIZED, "Invalid email or password");
    const isValid = await user.comparePassword(data.password);
    appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

    const userId = user._id as mongoose.Types.ObjectId;
    const session = await SessionModel.create({
        userId,
    });
    const sessionInfo: RefreshTokenPayload = {
        sessionId: session._id,
    };

    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
    const accessToken = signToken({
        ...sessionInfo,
        userId,
    });
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };

}


export const setRefreshToken = async (refreshToken: string) => {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
        secret: refreshTokenSignOptions.secret,
    });
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
    const session = await SessionModel.findById(payload.sessionId);
    const now = Date.now();
    appAssert(
        session && session.expiresAt.getTime() > now,
        UNAUTHORIZED,
        "Session expired"
    );
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh
        ? signToken(
            {
                sessionId: session._id,
            },
            refreshTokenSignOptions
        )
        : undefined;

    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id,
    });

    return {
        accessToken,
        newRefreshToken,
    };
}


export const logoutUser = async (payload: AccessTokenPayload) => {
    await SessionModel.findByIdAndDelete(payload.sessionId);
};