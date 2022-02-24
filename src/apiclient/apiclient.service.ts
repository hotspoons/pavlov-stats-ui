import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Player } from '../dtos/player';
import { RequestResponse, Sort } from '../dtos/request-response';
import { Scoreboard } from '../dtos/scoreboard';
 
@Injectable({ providedIn: 'root' })
export class ApiClientService{ 
    private baseUrl = "http://localhost:8080";     // TODO configuration
    private leaderboardEndpoint = "/leaderboard";  // TODO configuration
    private scoreboardEndpoing = "/scoreboard";    // TODO configuration
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient) { }

        getPlayerStats(requestResponse: RequestResponse<Player>): Observable<RequestResponse<Player>>{
            let args = {
                params: new HttpParams({
                    fromObject:{
                        offset: Number(requestResponse.offset),
                        amount: Number(requestResponse.amount),
                        sort: Sort[requestResponse.sort],
                        ascending: requestResponse.ascending,
                        q: requestResponse.q
                    }
                })
            };
            return this.http.get<RequestResponse<Player>>(this.baseUrl + this.leaderboardEndpoint, args).
                pipe(
                    tap(_ => {}),
                    catchError(this.handleError<RequestResponse<Player>>('getPlayerStats'))
                );
        }

        private handleError<T>(operation = 'operation', result?: T) {
            return (error: any): Observable<T> => {
        
              // TODO: send the error to remote logging infrastructure
              console.error(error); // log to console instead
        
              // Let the app keep running by returning an empty result.
              return of(result as T);
            };
          }

}