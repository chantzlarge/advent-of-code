import { createReadStream } from 'fs'
import { createInterface } from 'readline'

(async () => {
    const rs = createReadStream(process.argv[2])
    const rsi = createInterface({
        input: rs,
        crlfDelay: Infinity
    })

    const d: Record<string, string> = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
    }

    let s = 0;

    for await (const l of rsi) {
        const m: string[] = []

        for (let i = 0; i < l.length; i++) {
            for (let j = i + 1; j <= l.length; j++) {
                const s = l.substring(i, j).toLowerCase() as string
                if (d[s]) m.push(d[s])
            }
        }

        s += parseInt(m[0] + m[m.length - 1])
    }

    console.log(s)
})()