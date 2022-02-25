
import { Sort as MatSortSort } from '@angular/material/sort';
import { Sort } from 'src/app/apiclient/dtos/request-response';
import { PageEvent } from '@angular/material/paginator';
import { RequestResponse } from 'src/app/apiclient/dtos/request-response';
import { environment } from '../environments/environment';

export abstract class BaseTable {
    applyFilter(event: Event) {
        let filterValue: string = (event.target as HTMLInputElement).value;
    
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        
        this.filter = filterValue;
    }
   
    pageSizeOptions: number[] = environment.settings.requestSettings.pageSizeOptions;
    length: number;
    amount: number;
    offset: number;
    pageIndex: number;
    sortField: string;
    ascending: boolean;
    filter: string;
    isLoading: boolean;

    constructor(){
        this.length = 0;
        this.offset = 0;
        this.pageIndex = 0;
        this.amount = environment.settings.requestSettings.defaultAmount;
        this.sortField = environment.settings.requestSettings.defaultSort;
        this.ascending = environment.settings.requestSettings.defaultAscending;
        this.filter = "";
        this.isLoading = false;
    }

    protected setPaginationData(result: RequestResponse<any>) {
        this.length = Number(result.resultCount);
        this.amount = Number(result.amount);
        this.offset = Number(result.offset);
        this.sortField = result.sort;
        this.ascending = result.ascending;
        this.filter = result.q;
        this.isLoading = false;
    }

    protected pageChanged(event: PageEvent) {
        console.log({ event });
        this.amount = event.pageSize;
        this.offset = event.pageIndex * this.amount;
        this.pageIndex = event.pageIndex;
    }

    protected setSortValues(e: MatSortSort){
        this.sortField = Sort.getSortValueForField(e.active);
        this.ascending = e.direction === 'asc';
        this.offset = 0;
    }
}