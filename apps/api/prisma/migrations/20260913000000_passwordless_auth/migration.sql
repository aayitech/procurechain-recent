ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

CREATE TABLE "PasswordlessLoginCode" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordlessLoginCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PasswordlessLoginCode_email_key" ON "PasswordlessLoginCode"("email");
CREATE INDEX "PasswordlessLoginCode_expiresAt_idx" ON "PasswordlessLoginCode"("expiresAt");
