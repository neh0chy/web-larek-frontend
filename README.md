# Проектная работа "Веб-ларек"

Проект представляет из себя одностраничное приложение с возможностью отображения карточек с товарами для веб-разработчиков. На каждую карточку можно кликнуть для просмотра детальной информации в модальном окне и добавить данный товар в корзину. В корзине можно сделать заказ, выбрав способ оплаты и указав данные для доставки

Архитектура приложения основана на паттерне MVP, который состоит из следующих слоев:

- Model (Данные) — слой работы с данными (получение, добавление, обновление, удаление), выполняет задачи хранения и обработки данных для функционирования приложения
- View (Отображение) — слой, который образует визуальное отображение и загружает в него данные, а также обеспечивает взаимодействие с пользователем (нажатия кнопок, ввод данных)
- Presenter (Представление) — слой, который соединяет слои данных и отображения и производит обработку слушателей

В приложении используется событийно-ориентированный подход, при котором компоненты взаимодействуют друг с другом через брокер событий. В роли Presenter выступает код в основном скрипте приложения index.ts.

Стек:

- HTML
- SCSS
- TS
- Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовые компоненты

### Класс EventEmitter

Организует событийно-ориентированный подход. Позволяет компонентам подписаться на события и уведомлять подписчиков о наступлении события

Конструктор создает пустую коллекцию `this._events = new Map<EventName, Set<Subscriber>>()` для хранения событий и их подписчиков

Методы класса:

- `on<T extends object>(eventName: EventName, callback: (event: T)` — устанавливает обработчик на событие
- `off(eventName: EventName, callback: Subscriber)` — снимает обработчик с события
- `emit<T extends object>(eventName: string, data?: T)` — инициирует события с данными
- `onAll(callback: (event: EmitterEvent) => void)` — устанавливает обработчик на все события
- `offAll()` — сбрасывает обработчик на всех событиях
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - устанавливает коллбэк-триггер, генерирующий событие при вызове

### Класс Component

Получает тип в виде дженерика: `Component<T>`. Является основой для остальных классов в проекте, от которого они наследуются. Реализует возможность работы с разметкой на странице: переключать класс, добавлять атрибуты для модификации поведения видимости элемента, добавлять текстовые данные, а также возвращать разметку готового элемента

Конструктор принимает:

- `container: HTMLElement` — элемент разметки, в который будет вставлен компонент

Методы:

- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключает класс у элемента
- `setText(element: HTMLElement, value: unknown)` — устанавливает текстовое содержимое элемента, проверяя наличие переданного элемента
- `setDisabled(element: HTMLElement, state: boolean)` — делает элемент недоступным для взаимодействия
- `setHidden(element: HTMLElement)` — делает элемент скрытым, принимает DOM-элемент
- `setVisible(element: HTMLElement)` — делает элемент видимым
- `setImage(element: HTMLImageElement, src: string, alt?: string)` — устанавливает теги для изображений
- `render(data?: Partial<T>)` — возвращает результат рендера

### Класс Api

Обеспечивает взаимодействие с сервером для получения готовых и отправки сформированных приложением данных

Конструктор принимает:

- `baseUrl: string` — адрес сервера
- `options: RequestInit = {}` — объект опций

Методы класса:

- `get(uri: string)` — get-запрос на сервер
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` — post-запрос на сервер
- `handleResponse(response: Response)` — обработка ответа с сервера и ошибок

### Класс Model

Получает тип в виде дженерика: `Model<T>`. Класс предназначен для создания модельных данных

Конструктор принимает:

- `data: Partial<T>` — данные
- `events: IEvents` — объект событий

Метод класса:

- `emitChanges(event: string, payload?: object)` — сообщает подписчикам об изменении данных, принимает событие и конкретные данные, связанные с изменением

## Компоненты модели данных

### Класс AppState

Класс хранит текущие данные (состояния) для отдельных элементов приложения и обрабатывает эти данные. Наследует класс Model

Свойства класса:

- `сatalog: IProductItem[]` — массив с карточками для отображения
- `basket: string[]` — массив с идентификаторами заказов в корзине
- `formErrors: FormErrors` — ошибки валидации форм
- `order: IOrder` — хранит заказ для отправки на сервер

Методы класса:

- `setCatalog: void` — добавить карточки товаров
- `addOrderID(item: IProductItem): void` — добавить ID карточки для заказа
- `remOrderID(item: IProductItem)`
- `addBasket(item: IProductItem): void` — добавить переданный элемент в корзину
- `remBasket(item: IProductItem): void` — удалить переданный элемент из корзины
- `clearBasket(): void` — очистить корзину
- `getTotal(): void` — расчёт финальной стоимости корзины
- `setOrderField(field: keyof IContactsForm, value: string): void` — сохранить данные заказа в зависимости от переданного ключа
- `setContactsField(field: keyof IDeliveryForm, value: string): void` — сохранить данные контактов в зависимости от переданного ключа
- `validateOrder(): void` — валидация полей заказа
- `validateContacts(): void` — валидация полей контактов
- `get isBasketEmpty(): boolean` — геттер проверки пустоты корзины

## Компоненты модели представления

### Класс Page

Компонент главной страницы. Добавляет на страницу ленту карточек и вешает слушатель на элемент корзины. Изменяет количество элементов корзины в разметке. Наследует класс Component

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки карточек
- `events: IEvents` — объект событий

Свойства класса:

- `_counter: HTMLElement` — элемент счетчика корзины
- `_catalog: HTMLElement` — контейнер для отображения карточек
- `_wrapper: HTMLElement` — контейнер для блокировки скролла при открытой модалке
- `_basket: HTMLElement` — элемент корзины

Методы класса:

- `set counter(value: number)` — установить в разметку количество элементов корзины
- `set catalog(items: HTMLElement[])` — добавить карточки товаров на главной странице
- `set locked(value: boolean)` — блокировать скролл при открытой модалке

### Класс Card

Получает тип в виде дженерика: `Card<T>`. Компонент отрисовки карточки товара, наследует класс Component. Добавляет поля в карточку и возвращает готовую разметку

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки карточки
- `actions?: ICardActions` — экшены для установки на слушатели событий

Свойства класса:

- `_title: HTMLElement` — элемент названия товара
- `_image: HTMLImageElement` — элемент для вставки изображения
- `_price: HTMLElement` — элемент с ценой товара
- `_category: HTMLElement` — элемент категории товара
- `_categoryColorsList = <Record<string, string>>` — список категорий товаров

Методы класса:

- `set title(value: string)` — установить название товара
- `set image(value: string)` — установить изображение
- `set price(value: number)` — установить цену
- `set category(value: string)` — установить категорию товара

### Класс CardPreview

Компонент отображения информации о карточке в модальном окне, наследует класс Card. Добавляет описание товара, расширяя родительский класс Card

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки карточки
- `actions?: ICardActions` — экшены для установки на слушатели событий

Свойства класса:

- `_description: HTMLElement` — описание единицы товара
- `buttonElement: HTMLButtonElement` — элемент кнопки

Методы класса:

- `changeBasketName(value: string)` — изменить имя для неактивной кнопки
- `set description(value: string)` — установить описание единицы товара

### Класс BasketItem

Компонент единицы товара в модальном окне корзины, наследует класс Card. Устанавливает данные для отображения карточки в корзине

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки карточки
- `actions?: ICardActions` — экшены для установки на слушатели событий

Свойства класса:

- `_buttonElement: HTMLButtonElement` — элемент кнопки
- `_index: HTMLElement` — номер товара в корзине

Методы класса:

- `set index(value: number)`— установить порядковый номер товара

### Класс LarekAPI

Создает запрос на сервер на определенные эндпоинты, наследует класс Api

Конструктор принимает:

- `cdn: string` — адрес сервера с картинками для карточек товаров
- `baseUrl: string` — базовый эндпоинт
- `options?: RequestInit` — опции

Методы класса:

- `getLarekList(): Promise<IProductItem[]>` — получить массив карточек
- `makeOrder(value: IOrder): Promise<IOrderResult>` — разместить заказ на сервере

### Класс Basket

Компонент отображения корзины приложения, наследует класс Component. Устанавливает в разметку суммарную цену и элементы с товарами

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки данных
- `events: EventEmitter` — объект событий

Свойства класса:

- `list: HTMLElement[]` — массив элементов в корзине
- `total: HTMLElement` — элемент с финальной ценой
- `button: HTMLButtonElement` — элемент кнопки

Методы класса:

- `set items(items: HTMLElement[])` — установить список элементов корзины
- `set total(total: number)` — установить общую стоимость в разметку

### Класс Modal

Компонент обтображения модального окна, наследует класс Component. Устанавливает полученные данные и возвращает готовую разметку

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки данных
- `events: IEvents` — объект событий

Свойства класса:

- `_closeButton: HTMLButtonElement` — элемент кнопки закрытия
- `_content: HTMLElement` — контент модального окна

Методы класса:

- `open(): void` — открвает модалку
- `close(): void` — закрывает модалку
- `render(data: IModalData): HTMLElement` — создает разметку с учетом вставленных данных
- `set content(value: HTMLElement)` — установить данные в модалку

### Класс Form

Получает тип в виде дженерика: `Form<T>`. Компонент для отображения и управления формами, наследует класс Component. Предоставляет функционал для проверки форм, валидации, рендера результата

Конструктор принимает:

- `container: HTMLFormElement` — контейнер для вставки данных
- `events: IEvents` — объект событий

Свойства класса:

- `_submit: HTMLButtonElement` — кнопка далее
- `_errors: HTMLElement` — элемент для отображения ошибки

Методы класса:

- `onInputChange(field: keyof T, value: string)` — валидация поля
- `set valid(value: boolean)` — принимает решение о блокировке кнопки
- `set errors(value: string)` — добавляет ошибку
- `render(data: <T>): HTMLFormElement` — установить данные в модалку

### Класс Order

Компонент отображения выбора способа оплаты и формы адреса для доставки, наследует класс Form

Конструктор принимает:

- `container: HTMLElement` — контейнер для вставки данных
- `events: IEvents` — объект событий

Свойства класса:

- `_buttons: HTMLButtonElement[]` — кнопки выбора оплаты

Методы класса:

- `set payment(name: string)` — устанавливает выбранный способ оплаты
- `set address(value: string)` — устанавливает адрес доставки

### Класс Contacts

Компонент отображения формы ввода контактов для совершения заказа, наследует класс Form

Конструктор принимает:

- `container: HTMLFormElement` — контейнер для вставки данных
- `events: IEvents` — объект событий

Свойства класса:

- `nextButton: HTMLButtonElement` — кнопка закрытия модального окна при успешном заказа

Методы класса:

- `setEmail(value: string): void` — устанавливает email
- `setPhone(value: string): void` — устанавливает телефон

### Класс Success

Компонент отображения сообщения об успешном оформлении заказа, наследует класс Component

Конструктор принимает:

- `container: HTMLFormElement` — контейнер для вставки данных
- `events: IEvents` — объект событий

Свойства класса:

- `_close: HTMLElement` — кнопка закрытия окна
- `_total: HTMLElement` — списанное количество денег

Методы класса:

- `set total(total: number | string)` — устанавливает списанное количество денег

## Описание типов данных

```ts
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
```
