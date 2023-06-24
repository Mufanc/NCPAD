export function range(n: number, m?: number) {
    if (m !== undefined) {
        console.assert(m >= n)
        return Array.from({ length: m - n }, (_, i) => i + n)
    }
    return Array.from({ length: n }, (_, i) => i)
}
