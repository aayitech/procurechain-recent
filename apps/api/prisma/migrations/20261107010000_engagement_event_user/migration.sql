ALTER TABLE "EngagementEvent" ADD COLUMN "userId" TEXT;
CREATE INDEX "EngagementEvent_userId_idx" ON "EngagementEvent"("userId");
ALTER TABLE "EngagementEvent" ADD CONSTRAINT "EngagementEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
