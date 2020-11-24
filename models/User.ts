import mongoose from "mongoose";

export type User = {
	_id: string;
	email: string;
	password: string;
};

const UserSchema = new mongoose.Schema<User>({
	email: {
		type: String,
		unique: true,
		required: [true, "Please provide an email"],
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
	},
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
