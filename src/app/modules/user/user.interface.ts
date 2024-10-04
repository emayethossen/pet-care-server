export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  bio?:string,
  phone: string;
  role: "admin" | "user";
  profilePicture?: string; 
  resetPasswordToken?: string,
  resetPasswordExpires?: Date,
  createdAt?: Date;
  updatedAt?: Date;
  followers?: string[];
  following?: string[]; 
};
