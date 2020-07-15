export interface Orders {
  id?: number;
  type?: string;
  status?: string;
  create_at?: Date;
  client: number;
  salse_quot: number[];
}
