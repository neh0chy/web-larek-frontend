import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card, CardPreview, CardBasket } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { IProductItem } from './types';
import { Basket } from './components/Basket';

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
			description: item.description,
			price: item.price,
		}),
	});
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
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
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
	let i = 1;
	basket.items = appData.basket.map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
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

// events.on('order:open', () => {
//   modal.render({
//     content: order.render({
//       address: '',
//       payment: 'card',
//       valid: false,
//       errors: []
//     })
//   });
// });

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

// олучаем данные с сервера
api
	.getLarekList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
