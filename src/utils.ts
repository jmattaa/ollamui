export async function getResponse(response: Response, callback: Function) {
    const reader = response.body?.getReader();
    let partialLine = "";

    if (!reader)
        throw Error()

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        const textChunk = new TextDecoder().decode(value);
        const lines = (partialLine + textChunk).split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === "")
                continue;

            const parsedResponse = JSON.parse(line);
            callback(parsedResponse);
        }

    }
}

export function createResponseDiv() {
    const responsearea = document.getElementById("response-area");

    const responseDiv = document.createElement("div");
    responsearea?.appendChild(responseDiv);

    return responseDiv;
}
