import dbConnect from "../../utils/dbConnect";
import { User } from "../../models";
import bcrypt from "bcryptjs";
import { validateYupSchema, yupToFormErrors } from "formik";
import { isEmpty } from "lodash";
import withSession from "../../lib/session";
import schema from "../../lib/schemas/signin";
import { SigningData } from "../../lib/types/signin";
import { APIError } from "../../lib/types/api";

const errorBuilder = (err: APIError<keyof SigningData>) => ({ ...err });
const invalidLoginError = errorBuilder({
	formErrors: {
		email: "Email or password is invalid",
		password: "Email or password is invalid",
	},
});

const handler = withSession(async (req, res) => {
	const values = req.body as SigningData;

	await dbConnect();

	try {
		await validateYupSchema(values, schema);
	} catch (e) {
		const errors = yupToFormErrors<SigningData>(e);

		if (!isEmpty(errors)) {
			return res.status(400).json(errorBuilder({ formErrors: errors }));
		}

		return res.status(400).json(errorBuilder({ error: "Unkown form error" }));
	}

	const user = await User.findOne({ email: values.email });

	if (!user) {
		return res.status(400).json(invalidLoginError);
	}

	if (await bcrypt.compare(values.password, user.password)) {
		req.session.set("user", user);
		await req.session.save();
		return res.status(200).send("Logged in");
	} else {
		return res.status(400).json(invalidLoginError);
	}
});

export default handler;
