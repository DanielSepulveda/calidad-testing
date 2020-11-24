import * as React from "react";
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
	Text,
	Divider,
	useToast,
	InputGroup,
	InputRightElement,
} from "@chakra-ui/react";
import {
	MoonIcon,
	SunIcon,
	CheckIcon,
	ViewIcon,
	ViewOffIcon,
} from "@chakra-ui/icons";
import NextLink from "next/link";
import { signIn } from "next-auth/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FaGithub } from "react-icons/fa";
import schema from "../lib/schemas/signin";
import { getUserSession } from "../lib/session";
import { SigningData } from "../lib/types/signin";
import { APIError } from "../lib/types/api";

export default function SignIn() {
	const [displayPassword, setDisplayPassword] = React.useState(false);
	const [isSocialAuthLoading, setIsSocialAuthLoading] = React.useState(false);
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
				<Box py="2em">
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
								validateOnBlur={false}
								validateOnChange={false}
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
															<InputGroup>
																<Input {...field} placeholder="Email" />
																{meta.touched && !Boolean(meta.error) && (
																	<InputRightElement
																		children={<CheckIcon color="green.500" />}
																	/>
																)}
															</InputGroup>
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
															<Box display="flex">
																<Box flex="1">
																	<InputGroup>
																		<Input
																			{...field}
																			placeholder="Password"
																			type={
																				displayPassword ? "text" : "password"
																			}
																		/>
																		{meta.touched && !Boolean(meta.error) && (
																			<InputRightElement
																				children={
																					<CheckIcon color="green.500" />
																				}
																			/>
																		)}
																	</InputGroup>
																</Box>
																{field.value && field.value.length && (
																	<Box
																		display="flex"
																		alignItems="center"
																		pl="8px"
																	>
																		<IconButton
																			aria-label="Toggle see password"
																			icon={
																				displayPassword ? (
																					<ViewIcon />
																				) : (
																					<ViewOffIcon />
																				)
																			}
																			onClick={() =>
																				setDisplayPassword((prev) => !prev)
																			}
																		/>
																	</Box>
																)}
															</Box>
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
												w="100%"
											>
												Sign in
											</Button>
										</Box>
									</Form>
								)}
							</Formik>
						</Box>
						<Divider />
						<Box py="1rem" display="flex" justifyContent="center">
							<Text fontWeight="semibold">Or</Text>
						</Box>
						<Box display="flex" justifyContent="center">
							<Button
								leftIcon={<FaGithub />}
								variant="solid"
								onClick={() => {
									setIsSocialAuthLoading(true);
									signIn("github");
								}}
								isLoading={isSocialAuthLoading}
							>
								Sign in with github
							</Button>
						</Box>
						<Box
							display="flex"
							justifyContent="center"
							mt="2rem"
							p="1rem"
							backgroundColor="blue.50"
							borderRadius="5px"
						>
							<Text color="black">Don't have an account?</Text>
							<NextLink href="/signup" passHref>
								<Link color="blue.500" ml="8px">
									Sign up
								</Link>
							</NextLink>
						</Box>
					</main>
				</Box>
			</Container>
		</Box>
	);
}

export async function getServerSideProps({ req, res }) {
	const user = await getUserSession(req, res);

	if (user) {
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
