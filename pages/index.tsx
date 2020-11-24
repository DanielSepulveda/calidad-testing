import Head from "next/head";
import {
	Box,
	Container,
	Center,
	Heading,
	Button,
	IconButton,
	useColorMode,
	Text,
	Skeleton,
	Avatar,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import axios from "axios";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/client";
import { getUserSession } from "../lib/session";
import { Profile as ProfileType } from "../lib/types/client/user";
import queryCache from "../lib/cache";

const fetchUser = async () => {
	const { data } = await axios.get<ProfileType>("/api/me");
	return data;
};

type AsyncDataProps = {
	isLoading: boolean;
};

const AsyncData: React.FC<AsyncDataProps> = ({ isLoading, children }) => {
	if (isLoading) {
		return <Skeleton height="20px" />;
	}

	return <>{children}</>;
};

export default function Home() {
	const { colorMode, toggleColorMode } = useColorMode();
	const router = useRouter();
	const [authSession] = useSession();

	const logout = async () => {
		await axios.post("/api/logout");
		if (authSession) {
			await signOut();
		} else {
			router.push("/signin");
		}
		queryCache.clear();
	};

	const { data, isLoading } = useQuery("me", fetchUser);

	return (
		<Box>
			<Head>
				<title>Home</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header>
				<Box py="1rem">
					<Container maxWidth="4xl" display="flex" justifyContent="flex-end">
						<Box mr="1rem">
							<Button variant="ghost" onClick={logout}>
								Logout
							</Button>
						</Box>
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
								Welcome
							</Heading>
						</Center>
						<Box pt="2rem">
							<Box display="flex" flexDirection="column">
								<Box>
									<Box display="flex" justifyContent="center">
										<Avatar
											size="2xl"
											name={`${data?.name} ${data?.lastname || ""}`}
											src={data?.image}
										/>
									</Box>
								</Box>
								<Box
									mt="1rem"
									display="flex"
									flexDirection="column"
									alignItems="center"
								>
									<Box>
										<Box py="1rem">
											<Text fontWeight="semibold" fontSize="lg">
												Name
											</Text>
											<Box>
												<AsyncData isLoading={isLoading}>
													<Text>{data?.name}</Text>
												</AsyncData>
											</Box>
										</Box>
										<Box py="1rem">
											<Text fontWeight="semibold" fontSize="lg">
												Last name
											</Text>
											<Box>
												<AsyncData isLoading={isLoading}>
													<Text>{data?.lastname || "-"}</Text>
												</AsyncData>
											</Box>
										</Box>
										<Box py="1rem">
											<Text fontWeight="semibold" fontSize="lg">
												Email
											</Text>
											<Box>
												<AsyncData isLoading={isLoading}>
													<Text>{data?.user?.email}</Text>
												</AsyncData>
											</Box>
										</Box>
									</Box>
								</Box>
							</Box>
						</Box>
					</main>
				</Box>
			</Container>
		</Box>
	);
}

export async function getServerSideProps({ req, res }) {
	const user = await getUserSession(req, res);

	if (!user) {
		return {
			props: {},
			redirect: {
				destination: "/signin",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}
