-- CreateTable
CREATE TABLE "event_translations" (
    "event_id" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL DEFAULT '',
    "short_description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "event_translations_pkey" PRIMARY KEY ("event_id","locale")
);

-- CreateTable
CREATE TABLE "forum_translations" (
    "forum_id" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL DEFAULT '',
    "short_description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "forum_translations_pkey" PRIMARY KEY ("forum_id","locale")
);

-- AddForeignKey
ALTER TABLE "event_translations" ADD CONSTRAINT "event_translations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_translations" ADD CONSTRAINT "forum_translations_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
