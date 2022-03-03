import { Player }  from './player';

export interface Scoreboard{
    id: string;
    mapName: string;
    mapDisplayName: string;
    gameMode: string;
    playerCount: string;
    started: Date;
    concluded:Date;
    blueTeam: Array<Player>;
    redTeam: Array<Player>;
}