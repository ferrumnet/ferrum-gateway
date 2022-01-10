import React from 'react';
import { UserBridgeWithdrawableBalanceItem } from "types";

export function renderPaginatedList(items: UserBridgeWithdrawableBalanceItem[],page: number=1,count: number=10) {
    return items.slice(0,((page)*(count)))
}
