"use client";

import { useMemo, useState } from "react";
import {
  CommentInput,
  CommentControls,
  CommentCard,
  type CommentData,
  type SortOption,
} from "./comment";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";

const MOCK_COMMENTS: CommentData[] = [
  {
    id: "1",
    author: {
      name: "AutoModerator",
      avatarUrl: "https://picsum.photos/seed/mod1/80/80",
      role: "MOD",
    },
    timestamp: "3h ago",
    content:
      "Welcome to the forum! Please remember to follow our community guidelines and be respectful in your discussions.",
    upvotes: 12,
    downvotes: 1,
  },
  {
    id: "2",
    author: {
      name: "AutoModerator",
      avatarUrl: "https://picsum.photos/seed/mod1/80/80",
      role: "MOD",
    },
    timestamp: "3h ago",
    content:
      "If you have any questions or concerns, feel free to contact the moderators. We're here to help!\n\n• Check our FAQ\n• Report issues\n• Suggest improvements",
    upvotes: 8,
    downvotes: 0,
  },
  {
    id: "3",
    author: {
      name: "TechEnthusiast",
      avatarUrl: "https://picsum.photos/seed/user1/80/80",
    },
    timestamp: "2h ago",
    content:
      "Great discussion so far. I've been following the AI developments in Lugano and it's exciting to see the community grow.",
    upvotes: 5,
    downvotes: 0,
  },
];

interface ForumCommentsSectionProps {
  forumId?: string;
  className?: string;
}

export function ForumCommentsSection({ forumId, className }: ForumCommentsSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("best");
  const [searchQuery, setSearchQuery] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const filteredAndSortedComments = useMemo(() => {
    let result = [...comments];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.content.toLowerCase().includes(q) ||
          c.author.name.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "best":
      case "top":
        result.sort(
          (a, b) =>
            b.upvotes - (b.downvotes ?? 0) - (a.upvotes - (a.downvotes ?? 0))
        );
        break;
      case "newest":
        result.sort((a, b) => {
          const order = { "3h ago": 3, "2h ago": 2, "1h ago": 1 };
          return (order[b.timestamp as keyof typeof order] ?? 0) - (order[a.timestamp as keyof typeof order] ?? 0);
        });
        break;
      case "oldest":
        result.sort((a, b) => {
          const order = { "3h ago": 3, "2h ago": 2, "1h ago": 1 };
          return (order[a.timestamp as keyof typeof order] ?? 0) - (order[b.timestamp as keyof typeof order] ?? 0);
        });
        break;
    }

    return result;
  }, [comments, searchQuery, sortBy]);

  const handleVote = (commentId: string, direction: "up" | "down") => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        if (direction === "up")
          return { ...c, upvotes: c.upvotes + 1 };
        return { ...c, downvotes: (c.downvotes ?? 0) + 1 };
      })
    );
  };

  return (
    <section
      className={cn(
        sectionClasses,
        "bg-foreground",
        className
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "flex flex-col gap-8"
        )}
      >
        <h2 className="text-2xl font-regular tracking-tight text-background md:text-3xl">
          Comments
        </h2>

        <CommentInput placeholder="Join the conversation" />

        <CommentControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex flex-col gap-4">
          {filteredAndSortedComments.length === 0 ? (
            <p className="text-background/60">No comments found.</p>
          ) : (
            filteredAndSortedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onVote={handleVote}
                onReply={() => {}}
                onAward={() => {}}
                onShare={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
