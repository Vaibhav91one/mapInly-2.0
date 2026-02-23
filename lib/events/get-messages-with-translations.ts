import { prisma } from "@/lib/prisma";

type MessageRow = {
  id: string;
  content: string;
  [key: string]: unknown;
};

export type MessageWithTranslation = MessageRow & {
  content: string;
};

export function mergeMessageWithTranslation(
  message: MessageRow,
  translation: { content: string } | null
): MessageWithTranslation {
  if (!translation) {
    return { ...message };
  }
  return {
    ...message,
    content: translation.content,
  };
}

export async function getMessagesWithTranslations<T extends MessageRow>(
  messages: T[],
  locale: string
): Promise<(T & { content: string })[]> {
  if (messages.length === 0) {
    return messages as (T & { content: string })[];
  }
  const ids = messages.map((m) => m.id);
  let translations: { messageId: string; content: string }[] = [];
  try {
    translations = await prisma.eventMessageTranslation.findMany({
      where: { messageId: { in: ids }, locale },
    });
  } catch {
    return messages as (T & { content: string })[];
  }
  const byMessage = Object.fromEntries(
    translations.map((t) => [t.messageId, t])
  );
  return messages.map((m) => {
    const tx = byMessage[m.id];
    return mergeMessageWithTranslation(m, tx) as T & { content: string };
  });
}
