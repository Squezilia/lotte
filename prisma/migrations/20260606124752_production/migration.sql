-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('URL', 'PHONE');

-- CreateTable
CREATE TABLE "Links" (
    "id" TEXT NOT NULL,
    "type" "LinkType" NOT NULL,
    "uri" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "purged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);
