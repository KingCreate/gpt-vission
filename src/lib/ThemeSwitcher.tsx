import { useState, useEffect } from 'react'
import { cn } from './utils'

type props = {
    className?: string
}

const ThemeSwitcher = (props: props) => {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const localStorageDarkmode = localStorage.getItem('darkMode')
        const systemDarkMode = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches
        if (localStorageDarkmode === null) {
            localStorage.setItem('darkMode', String(systemDarkMode))
        }
        const darkMode = localStorageDarkmode
            ? localStorageDarkmode === 'true'
            : systemDarkMode
        document.documentElement.classList.toggle('dark', darkMode)
        setDarkMode(darkMode)
    }, [])

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => {
            console.log('prevMode', prevMode)
            const darkMode = !prevMode
            document.documentElement.classList.toggle('dark', darkMode)
            localStorage.setItem('darkMode', String(darkMode))
            return darkMode
        })
    }

    return (
        <button
            onClick={toggleDarkMode}
            className={cn(
                'px-4 py-2 rounded-md bg-gray-800 text-white',
                props.className
            )}
        >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    )
}

export default ThemeSwitcher
