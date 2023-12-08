import { createReadStream } from 'fs'
import { createInterface } from 'readline'

(async () => {
    const are = /([*]{1})/g
    const dre = /([\d]+)/g
    const rs = createReadStream(process.argv[2])
    const rsi = createInterface({
        input: rs,
        crlfDelay: Infinity
    })
    const L: string[] = ['', '', '']
    
    let s = 0
    
    const p = (l: string) => {
        L.shift()
        L.push(l)

        let m: RegExpExecArray | null, n = 0
        
        L.forEach(v => console.log(v))

        while ((m = are.exec(L[1])) !== null) {
            // FIX
            s += L.flatMap(v => v.match(dre)?.filter(x => (((v.indexOf(x) + x.length) >= (m?.index ?? 0)) && (v.indexOf(x) - 1) <= (m?.index ?? 0)))).reduce((p, c, i, a) => p *= (c && a.length === 2) ? parseInt(c) : 0, 1)
        }
        
        console.log()
    }

    for await (const l of rsi) {
        p(l)
    }

    p('')

    console.log(s)
})()