import { Api, ApiListResponse } from './base/api';
import { IProductItem } from '../types/index';

export interface IAuctionAPI {
	getLarekList: () => Promise<IProductItem[]>;
	// getLotItem: (id: string) => Promise<ILot>;
	// getLotUpdate: (id: string) => Promise<LotUpdate>;
	// placeBid(id: string, bid: IBid): Promise<LotUpdate>;
	// orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements IAuctionAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getLarekList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// getLotItem(id: string): Promise<ILot> {
	// 	return this.get(`/lot/${id}`).then((item: ILot) => ({
	// 		...item,
	// 		image: this.cdn + item.image,
	// 	}));
	// }

	// getLotUpdate(id: string): Promise<LotUpdate> {
	// 	return this.get(`/lot/${id}/_auction`).then((data: LotUpdate) => data);
	// }

	// placeBid(id: string, bid: IBid): Promise<LotUpdate> {
	// 	return this.post(`/lot/${id}/_bid`, bid).then((data: ILot) => data);
	// }

	// orderLots(order: IOrder): Promise<IOrderResult> {
	// 	return this.post('/order', order).then((data: IOrderResult) => data);
	// }
}
