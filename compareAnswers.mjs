import { getAIResponse } from "./openai.mjs";
import { readJsonFromFile, saveJsonToFile } from "./fileio.mjs";

export async function compareAnswers(answers)
{
    const comparisons = [];

    for (let i = 0; i < answers.length; i++)
    {
        for (let j = i + 1; j < answers.length; j++)
        {
            if (answers[i].questionId === answers[j].questionId && answers[i].personaId !== answers[j].personaId)
            {

                const prompt = `You are an expert dating matchmaker. You have two clients that have both answered the same question. I'd like for you to evaluate their answers and provide: (1) an integer from 0 to 10 for how similar their answers are for potentially dating, and (2) a short, witty, funny comment about their two answers. Make the witty comment one short sentence. Return result in JSON.\n\nAnswer 1: ${answers[i].answer}\n\nAnswer 2: ${answers[j].answer}\n\nExample response: {"similarity_score": 8, "witty_comment": "Wow you both love movies, maybe an action comedy would be the perfect movie night for you two!"}`;
                const comparisonResult = await getAIResponse(prompt, "gpt-3.5-turbo");
                // const comparisonResult = await getAIResponse(prompt, "gpt-4-turbo");

                comparisons.push({
                    answer1Id: answers[i].answerId,
                    answer2Id: answers[j].answerId,
                    questionId: answers[i].questionId,
                    comparisonResult: comparisonResult
                });

                console.log(`Comparison: ${comparisonResult}\n`);
            }
        }
    }
    return comparisons;
}
