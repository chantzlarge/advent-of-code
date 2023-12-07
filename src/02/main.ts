import { createReadStream } from 'fs'
import { createInterface } from 'readline'

(async () => {
    const rs = createReadStream(process.argv[2])
    const rsi = createInterface({
        input: rs,
        crlfDelay: Infinity
    })
    const g = (l: string) => parseInt(l.match(/^game ([\d]+):/i)?.[1]!)
    const c = (l: string) => l.match(/(([\d]+)\s([red|green|blue]+))/g)?.reduce((p, c) => (a => ({ ...p, [a[1]]: p[a[1]] && p[a[1]] > parseInt(a[0]) ? p[a[1]] : parseInt(a[0]) }))(c.split(' ')), {} as Record<string, number>)

    let i = 0, p = 0

    for await (const l of rsi) {
        const G = g(l)
        const C = c(l)

        i += (12 >= (C?.['red'] ?? 0)) && (14 >= (C?.['blue'] ?? 0)) && (13 >= (C?.['green'] ?? 0)) ? G : 0
        p += ((C?.['red'] ?? 1) * (C?.['blue'] ?? 1) * (C?.['green'] ?? 1))
    }

    console.log(i)
    console.log(p)
})()