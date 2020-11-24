import { withIronSession, Session, applySession } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

export type NextApiRequestWithSession = NextApiRequest & {
	session: Session;
};

type Handler = (
	req: NextApiRequestWithSession,
	res: NextApiResponse
) => void | Promise<void>;

export const sessionOptions = {
	password: process.env.SECRET_COOKIE_PASSWORD,
	cookieName: "iron-session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production" ? true : false,
	},
};

const getUserIronSession = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	await applySession(req, res, sessionOptions);
	const reqWithSession = req as NextApiRequestWithSession;
	const user = reqWithSession.session.get("user");
	return user;
};

const getUserAuthSession = async (req: NextApiRequest) => {
	const session = await getSession({ req });
	return session;
};

export const getUserSession = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const userIronSession = await getUserIronSession(req, res);
	const userAuthSession = await getUserAuthSession(req);

	return userIronSession || userAuthSession;
};

export default function withSession(handler: Handler) {
	return withIronSession(handler, sessionOptions);
}
