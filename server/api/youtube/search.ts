import { youtube, youtube_v3 as ytV3 } from "@googleapis/youtube";
import { GaxiosResponse } from "gaxios";

const yt = youtube("v3");

export default defineEventHandler(async (event) => {
	if (!event.req.url) {
		return [];
	}
	const url = new URL(event.req.url, `http://${event.req.headers.host}`);
	const query = url.searchParams.get("query");
	if (!query) {
		return {};
	}
	console.log(useRuntimeConfig());
	console.log(useRuntimeConfig().googleApiKey);

	const params: ytV3.Params$Resource$Search$List = {
		auth: useRuntimeConfig().googleApiKey,
		maxResults: 5,
		q: query,
		part: ["snippet"],
	};
	return (await yt.search.list(params, {
		http2: true,
		headers: { Referer: event.req.headers.referer },
	})) as GaxiosResponse<ytV3.Schema$SearchListResponse>;
});
