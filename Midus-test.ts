function getClockAngle(hh_mm: string): number {
    const [hourBeforeParse, minuteBeforeParse] = hh_mm.split(":")
    const hour = parseInt(hourBeforeParse)
    const minute = parseInt(minuteBeforeParse)

    const hourAngle = 360 / 12 // ==30 หน่วยองศาของเข็มนาฬิกาชั่วโมง
    const minuteAngle = 360 / 60 // ==6 หน่วยองศาของเข็มนาฬิกานาที

    const hourPosition = (hour % 12) * hourAngle + (minute / 60) * hourAngle //องศาเข็มชั่วโมง
    const minutePosition = minute * minuteAngle //องศาเข็มนาที

    const findDifference = Math.abs(hourPosition - minutePosition)

    return Math.min(360 - findDifference, findDifference)
}

// console.log(getClockAngle('09:00'))
// console.log(getClockAngle('17:30'))

function getQuestionPart(terms: string[]): string[] {
    let commond: string = terms[0].toUpperCase()
    for (const word of terms) {
        let fullWord: string = ''
        for (let i = 0; i < commond.length; i += 2) {
            const currentWord: string = commond[i]
            const nextWord: string = commond[i + 1]
            for (const [ii, char] of word.split('').entries()) {
                if (currentWord == char && nextWord == word[ii + 1]) {
                    fullWord += char + word[ii + 1]
                } else if (currentWord == char && nextWord == word[ii - 1]) {
                    fullWord += char
                }
            }
        }
        commond = fullWord
    }

    return terms.map(term => term.replace(new RegExp(commond, "i"), ""))
}

// const terms = ["BATHROOM", "BATH SALTS", "BLOODBATH"] 
// const questionParts = getQuestionPart(terms)
// console.log(questionParts) 

function quickestPath(board: { ladders: [number, number][]; snakes: [number, number][]; }): number[] {
    // return array of roll results that reach 100 in the shortest possible way.
    let ladderUp: number[] = []
    let ladderTo: number[] = []
    let snakeDown: number[] = []
    let snakeTo: number[] = []
    let results: number[] = []

    function findClosestValue(target: number, numbers: number[]): number | undefined {

        const greaterNumbers = numbers.filter(number => number > target);

        if (greaterNumbers.length === 0) {
            return undefined;
        }

        return greaterNumbers.reduce((closest, current) => {
            return current < closest ? current : closest;
        })
    }

    for (const num of board.ladders) {
        ladderUp.push(num[0])
        ladderTo.push(num[1])
    }

    for (const num of board.snakes) {
        snakeDown.push(num[0])
        snakeTo.push(num[1])
    }

    let round: number = 1
    while (round < 100) {
        let setRound = round + 1
        const page = [6, 5, 4, 3, 2, 1]
        // const roll = Math.max(...page)
        const ladderNearMe = findClosestValue(round, ladderUp)
        const sneakNearMe = findClosestValue(round, snakeDown)

        const canGoUp = ladderNearMe ? (ladderNearMe - round) <= 6 : false
        if (!canGoUp) {
            for (const num of page) {
                if ((num + round) === sneakNearMe) {
                    continue
                }
                results.push(num)
                setRound = round + num
                break
            }
        } else {
            const roll = (ladderNearMe ? ladderNearMe : 6)
            results.push(roll - round)
            setRound = ladderTo[ladderUp.indexOf(roll)]
        }

        round = setRound
    }

    return results
}

const resultsOfGame = quickestPath({
    ladders: [[3, 39], [14, 35], [31, 70], [44, 65], [47, 86], [63, 83], [71, 93]],
    snakes: [[21, 4], [30, 8], [55, 38], [79, 42], [87, 54], [91, 48], [96, 66]]
})
console.log(resultsOfGame)