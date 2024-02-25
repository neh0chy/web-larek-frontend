// интерфейс события
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

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
	order: IOrder | null; // хранит заказ для отправки на сервер
}

// интерфейс данных единицы товара
export interface IProductItem {
	id: string; // идентификатор
	description: string; // описание
	image: string; // ссылка на изображение
	title: string; // название
	category: string; // категория
	price: number; // цена
}

// интерфейс данных единицы товара на главной странице
export interface ICard {
	title: string;
	image: string;
	price: number;
	category: string;
}

// интерфейс данных в превью
export interface ICardPreview {
	text: string;
}

// интерфейс данных заказа
export interface IOrder extends IDeliveryForm, IContactsForm {
	total: number; // сумма заказа
	items: string[]; // массив с идентификаторами товаров
}

// интерфейс данных формы с адресом доставки
export interface IDeliveryForm {
	payment: string; // способ оплаты
	adress: string; // адрес
}

// интерфейс данных формы с контактами
export interface IContactsForm {
	email: string; // почта
	phone: string; // телефон
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
