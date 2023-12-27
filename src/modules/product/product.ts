import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers';
import html from './product.tpl.html';
import { ProductData } from 'types';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  async render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);
    // console.log(this.view.root.onclick);

    // this.view.root.onclick = async (e) => {
    //   e.preventDefault;
    //   console.log('click');

    //   let secretKey = await this.getSecretKey(id);
    //   console.log(secretKey);

    //   await statService.sendViewCard(this.product, secretKey);
    // };
  }

  // async getSecretKey(id: number) {
  //   await fetch(`/api/getProductSecretKey?id=${id}`)
  //     .then((res) => res.json())
  //     .then((receivedKey) => {
  //       console.log(receivedKey);
  //       return receivedKey;
  //     });
  // }
}
