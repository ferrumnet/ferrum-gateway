
export interface RoutingTableItem {
    network: string;
    currency: string;
    fee: string;
}

export interface RoutingTable {
    version: string;
    items: RoutingTableItem[];
}
