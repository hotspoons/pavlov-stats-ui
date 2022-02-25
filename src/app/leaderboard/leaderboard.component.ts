import { Component, AfterViewInit, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { Sort } from 'src/app/apiclient/dtos/request-response';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiClientService } from '../apiclient/apiclient.service';
import { RequestResponse } from 'src/app/apiclient/dtos/request-response';
import { Player } from 'src/app/apiclient/dtos/player';
import { BaseTable } from '../base-table.component';

@Component({
  selector: 'app-leaderboard',
  styleUrls: ['./leaderboard.component.css'],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent extends BaseTable implements OnInit, OnDestroy, AfterViewInit {

  private subs = new Subscription();

  displayedColumns: string[] = ['playerName', 'kills', 'deaths', 'assists', 'kdr', 
  'games', 'lastPlayed',];

  public dataSource: MatTableDataSource<Player>;

  // TODO why do these require guaranteeing? No examples I saw for even angular 13 + material had these
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected data: any;
  defaultRequest: RequestResponse<Player>;


  constructor(private apiClientService: ApiClientService,
    private changeDetectorRefs: ChangeDetectorRef) {
      super();
      this.dataSource = new MatTableDataSource<Player>();
      this.defaultRequest = this.getRequest();
  }


  ngOnInit() {
    this.load();
  }

  
  private load(){
    super.isLoading = true;
    this.subs.add(this.apiClientService.getPlayerStats(this.getRequest())
      .subscribe(
        { 
          next: (result) => {
              console.log(result);
              this.data = result.results;
              this.dataSource.data = this.data;
              super.setPaginationData(result);
              if(this.dataSource === undefined){
                this.dataSource = new MatTableDataSource<Player>(this.data);
                if(this.paginator !== undefined){
                  this.dataSource.paginator = this.paginator;
                }
                if(this.sort !== undefined){
                  this.dataSource.sort = this.sort;
                }
              }
              this.changeDetectorRefs.detectChanges();
              
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      }));
  }

  private getRequest(): RequestResponse<Player> {
    let requestResponse: RequestResponse<Player> = {
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