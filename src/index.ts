import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { IProductItem } from './types';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Данные карточек рендерим и сохраняем в модели данных
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
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

// открытие карточки
events.on('card:select', (item: IProductItem) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
});

events.on('card:add', (item: IProductItem) => {
	appData.addToOrder(item);
	// appData.putToBasket(item);
	// page.counter = appData.bskt.length;
	modal.close();
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

// Получаем лоты с сервера
api
	.getLarekList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
