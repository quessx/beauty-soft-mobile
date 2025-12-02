import { ActivatedRoute, Router } from "@angular/router";
import { TableDataSourceBase, TableItem } from "@ui/table/table-datasource.model";


export type TClientsTable = {
    id?: string;
    orderName: string,
    phone: string,
    email: string,
    orderSoldAmountAmount: string,
    visits: string,
    orderDiscount: string,
    last_visit: string,
}

export interface IClientsTable extends TClientsTable {
    getId(): string
}

export class ClientsTableDataSource extends TableDataSourceBase<ClientsTableItem> {
    private router: Router | undefined;
    private route: ActivatedRoute | undefined;
    constructor(data: ClientsTableItem) {
        super(data);
        this.columnEvents = {
            'orderName': (index: number) => {
                if (!this.route || !this.router || !this.getDataSource()[index]) {
                    return;
                }
                this.router.navigate([`./${this.getDataSource()[index].getId()}`], {relativeTo: this.route});
            }
        }
    }

    setRouter(router: Router): this {
        this.router = router;
        return this;
    }

    setRoute(route: ActivatedRoute): this {
        this.route = route;
        return this;
    }
}

export class ClientsTableItem extends TableItem implements IClientsTable {
    #id: string = '';
    orderName: string = '';
    phone: string = '';
    email: string = '';
    orderSoldAmountAmount: string = '';
    visits: string = '';
    orderDiscount: string = '';
    last_visit: string = '';
    constructor(data: TClientsTable) {
        super();
        this.#id = data.id || '';
        this.orderName = data.orderName;
        this.phone = data.phone;
        this.email = data.email;
        this.orderSoldAmountAmount = data.orderSoldAmountAmount;
        this.visits = data.visits;
        this.orderDiscount = data.orderDiscount;
        this.last_visit = data.last_visit;
    }

    getId(): string {
        return this.#id;
    }
}