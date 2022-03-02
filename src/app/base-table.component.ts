
import { Sort as MatSortSort } from '@angular/material/sort';
import { Sort } from 'src/app/apiclient/dtos/request-response';
import { PageEvent } from '@angular/material/paginator';
import { RequestResponse } from 'src/app/apiclient/dtos/request-response';
import { environment } from '../environments/environment';

export abstract class BaseTable {
    
   
    private pageSizeOptions: number[] = environment.settings.requestSettings.pageSizeOptions;
    private length: number;
    private amount: number;
    private offset: number;
    private pageIndex: number;
    private sortField: string;
    private sortDisplayField: string;
    private ascending: boolean;
    private filter: string;
    private loading: boolean;
    private autoRefreshRate: number;
    baseTable?: BaseTable;
    private refreshInterval?: any;

    constructor(){
        this.length = 0;
        this.offset = 0;
        this.pageIndex = 0;
        this.amount = environment.settings.requestSettings.defaultAmount;
        this.sortField = environment.settings.requestSettings.defaultSort;
        this.sortDisplayField = environment.settings.requestSettings.defaultSortDisplayField;
        this.ascending = environment.settings.requestSettings.defaultAscending;
        this.autoRefreshRate = environment.settings.autoRefreshRate;
        this.filter = "";
        this.loading = false;
    }

    protected setRequestData(result: RequestResponse<any>) {
        this.length = Number(result.resultCount);
        this.amount = Number(result.amount);
        this.offset = Number(result.offset);
        this.sortField = result.sort;
        this.ascending = result.ascending;
        this.filter = result.q;
        this.loading = false;
    }
    getRequest<T>():RequestResponse<T>{
        let requestResponse: RequestResponse<T> = {
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

    protected pageChanged(event: PageEvent) {
        console.log({ event });
        this.amount = event.pageSize;
        this.offset = event.pageIndex * this.amount;
        this.pageIndex = event.pageIndex;
    }

    protected setSortValues(e: MatSortSort){
        this.sortField = Sort.getSortValueForField(e.active);
        this.sortDisplayField = e.active;
        this.ascending = e.direction === 'asc';
        this.offset = 0;
    }

    applyFilter(event: Event) {
        let filterValue: string = (event.target as HTMLInputElement).value;
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        
        this.filter = filterValue;
    }

      // TODO wire these to a toggle switch
  public startAutoRefresh(){
    this.stopAutoRefresh();
    if(this.getAutoRefreshRate() > 0){
      this.refreshInterval = setInterval(() => {
        this.load();
      }, this.getAutoRefreshRate());
    }
  }

  public stopAutoRefresh(){
    if(this.refreshInterval != null){
      clearInterval(this.refreshInterval);
    }
  }

    abstract load(): void;

    protected setChild(baseTable: BaseTable){
        this.baseTable = baseTable;
    }

    protected isLoading(): boolean{
        return this.loading;
    }
    protected setLoading(loading: boolean){
        this.loading = loading;
    }
    getPageSizeOptions(): number[]{
        return this.pageSizeOptions;
    }
    getPageIndex(): number{
        return this.pageIndex;
    }
    protected setPageIndex(pageIndex: number){
        this.pageIndex = pageIndex;
    }

    getSortDirection(): string{
      return this.ascending ? 'asc': 'desc';
    }
    getSortField(): string{
        return this.sortDisplayField;
    }

    getLength(): number{
        return this.length;
    }
    getAmount(): number{
        return this.amount;
    }

    getFilter(): string{
        return this.filter;
    }

    getAutoRefreshRate(): number{
        return this.autoRefreshRate;
    }

    overrideRefreshRate(rateInMs: number){
        this.autoRefreshRate = rateInMs;
    }
}