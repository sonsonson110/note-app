/*
  Warnings:

  - You are about to drop the column `authorId` on the `Notebook` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Notebook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notebook" DROP CONSTRAINT "Notebook_authorId_fkey";

-- DropIndex
DROP INDEX "Notebook_createdAt_authorId_idx";

-- AlterTable
ALTER TABLE "Notebook" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "isPublic" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotebookNote" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noteId" TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,

    CONSTRAINT "NotebookNote_pkey" PRIMARY KEY ("noteId","notebookId")
);

-- CreateTable
CREATE TABLE "_NoteToNotebook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NoteToNotebook_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NoteToNotebook_B_index" ON "_NoteToNotebook"("B");

-- CreateIndex
CREATE INDEX "Notebook_createdAt_userId_idx" ON "Notebook"("createdAt", "userId");

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookNote" ADD CONSTRAINT "NotebookNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookNote" ADD CONSTRAINT "NotebookNote_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToNotebook" ADD CONSTRAINT "_NoteToNotebook_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToNotebook" ADD CONSTRAINT "_NoteToNotebook_B_fkey" FOREIGN KEY ("B") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
