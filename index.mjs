import { promises as fs } from 'fs';

import { staticPersonas } from "./personas.mjs";
import { questions } from "./questions.mjs";
import { getAnswers } from "./getAnswers.mjs";

import { readJsonFromFile, saveJsonToFile } from "./fileio.mjs";
import { compareAnswers } from './compareAnswers.mjs';

const numPersonasToProcess = 3;
const numQuestionsToProcess = 3;

async function main()
{
    let personas = null;
    let answers = null;
    let comparisons = null;

    const filePathAnswers = './output/answers.json';
    const filePathComparisons = './output/comparisons.json';
    const filePathScoreTotals = './output/scoretotals.json';
    const filePathPersonas = './output/personas.json';


    // write personas to a JSON file
    // get answers
    try
    {
        const fileExists = await fs.access(filePathPersonas);
        personas = await readJsonFromFile(filePathPersonas);
    } catch (error)
    {
        console.log(filePathAnswers + " not found. Generating.");
        personas = staticPersonas;
        await saveJsonToFile(filePathPersonas, personas);
    }

    // get answers
    try
    {
        const fileExists = await fs.access(filePathAnswers);
        answers = await readJsonFromFile(filePathAnswers);
    } catch (error)
    {
        console.log(filePathAnswers + " not found. Generating.");
        answers = await getAnswers(personas, questions, numPersonasToProcess, numQuestionsToProcess);
        await saveJsonToFile(filePathAnswers, answers);
    }

    // get comparisons
    try
    {
        const fileExists = await fs.access(filePathComparisons);
        comparisons = await readJsonFromFile(filePathComparisons);
    } catch (error)
    {
        console.log(filePathComparisons + " not found. Generating.");
        comparisons = await compareAnswers(answers);
        await saveJsonToFile(filePathComparisons, comparisons);
    }


    //
    // for lookup
    //
    const personaMap = new Map();
    answers.forEach(answer =>
    {
        personaMap.set(answer.answerId, answer.personaId);
    });

    const personaNameMap = new Map();
    personas.forEach(persona =>
    {
        personaNameMap.set(persona.personaId, persona.name);
    });

    // total scores
    const similarityScores = {};
    comparisons.forEach(comparison =>
    {
        // sometimes the json is not valid and we need to skip it
        try
        {

            const persona1Id = personaMap.get(comparison.answer1Id);
            const persona2Id = personaMap.get(comparison.answer2Id);
            const persona1Name = personaNameMap.get(persona1Id);
            const persona2Name = personaNameMap.get(persona2Id);
            const result = JSON.parse(comparison.comparisonResult);
            const score = parseInt(result.similarity_score, 10);

            // Create a unique key for each pair regardless of order
            const key = [persona1Id, persona2Id].sort().join("-");

            if (!similarityScores[key])
            {
                similarityScores[key] = {
                    persona1Id: persona1Id,
                    persona2Id: persona2Id,
                    persona1Name: persona1Name,
                    persona2Name: persona2Name,
                    totalScore: 0
                };
            }

            similarityScores[key].totalScore += score;

        }
        catch (e)
        {
            console.log("Error totaling comparison result: " + e);
        }
    });

    // save results to JSON file
    const jsonScoreTotals = Object.values(similarityScores);
    await saveJsonToFile(filePathScoreTotals, jsonScoreTotals);

    // output to console
    jsonScoreTotals.sort((a, b) => b.totalScore - a.totalScore);
    jsonScoreTotals.forEach(result =>
    {
        console.log(`${result.persona1Name} + ${result.persona2Name} = ${result.totalScore}`);
    });
}

await main();
