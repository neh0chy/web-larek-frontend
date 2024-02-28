// интерфейс события
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// интерфейс промиса
export interface ILarekApi {
	getLarekList: () => Promise<IProductItem[]>;
	makeOrder: (value: IOrder) => Promise<IOrderResult>;
}

// тип ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// тип категории товара
export type CatalogItemStatus = {
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
};

// интерфейс данных страницы приложения
export interface IPage {
	counter: HTMLElement; // элемент счетчика корзины
	catalog: HTMLElement; // контейнер для отображения карточек
	basket: HTMLElement; // элемент корзины
}

// интерфейс данных приложения
export interface IAppState {
	catalog: IProductItem[]; // массив с карточками для отображения
	basket: string[]; // массив с идентификаторами заказов в корзине
	order: IOrder; // хранит заказ для отправки на сервер
}

// интерфейс данных единицы товара
export interface IProductItem {
	id: string; // идентификатор
	description: string; // описание
	image: string; // ссылка на изображение
	title: string; // название
	category: string; // категория
	price: number | null; // цена
}

// интерфейс данных единицы товара на главной странице
export interface ICard {
	image: string; // ссылка на изображение
	title: string; // название
	category: string; // категория
	price: number | null; // цена
	description: string; // описание
	index?: number;
}

// интерфейс данных в превью
export interface ICardPreview {
	description: string; // описание
}

export interface ICardBasket {
	title: string; // название
	price: number | null; // цена
	index: number; // индекс в списке
}

// интерфейс данных формы с адресом доставки
export interface IDeliveryForm {
	payment: string; // способ оплаты
	address: string; // адрес
}

// интерфейс данных формы с контактами
export interface IContactsForm {
	email: string; // почта
	phone: string; // телефон
}

// интерфейс данных заказа
export interface IOrder extends IDeliveryForm, IContactsForm {
	total: number; // сумма заказа
	items: string[]; // массив с идентификаторами товаров
}

// интерфейс корзины
export interface IBasket {
	items: HTMLElement[]; // массив карточек в корзине
	total: number; // сумма заказа
}

// интерфейс успешного совершения заказа
export interface ISuccess {
	total: number | null; // сумма заказа с сервера в ответ на успешный заказ
}

// интерфейс данных модального окна
export interface IModalData {
	content: HTMLElement;
}

// интерфейс данных ответа сервера на создание заказа
export interface IOrderResult {
	total: number; // идентификатор заказа
}
