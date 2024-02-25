import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Card, CatalogItem } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/Modal';

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
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('items:test', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// events.on('card:open', () => {
// 	modal.render({
// 		content: order.render({
// 			phone: '',
// 			email: '',
// 			valid: false,
// 			errors: [],
// 		}),
// 	});
// });

events.on('items:test', (item) => {
	console.log(item);
});

// Получаем лоты с сервера
api
	.getLarekList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
