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
	SimpleGrid,
	IconButton,
	useColorMode,
	Link,
	useToast,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import schema from "../lib/schemas/signin";
import { getUserSession } from "../lib/session";
import { SigningData } from "../lib/types/signin";
import { APIError } from "../lib/types/api";

export default function SignIn() {
	const { colorMode, toggleColorMode } = useColorMode();
	const toastManager = useToast();
	const router = useRouter();

	return (
		<Box>
			<Head>
				<title>Sign in</title>
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
								Sign in
							</Heading>
						</Center>
						<Box pt="1rem">
							<Formik
								initialValues={{
									email: "",
									password: "",
								}}
								validationSchema={schema}
								onSubmit={async (values, formik) => {
									try {
										await axios.post("/api/signin", values);
										router.push("/");
									} catch (e) {
										const error = e as AxiosError<APIError<keyof SigningData>>;
										if (error.response) {
											formik.setSubmitting(false);
											const { formErrors, error: err } = error.response.data;
											if (formErrors !== undefined) {
												formik.setErrors(formErrors);
											} else {
												toastManager({
													title: "Error.",
													description: err,
													status: "error",
													duration: 9000,
													isClosable: true,
												});
											}
										} else {
											toastManager({
												title: "Unkown error.",
												description:
													"Something bad happend, please try again later.",
												status: "error",
												duration: 9000,
												isClosable: true,
											});
										}
									}
								}}
							>
								{({ isSubmitting }) => (
									<Form noValidate>
										<Box py="1rem">
											<SimpleGrid columns={1} gap={6}>
												<Field name="email">
													{({ field, form, meta }) => (
														<FormControl
															isInvalid={Boolean(meta.error && meta.touched)}
															id="email"
															isRequired
														>
															<FormLabel>Email</FormLabel>
															<Input {...field} placeholder="Email" />
															<FormErrorMessage>{meta.error}</FormErrorMessage>
														</FormControl>
													)}
												</Field>
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
															<FormErrorMessage>{meta.error}</FormErrorMessage>
														</FormControl>
													)}
												</Field>
											</SimpleGrid>
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
											<NextLink href="/signup" passHref>
												<Link color="blue.500">Don't have an account?</Link>
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

export async function getServerSideProps({ req, res }) {
	const user = await getUserSession(req, res);

	if (user !== undefined) {
		return {
			props: {},
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}
