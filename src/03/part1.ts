import { createReadStream } from 'fs'
import { createInterface } from 'readline'

(async () => {
    const dre = /([\d]+)/g
    const scre = /[-’/`~!#*$@_%+=,^&(){}[\]|;:”<>?\\]/g
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

        let m

        while ((m = dre.exec(L[1])) !== null) {
            if (
                (L[0].substring(m.index - 1, dre.lastIndex + 1).match(scre)) ||
                (L[1].substring(m.index - 1, dre.lastIndex + 1).match(scre)) ||
                (L[2].substring(m.index - 1, dre.lastIndex + 1).match(scre))
            ) {
                s += parseInt(m[0])
            }
        }
    }

    for await (const l of rsi) {
        p(l)
    }

    p('')

    console.log(s)
})()