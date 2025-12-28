-- Migration to update Review table structure
-- Add missing columns if they don't exist

-- Add planId column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Review' AND column_name = 'planId'
    ) THEN
        ALTER TABLE "Review" ADD COLUMN "planId" TEXT;
        -- Set a default value for existing rows (you may want to update these manually)
        UPDATE "Review" SET "planId" = 'unknown' WHERE "planId" IS NULL;
        ALTER TABLE "Review" ALTER COLUMN "planId" SET NOT NULL;
    END IF;
END $$;

-- Add userName column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Review' AND column_name = 'userName'
    ) THEN
        ALTER TABLE "Review" ADD COLUMN "userName" TEXT;
        -- Set a default value for existing rows
        UPDATE "Review" SET "userName" = 'Anonymous' WHERE "userName" IS NULL;
        ALTER TABLE "Review" ALTER COLUMN "userName" SET NOT NULL;
    END IF;
END $$;

-- Add rating column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Review' AND column_name = 'rating'
    ) THEN
        ALTER TABLE "Review" ADD COLUMN "rating" INTEGER;
        -- Set a default value for existing rows
        UPDATE "Review" SET "rating" = 5 WHERE "rating" IS NULL;
        ALTER TABLE "Review" ALTER COLUMN "rating" SET NOT NULL;
    END IF;
END $$;

-- Add verified column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Review' AND column_name = 'verified'
    ) THEN
        ALTER TABLE "Review" ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Ensure comment column has correct type
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Review' AND column_name = 'comment' AND data_type != 'character varying'
    ) THEN
        ALTER TABLE "Review" ALTER COLUMN "comment" TYPE VARCHAR(1000);
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "Review_planId_idx" ON "Review"("planId");
CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId");
CREATE INDEX IF NOT EXISTS "Review_createdAt_idx" ON "Review"("createdAt");

-- Ensure foreign key constraint exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Review_userId_fkey'
    ) THEN
        ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
