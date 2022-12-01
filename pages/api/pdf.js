import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
    const { url } = req.query;

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    try {
        const response = await fetch(
            url,
            {
                method: "get",
            }
        );

        const resBlob = await response.blob();
        const resBufferArray = await resBlob.arrayBuffer();
        const resBuffer = Buffer.from(resBufferArray);
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        res.write(resBuffer, 'binary');
        res.status(200).end();
    } catch (error) {
        return res.send({ error: `You made an invalid request to download a file ${error}`, status: 400 })
    }
}
