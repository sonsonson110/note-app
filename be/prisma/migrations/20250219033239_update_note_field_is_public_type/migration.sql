/*
  Warnings:

  - The `isPublic` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "isPublic",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
