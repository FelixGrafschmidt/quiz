import { youtube, youtube_v3 as ytV3 } from "@googleapis/youtube";
import { GaxiosResponse } from "gaxios";

const yt = youtube("v3");

export default defineEventHandler(async (event) => {
	if (!getRequestPath(event)) {
		return 401;
	}
	const query = getQuery(event).query as string;
	if (!query) {
		return {};
	}
	const pageToken = getQuery(event).pagetoken as string;

	const params: ytV3.Params$Resource$Search$List = {
		auth: useRuntimeConfig().googleApiKey,
		maxResults: 5,
		q: query,
		part: ["snippet"],
		pageToken,
	};
	return (await yt.search.list(params, {
		http2: true,
		headers: { Referer: getRequestHeader(event, "Referer") },
	})) as GaxiosResponse<ytV3.Schema$SearchListResponse>;
});
