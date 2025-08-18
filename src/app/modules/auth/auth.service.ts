import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { User } from "../user/user.model";
import type { IUser } from "../user/user.interface";
import { verifyToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }
  const userTokens = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const { email } = decodedToken;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect old password");
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
    }
  );

  return null;
};

const register = async (userData: Partial<IUser>) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  // Hash the password
  if (userData.password) {
    userData.password = await bcryptjs.hash(
      userData.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  // Create auth provider
  userData.auths = [
    {
      provider: "credentials",
      providerId: userData.email as string,
    },
  ];

  // Create the user
  const newUser = await User.create(userData);

  // Remove password from response
  const { password, ...userWithoutPassword } = newUser.toObject();

  return {
    user: userWithoutPassword,
  };
};

const refreshToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  resetPassword,
  register,
  refreshToken,
};
