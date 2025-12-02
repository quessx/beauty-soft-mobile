import { DataSource } from "@angular/cdk/collections";
import { signal, Signal, WritableSignal } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, merge, Observable, of } from "rxjs";

export class TableDataSourceBase<T extends TableItem = TableItem> extends DataSource<TableItem> {
    private displayedColumns: string[] = [];
    private displayedColumnsNames: T;
    public data: T[] = [];
    private paginator: MatPaginator | undefined;
    private sort: MatSort | undefined;
    private totalCount: WritableSignal<number> = signal<number>(0);
    protected columnEvents: { [key: string]: Function } = {};
    
    constructor(data: T) {
        super();
        if (!(data instanceof TableItem)) {
            throw new Error('data not instance TableItem');
        }
        this.displayedColumnsNames = data;
        this.displayedColumns = Object.keys(data);
    }

    public getTotalCount(): WritableSignal<number> {
        return this.totalCount;
    }

    setTotalCount(count: Signal<number>): this {
        this.totalCount.set(count());
        return this;
    }

    public getDisplayedColumns(): string[] {
        return this.displayedColumns;
    }

    public getColumnName(columnName: string): string {
        return this.displayedColumnsNames[columnName] || '';
    }

    public getColumnEvent(columnName: string, ...arg: any): void {
        if (this.columnEvents[columnName]) {
            this.columnEvents[columnName](...arg);
        }
    }

    public getDataSource(): T[] {
        return this.data;
    }

    public setPaginator(paginator: MatPaginator): this {
        this.paginator = paginator;
        return this;
    }

    public get _paginator(): MatPaginator | undefined { return this.paginator }

    public setSort(sort: MatSort): this {
        this.sort = sort;
        return this;
    }

    public setDataSource(dataSource: T[]): this {
        if (!Array.isArray(dataSource) || !dataSource.every(data => (data instanceof TableItem))) {
            throw new Error('dataSource must be an array of TableItem');
        }
        this.data = dataSource;
        return this;
    }

    public connect(): Observable<TableItem[]> {
        if (this.paginator && this.sort) {
            // Combine everything that affects the rendered data into one update
            // stream for the data-table to consume.
            return merge(of(this.data), this.paginator.page, this.sort.sortChange).pipe(map(() => {
                return this.getPagedData(this.getSortedData([...this.data]));
            }));
        } else {
            throw Error('Please set the paginator and sort on the data source before connecting.');
        }
    }

    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    public disconnect(): void {}

    /**
     * Paginate the data (client-side). If you're using server-side pagination,
     * this would be replaced by requesting the appropriate data from the server.
     */
    private getPagedData(data: TableItem[]): TableItem[] {
        return data;
        // if (this.paginator) {                
        //     if(this.paginator.pageIndex > 0) {
        //         return data;
        //     } else {
        //         const startIndex: number = this.paginator.pageIndex * this.paginator.pageSize;
        //         return data.splice(startIndex, this.paginator.pageSize);
        //     }
        // } else {
        //     return data;
        // }
    }

    sortData(data: T[], sort: MatSort): T[] {
        return data
    }

    getSortedDataSource() {
        return this.getSortedData(this.getDataSource());
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    private getSortedData(data: TableItem[]): TableItem[] {
        return data;
    }
}

interface ITableItem {
    [name: string]: any;
}

export class TableItem implements ITableItem {
    [name: string]: any;
}

export type TSelectedTableItem = {
    getId?: () => string;
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
