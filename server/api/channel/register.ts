import Pusher from "pusher";

const pusher = new Pusher({
	appId: process.env.PUSHER_APPID || "",
	key: "4956cd21dbf523a6c3d4",
	secret: process.env.PUSHER_SECRET || "",
	cluster: "eu",
	useTLS: true,
});

export default defineEventHandler(async (event) => {
	if (!getRequestPath(event)) {
		return [];
	}
	const id = getQuery(event).id as string;
	if (!id) {
		return 401;
	} else {
		await pusher.trigger(id, "register-channel", id);
		return 204;
	}
});
