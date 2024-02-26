import { Model } from './base/Model';
import {
	IAppState,
	IOrder,
	IProductItem,
	FormErrors,
	IContactsForm,
	IDeliveryForm,
} from '../types/index';

export type CatalogChangeEvent = {
	catalog: IProductItem[];
};

export class AppState extends Model<IAppState> {
	catalog: IProductItem[];
	basket: IProductItem[] = [];
	formErrors: FormErrors = {};
	order: IOrder = {
		total: 0,
		items: [],
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}

	addOrderID(item: IProductItem) {
		this.order.items.push(item.id);
	}

	remOrderID(item: IProductItem) {
		const index = this.order.items.indexOf(item.id);
		if (index >= 0) {
			this.order.items.splice(index, 1);
		}
	}

	addBasket(item: IProductItem) {
		this.basket.push(item);
	}

	remBasket(item: IProductItem) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}

	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	get isBasketEmpty(): boolean {
		return this.basket.length === 0;
	}

	setOrderField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		// console.log(`field: ${field}` + ' ' + `value: ${value}`);

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IDeliveryForm, value: string) {
		this.order[field] = value;
		// console.log(`field: ${field}` + ' ' + `value: ${value}`);

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.address = 'Необходимо выбрать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
