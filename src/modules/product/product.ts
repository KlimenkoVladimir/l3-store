import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers';
import html from './product.tpl.html';
import { ProductData } from 'types';
import { statService } from '../../services/statistic.service';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;
  observer!: IntersectionObserver;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);
    this.observer = new IntersectionObserver(this._callback.bind(this), { threshold: 0.5 });
    this.observer.observe(this.view.root);
    console.log(this.params);
  }

  private _callback(entries: any, observer: IntersectionObserver) {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        fetch(`/api/getProductSecretKey?id=${this.product.id}`)
          .then((res) => res.json())
          .then((secretKey) => {
            statService.sendViewCard(this.product, secretKey);
          });
        console.log(this.product.log);

        observer.unobserve(entry.target);
      }
    });
  }
}
