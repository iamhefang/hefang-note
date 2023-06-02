import {useEffect, useState} from "react"

import {time} from "$utils/time"

export default function Clock() {
    const [value, setValue] = useState(time())
    useEffect(() => {
        const timer = setInterval(() => setValue(time()), 1000)

        return () => clearInterval(timer)
    }, [])

    return <span>{value}</span>
}
