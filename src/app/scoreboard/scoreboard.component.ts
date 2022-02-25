import { Component, AfterViewInit, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { Sort } from 'src/app/apiclient/dtos/request-response';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiClientService } from '../apiclient/apiclient.service';
import { RequestResponse } from 'src/app/apiclient/dtos/request-response';
//import { Player } from 'src/app/apiclient/dtos/player';
import { BaseTable } from '../base-table.component';
import { Scoreboard } from '../apiclient/dtos/scoreboard';
import { FormControl, FormGroup } from '@angular/forms';
import { Player } from '../apiclient/dtos/player';

@Component({
  selector: 'app-scoreboard',
  styleUrls: ['./scoreboard.component.css'],
  templateUrl: './scoreboard.component.html',
})
export class ScoreboardComponent extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  private subs = new Subscription();

  displayedColumns: string[] = ['playerName', 'kills', 'deaths', 'assists', 'kdr', 
  'games', 'lastPlayed',];

  public dataSource: MatTableDataSource<Scoreboard>;

  range: FormGroup;

  // TODO why do these require guaranteeing? No examples I saw for even angular 13 + material had these
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data: any;
  defaultRequest: RequestResponse<Scoreboard>;
  isCurrentScoreboard: boolean = true; // Presumably false when doing a historical scoreboard search
  title: String = "";



  constructor(private apiClientService: ApiClientService,
    private changeDetectorRefs: ChangeDetectorRef) {
      super();
      this.dataSource = new MatTableDataSource<Scoreboard>();
      this.defaultRequest = this.getRequest();
      this.range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
      });
  }


  ngOnInit() {
    this.load();
  }

  
  private load(){
    super.setLoading(true);
    this.subs.add(this.apiClientService.getScoreboard(this.getRequest())
      .subscribe(
        { 
          next: (result) => {
              console.log(result);
              this.data = result.results;
              this.dataSource.data = this.data;
              super.setRequestData(result);
              if(this.dataSource === undefined){
                this.dataSource = new MatTableDataSource<Scoreboard>(this.data);
                if(this.paginator !== undefined){
                  this.dataSource.paginator = this.paginator;
                }
                if(this.sort !== undefined){
                  this.dataSource.sort = this.sort;
                }
              }
              this.changeDetectorRefs.detectChanges();
              for(let i:number = 0; i < this.data.length; i++){
                this
              }
              if(this.data.length > 0){
                if(this.isCurrentScoreboard){
                  this.title = "Current Scoreboard";
                }
                else{
                  this.title = "Results";
                }
              }
              else{
                if(this.isCurrentScoreboard){
                  this.title = "There is no game currently being played";
                }
                else{
                  this.title = "There are no scoreboards that match your criteria";
                }
              }
              
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      }));
  }



  isTwoTeams(scoreboard: Scoreboard): boolean{
    if(scoreboard.redTeam !== undefined && scoreboard.redTeam.length > 0 && scoreboard.blueTeam !== undefined && scoreboard.blueTeam.length > 0){
      return true;
    }
    return false;
  }
  isEmptyTeam(players: Player[]): boolean{
    if(players === undefined || players.length === 0){
      return true;
    }
    return false;
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // TODO why do I have to do this check here, why does the ViewChild not guarantee that sort will be instantiated by the time this runs?
    if(this.sort !== undefined){
        this.sort.sortChange.subscribe((e) => {
          super.setSortValues(e);
          let sortData = super.getRequest();
          sortData.sort = Sort.getSortValueForField(e.active);
          sortData.ascending = e.direction === 'asc';
          sortData.offset = BigInt(0);
          super.setRequestData(sortData);
          this.load();
        }
      );
    }
  }

  
  override pageChanged(event: PageEvent) {
   super.pageChanged(event);
    this.load();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  // TODO debounce
  override applyFilter(event: Event) {
    super.applyFilter(event);
    let request:RequestResponse<any> = super.getRequest();
    this.dataSource.filter = request.q;
    request.offset = BigInt(0);
    super.setRequestData(request);
    this.load();
  }
}