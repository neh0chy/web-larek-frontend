import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICardActions, IProductItem } from '../types/index';

export class Card<T> extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _buttonElement?: HTMLButtonElement;
	protected _categoryColorsList = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._price = ensureElement<HTMLImageElement>(
			`.${blockName}__price`,
			container
		);
		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		this._description = container.querySelector(`.${blockName}__text`);
		console.log(this._description);
		this._buttonElement = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._buttonElement) {
				this._buttonElement.addEventListener('click', actions.onClick);
				this._buttonElement.textContent = 'Купить';
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${this._categoryColorsList[value]}`;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set price(value: number) {
		value === null
			? this.setText(this._price, `Бесценно`)
			: this.setText(this._price, `${value} синапсов`);
	}

	set description(value: string) {
		console.log(value);
		this.setText(this._description, value);
	}
}

// export class CatalogItem extends Card {
// protected _category: HTMLElement;
// protected _categoryColorsList = <Record<string, string>>{
// 	'софт-скил': 'soft',
// 	другое: 'other',
// 	дополнительное: 'additional',
// 	кнопка: 'button',
// 	'хард-скил': 'hard',
// };

// constructor(container: HTMLElement, actions?: ICardActions) {
// 	super('card', container, actions);
// 	this._category = ensureElement<HTMLElement>(`.card__category`, container);
// }

// set category(value: string) {
// 	this.setText(this._category, value);
// 	this._category.className = `card__category card__category_${this._categoryColorsList[value]}`;
// }
// }
