import z from 'zod';

export enum PromoCodeDiscountType {
  PERCENTAGE = 'percentage',
  fixed_amount = 'fixed_amount',
}

export const promoSchema = z.object({
  code: z.string('Need a valid code').length(6, 'Promo code must be of 6 Alpha Numrice code').uppercase('Promo Code shoud be in Uppercase'),
  discount_type: z.enum(PromoCodeDiscountType),
  discount_value: z.coerce.number(),
  max_uses: z.number('Need a valid number').min(1, 'At lest 1 use is required'),
  expires_at: z.coerce.date(),
  used_times: z.coerce.number(),
  is_active: z.boolean().default(true),
});
