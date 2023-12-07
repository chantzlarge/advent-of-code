import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const plural_digit_global_re = /([\d]+)/g
const special_char_global_re = /[-’/`~!#*$@_%+=,^&(){}[\]|;:”<>?\\]/g

const p = async (fileName: string) => {
    const rs = createReadStream(fileName)
    const i = createInterface({
        input: rs,
        crlfDelay: Infinity
    })
    const L: string[] = ['']

    let r;
    let s = 0

    for await (const l of i) {
        L.push(l)

        if (L.length < 3) {
            continue
        }

        if (L.length > 3) {
            L.shift()
        }

        while ((r = plural_digit_global_re.exec(L[1])) !== null) {
            if (
                L[0].substring(r.index - 1, plural_digit_global_re.lastIndex + 1).match(special_char_global_re) ||
                L[1].substring(r.index - 1, plural_digit_global_re.lastIndex + 1).match(special_char_global_re) ||
                L[2].substring(r.index - 1, plural_digit_global_re.lastIndex + 1).match(special_char_global_re)
            ) {
                s += parseInt(r[0])
            }
        }
    }

    L.push('')
    L.shift()

    while ((r = plural_digit_global_re.exec(L[1])) !== null) {
        if (
            L[0].substring(r.index - 1, plural_digit_global_re.lastIndex + 1).match(special_char_global_re) ||
            L[1].substring(r.index - 1, plural_digit_global_re.lastIndex + 1).match(special_char_global_re) ||
            L[2].substring(r.index - 1, plural_digit_global_re.lastIndex + 1).match(special_char_global_re)
        ) {
            s += parseInt(r[0])
        }
    }

    return s
}

const main = async () => console.log(await p(process.argv[2]))

main()