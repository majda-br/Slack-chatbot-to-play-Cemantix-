import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function handler(word1: string, word2: string): Promise<string> {
    const body = {
        sim1: word1,
        sim2: word2,
        lang: "fr",
        type: "General Word2Vec",
    };
    const similarityResponse = await fetch(
        "http://nlp.polytechnique.fr/similarityscore",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );
    const similarityResponseJson = await similarityResponse.json();
    return Number(similarityResponseJson.simscore).toString();
}

const extractGuess = async (req: Request) => {
    let score: string;
    const slackPayload = await req.formData();
    const guess = await slackPayload.get("text")?.toString();
    if (!guess) {
        throw Error("Guess is empty or null");
    }
    else {
        score = await handler(guess, 'chien');
        return new Response(score);
    }
};

serve(extractGuess);