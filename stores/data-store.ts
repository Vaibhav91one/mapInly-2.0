"use client";

import { create } from "zustand";
import type { Event, EventFormData } from "@/types/event";
import type { Forum, ForumFormData } from "@/types/forum";
import { uniqueSlug } from "@/lib/slugify";
import {
  DEMO_USER_ID,
  loadDemo,
  type DemoUser,
  type StoredComment,
  type StoredEvent,
  type StoredForum,
  type StoredMessage,
} from "@/lib/demo/data";

/**
 * In-memory demo backend: seeded from data/demo.json, every write lives in the browser tab only
 * and resets on reload. Replaces the old Prisma + API routes + Supabase.
 */
interface DataState {
  users: DemoUser[];
  events: StoredEvent[];
  forums: StoredForum[];
  comments: StoredComment[];
  messages: StoredMessage[];
  createEvent: (data: EventFormData) => Promise<Event>;
  updateEvent: (slug: string, data: EventFormData) => Promise<Event>;
  deleteEvent: (slug: string) => void;
  registerForEvent: (slug: string) => void;
  createForum: (data: ForumFormData) => Promise<Forum>;
  updateForum: (slug: string, data: ForumFormData) => Promise<Forum>;
  deleteForum: (slug: string) => void;
  addComment: (forumSlug: string, content: string, parentId: string | null) => StoredComment;
  voteComment: (commentId: string, direction: "up" | "down") => void;
  addMessage: (eventSlug: string, content: string) => StoredMessage;
}

export const useDataStore = create<DataState>((set, get) => ({
  ...loadDemo(),

  createEvent: async (data) => {
    const event: StoredEvent = {
      ...data,
      id: crypto.randomUUID(),
      slug: uniqueSlug(data.title, get().events.map((e) => e.slug)),
      createdBy: DEMO_USER_ID,
      createdAt: new Date().toISOString(),
      registrations: [DEMO_USER_ID],
      translations: {},
    };
    set((s) => ({ events: [event, ...s.events] }));
    return event;
  },

  updateEvent: async (slug, data) => {
    let updated: StoredEvent | undefined;
    set((s) => ({
      events: s.events.map((e) =>
        e.slug === slug ? (updated = { ...e, ...data, translations: {} }) : e
      ),
    }));
    if (!updated) throw new Error("Event not found");
    return updated;
  },

  deleteEvent: (slug) =>
    set((s) => ({
      events: s.events.filter((e) => e.slug !== slug),
      messages: s.messages.filter((m) => m.eventSlug !== slug),
    })),

  registerForEvent: (slug) =>
    set((s) => ({
      events: s.events.map((e) =>
        e.slug === slug && !e.registrations?.includes(DEMO_USER_ID)
          ? { ...e, registrations: [...(e.registrations ?? []), DEMO_USER_ID] }
          : e
      ),
    })),

  createForum: async (data) => {
    const forum: StoredForum = {
      ...data,
      id: crypto.randomUUID(),
      slug: uniqueSlug(data.title, get().forums.map((f) => f.slug)),
      createdBy: DEMO_USER_ID,
      createdAt: new Date().toISOString(),
      translations: {},
    };
    set((s) => ({ forums: [forum, ...s.forums] }));
    return forum;
  },

  updateForum: async (slug, data) => {
    let updated: StoredForum | undefined;
    set((s) => ({
      forums: s.forums.map((f) =>
        f.slug === slug ? (updated = { ...f, ...data, translations: {} }) : f
      ),
    }));
    if (!updated) throw new Error("Forum not found");
    return updated;
  },

  deleteForum: (slug) =>
    set((s) => ({
      forums: s.forums.filter((f) => f.slug !== slug),
      comments: s.comments.filter((c) => c.forumSlug !== slug),
    })),

  addComment: (forumSlug, content, parentId) => {
    const comment: StoredComment = {
      id: crypto.randomUUID(),
      forumSlug,
      parentId,
      authorId: DEMO_USER_ID,
      content,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      translations: {},
    };
    set((s) => ({ comments: [...s.comments, comment] }));
    return comment;
  },

  voteComment: (commentId, direction) =>
    set((s) => ({
      comments: s.comments.map((c) =>
        c.id !== commentId
          ? c
          : direction === "up"
            ? { ...c, upvotes: c.upvotes + 1 }
            : { ...c, downvotes: c.downvotes + 1 }
      ),
    })),

  addMessage: (eventSlug, content) => {
    const message: StoredMessage = {
      id: crypto.randomUUID(),
      eventSlug,
      userId: DEMO_USER_ID,
      content,
      createdAt: new Date().toISOString(),
      translations: {},
    };
    set((s) => ({ messages: [...s.messages, message] }));
    return message;
  },
}));
