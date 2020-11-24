import { withIronSession, Session, applySession } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from "next";

export type NextApiRequestWithSession = NextApiRequest & {
	session: Session;
};

type Handler = (
	req: NextApiRequestWithSession,
	res: NextApiResponse
) => void | Promise<void>;

const sessionOptions = {
	password: process.env.SECRET_COOKIE_PASSWORD,
	cookieName: "iron-session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production" ? true : false,
	},
};

export const getUserSession = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	await applySession(req, res, sessionOptions);
	const reqWithSession = req as NextApiRequestWithSession;
	const user = reqWithSession.session.get("user");
	return user;
};

export default function withSession(handler: Handler) {
	return withIronSession(handler, sessionOptions);
}
