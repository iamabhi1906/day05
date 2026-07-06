export function parseChatId(chatId: string) {
  const separatorIndex = chatId.lastIndexOf('-');

  if (separatorIndex <= 0) {
    return { productId: '', orderId: chatId };
  }

  return {
    productId: chatId.slice(0, separatorIndex),
    orderId: chatId.slice(separatorIndex + 1),
  };
}

export function buildChatId(productId: string, orderId: string | number) {
  return `${productId}-${String(orderId)}`;
}