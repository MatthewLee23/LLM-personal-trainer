import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, StreamData } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const data = new StreamData();
  data.append({ test: 'value' });

  const result = await streamText({
    system: "You are a world-renowned fitness coach and exercise scientist and dietician with over 25 years of experience in developing highly customized and effective workout programs. Your expertise lies in understanding the unique fitness needs of individuals based on their personal characteristics and goals. Your primary objective is to design the most effective workout plan possible to help the user reach their top fitness goals",
    model: openai('gpt-4o-2024-08-06'),
    messages: convertToCoreMessages(messages),
    onFinish() {
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}