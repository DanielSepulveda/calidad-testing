import NextAuth, { InitOptions, User as AuthUser } from "next-auth";
import Providers from "next-auth/providers";
import { NextApiRequest, NextApiResponse } from "next";
import { applySession } from "next-iron-session";
import dbConnect from "../../../utils/dbConnect";
import { User, Profile } from "../../../models";
import {
	NextApiRequestWithSession,
	sessionOptions,
} from "../../../lib/session";

const getUserInfoFromGithubAuth = (githubUser: AuthUser) => {
	return {
		name: githubUser.name,
		email: githubUser.email,
		image: githubUser.image,
	};
};

const options: InitOptions = {
	providers: [
		Providers.GitHub({
			clientId: process.env.NEXTAUTH_GITHUB_ID,
			clientSecret: process.env.NEXTAUTH_GITHUB_SECRET,
		}),
	],
	session: {
		jwt: true,
	},
	jwt: {
		secret: process.env.SECRET_COOKIE_PASSWORD,
	},
	pages: {
		signIn: "/signin",
		error: "/signin",
		signOut: "/signin",
	},
	database: process.env.DATABASE_URL,
	debug: process.env.NODE_ENV === "development",
	secret: process.env.SECRET_COOKIE_PASSWORD,
};

export default (req: NextApiRequest, res: NextApiResponse) => {
	return NextAuth(req, res, {
		...options,
		callbacks: {
			signIn: async (user, account, profile) => {
				let userInfo: AuthUser;
				switch (account.provider) {
					case "github": {
						userInfo = getUserInfoFromGithubAuth(user);
					}
				}

				await dbConnect();

				if ((await User.countDocuments({ email: userInfo.email })) > 0) {
					const mongoUser = await User.findOne({ email: userInfo.email });
					await Profile.findByIdAndUpdate(mongoUser._id, {
						name: userInfo.name,
						image: userInfo.image,
					});
				} else {
					const mongoUser = new User({
						email: userInfo.email,
					});
					await mongoUser.save();
					const mongoProfile = new Profile({
						name: userInfo.name,
						image: userInfo.image,
						user: mongoUser._id,
					});
					mongoProfile.save();
				}

				const ironUser = await User.findOne({ email: userInfo.email });

				await applySession(req, res, sessionOptions);
				const reqWithSession = req as NextApiRequestWithSession;
				reqWithSession.session.set("user", ironUser);
				await reqWithSession.session.save();

				return Promise.resolve(true);
			},
			redirect: async (url, baseUrl) => {
				return Promise.resolve(baseUrl);
			},
			session: async (session, user) => {
				return Promise.resolve(session);
			},
			jwt: async (token, user, account, profile, isNewUser) => {
				return Promise.resolve(token);
			},
		},
	});
};
