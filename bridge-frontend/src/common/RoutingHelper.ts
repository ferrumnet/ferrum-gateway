import { RoutingTableItem, Utils } from "types";
import { BridgeAppState } from "./BridgeAppState";

export class RoutingHelper {
  static groupCurrencies(state: BridgeAppState) {
      const groupId = state.data.state.groupInfo?.groupId || '';
      if (groupId === 'frm') {
          return (state.data.state.groupInfo?.bridgeCurrencies || [])
            .concat(Object.keys(state.data.state.routingTable));
      } else {
          return state.data.state.groupInfo?.bridgeCurrencies || [];
      }
  }

  static targetRoutes(state: BridgeAppState, currency: string): RoutingTableItem[] {
      const items = state.data.state.routingTable[currency]?.items || [] as any;
      return items
        .filter(i => i.currency !== currency);
  }
  static targetCurrencies(state: BridgeAppState, currency: string): string[] {
      return RoutingHelper
        .targetRoutes(state, currency).map(i => i.currency);
  }
  static targetNetworks(state: BridgeAppState, currency: string): string[] {
      if (!currency) {
          return [];
      }
      const [network, ] = Utils.parseCurrency(currency);
      const all = RoutingHelper
        .targetRoutes(state, currency).map(i => i.network).filter(n => n != network);
    return Array.from(new Set(all));
  }
}
