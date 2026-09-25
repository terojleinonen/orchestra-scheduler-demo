// "1 tapahtuma", "5 tapahtumaa"
export const formatCount = (n: number) => `${n} ${n === 1 ? "tapahtuma" : "tapahtumaa"}`
