import localforage from 'localforage';
import { ProductData } from 'types';

export class CollectionService {
  DB: string;

  constructor(dbName: string) {
    this.DB = dbName;
  }

  init() {
    this._updCounters();
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
    await localforage.removeItem(this.DB);
    this._updCounters();
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(this.DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(this.DB, data);
    this._updCounters();
  }

  async isInCart(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    //@ts-ignore
    document.querySelectorAll('.js__cart-counter').forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));
  }
}
