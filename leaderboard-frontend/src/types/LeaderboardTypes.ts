export interface Addresses {
  network: String;
  address: String;
  createdAt: Date;
}

export interface QueryParams {
  filter: { by: string; value: string };
  sort: { by: string; order: string };
  page: number;
  limit: number;
}
