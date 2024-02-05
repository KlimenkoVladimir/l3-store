import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favService } from '../../services/fav.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;
  isInCart?: boolean;
  isInFav?: boolean;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._toggleCart.bind(this);
    this.view.btnFav.onclick = this._toggleFav.bind(this);

    this.isInCart = await cartService.isInCart(this.product);
    this.isInFav = await favService.isInFav(this.product);

    if (this.isInCart) this._setInCart();
    if (this.isInFav) this._setInFav();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _toggleCart() {
    if (!this.product) return;

    if (!this.isInCart) {
      cartService.addProduct(this.product);
      this.isInCart = true;
      this._setInCart();
    } else {
      cartService.removeProduct(this.product);
      this.isInCart = false;
      this._setNotInCart();
    }
  }

  private _toggleFav() {
    if (!this.product) return;

    if (!this.isInFav) {
      favService.addProduct(this.product);
      this.isInFav = true;
      this._setInFav();
    } else {
      favService.removeProduct(this.product);
      this.isInFav = false;
      this._setNotInFav();
    }
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.classList.add('is__inCart');
  }

  private _setNotInCart() {
    this.view.btnBuy.innerText = 'В корзину';
    this.view.btnBuy.classList.remove('is__inCart');
  }

  private _setInFav() {
    this.view.btnFav.innerHTML = `<svg class="svg-icon"><use xlink:href="#heart-fill"></use></svg>`;
  }

  private _setNotInFav() {
    this.view.btnFav.innerHTML = `<svg class="svg-icon"><use xlink:href="#heart"></use></svg>`;
  }
}

export const productDetailComp = new ProductDetail(html);
