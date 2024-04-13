import { useState } from 'react'
import ThemeSwitcher from './utils/ThemeSwitcher'
import { getImageChatCompletion } from './utils/getImageChatCompletion'

function App() {
    const [apiKey, setApiKey] = useState('' as string)
    const [prompt, setPrompt] = useState(
        'take the role of an OCR reader an extract the text from the image in a similar format'
    )
    const [file, setFile] = useState<File | null>(null)

    const [result, setResult] = useState('' as string)

    const onsubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()

        if (!file) {
            return
        }
        const answer = await getImageChatCompletion(apiKey, prompt, file)

        setResult(answer)
    }

    return (
        <>
            <div className="flex flex-col">
                <h1>AI Image Prompt</h1>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <button onClick={onsubmit}>Submit</button>
                <ThemeSwitcher />
                <div className="whitespace-pre-line">{result}</div>
            </div>
        </>
    )
}

export default App
