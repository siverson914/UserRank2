import { getAIResponse } from "./openai.mjs";
import { saveJsonToFile } from "./fileio.mjs";
import { v4 as uuidv4 } from 'uuid';

export async function getAnswers(personas, questions, numPersonas, numQuestions)
{
    const answers = [];
    const selectedPersonas = personas.slice(0, numPersonas);
    const selectedQuestions = questions.slice(0, numQuestions);

    for (const persona of selectedPersonas)
    {
        for (const question of selectedQuestions)
        {
            const prompt = `Pretend you are being interviewed by a dating matchmaker. I also want you to pretend that you are the persona below. Even if enough information was not provided to answer the question, answer the question and make your best guess as to what that persona would say. Be brief but complete in your answers. Be creative if necessary.\n\nThe persona that you are: ${persona.description}\n\nPlease answer this question briefly: ${question.questionText}`;
            const answer = await getAIResponse(prompt, "gpt-3.5-turbo");
            // const answer = await getAIResponse(prompt, "gpt-4-turbo");

            answers.push({
                answerId: uuidv4(),
                personaId: persona.personaId,
                questionId: question.questionGuid,
                answer: answer
            });

            console.log(`Persona: ${persona.personaId}\nQuestion: ${question.questionGuid}\nAnswer: ${answer}\n\n`);
        }
    }

    return answers;
}
