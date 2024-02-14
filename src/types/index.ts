// интерфейс данных страницы приложения
interface IPage {
	counter: HTMLElement; // элемент счетчика корзины
	catalog: HTMLElement; // контейнер для отображения карточек
	basket: HTMLElement; // элемент корзины
}

// интерфейс данных приложения
interface IAppState {
	catalog: IProductItem[]; // массив с карточками для отображения
	basket: string[]; // массив с идентификаторами заказов в корзине
	order: IOrder | null; // хранит заказ для отправки на сервер
}

// интерфейс данных единицы товара
interface IProductItem {
	id: string; // идентификатор
	description: string; // описание
	image: string; // ссылка на изображение
	title: string; // название
	category: string; // категория
	price: number; // цена
}

// интерфейс данных заказа
interface IOrder extends IDeliveryForm, IContactsForm {
	total: number; // сумма заказа
	items: string[]; // массив с идентификаторами товаров
}

// интерфейс данных формы с адресом доставки
interface IDeliveryForm {
	payment: string; // способ оплаты
	adress: string; // адрес
}

// интерфейс данных формы с контактами
interface IContactsForm {
	email: string; // почта
	phone: string; // телефон
}

// интерфейс корзины
interface IBasket {
	items: HTMLElement[]; // массив карточек в корзине
	total: number; // сумма заказа
}

// интерфейс успешного совершения заказа
interface ISuccess {
	total: number | null; // сумма заказа с сервера в ответ на успешный заказ
}

// интерфейс данных модального окна
interface IModalData {
	content: HTMLElement;
}
