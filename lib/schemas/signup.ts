import * as yup from "yup";
import zxcvbn from "zxcvbn";

const schema = yup.object({
	name: yup.string().required("The name is required."),
	lastname: yup.string().required("The last name is required."),
	email: yup
		.string()
		.required("The email is required.")
		.email("Please provide a valid email."),
	password: yup
		.string()
		.required("The password is required.")
		.min(6, "Please provide a password longer than 6 characters")
		.test("password-strength", "Password is weak", (val) => {
			if (!val) return false;
			return zxcvbn(val).score > 2;
		}),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords don't match.")
		.required("Please confirm your password."),
});

export default schema;
