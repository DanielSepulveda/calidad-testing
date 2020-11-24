import { User as UserType } from "../../../models/User";
import { Profile as ProfileType } from "../../../models/Profile";

export type User = Omit<UserType, "password">;
export type Profile = ProfileType<User>;
