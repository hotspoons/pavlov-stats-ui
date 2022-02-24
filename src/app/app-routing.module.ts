import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

// TODO how does this work for a compiled/static site? Is there a preprocessor to generate all the routes?
export const RouteList: Routes = [
  { path: '', redirectTo: '/scoreboard', pathMatch: 'full', data:{label: 'Home'} },
  { path: 'leaderboard', component:  LeaderboardComponent, data:{label: 'Leaderboard'}},
  { path: 'scoreboard', component:  ScoreboardComponent, data:{label: 'Scoreboard'}},

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