// интерфейс данных страницы приложения
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// интерфейс данных приложения (список карточек с сервера, корзина, заказ)
export interface IAppState {
	catalog: IProductItem[];
	basket: IProductItem[];
	delivery: IDeliveryForm | null;
	contact: IContactsForm | null;
	preview: string | null;
	order: IOrder | null;
}

// интерфейс данных единицы товара
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// интерфейс данных заказа для отправки на сервер
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

// интерфейс данных формы с адресом доставки
export interface IDeliveryForm {
	payment: string;
	adress: string;
}

// интерфейс данных формы с контактами
export interface IContactsForm {
	email: string;
	phone: string;
}

// интерфейс данных заказа
export interface IOrder extends IDeliveryForm, IContactsForm {
	items: string[];
	total: number;
}

// интерфейс корзины
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

// интерфейс успешного совершения заказа
export interface ISuccess {
	total: number | null;
}
