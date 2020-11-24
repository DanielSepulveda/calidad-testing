type FormErrors<T extends string> = Partial<Record<T, string>>;

export type APIError<FormKeys extends string> = {
	error?: string;
	formErrors?: FormErrors<FormKeys>;
};
