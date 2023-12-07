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

    let s = 0

    for await (const l of rsi) {
        s += ((G, C) => (12 >= (C?.['red'] ?? 0)) && (14 >= (C?.['blue'] ?? 0)) && (13 >= (C?.['green'] ?? 0)) ? G : 0)(g(l), c(l))
    }

    console.log(s)
})()