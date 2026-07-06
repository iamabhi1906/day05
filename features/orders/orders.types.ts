import { z } from 'zod';

export enum OrderStatus {
  CREATED = 'created',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in transit',
  OUT_FOR_DELIVERY = 'out for delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum OrderPaymentStatus {
  PAID = 'paid',
  REFUNDED = 'refunded',
}

const toDate = (value: { toDate?: () => Date } | null | undefined) => {
  return typeof value?.toDate === 'function' ? value.toDate() : value;
};

const firestoreDate = z.preprocess(toDate, z.date({ error: 'Expected a Firestore Timestamp' }));

export const ordersSchema = z
  .object({
    id: z.string().optional(),

    orderId: z.number(),

    buyerEmail: z.email('Need a valid email'),

    placedAt: firestoreDate,

    status: z.enum(OrderStatus, { error: 'Need a valid order status' }),

    paymentStatus: z.enum(OrderPaymentStatus),

    productId: z.string().min(1, 'Product ID is required'),

    productName: z.string().min(1, 'Product name is required'),

    productPrice: z.coerce.number().positive('Product price must be greater than 0'),

    productImageUrls: z.array(z.string()),

    discount: z.coerce.number().min(0, 'Discount cannot be negative').default(0),

    quantity: z.coerce.number().int().min(1, 'Minimum quantity is 1'),

    vendorEmail: z.email('Need a valid vendor email'),

    createdAt: firestoreDate,
    updatedAt: firestoreDate,
  })
  .superRefine((data, ctx) => {
    if (data.discount > data.productPrice) {
      ctx.addIssue({
        code: 'custom',
        path: ['discount'],
        message: 'Discount cannot exceed product price',
      });
    }

    if (data.status === OrderStatus.DELIVERED && data.paymentStatus !== OrderPaymentStatus.PAID) {
      ctx.addIssue({
        code: 'custom',
        path: ['paymentStatus'],
        message: 'Delivered orders must be paid',
      });
    }
  });

export type OrderData = z.infer<typeof ordersSchema>;
