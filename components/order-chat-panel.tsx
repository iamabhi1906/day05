'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useOrderChat, type OrderChatMetadata } from '@/lib/useOrderChat';
import styles from './css/order-chat-panel.module.css';

interface OrderChatPanelProps {
  chatId: string;
  currentUserId: string;
  initialMetadata: Partial<OrderChatMetadata>;
  title?: string;
}

export default function OrderChatPanel({ chatId, currentUserId, initialMetadata, title }: OrderChatPanelProps) {
  const [draft, setDraft] = useState('');

  const { messages, isReady, sendMessage } = useOrderChat(chatId, initialMetadata);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.trim()) return;

    await sendMessage(draft.trim(), currentUserId);

    setDraft('');
  };

  return (
    <Box className={styles.wrapper}>
      <Card className={styles.chatCard}>
        <CardHeader avatar={<Avatar>{title?.charAt(0) ?? 'C'}</Avatar>} title={title ?? `Chat ${chatId}`} subheader="Order Conversation" />
        <Divider />

        <CardContent className={styles.messages}>
          {!isReady && <Typography color="text.secondary">Loading messages...</Typography>}

          {isReady && messages.length === 0 && (
            <Box className={styles.emptyState}>
              <ForumOutlinedIcon fontSize="large" color="disabled" />

              <Typography color="text.secondary">No messages yet</Typography>

              <Typography variant="body2" color="text.secondary">
                Start the conversation.
              </Typography>
            </Box>
          )}

          {messages.length > 0 && (
            <>
              <Divider className={styles.dateDivider}>
                <Chip size="small" label="Today" />
              </Divider>

              <Stack spacing={2}>
                {messages.map((message) => {
                  const isMine = message.senderId === currentUserId;

                  return (
                    <Box key={message.id} className={`${styles.messageRow} ${isMine ? styles.myMessage : styles.otherMessage}`}>
                      {!isMine && <Avatar className={styles.avatar}>U</Avatar>}

                      <Box className={`${styles.bubble} ${isMine ? styles.myBubble : styles.otherBubble}`}>
                        <Typography variant="body2">{message.text}</Typography>

                        <Typography variant="caption" className={styles.time}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>

              <div ref={bottomRef} />
            </>
          )}
        </CardContent>

        <Divider />

        <Box component="form" onSubmit={handleSubmit} className={styles.composer}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder="Type a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />

          <IconButton color="primary" type="submit" disabled={!draft.trim()}>
            <SendRoundedIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
