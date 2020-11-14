import Head from "next/head";
import { Formik, Form, Field } from "formik";
import {
	Box,
	Container,
	Center,
	Heading,
	FormErrorMessage,
	FormLabel,
	FormControl,
	Input,
	Button,
	Grid,
	GridItem,
	IconButton,
	useColorMode,
	Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import * as yup from "yup";
import NextLink from "next/link";

type FormData = {
	name: string;
	lastname: string;
	email: string;
	password: string;
	confirmPassword: string;
};

const schema = yup.object<FormData>({
	name: yup.string().required("The name is required."),
	lastname: yup.string().required("The lastname is required."),
	email: yup.string().required("The email is required."),
	password: yup.string().required("The password is required."),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords don't match.")
		.required("Please confirm your password."),
});

export default function Signup() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Box>
			<Head>
				<title>Sign up</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header>
				<Box py="1rem">
					<Container maxWidth="4xl" display="flex" justifyContent="flex-end">
						<IconButton
							aria-label="Toggle Darkmode"
							icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
							onClick={toggleColorMode}
						/>
					</Container>
				</Box>
			</header>

			<Container>
				<Box pt="2em">
					<main>
						<Center>
							<Heading size="2xl" fontWeight="medium">
								Sign up
							</Heading>
						</Center>
						<Box pt="1rem">
							<Formik
								initialValues={{
									name: "",
									lastname: "",
									email: "",
									password: "",
									confirmPassword: "",
								}}
								onSubmit={(values) => {
									console.log(values);
								}}
								validationSchema={schema}
							>
								{({ isSubmitting }) => (
									<Form noValidate>
										<Box py="1rem">
											<Grid
												templateRows="repeat(4, 1fr)"
												templateColumns="repeat(2, 1fr)"
												rowGap={4}
												columnGap={4}
											>
												<GridItem rowSpan={1} colSpan={1}>
													<Field name="name">
														{({ field, form, meta }) => (
															<FormControl
																isInvalid={Boolean(meta.error && meta.touched)}
																id="name"
																isRequired
															>
																<FormLabel>Name</FormLabel>
																<Input {...field} placeholder="Name" />
																<FormErrorMessage>
																	{meta.error}
																</FormErrorMessage>
															</FormControl>
														)}
													</Field>
												</GridItem>
												<GridItem rowSpan={1} colSpan={1}>
													<Field name="lastname">
														{({ field, form, meta }) => (
															<FormControl
																isInvalid={Boolean(meta.error && meta.touched)}
																id="lastname"
																isRequired
															>
																<FormLabel>Last name</FormLabel>
																<Input {...field} placeholder="Last name" />
																<FormErrorMessage>
																	{meta.error}
																</FormErrorMessage>
															</FormControl>
														)}
													</Field>
												</GridItem>
												<GridItem rowSpan={1} colSpan={2}>
													<Field name="email">
														{({ field, form, meta }) => (
															<FormControl
																isInvalid={Boolean(meta.error && meta.touched)}
																id="email"
																isRequired
															>
																<FormLabel>Email</FormLabel>
																<Input {...field} placeholder="Email" />
																<FormErrorMessage>
																	{meta.error}
																</FormErrorMessage>
															</FormControl>
														)}
													</Field>
												</GridItem>
												<GridItem rowSpan={1} colSpan={2}>
													<Field name="password">
														{({ field, form, meta }) => (
															<FormControl
																isInvalid={Boolean(meta.error && meta.touched)}
																id="password"
																isRequired
															>
																<FormLabel>Password</FormLabel>
																<Input
																	{...field}
																	placeholder="Password"
																	type="password"
																/>
																<FormErrorMessage>
																	{meta.error}
																</FormErrorMessage>
															</FormControl>
														)}
													</Field>
												</GridItem>
												<GridItem rowSpan={1} colSpan={2}>
													<Field name="confirmPassword">
														{({ field, form, meta }) => (
															<FormControl
																isInvalid={Boolean(meta.error && meta.touched)}
																id="confirmPassword"
																isRequired
															>
																<FormLabel>Confirm password</FormLabel>
																<Input
																	{...field}
																	placeholder="Confirm password"
																	type="password"
																/>
																<FormErrorMessage>
																	{meta.error}
																</FormErrorMessage>
															</FormControl>
														)}
													</Field>
												</GridItem>
											</Grid>
										</Box>
										<Box d="flex" flexDirection="column" alignItems="center">
											<Button
												my={4}
												colorScheme="blue"
												isLoading={isSubmitting}
												type="submit"
											>
												Submit
											</Button>
											<NextLink href="/signin" passHref>
												<Link color="blue.500">Already have an account?</Link>
											</NextLink>
										</Box>
									</Form>
								)}
							</Formik>
						</Box>
					</main>
				</Box>
			</Container>
		</Box>
	);
}
