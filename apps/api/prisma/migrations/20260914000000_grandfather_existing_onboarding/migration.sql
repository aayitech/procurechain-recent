-- Users present before the new onboarding gate have already used the platform.
-- Mark them complete once so the new GHL profile form is only shown to new users.
UPDATE "User"
SET "onboardingCompletedAt" = CURRENT_TIMESTAMP
WHERE "onboardingCompletedAt" IS NULL;
