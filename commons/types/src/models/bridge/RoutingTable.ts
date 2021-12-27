
export interface RoutingTableItem {
    network: string;
    currency: string;
    fee: string;
}

export interface RoutingTableGroup {
    routingId: string;
    items: RoutingTableItem[];
}

export interface RoutingTable {
    version: string;
    groups: RoutingTableGroup[];
}

export type RoutingTableLookup = { [k: string]: RoutingTableGroup };

/**
 * Populates the lookup for routing table. Every currency points directly 
 * to the group.
 * Run this on the client side to avoid massive multiplication of 
 */
export function routingTablePopulateLookup(r: RoutingTable): RoutingTableLookup {
    const loockup: RoutingTableLookup = {};
    r.groups.forEach(g => {
        g.items.forEach(i => {
            loockup[i.currency] = g;
        })
    });
    return loockup;
}