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
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import * as yup from "yup";
import NextLink from "next/link";

type FormData = {
	email: string;
	password: string;
};

const schema = yup.object<FormData>({
	email: yup.string().required("The email is required."),
	password: yup.string().required("The password is required"),
});

export default function SignIn() {
	const { colorMode, toggleColorMode } = useColorMode();

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
								onSubmit={(values) => {
									console.log(values);
								}}
								validationSchema={schema}
								validateOnBlur={false}
								validateOnChange={false}
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
