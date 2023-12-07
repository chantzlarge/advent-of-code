import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const single_asterisk_global_re = /([*]{1})/g
const plural_digit_global_re = /([\d]+)/g
const special_char_global_re = /[-’/`~!#*$@_%+=,^&(){}[\]|;:”<>?\\]/g

const p_1 = async (fileName: string) => {
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

const p_2 = async (fileName: string) => {
    const rs = createReadStream(fileName);
    const i = createInterface({
        input: rs,
        crlfDelay: Infinity
    });

    let lines: string[] = ['', '', ''];
    let sum = 0;

    let asteriskMatch;

    for await (const line of i) {
        lines[0] = lines[1];
        lines[1] = lines[2];
        lines[2] = line;

        // Skip processing if the above or below line is not available
        if (lines[1] === '') {
            continue;
        }

        single_asterisk_global_re.lastIndex = 0; // Resetting lastIndex for global regex

        while ((asteriskMatch = single_asterisk_global_re.exec(lines[1])) !== null) {
            const asteriskIndex = asteriskMatch.index;
            const gears: number[] = [];
        
            for (let j = 0; j < 3; j++) {
                plural_digit_global_re.lastIndex = 0; // Resetting lastIndex for global regex
                let numberMatch;
                while ((numberMatch = plural_digit_global_re.exec(lines[j])) !== null) {
                    const numberStart = numberMatch.index;
                    const numberEnd = numberMatch.index + numberMatch[0].length - 1;
        
                    // In the same line (j = 1), check left and right adjacency
                    if (j === 1 && ((numberStart <= asteriskIndex + 1 && numberEnd >= asteriskIndex) || 
                                    (numberStart <= asteriskIndex && numberEnd >= asteriskIndex - 1))) {
                        gears.push(parseInt(numberMatch[0]));
                    }
        
                    // In the above and below lines (j = 0, 2), check for vertical alignment with the asterisk
                    if (j !== 1 && numberStart <= asteriskIndex && numberEnd >= asteriskIndex) {
                        gears.push(parseInt(numberMatch[0]));
                    }
                }
            }
        
            if (gears.length == 2) {
                sum += gears.reduce((p, c) => p * c, 1);
            }
            console.log(gears);
        }        

        console.log();
    }

    single_asterisk_global_re.lastIndex = 0; // Resetting lastIndex for global regex

    lines[0] = lines[1];
    lines[1] = lines[2];
    lines[2] = ''

    console.log(lines[0]);
    console.log(lines[1]);
    console.log(lines[2]);

    while ((asteriskMatch = single_asterisk_global_re.exec(lines[1])) !== null) {
        const asteriskIndex = asteriskMatch.index;
        const gears: number[] = [];
    
        for (let j = 0; j < 3; j++) {
            plural_digit_global_re.lastIndex = 0; // Resetting lastIndex for global regex
            let numberMatch;

            while ((numberMatch = plural_digit_global_re.exec(lines[j])) !== null) {
                const numberStart = numberMatch.index;
                const numberEnd = numberMatch.index + numberMatch[0].length - 1;

                // In the same line (j = 1), check left and right adjacency
                if (j === 1 && ((numberStart <= asteriskIndex + 1 && numberEnd >= asteriskIndex) || 
                                (numberStart <= asteriskIndex && numberEnd >= asteriskIndex - 1))) {
                    gears.push(parseInt(numberMatch[0]));
                }
    
                // In the above and below lines (j = 0, 2), check for vertical alignment with the asterisk
                if (j !== 1 && numberStart <= asteriskIndex && numberEnd >= asteriskIndex) {
                    gears.push(parseInt(numberMatch[0]));
                }
            }
        }
    
        if (gears.length == 2) {
            sum += gears.reduce((p, c) => p * c, 1);
        }
        console.log(gears);
    }  

    return sum;
}

const main = async () => console.log(await p_2(process.argv[2]))

main()