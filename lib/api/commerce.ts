import { CartData } from '@/features/cart/cart.types';
import { OrderData, OrderPaymentStatus, OrderStatus } from '@/features/orders/orders.types';
import { ProductCategory, ProductData } from '@/features/product/product.types';
import { UserAddress } from '@/lib/crud/address';

type ApiProduct = Record<string, unknown>;
type ApiOrder = Record<string, unknown>;
type ApiCartItem = Record<string, unknown>;
type ApiAddress = Record<string, unknown>;

const stringValue = (value: unknown) => (value == null ? '' : String(value));
const numberValue = (value: unknown) => Number(value ?? 0);
const strings = (value: unknown) => (Array.isArray(value) ? value.map(stringValue) : []);

export const productFromApi = (product: ApiProduct): ProductData => ({
  id: stringValue(product.id),
  title: stringValue(product.title),
  description: stringValue(product.description),
  price: numberValue(product.price),
  stock: numberValue(product.stock),
  category: stringValue(product.category) as ProductCategory,
  productImages: strings(product.productImages),
  status: product.status as ProductData['status'],
  userId: stringValue(product.userId),
  createdAt: product.createdAt ? new Date(stringValue(product.createdAt)) : null,
  updatedAt: product.updatedAt ? new Date(stringValue(product.updatedAt)) : null,
});

export const cartFromApi = (item: ApiCartItem): CartData => {
  const product = item.product as ApiProduct;
  return {
    id: Number(item.id),
    buyerEmail: null,
    productId: Number(item.productId),
    productName: stringValue(product?.title),
    productproductImages: strings(product?.productImages),
    vendorEmail: stringValue((product?.user as ApiProduct | undefined)?.email),
    price: numberValue(product?.price),
    quantity: numberValue(item.quantity),
    addedAt: item.createdAt ? stringValue(item.createdAt) : null,
  };
};

export const orderFromApi = (order: ApiOrder): OrderData => ({
  id: stringValue(order.id),
  orderId: numberValue(order.id),
  buyerEmail: stringValue((order.buyer as ApiProduct | undefined)?.email),
  placedAt: new Date(stringValue(order.placedAt)),
  status: order.status as OrderStatus,
  paymentStatus: order.paymentStatus as OrderPaymentStatus,
  productId: stringValue(order.productId),
  productName: stringValue(order.productTitle),
  productPrice: numberValue(order.productPrice),
  productproductImages: strings(order.productImages),
  discount: numberValue(order.discount),
  quantity: numberValue(order.quantity),
  vendorEmail: stringValue((order.vendor as ApiProduct | undefined)?.email),
  createdAt: new Date(stringValue(order.createdAt)),
  updatedAt: new Date(stringValue(order.updatedAt)),
});

export const addressFromApi = (address: ApiAddress): UserAddress => ({
  id: stringValue(address.id),
  email: '',
  city: stringValue(address.city),
  landmark: stringValue(address.landmark),
  state: stringValue(address.state),
  pinCode: numberValue(address.pinCode),
  isDefault: Boolean(address.isDefault),
  createdAt: new Date(stringValue(address.createdAt)),
  updatedAt: new Date(stringValue(address.updatedAt)),
  lastUsed: null,
});
