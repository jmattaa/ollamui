<script lang="ts">
    import { getResponse, createResponseDiv } from "../utils";

    let selectedModel: string;
    let availableModels: string[] = [];
    fetch("http://localhost:11434/api/tags").then(async (data) => {
        let availableModelsObj = await data.json();

        for (let i = 0; i < availableModelsObj.models.length; i++) {
            const availableModel = availableModelsObj.models[i];
            availableModels.push(availableModel.model);
        }

        // for some reason i need to do this so svelte detects a change
        availableModels = availableModels;
        selectedModel = availableModels[0];
    });

    let promptInp = "";

    const sendPrompt = (e: Event) => {
        e.preventDefault();

        fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: selectedModel,
                prompt: promptInp,
            }),
        }).then(async (res) => {
            const responseDiv = createResponseDiv();
            await getResponse(res, (parsedRes: any) => {
                responseDiv.append(parsedRes.response);
            });
        });

        promptInp = "";
    };
</script>

<form>
    <div class="flex bg-gray-900 mx-5 mb-3 rounded-xl">
        <textarea
            id="prompt"
            rows="1"
            class="block w-full p-4 ps-3 text-sm text-white border-none
                    rounded-lg bg-gray-900 placeholder-gray-400
                    outline-none resize-none"
            placeholder="Prompt"
            bind:value={promptInp}
        />
        <select class="bg-black" bind:value={selectedModel}>
            {#each availableModels as value}
                <option {value}>{value}</option>
            {/each}
        </select>
        <button
            disabled={!promptInp}
            type="submit"
            on:click={sendPrompt}
            class="right-2 rounded-lg border border-gray-700
                    bg-black p-0.5 text-white enabled:bg-black
                    disabled:text-gray-400 disabled:opacity-10 my-2 mx-3"
            ><span data-state="closed"
                ><svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-white"
                    ><path
                        d="M7 11L12 6L17 11M12 18V7"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path></svg
                ></span
            >
        </button>
    </div>
</form>
