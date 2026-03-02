-- Account
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");

-- Session
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");

-- Problem
CREATE INDEX IF NOT EXISTS "Problem_userId_idx" ON "Problem"("userId");
CREATE INDEX IF NOT EXISTS "Problem_userId_createdAt_idx" ON "Problem"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Problem_userId_date_idx" ON "Problem"("userId", "date");
CREATE INDEX IF NOT EXISTS "Problem_userId_revisit_idx" ON "Problem"("userId", "revisit");

-- DsaTopic
CREATE INDEX IF NOT EXISTS "DsaTopic_userId_idx" ON "DsaTopic"("userId");
CREATE INDEX IF NOT EXISTS "DsaTopic_userId_order_idx" ON "DsaTopic"("userId", "order");
CREATE INDEX IF NOT EXISTS "DsaTopic_userId_sm2NextReview_idx" ON "DsaTopic"("userId", "sm2NextReview");
CREATE INDEX IF NOT EXISTS "DsaTopic_userId_lastReviewed_idx" ON "DsaTopic"("userId", "lastReviewed");

-- ReviewSession
CREATE INDEX IF NOT EXISTS "ReviewSession_userId_reviewedAt_idx" ON "ReviewSession"("userId", "reviewedAt");
CREATE INDEX IF NOT EXISTS "ReviewSession_topicId_reviewedAt_idx" ON "ReviewSession"("topicId", "reviewedAt");
CREATE INDEX IF NOT EXISTS "ReviewSession_userId_topicId_idx" ON "ReviewSession"("userId", "topicId");

-- TopicProblem
CREATE INDEX IF NOT EXISTS "TopicProblem_problemId_idx" ON "TopicProblem"("problemId");

-- Resource
CREATE INDEX IF NOT EXISTS "Resource_topicId_idx" ON "Resource"("topicId");

-- TechStack
CREATE INDEX IF NOT EXISTS "TechStack_userId_idx" ON "TechStack"("userId");
CREATE INDEX IF NOT EXISTS "TechStack_userId_order_idx" ON "TechStack"("userId", "order");
CREATE INDEX IF NOT EXISTS "TechStack_userId_stage_idx" ON "TechStack"("userId", "stage");

-- TechResource
CREATE INDEX IF NOT EXISTS "TechResource_techId_idx" ON "TechResource"("techId");

-- TechProject
CREATE INDEX IF NOT EXISTS "TechProject_techId_idx" ON "TechProject"("techId");

-- DocBookmark
CREATE INDEX IF NOT EXISTS "DocBookmark_userId_createdAt_idx" ON "DocBookmark"("userId", "createdAt");
