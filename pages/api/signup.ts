import bcrypt from "bcryptjs";
import { validateYupSchema, yupToFormErrors } from "formik";
import { isEmpty } from "lodash";
import dbConnect from "../../utils/dbConnect";
import { User, Profile } from "../../models";
import withSession from "../../lib/session";
import schema from "../../lib/schemas/signup";
import { SignupData } from "../../lib/types/signup";
import { APIError } from "../../lib/types/api";

const errorBuilder = (err: APIError<keyof SignupData>) => ({ ...err });

const handler = withSession(async (req, res) => {
	const values = req.body as SignupData;

	await dbConnect();

	try {
		await validateYupSchema(values, schema);
	} catch (e) {
		const errors = yupToFormErrors<SignupData>(e);

		if (!isEmpty(errors)) {
			return res.status(400).json(errorBuilder({ formErrors: errors }));
		}

		return res.status(400).json(errorBuilder({ error: "Unkown form error" }));
	}

	if ((await User.countDocuments({ email: values.email })) > 0) {
		return res.status(403).json(
			errorBuilder({
				error: "A user already exists with the email provided.",
			})
		);
	}

	const { password, email, confirmPassword: _, ...profileValues } = values;

	const bcryptSalt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hash(password, bcryptSalt);

	const user = await User.create({
		email,
		password: hashedPassword,
	});

	try {
		user.save();
	} catch {
		return res.status(500).send(errorBuilder({ error: "Error creating user" }));
	}

	const profile = await Profile.create({
		...profileValues,
		user: user._id,
	});

	try {
		profile.save();
	} catch {
		return res
			.status(500)
			.send(errorBuilder({ error: "Error creating profile" }));
	}

	req.session.set("user", user);
	await req.session.save();

	res.status(200).send("Logged in");
});

export default handler;
