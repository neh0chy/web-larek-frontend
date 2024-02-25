import { Model } from './base/Model';
import { IAppState, IOrder, IProductItem } from '../types/index';

export type CatalogChangeEvent = {
	catalog: IProductItem[];
};

export class AppState extends Model<IAppState> {
	catalog: IProductItem[];
	basket: string[];
	order: IOrder = {
		total: 0,
		items: [],
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}
	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
		// console.log(this.catalog);
	}

	addToOrder(item: IProductItem) {
		this.order.items.push(item.id);
	}

	// clearBasket() {
	// 	this.order.items.forEach((id) => {
	// 		this.toggleOrderedLot(id, false);
	// 		this.catalog.find((it) => it.id === id).clearBid();
	// 	});
	// }

	// getTotal() {
	// 	return this.order.items.reduce(
	// 		(a, c) => a + this.catalog.find((it) => it.id === c).price,
	// 		0
	// 	);
	// }

	// setPreview(item: LotItem) {
	// 	this.preview = item.id;
	// 	this.emitChanges('preview:changed', item);
	// }

	// getActiveLots(): LotItem[] {
	// 	return this.catalog.filter(
	// 		(item) => item.status === 'active' && item.isParticipate
	// 	);
	// }

	// getClosedLots(): LotItem[] {
	// 	return this.catalog.filter(
	// 		(item) => item.status === 'closed' && item.isMyBid
	// 	);
	// }

	// setOrderField(field: keyof IOrderForm, value: string) {
	// 	this.order[field] = value;

	// 	if (this.validateOrder()) {
	// 		this.events.emit('order:ready', this.order);
	// 	}
	// }

	// validateOrder() {
	// 	const errors: typeof this.formErrors = {};
	// 	if (!this.order.email) {
	// 		errors.email = 'Необходимо указать email';
	// 	}
	// 	if (!this.order.phone) {
	// 		errors.phone = 'Необходимо указать телефон';
	// 	}
	// 	this.formErrors = errors;
	// 	this.events.emit('formErrors:change', this.formErrors);
	// 	return Object.keys(errors).length === 0;
	// }
}
