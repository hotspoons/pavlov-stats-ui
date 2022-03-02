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


  constructor(private apiClientService: ApiClientService,
    private changeDetectorRefs: ChangeDetectorRef) {
      super();
      super.setChild(this);
      this.dataSource = new MatTableDataSource<Player>();
  }


  ngOnInit() {
    this.load();
    super.startAutoRefresh();
  }
  
  public load(){
    super.setLoading(true);
    this.subs.add(this.apiClientService.getPlayerStats(super.getRequest())
      .subscribe(
        { 
          next: (result) => {
              console.log(result);
              this.data = result.results;
              this.dataSource.data = this.data;
              super.setRequestData(result);
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
              super.setLoading(false);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      }));
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