import { ChakraProvider } from "@chakra-ui/react";
import { Query } from "mongoose";
import { ReactQueryCacheProvider } from "react-query";
import queryCache from "../lib/cache";

function MyApp({ Component, pageProps }) {
	return (
		<ReactQueryCacheProvider queryCache={queryCache}>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</ReactQueryCacheProvider>
	);
}

export default MyApp;
