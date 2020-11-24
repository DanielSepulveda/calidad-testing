import * as yup from "yup";

const schema = yup.object({
	email: yup
		.string()
		.required("The email is required.")
		.email("Please provide a valid email."),
	password: yup.string().required("The password is required"),
});

export default schema;
