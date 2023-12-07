import { createReadStream } from 'fs'
import { createInterface } from 'readline'

(async () => {
    const rs = createReadStream(process.argv[2])
    const rsi = createInterface({
        input: rs,
        crlfDelay: Infinity
    })
    const c = (l: string) => l.match(/(([\d]+)\s([red|green|blue]+))/g)?.reduce((p, c) => (a => ({ ...p, [a[1]]: p[a[1]] && p[a[1]] > parseInt(a[0]) ? p[a[1]] : parseInt(a[0]) }))(c.split(' ')), {} as Record<string, number>)

    let s = 0

    for await (const l of rsi) {
        s += (C => (C?.['red'] ?? 1) * (C?.['blue'] ?? 1) * (C?.['green'] ?? 1))(c(l))
    }

    console.log(s)
})()