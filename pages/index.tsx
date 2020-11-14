import Head from "next/head";
import { Container, Box, Heading } from "@chakra-ui/react";

export default function Home() {
	return (
		<Container maxW="5xl">
			<Head>
				<title>Calidad - Testing</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<Box bg="gray.400">
					<Heading>Home</Heading>
				</Box>
			</main>

			<footer></footer>
		</Container>
	);
}
