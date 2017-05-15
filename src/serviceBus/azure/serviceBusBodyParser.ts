
export function parseJson(body: string): any {
	/* Parse body
		try to read the body (and check if is serialized with .NET, int this case remove extra characters)
		http://www.bfcamara.com/post/84113031238/send-a-message-to-an-azure-service-bus-queue-with
		"♠strin3http://schemas.microsoft.com/2003/10/Serialization/��{\"ItemId\":\..."
	*/

	const patterns = [
		/^({.*})$/,
		/^.*?({.*}).*?$/,
		/^.*?\{.*?({.*}).*?$/,
		/^.*?({.*}).*?\}.*?$/,
		/^.*?\{.*?({.*}).*?\}.*?$/
	];

	for (const pattern of patterns) {
		const matches = body.match(pattern);
		if (matches && matches.length >= 2)	{
			try {
				return JSON.parse(matches[1]);
			} catch (err) {
				continue;
			}
		}
	}

	throw new Error("Invalid message body: " + body);
}
