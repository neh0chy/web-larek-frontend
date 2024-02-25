import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	title: string;
	image: string;
	price: number;
	category: string;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

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

		// this._category = container.querySelector(`.${blockName}__category`);
		console.log(this._price);

		// this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (container) {
				this.container.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		value === null
			? this.setText(this._price, `Бесценно`)
			: this.setText(this._price, `${value} синапсов`);
	}
}

export type CatalogItemStatus = {
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
};

export class CatalogItem extends Card<CatalogItemStatus> {
	protected _category: HTMLElement;
	protected _categoryColorsList = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._category = ensureElement<HTMLElement>(`.card__category`, container);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${this._categoryColorsList[value]}`;
	}
}
