class Markov implements Iterable<number> {
    #s: number = 0
    readonly #p: number

    constructor(p: number) {
        this.#p = p
    }

    *[Symbol.iterator]() {
        while (true) {
            if (Math.random() < this.#p) {
                this.#s = 1 - this.#s
            }
            yield this.#s
        }
    }
}

class Smooth implements Iterable<any> {
    readonly #n: number
    readonly #g: Iterable<number>
    #h: number[] = []

    constructor(g: Iterable<number>, n: number) {
        this.#n = n
        this.#g = g
        for (const v of g) {
            this.#h.push(v)
            if (--n <= 0) break
        }
    }

    *[Symbol.iterator]() {
        while (true) {
            this.#h.shift()
            this.#h.push(this.#g[Symbol.iterator]().next().value)
            const sum = this.#h.reduce((a, b) => a + b)
            yield sum / this.#n
        }
    }
}

export class RandomCurve {
    readonly #a: number
    readonly #b: number
    readonly #g: Iterable<number>

    constructor(min: number, max: number, p: number = 0.2, smooth: number = 25, rank: number = 3) {
        console.assert(max > min)
        this.#a = max - min
        this.#b = min
        this.#g = new Markov(p)
        for (let i = 0; i < rank; i++) {
            this.#g = new Smooth(this.#g, smooth)
        }
    }

    next(): number {
        // noinspection LoopStatementThatDoesntLoopJS
        for (const x of this.#g) {
            return x * this.#a + this.#b
        }
        throw 'wtf??'
    }
}
