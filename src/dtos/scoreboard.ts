import { Player }  from './player';

export interface Scoreboard{
    id: string;
    mapName: string;
    gameMode: string;
    player: bigint;
    blueTeam: Array<Player>;
    redTeam: Array<Player>;
}