import OpenAI from 'openai'
import { fileToBase64url } from './fileToBase64url'

export async function getImageChatCompletion(
    apiKey: string,
    prompt: string,
    file: File
) {
    const base64image = await fileToBase64url(file)

    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: prompt,
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: base64image,
                        },
                    },
                ],
            },
        ],
        max_tokens: 1000,
    })

    const answer = completion.choices?.[0].message.content ?? ''
    return answer
}
