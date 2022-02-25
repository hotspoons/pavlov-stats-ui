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

  // TODO why do these require guaranteeing? No examples I saw for even angular 13 + material had these
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected data: any;
  defaultRequest: RequestResponse<Scoreboard>;
  isTwoTeams: boolean = false;
  isCurrentScoreboard: boolean = true; // Presumably false when doing a historical scoreboard search
  currentScoreboard?: Scoreboard;


  constructor(private apiClientService: ApiClientService,
    private changeDetectorRefs: ChangeDetectorRef) {
      super();
      this.dataSource = new MatTableDataSource<Scoreboard>();
      this.defaultRequest = this.getRequest();
  }


  ngOnInit() {
    this.load();
  }

  
  private load(){
    super.isLoading = true;
    this.subs.add(this.apiClientService.getScoreboard(this.getRequest())
      .subscribe(
        { 
          next: (result) => {
              console.log(result);
              this.data = result.results;
              this.dataSource.data = this.data;
              super.setPaginationData(result);
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
              if(this.data.length > 0){
                if(this.isCurrentScoreboard){
                  this.currentScoreboard = this.data[0];
                  if(this.currentScoreboard?.blueTeam != null || this.currentScoreboard?.blueTeam?.length > 0){
                    // TODO pick up here
                  }
                }
              }
              
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      }));
  }

  private getRequest(): RequestResponse<Scoreboard> {
    let requestResponse: RequestResponse<Scoreboard> = {
      offset: BigInt(super.offset), 
      amount: BigInt(super.amount),
      resultCount: BigInt(super.length), 
      sort: super.sortField,
      ascending: super.ascending,
      q: super.filter,
      results: []
  };
  return requestResponse;

  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // TODO why do I have to do this check here, why does the ViewChild not guarantee that sort will be instantiated by the time this runs?
    if(this.sort !== undefined){
        this.sort.sortChange.subscribe((e) => {
          super.setSortValues(e);
          super.sortField = Sort.getSortValueForField(e.active);
          super.ascending = e.direction === 'asc';
          super.offset = 0;
          this.load();
        }
      );
    }
  }

  
  override pageChanged(event: PageEvent) {
   super.pageChanged(event);
    this.load();
  }

  getSortDirection(){
    return super.ascending ? 'asc': 'desc';
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  // TODO debounce
  override applyFilter(event: Event) {
    super.applyFilter(event);
    this.dataSource.filter = super.filter;
    this.offset = Number(this.defaultRequest.offset);
    this.load();
  }
}