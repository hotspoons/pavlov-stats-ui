
export interface Player{
    uuid: string;
    playerName: string;
    kills: bigint;
    deaths: bigint;
    assists: bigint;
    kdr: number;
    games: bigint;
    lastPlayed: Date;
    changed: boolean;
}
