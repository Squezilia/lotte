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

-- CreateTable
CREATE TABLE "Tries" (
    "ip" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "lastTry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tries_pkey" PRIMARY KEY ("ip")
);
