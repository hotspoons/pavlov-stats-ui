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
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-leaderboard',
  styleUrls: ['./leaderboard.component.css'],
  templateUrl: './leaderboard.component.html',
})
export class LeaderboardComponent implements OnInit, OnDestroy, AfterViewInit {

  private subs = new Subscription();

  displayedColumns: string[] = ['playerName', 'kills', 'deaths', 'assists', 'kdr', 
  'games', 'lastPlayed',];

  public dataSource: MatTableDataSource<Player>;

  // TODO why do these require guaranteeing? No examples I saw for even angular 13 + material had these
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private data: any;
  pageSizeOptions: any = environment.settings.requestSettings.pageSizeOptions;
  length: number;
  amount: number;
  offset: number;
  pageIndex: number;
  sortField: string;
  ascending: boolean;
  filter: string;
  isLoading: boolean;
  defaultRequest: RequestResponse<Player>;


  constructor(private apiClientService: ApiClientService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<Player>();
    this.length = 0;
    this.offset = 0;
    this.pageIndex = 0;
    this.amount = environment.settings.requestSettings.defaultAmount;
    this.sortField = environment.settings.requestSettings.defaultSort;
    this.ascending = environment.settings.requestSettings.defaultAscending;
    this.filter = "";
    this.isLoading = false;
    this.defaultRequest = this.getRequest();
  }


  ngOnInit() {
    this.load();
  }

  
  private load(){
    this.isLoading = true;
    this.subs.add(this.apiClientService.getPlayerStats(this.getRequest())
      .subscribe(
        { 
          next: (result) => {
              console.log(result);
              this.data = result.results;
              this.dataSource.data = this.data;
              
              this.length = Number(result.resultCount);
              this.amount = Number(result.amount);
              this.offset = Number(result.offset);
              this.sortField = result.sort;
              this.ascending = result.ascending;
              this.filter = result.q;
              this.isLoading = false;
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
      offset: BigInt(this.offset), 
      amount: BigInt(this.amount),
      resultCount: BigInt(this.length), 
      sort: this.sortField,
      ascending: this.ascending,
      q: this.filter,
      results: []
  };
  return requestResponse;

  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // TODO why do I have to do this check here, why does the ViewChild not guarantee that sort will be instantiated by the time this runs?
    if(this.sort !== undefined){
        this.sort.sortChange.subscribe((e) => {
          this.sortField = Sort.getSortValueForField(e.active);
          this.ascending = e.direction === 'asc';
          this.offset = 0;
          this.load();
        }
      );
    }
  }


  pageChanged(event: PageEvent) {
    console.log({ event });
    this.amount = event.pageSize;
    this.offset = event.pageIndex * this.amount;
    this.pageIndex = this.pageIndex;
    this.load();
  }

  getSortDirection(){
    return this.ascending ? 'asc': 'desc';
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  
  // TODO debounce
  applyFilter(event: Event) {
    let filterValue: string = (event.target as HTMLInputElement).value;
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.filter = filterValue;

    this.offset = Number(this.defaultRequest.offset);
    this.load();
  }
}