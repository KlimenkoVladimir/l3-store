import { Component } from '../component';
import html from './catalog.tpl.html';

import { ProductList } from '../productList/productList';
import { getFetchOptions } from '../../utils/helpers';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
    const options = await getFetchOptions();
    const productsResp = await fetch('/api/getProducts', options);
    const products = await productsResp.json();
    this.productList.update(products);
  }
}

export const catalogComp = new Catalog(html);
