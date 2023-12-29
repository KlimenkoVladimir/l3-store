import { genUUID } from '../utils/helpers';
import { ProductData, StatisticData } from 'types';

class StatService {
  async sendStatistic(data: StatisticData) {
    try {
      let response = await fetch('/api/sendEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data, timestamp: Date.now() })
      });
      let result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error sending route:', error);
    }
  }

  async sendRoute(url: string) {
    const data = {
      type: 'route',
      payload: { url: url }
    };
    this.sendStatistic(data);
  }

  async sendViewCard(product: ProductData, secretKey: string) {
    const type = Object.keys(product.log).length ? 'viewCardPromo' : 'viewCard';
    const data = {
      type: type,
      payload: { product, secretKey }
    };
    this.sendStatistic(data);
  }

  async sendAddToCart(product: ProductData) {
    const data = {
      type: 'addToCart',
      payload: { product }
    };
    this.sendStatistic(data);
  }

  async sendPurchase(products: ProductData[]) {
    let orderId = genUUID();
    let totalPrice = products.reduce((sum: number, product: ProductData) => {
      let price = product.salePriceU;
      return sum + price;
    }, 0);
    let productIds = products.map((product: ProductData) => product.id);

    const data = {
      type: 'purchase',
      payload: { orderId, totalPrice, productIds }
    };
    this.sendStatistic(data);
  }
}

export const statService = new StatService();
