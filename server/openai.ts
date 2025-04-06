import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate a summary from text content
 */
export async function generateSummary(text: string): Promise<string> {
  try {
    const prompt = `Please create a concise educational summary of the following text, highlighting key concepts and important points:\n\n${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Could not generate summary";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate content summary");
  }
}

/**
 * Generate quiz questions from text content
 */
export async function generateQuizQuestions(text: string, numberOfQuestions: number = 5): Promise<any> {
  try {
    const prompt = `Based on the following educational content, generate ${numberOfQuestions} quiz questions with multiple choice answers (4 options per question). For each question, indicate the correct answer. Format the response as JSON with an array of questions, each containing the question text, answer options, and correct answer index.

Content:
${text}

Please provide the response in the following JSON format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    },
    ...
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

/**
 * Generate study notes from text
 */
export async function generateStudyNotes(text: string): Promise<string> {
  try {
    const prompt = `Create comprehensive study notes from the following educational content. Include bullet points, section headings, and highlight key concepts. Format it in markdown for readability:

Content:
${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Could not generate study notes";
  } catch (error) {
    console.error("Error generating study notes:", error);
    throw new Error("Failed to generate study notes");
  }
}

/**
 * Generate a lesson plan from a topic
 */
export async function generateLessonPlan(topic: string, duration: string = "60 minutes"): Promise<string> {
  try {
    const prompt = `Create a detailed lesson plan for teaching "${topic}" in a ${duration} session. Include learning objectives, activities, time allocation, materials needed, and assessment methods. Format the response in markdown.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Could not generate lesson plan";
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw new Error("Failed to generate lesson plan");
  }
}

/**
 * Generate content based on custom instructions
 */
export async function generateCustomContent(instructions: string, reference?: string): Promise<string> {
  try {
    const prompt = `Generate educational content based on these instructions: ${instructions}
    ${reference ? `\n\nReference material:\n${reference}` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    return response.choices[0].message.content || "Could not generate content";
  } catch (error) {
    console.error("Error generating custom content:", error);
    throw new Error("Failed to generate custom content");
  }
}
