import { orderBy } from "lodash";
export default class TableUtils {
  /**
   * Filtration with sorting
   * First do Sort then filter
   *
   * @param _entities: any[]
   * @param _queryParams: QueryParamsModel
   * @param _filtrationFields: string[]
   */
  baseFilter(_entities, _queryParams) {
    // Filtration
    // console.log(pageNo, perPage);
    // console.log("start index : ", (pageNo - 1) * perPage);
    // console.log("end index : ");
    // console.log(_entities);
    console.log(_queryParams);
    const {
      pageNumber,
      pageSize,
      sortField,
      sortOrder,
      top,
      filter: { walletAddress },
    } = _queryParams;

    console.log(walletAddress);
    let entitiesResult = [...orderBy([..._entities], sortField, sortOrder)];
    console.log("after order : ", entitiesResult);
    if (walletAddress) {
      entitiesResult = entitiesResult.filter(
        (item) => item.walletAddress === walletAddress
      );
      console.log("after search : ", entitiesResult);
    }

    let total = entitiesResult.length;
    if (top) {
      entitiesResult = entitiesResult?.length
        ? entitiesResult.slice(0, top)
        : [];
      total = entitiesResult.length;
    }
    entitiesResult = entitiesResult?.length
      ? entitiesResult.slice(
          (pageNumber - 1) * pageSize,
          (pageNumber - 1) * pageSize + pageSize
        )
      : [];
    console.log("after paginations : ", entitiesResult);

    return { total, entitiesResult };
  }
}
