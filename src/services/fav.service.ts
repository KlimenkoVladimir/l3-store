import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-fav';

class FavService {
  init() {
    this._updFav();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async clear() {
    await localforage.removeItem(DB);
    this._updFav();
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB, data);
    this._updFav();
  }

  async isInFav(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updFav() {
    const products = await this.get();
    const favElement = document.querySelector('.js__fav') as HTMLElement;

    if (!products.length) {
      favElement.classList.add('hide');
    } else {
      favElement.classList.remove('hide');
    }
  }
}

export const favService = new FavService();
