export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "user";
  resetPasswordToken?: string,
  resetPasswordExpires?: Date,
  createdAt?: Date;
  updatedAt?: Date;
};
