/*
  Warnings:

  - You are about to drop the column `userId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `NoteTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "NoteTag" DROP CONSTRAINT "NoteTag_noteId_fkey";

-- DropForeignKey
ALTER TABLE "NoteTag" DROP CONSTRAINT "NoteTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- DropIndex
DROP INDEX "Tag_name_userId_key";

-- DropIndex
DROP INDEX "Tag_userId_idx";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "NoteTag";

-- CreateTable
CREATE TABLE "TagsOnNotes" (
    "noteId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnNotes_pkey" PRIMARY KEY ("noteId","tagId")
);

-- CreateIndex
CREATE INDEX "TagsOnNotes_tagId_idx" ON "TagsOnNotes"("tagId");

-- CreateIndex
CREATE INDEX "TagsOnNotes_noteId_idx" ON "TagsOnNotes"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "TagsOnNotes" ADD CONSTRAINT "TagsOnNotes_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnNotes" ADD CONSTRAINT "TagsOnNotes_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
