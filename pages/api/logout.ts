import withSession from "../../lib/session";

const handler = withSession(async (req, res) => {
	req.session.destroy();
	res.status(200).send("Logged out.");
});

export default handler;
