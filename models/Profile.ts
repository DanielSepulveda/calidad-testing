import mongoose from "mongoose";
import { User } from "./User";

export type Profile<UserType = User> = {
	_id: string;
	name: string;
	lastname?: string;
	user: UserType;
	image?: string;
};

const ProfileSchema = new mongoose.Schema<Profile>({
	name: {
		type: String,
		required: [true, "Please provide a name"],
	},
	lastname: {
		type: String,
	},
	image: {
		type: String,
	},
	user: {
		type: "ObjectId",
		ref: "User",
	},
});

export default mongoose.models.Profile ||
	mongoose.model("Profile", ProfileSchema);
