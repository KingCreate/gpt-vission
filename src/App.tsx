import { useState } from 'react'
import { getImageChatCompletion } from './lib/getImageChatCompletion'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader } from './components/ui/card'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './components/ui/form'
import { Textarea } from './components/ui/textarea'
import { ScrollArea } from './components/ui/scroll-area'
import ThemeSwitcher from './lib/ThemeSwitcher'

const formSchema = z.object({
    apiKey: z.string().min(1),
    prompt: z.string().min(1),
    file: z.any(),
})

function App() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            apiKey: localStorage.getItem('apiKey') ?? '',
            prompt:
                localStorage.getItem('prompt') ??
                'take the role of an OCR reader an extract the text from the image in a similar format ignoring superscripts',
            file: '',
        },
    })

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState('')

    const onsubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        if (!values.file) {
            setLoading(false)
            return
        }
        localStorage.setItem('apiKey', values.apiKey)
        localStorage.setItem('prompt', values.prompt)
        try {
            const answer = await getImageChatCompletion(
                values.apiKey,
                values.prompt,
                values.file
            )
            setResult(answer)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <header className="flex justify-between items-center h-16 bg-secondary text-secondary-foreground p-4">
                <h1 className="text-xl">AI Image Prompt</h1>
                <ThemeSwitcher className="" />
            </header>
            <div className="justify-center items-center flex mt-8">
                <Card className="flex flex-col items-center w-full max-w-[516px]">
                    <CardHeader>AI Image Prompt</CardHeader>
                    <CardContent className="space-y-2 w-full">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onsubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    name="apiKey"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Api Key</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="prompt"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prompt</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="file"
                                    control={form.control}
                                    render={({
                                        field: {
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            value,
                                            onChange,
                                            ...fieldProps
                                        },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="file:text-foreground"
                                                    {...fieldProps}
                                                    onChange={(event) =>
                                                        onChange(
                                                            event.target
                                                                .files?.[0]
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="w-full text-center">
                                    <Button type="submit" disabled={loading}>
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        <div className="flex flex-row justify-between">
                            <h2>Result:</h2>
                            <Button
                                size={'sm'}
                                onClick={() => {
                                    navigator.clipboard.writeText(result)
                                }}
                                className={result ? 'block' : 'hidden'}
                            >
                                copy
                            </Button>
                        </div>
                        <ScrollArea className="whitespace-pre-wrap h-[200px] border shadow rounded-md p-2">
                            {loading ? 'Loading...' : result}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default App
