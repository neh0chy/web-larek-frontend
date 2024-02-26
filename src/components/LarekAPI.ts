import { Api, ApiListResponse } from './base/api';
import { IProductItem, IOrderResult, IOrder } from '../types/index';

export interface IAuctionAPI {
	getLarekList: () => Promise<IProductItem[]>;
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

	makeOrder(value: IOrder): Promise<IOrderResult> {
		return this.post('/order', value).then((data: IOrderResult) => data);
	}
}
