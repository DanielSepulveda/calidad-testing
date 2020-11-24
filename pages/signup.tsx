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
	Grid,
	GridItem,
	IconButton,
	useColorMode,
	Link,
	useToast,
	Text,
	Divider,
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
import zxcvbn from "zxcvbn";
import classnames from "classnames";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import schema from "../lib/schemas/signup";
import { SignupData } from "../lib/types/signup";
import { APIError } from "../lib/types/api";
import styles from "./signup.module.scss";
import { getUserSession } from "../lib/session";

export default function Signup() {
	const [displayPassword, setDisplayPassword] = React.useState(false);
	const { colorMode, toggleColorMode } = useColorMode();
	const toastManager = useToast();
	const router = useRouter();

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
				<Box py="2rem">
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
								onSubmit={async (values, formik) => {
									try {
										await axios.post("/api/signup", values);
										router.push("/");
									} catch (e) {
										const error = e as AxiosError<APIError<keyof SignupData>>;
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
												<GridItem rowSpan={1} colSpan={[2, 1]}>
													<Field name="name">
														{({ field, form, meta }) => (
															<FormControl
																isInvalid={Boolean(meta.error && meta.touched)}
																id="name"
																isRequired
															>
																<FormLabel>Name</FormLabel>
																<InputGroup>
																	<Input {...field} placeholder="Name" />
																	{meta.touched && !Boolean(meta.error) && (
																		<InputRightElement
																			children={<CheckIcon color="green.500" />}
																		/>
																	)}
																</InputGroup>
																<FormErrorMessage>
																	{meta.error}
																</FormErrorMessage>
															</FormControl>
														)}
													</Field>
												</GridItem>
												<GridItem rowSpan={1} colSpan={[2, 1]}>
													<Field name="lastname">
														{({ field, form, meta }) => (
															<FormControl
																isInvalid={Boolean(meta.error && meta.touched)}
																id="lastname"
																isRequired
															>
																<FormLabel>Last name</FormLabel>
																<InputGroup>
																	<Input {...field} placeholder="Last name" />
																	{meta.touched && !Boolean(meta.error) && (
																		<InputRightElement
																			children={<CheckIcon color="green.500" />}
																		/>
																	)}
																</InputGroup>
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
																<InputGroup>
																	<Input {...field} placeholder="Email" />
																	{meta.touched && !Boolean(meta.error) && (
																		<InputRightElement
																			children={<CheckIcon color="green.500" />}
																		/>
																	)}
																</InputGroup>
																<FormErrorMessage>
																	{meta.error}
																</FormErrorMessage>
															</FormControl>
														)}
													</Field>
												</GridItem>
												<GridItem rowSpan={1} colSpan={2}>
													<Field name="password">
														{({ field, form, meta }) => {
															const strength =
																field.value &&
																field.value.length &&
																zxcvbn(field.value).score;
															return (
																<FormControl
																	isInvalid={Boolean(
																		meta.error && meta.touched
																	)}
																	id="password"
																	isRequired
																>
																	<Box mb={1}>
																		<FormLabel>Password</FormLabel>
																	</Box>
																	<Box display="flex">
																		<Box flex="1">
																			{field.value && field.value.length && (
																				<Box
																					className={classnames(
																						styles.strengthMeter,
																						{
																							[styles.strengthMeterDark]:
																								colorMode === "dark",
																						}
																					)}
																				>
																					<Box
																						className={styles.strengthMeterFill}
																						data-strength={strength}
																					/>
																				</Box>
																			)}
																			<InputGroup>
																				<Input
																					{...field}
																					placeholder="Password"
																					type={
																						displayPassword
																							? "text"
																							: "password"
																					}
																				/>
																				{meta.touched &&
																					!Boolean(meta.error) && (
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
																				transform="translate(0px, 8px)"
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
																	<FormErrorMessage>
																		{meta.error}
																	</FormErrorMessage>
																</FormControl>
															);
														}}
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
																<InputGroup>
																	<Input
																		{...field}
																		placeholder="Confirm password"
																		type="password"
																	/>
																	{meta.touched && !Boolean(meta.error) && (
																		<InputRightElement
																			children={<CheckIcon color="green.500" />}
																		/>
																	)}
																</InputGroup>
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
												w="100%"
											>
												Sign up
											</Button>
										</Box>
									</Form>
								)}
							</Formik>
						</Box>
						<Divider />
						<Box
							display="flex"
							justifyContent="center"
							mt="2rem"
							p="1rem"
							backgroundColor="blue.50"
							borderRadius="5px"
						>
							<Text color="black">Already have an account?</Text>
							<NextLink href="/signin" passHref>
								<Link color="blue.500" ml="8px">
									Sign in
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
