import { Component } from '../component';
import { Product } from '../product/product';
import html from './favotites.tpl.html';
import { favService } from '../../services/fav.service';
import { ProductData } from 'types';

class Favorites extends Component {
  products!: ProductData[];

  async render() {
    this.products = await favService.get();

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: false });
      productComp.render();
      productComp.attach(this.view.favorites);
    });
  }
}

export const favoritesComp = new Favorites(html);
