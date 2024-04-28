import { promises as fs } from 'fs';

export async function saveJsonToFile(filenameOutput, jsonToWrite)
{
    try
    {
        const data = JSON.stringify(jsonToWrite, null, 2);
        await fs.writeFile(filenameOutput, data);
        console.log(`Saved: ${filenameOutput} (${jsonToWrite.length})`);
    } catch (error)
    {
        console.error(`Failed to save file: ${error}`);
    }
}

export async function readJsonFromFile(filenameInput)
{
    try
    {
        const data = await fs.readFile(filenameInput, 'utf8');
        const json = JSON.parse(data);
        console.log(`Loaded: ${filenameInput} (${json.length})`);
        return json;
    } catch (error)
    {
        console.error(`Failed to read file: ${error}`);
        return null;
    }
}

