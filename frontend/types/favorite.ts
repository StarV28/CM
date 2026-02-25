export type FavoriteCoin = {
  userId: number;
  coinId: number;
  symbol: string;
};
export interface FavoriteCoinRes {
  success: boolean;
  message?: string;
  data?: Favorite[];
}
export type Favorite = {
  id: number;
  userId: number;
  symbol: string;
  coinId: number;
  createdAt: string;
};
