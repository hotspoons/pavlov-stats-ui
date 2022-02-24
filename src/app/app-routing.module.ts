import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
export const RouteList: Routes = [
  { path: '', redirectTo: '/scoreboard', pathMatch: 'full', data:{label: 'Home'} },
  { path: 'scoreboard', component:  ScoreboardComponent, data:{label: 'Scoreboard'}},
  { path: 'leaderboard', component:  LeaderboardComponent, data:{label: 'Leaderboard'}},
];

export const appRouting = RouterModule.forRoot(RouteList);

@NgModule({
  imports: [
    RouterModule.forRoot(RouteList),
    CommonModule
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }