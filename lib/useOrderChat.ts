'use client';

import { useCallback, useEffect, useState } from 'react';
import { onValue, push, ref, set } from 'firebase/database';
import { getRealtimeDatabase } from '@/lib/firebase-realtime';

export interface OrderChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface OrderChatMetadata {
  orderId: string;
  productId: string;
  buyerId: string;
  vendorId: string;
  lastMessage: string;
  lastTimestamp: number;
}

const CHAT_ROOT = '/order/chats';

export function useOrderChat(chatId: string, metadata?: Partial<OrderChatMetadata>) {
  const [messages, setMessages] = useState<OrderChatMessage[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    const database = getRealtimeDatabase();
    const messagesRef = ref(database, `${CHAT_ROOT}/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const nextMessages: OrderChatMessage[] = [];
      snapshot.forEach((child) => {
        const value = child.val() as Partial<OrderChatMessage> | null;
        if (!value?.senderId || typeof value.text !== 'string') return;
        nextMessages.push({
          id: child.key ?? '',
          senderId: value.senderId,
          text: value.text,
          timestamp: value.timestamp ?? 0,
        });
      });
      nextMessages.sort((left, right) => left.timestamp - right.timestamp);
      setMessages(nextMessages);
      setIsReady(true);
    });
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = useCallback(
    async (text: string, senderId: string) => {
      const normalizedText = text.trim();
      if (!chatId || !normalizedText || !senderId.trim()) return;

      const database = getRealtimeDatabase();
      const messagesRef = ref(database, `${CHAT_ROOT}/${chatId}/messages`);
      const metadataRef = ref(database, `${CHAT_ROOT}/${chatId}/metadata`);
      const newMessageRef = push(messagesRef);
      const timestamp = Date.now();

      await set(newMessageRef, {
        senderId,
        text: normalizedText,
        timestamp,
      });

      await set(metadataRef, {
        orderId: chatId,
        productId: metadata?.productId ?? '',
        buyerId: metadata?.buyerId ?? '',
        vendorId: metadata?.vendorId ?? '',
        lastMessage: normalizedText,
        lastTimestamp: timestamp,
      });
    },
    [chatId, metadata?.buyerId, metadata?.productId, metadata?.vendorId],
  );

  return { messages, isReady, sendMessage };
}
