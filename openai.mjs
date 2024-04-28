import OpenAI from "openai";

const openai = new OpenAI();

export async function getAIResponse(prompt, model)
{
    try
    {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: model
        });
        return completion.choices[0].message.content;
    } catch (error)
    {
        console.error(`Error fetching completion: ${error}`);
        return null;
    }
}

