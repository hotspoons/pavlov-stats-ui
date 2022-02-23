import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiClientService } from '../apiclient/apiclient.service';
import { RequestResponse, Sort } from 'src/dtos/request-response';
import { Player } from 'src/dtos/player';

@Component({
  selector: 'leaderboard',
  styleUrls: ['leaderboard.component.css'],
  templateUrl: 'leaderboard.component.html',
})
export class LeaderboardComponent implements OnInit, OnDestroy {

  private subs = new Subscription();

  displayedColumns: string[] = ['playerName', 'kills', 'deaths', 'assists', 'kdr', 
  'games', 'lastPlayed',];

  public dataSource!: MatTableDataSource<Player>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dataArray: any;
  requestResponse: RequestResponse<Player>;
  pageSizeOptions = [10,50,100,200];  // TODO configuration

  constructor(private apiClientService: ApiClientService, private _snackBar: MatSnackBar) {
    this.requestResponse = {
        offset: BigInt(0),      // TODO configuration
        amount: BigInt(50),     // TODO configuration
        resultCount: BigInt(0), 
        sort: Sort.KDA,         // TODO configuration
        ascending: false,       // TODO configuration
        q: "",
        results: []
    };
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.subs.add(this.apiClientService.getPlayerStats(this.requestResponse)
      .subscribe((result) => {
        console.log(result);
        this.dataArray = result.results;
        this.dataSource = new MatTableDataSource<Player>(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        (err: HttpErrorResponse) => {
          console.log(err);
        }));
  }

  

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  public openRecord(id: number, name: string): void {
    this._snackBar.open(`Record ${id} ${name} `, 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });    
  }
}