import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Player } from './dtos/player';
import { RequestResponse, Sort } from './dtos/request-response';
import { Scoreboard } from './dtos/scoreboard';
import { environment } from '../../environments/environment';
 
@Injectable({ providedIn: 'root' })
export class ApiClientService { 
    private baseUrl = environment.settings.api.baseUrl;
    private leaderboardEndpoint = environment.settings.api.leaderboardEndpoint;
    private scoreboardEndpoint = environment.settings.api.scoreboardEndpoing;
    

    constructor(
        private http: HttpClient) { }

    getPlayerStats(requestResponse: RequestResponse<Player>): Observable<RequestResponse<Player>>{
        let args = {
            headers: new HttpHeaders(environment.settings.api.httpHeaders),
            params: new HttpParams({
                fromObject:{
                    offset: Number(requestResponse.offset),
                    amount: Number(requestResponse.amount),
                    sort: Sort.getValue(requestResponse.sort),
                    ascending: requestResponse.ascending,
                    q: requestResponse.q
                }
            })
        };
        return this.http.get<RequestResponse<Player>>(this.baseUrl + this.leaderboardEndpoint, args);
    }

    getScoreboard(requestResponse: RequestResponse<Scoreboard>): Observable<RequestResponse<Scoreboard>>{
        let args = {
            headers: new HttpHeaders(environment.settings.api.httpHeaders),
            params: new HttpParams({
                fromObject:{
                    offset: Number(requestResponse.offset),
                    amount: Number(requestResponse.amount),
                    sort: Sort.getValue(requestResponse.sort),
                    ascending: requestResponse.ascending,
                    q: requestResponse.q
                }
            })
        };
        return this.http.get<RequestResponse<Scoreboard>>(this.baseUrl + this.scoreboardEndpoint, args);
    }
}