-- CreateTable
CREATE TABLE "comment_translations" (
    "comment_id" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "comment_translations_pkey" PRIMARY KEY ("comment_id","locale")
);

-- CreateTable
CREATE TABLE "event_message_translations" (
    "message_id" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "event_message_translations_pkey" PRIMARY KEY ("message_id","locale")
);

-- AddForeignKey
ALTER TABLE "comment_translations" ADD CONSTRAINT "comment_translations_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_message_translations" ADD CONSTRAINT "event_message_translations_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "event_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
