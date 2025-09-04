const { GoogleGenAI } =  require('@google/genai');
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function analyzeService(code) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an expert computer science professor specializing in algorithm analysis. Analyze the following C++ code and determine its time complexity and space complexity. You must respond with only a valid JSON object. The JSON object should have two keys: 'timeComplexity' and 'spaceComplexity'. Do not include any other text, explanations, or markdown formatting. The C++ code is:${code}`,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      }
    }
  });
  console.log("RAW AI RESPONSE:", JSON.stringify(result, null, 2)); 
  //const response = await result.response; 
  const text = result.candidates[0].content.parts[0].text;
  try{
    const jsonMatch = text.match(/\{[\s\S]*\}/);
const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

   // const parsed = JSON.parse(text);
    if(parsed.timeComplexity && parsed.spaceComplexity){
        return parsed;
    }
    throw new Error('Failed to parse');
  }
    catch(error){
    return {
        timeComplexity: "Unable to analyze",
        spaceComplexity: "Unable to analyze",
        error: "Failed to parse AI response"
      };
  }
}

module.exports = analyzeService;