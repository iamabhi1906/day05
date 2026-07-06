import { OrderData as BuyerOrderData } from '@/features/orders/orders.types';
import styles from './orders-page.module.css';

type VendorOrderItem = {
  productId: string;
  productName: string;
  productImageUrl: string;
  vendorEmail: string;
  price: number;
  quantity: number;
};

type VendorOrderData = {
  id: string;
  buyerEmail: string;
  items: VendorOrderItem[];
  total: number;
  status: string;
  createdAt: Date | null;
};

type OrderCardData = BuyerOrderData | VendorOrderData;

interface OrdersPageProps {
  orders: OrderCardData[];
  title?: string;
  showBuyerEmail?: boolean;
}

const statusClassMap: Record<string, string> = {
  created: styles.statusCreated,
  processing: styles.statusProcessing,
  shipped: styles.statusShipped,
  'in transit': styles.statusInTransit,
  'out for delivery': styles.statusOutForDelivery,
  delivered: styles.statusDelivered,
  cancelled: styles.statusCancelled,
  returned: styles.statusReturned,
};

const paymentClassMap: Record<string, string> = {
  paid: styles.paymentPaid,
  refunded: styles.paymentRefunded,
};

const formatDate = (value: Date | string | null | undefined) => {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  return date
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
    : 'Unknown date';
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

const getOrderId = (order: OrderCardData) => {
  if ('orderId' in order && typeof order.orderId === 'number') {
    return `#${order.orderId}`;
  }

  return order.id ? order.id.slice(0, 8).toUpperCase() : 'Unknown';
};

const getImageUrl = (order: OrderCardData) => {
  if ('items' in order) {
    return order.items[0]?.productImageUrl ?? '';
  }
  return order.productImageUrls?.[0] ?? '';
};

const getLines = (order: OrderCardData) => {
  if ('items' in order) {
    return order.items.map((item) => ({
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.productImageUrl,
      vendorEmail: item.vendorEmail,
    }));
  }

  return [
    {
      productName: order.productName,
      price: order.productPrice,
      quantity: order.quantity,
      imageUrl: getImageUrl(order),
      vendorEmail: order.vendorEmail,
      discount: order.discount,
    },
  ];
};

const getSubtotal = (order: OrderCardData) => {
  if ('items' in order) {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  return order.productPrice * order.quantity - (order.discount ?? 0);
};

const renderStatus = (status: string) => {
  const normalized = status.toLowerCase();
  return <span className={`${styles.badge} ${statusClassMap[normalized] ?? styles.statusCreated}`}>{status}</span>;
};

const renderPayment = (paymentStatus?: string) => {
  if (!paymentStatus) return null;
  const normalized = paymentStatus.toLowerCase();
  return <span className={`${styles.badge} ${paymentClassMap[normalized] ?? styles.paymentPaid}`}>{paymentStatus}</span>;
};

export default function OrdersPage({ orders, title = 'Orders', showBuyerEmail }: OrdersPageProps) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>A clear summary of every order with status, payment details, and item preview.</p>
        </div>
        <div className={styles.summaryPill}>{orders.length} total orders</div>
      </header>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No orders found yet. Once you place an order, it will appear here with full tracking details.</p>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map((order) => {
            const buyerEmail = 'buyerEmail' in order ? order.buyerEmail : '';
            const placedAt = 'placedAt' in order ? order.placedAt : order.createdAt;
            const lines = getLines(order);
            const subtotal = getSubtotal(order);
            const discount = 'discount' in order ? (order.discount ?? 0) : 0;
            const productImageUrl = getImageUrl(order);
            const paymentStatus = 'paymentStatus' in order ? order.paymentStatus : undefined;

            return (
              <article key={getOrderId(order)} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.orderLabel}>Order</p>
                    <h2 className={styles.orderId}>{getOrderId(order)}</h2>
                    <p className={styles.orderMeta}>Placed {formatDate(placedAt)}</p>
                    {showBuyerEmail && buyerEmail ? <p className={styles.orderMeta}>Buyer: {buyerEmail}</p> : null}
                  </div>
                  <div className={styles.badgesRow}>
                    {renderStatus(order.status)}
                    {renderPayment(paymentStatus)}
                  </div>
                </div>

                <div className={styles.orderBody}>
                  {lines.length > 1 ? (
                    <div className={styles.itemsGrid}>
                      {lines.map((line, index) => (
                        <div key={`${order.id ?? order.id}-${index}`} className={styles.itemCard}>
                          <div className={styles.imageWrapper}>
                            {line.imageUrl ? (
                              <img src={line.imageUrl} alt={line.productName} className={styles.productImage} />
                            ) : (
                              <div className={styles.imageFallback}>No image</div>
                            )}
                          </div>
                          <div className={styles.itemDetails}>
                            <p className={styles.productName}>{line.productName}</p>
                            <p className={styles.productInfo}>Qty {line.quantity}</p>
                            <p className={styles.productInfo}>{formatCurrency(line.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.productRow}>
                      <div className={styles.imageWrapper}>
                        {productImageUrl ? (
                          <img src={productImageUrl} alt={lines[0].productName} className={styles.productImage} />
                        ) : (
                          <div className={styles.imageFallback}>No image</div>
                        )}
                      </div>
                      <div className={styles.productDetails}>
                        <p className={styles.productName}>{lines[0].productName}</p>
                        <div className={styles.productInfoRow}>
                          <span>
                            {lines[0].quantity} item{lines[0].quantity === 1 ? '' : 's'}
                          </span>
                          <span>• {formatCurrency(lines[0].price)} each</span>
                          {lines[0].vendorEmail ? <span>• Vendor: {lines[0].vendorEmail}</span> : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.orderSummary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal + discount)}</span>
                  </div>
                  {discount > 0 ? (
                    <div className={styles.summaryRow}>
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  ) : null}
                  <div className={styles.summaryRowTotal}>
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
