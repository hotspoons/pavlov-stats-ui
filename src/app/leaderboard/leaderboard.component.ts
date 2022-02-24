import { Component, AfterViewInit, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiClientService } from '../apiclient/apiclient.service';
import { RequestResponse, Sort } from 'src/app/apiclient/dtos/request-response';
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

  public dataSource!: MatTableDataSource<Player>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  private data: any;
  requestResponse: RequestResponse<Player>;
  pageSizeOptions = environment.settings.requestSettings.pageSizeOptions;
  length: number = 0;
  pageIndex: number = 0;
  pageSize: number = 0;


  constructor(private apiClientService: ApiClientService) {
    this.requestResponse = {
        offset: BigInt(0),      
        amount: BigInt(environment.settings.requestSettings.defaultAmount),
        resultCount: BigInt(0), 
        sort: environment.settings.requestSettings.defaultSort,
        ascending: environment.settings.requestSettings.defaultAscending,       // TODO configuration
        q: "",
        results: []
    };
   }

  ngOnInit() {
    this.subs.add(this.apiClientService.getPlayerStats(this.requestResponse)
      .subscribe((result) => {
        console.log(result);
        this.data = result.results;
        this.dataSource = new MatTableDataSource<Player>(this.data);
        if(this.paginator !== undefined){
          this.dataSource.paginator = this.paginator;
        }
        if(this.sort !== undefined){
          this.dataSource.sort = this.sort;
        }
        
        this.length = Number(result.resultCount);
        this.pageSize = Number(result.amount);
        this.pageIndex = Number(result.offset);

      },
        (err: HttpErrorResponse) => {
          console.log(err);
        }));
  }

  ngAfterViewInit() {
      // If the user changes the sort order, reset back to the first page.
      if(this.sort !== undefined){
          this.sort.sortChange.subscribe(() => {
            if( this.paginator !== undefined){
              this.paginator.pageIndex = 0
            }
          }
        );
      }
      

  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}