import { createReadStream } from 'fs'
import { createInterface } from 'readline'

(async () => {
    const are = /([*]{1})/g
    const dre = /([\d]+)/g
    const scre = /[-’/`~!#*$@_%+=,^&(){}[\]|;:”<>?\\]/g
    const rs = createReadStream(process.argv[2])
    const rsi = createInterface({
        input: rs,
        crlfDelay: Infinity
    })
    const p = (l: string) => {
        L.shift()
        L.push(l)

        let m: RegExpExecArray | null, n = 0
        
        while ((m = are.exec(L[1])) !== null) {
            // FIX
            const G = L.flatMap(v => v.match(dre)?.filter(x => ((m?.index ?? 0) - 1 >= v.indexOf(x)) && (((m?.index ?? 0) - 1) <= (v.indexOf(x) + x.length))) ?? '1')

            if (G && G.length == 2) n += G.map(v => parseInt(v)).reduce((p, c) => p *= c, 1)
        }

        return n
    }

    const L: string[] = ['', '', '']

    let s = 0

    for await (const l of rsi) {
        s += p(l)
    }

    s += p('')

    console.log(s)
})()