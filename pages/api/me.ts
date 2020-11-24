import dbConnect from "../../utils/dbConnect";
import { Profile } from "../../models";
import { User as UserType } from "../../models/User";
import withSession from "../../lib/session";
import { APIError } from "../../lib/types/api";

const errorBuilder = (err: APIError<any>) => ({ ...err });

const handler = withSession(async (req, res) => {
	const user = req.session.get<UserType>("user");

	if (user === undefined) {
		return res.status(401).send("Please login.");
	}

	await dbConnect();

	try {
		const userProfile = await Profile.findOne({ user: user._id }).populate(
			"user",
			{
				password: 0,
			}
		);
		return res.status(200).json(userProfile);
	} catch (_) {
		return res.status(404).json(errorBuilder({ error: "Profile not found." }));
	}
});

export default handler;
