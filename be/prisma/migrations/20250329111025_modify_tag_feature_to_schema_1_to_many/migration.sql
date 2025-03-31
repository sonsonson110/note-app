/*
  Warnings:

  - You are about to drop the `TagsOnNotes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `noteId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TagsOnNotes" DROP CONSTRAINT "TagsOnNotes_noteId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnNotes" DROP CONSTRAINT "TagsOnNotes_tagId_fkey";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "noteId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TagsOnNotes";

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
