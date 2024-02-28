import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { AppState } from './components/AppState';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card, CardPreview, BasketItem } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Order } from './components/Order';
import { IOrder, IProductItem, IDeliveryForm, IContactsForm } from './types';
import { Contacts } from './components/Contacts';
import { Basket } from './components/Basket';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// модель данных приложения
const appData = new AppState({}, events);

// глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// переиспользуемые части интерфейса
const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketTemplate),
	events
);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// данные карточек рендерим и сохраняем в модели данных
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// открытие карточки с информацией
events.on('card:select', (item: IProductItem) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});

	if (appData.isInBasket(item)) {
		card.setDisabled(card.buttonElement, true);
		card.changeBasketName('Уже в корзине');
	}
});

// установка данных о добавленном элементе корзины
events.on('card:add', (item: IProductItem) => {
	appData.addOrderID(item);
	appData.addBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

// открытие корзины с информацией
events.on('basket:open', () => {
	basket.total = appData.getTotal();
	basket.setDisabled(basket.button, appData.isBasketEmpty);
	let i = 1;
	basket.items = appData.basket.map((item) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: i++,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// удаление товара из корзины
events.on('card:remove', (item: IProductItem) => {
	appData.remBasket(item);
	appData.remOrderID(item);
	page.counter = appData.basket.length;
	basket.setDisabled(basket.button, appData.isBasketEmpty);
	basket.total = appData.getTotal();
	basket.items = appData.basket.map((item) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		let i = 1;
		return card.render({
			title: item.title,
			price: item.price,
			index: i++,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// рендер модалки с заказом
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// рендер модалки с контактами
events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// запуск валидации
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// реакция на выбор способа оплаты
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrder();
});

// обработка изменения поля ввода доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// обработка изменения поля ввода контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IDeliveryForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

//Отправляем форму контактов и открываем окно с успешным заказом
events.on('contacts:submit', () => {
	api
		.makeOrder(appData.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: res.total,
				}),
			});

			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('items:test', (item) => {
	console.log(item);
});

// заморозка прокрутки при открытии модалки
events.on('modal:open', () => {
	page.locked = true;
});

// разморозка прокрутки при закрытии модалки
events.on('modal:close', () => {
	page.locked = false;
});

// получение данных с сервера
api
	.getLarekList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
