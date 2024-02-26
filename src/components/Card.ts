import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { ICardActions, ICard, ICardPreview, ICardBasket } from '../types/index';

export class Card<T> extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _buttonElement: HTMLButtonElement;
	protected _categoryColorsList = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);
		this._category = container.querySelector(`.card__category`);
		this._buttonElement = container.querySelector(`.card__button`);

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
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

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${this._categoryColorsList[value]}`;
	}
}

export class CardPreview extends Card<ICardPreview> {
	protected _description: HTMLElement;
	protected _buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		this._description = container.querySelector(`.card__text`);

		if (actions?.onClick) {
			if (this._buttonElement) {
				container.removeEventListener('click', actions.onClick);
				this._buttonElement.addEventListener('click', actions.onClick);
				this._buttonElement.textContent = 'Купить';
			}
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}

export class CardBasket extends Component<ICardBasket> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _buttonElement: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		container.removeEventListener('click', actions.onClick);
		this._index = container.querySelector(`.basket__item-index`);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		value === null
			? this.setText(this._price, `Бесценно`)
			: this.setText(this._price, `${value} синапсов`);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}
