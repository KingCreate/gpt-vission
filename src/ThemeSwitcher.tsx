import { useState, useEffect } from 'react'

const ThemeSwitcher = () => {
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
            className="px-4 py-2 rounded-md bg-gray-800 text-white"
        >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    )
}

export default ThemeSwitcher
