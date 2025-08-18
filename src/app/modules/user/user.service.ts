import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (
      decodedToken.role === Role.TRAINEE ||
      decodedToken.role === Role.TRAINER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (
      decodedToken.role === Role.TRAINEE ||
      decodedToken.role === Role.TRAINER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const users = await queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  
  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);

  // Safely exclude password field if it exists
  const sanitizedData = data.map(user => {
    const userObject = user.toObject ? user.toObject() : user;
    
    // Check if password exists before removing
    if ('password' in userObject) {
      const { password, ...userWithoutPassword } = userObject;
      return userWithoutPassword;
    }
    return userObject;
  });

  return {
    data: sanitizedData,
    meta,
  };
};

const updateProfile = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Only allow updating specific fields for profile
  const allowedFields = ["name", "phone", "address", "picture"];
  const updateData: Partial<IUser> = {};

  Object.keys(payload).forEach((key) => {
    if (
      allowedFields.includes(key) &&
      payload[key as keyof Partial<IUser>] !== undefined
    ) {
      (updateData as any)[key] = payload[key as keyof Partial<IUser>];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");

  return updatedUser;
};

export const UserServices = {
  getAllUsers,
  updateUser,
  updateProfile,
};
