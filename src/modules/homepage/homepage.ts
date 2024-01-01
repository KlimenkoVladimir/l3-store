import { addElement, fetchHints } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';

import { ProductList } from '../productList/productList';
import { SearchHints } from '../hints/hints';
import { Hint } from 'types';

class Homepage extends Component {
  popularProducts: ProductList;
  searchHints: SearchHints;

  constructor(props: any) {
    super(props);

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);
    this.searchHints = new SearchHints();
    this.searchHints.attach(this.view.hints);
  }

  render() {
    fetchHints()
      .then((hints: Hint[]) => this.searchHints.update(hints))
      .catch((e) => console.error(e));

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.popularProducts.update(products);
      });

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  }
}

export const homepageComp = new Homepage(html);
