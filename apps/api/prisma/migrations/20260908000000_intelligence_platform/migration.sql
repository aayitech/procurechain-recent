CREATE TYPE "InstrumentType" AS ENUM ('COMMODITY', 'FX', 'FREIGHT', 'PORT', 'ECONOMIC', 'TRADE');
CREATE TYPE "DataStatus" AS ENUM ('ACTIVE', 'DELAYED', 'UNAVAILABLE', 'CONFIGURATION_REQUIRED');

CREATE TABLE "UserMarketProfile" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "regionCity" TEXT, "currency" TEXT,
  "procurementCategories" TEXT[] DEFAULT ARRAY[]::TEXT[], "commodities" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "purchaseMix" TEXT, "sourcingCountries" TEXT[] DEFAULT ARRAY[]::TEXT[], "tradeLanes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "procurementChallenges" TEXT[] DEFAULT ARRAY[]::TEXT[], "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "UserMarketProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserMarketProfile_userId_key" ON "UserMarketProfile"("userId");

CREATE TABLE "CountryConfiguration" (
  "id" TEXT NOT NULL, "code" TEXT NOT NULL, "name" TEXT NOT NULL, "currency" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false, "priorityInstruments" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "ports" TEXT[] DEFAULT ARRAY[]::TEXT[], "tradeLanes" TEXT[] DEFAULT ARRAY[]::TEXT[], "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CountryConfiguration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CountryConfiguration_code_key" ON "CountryConfiguration"("code");

CREATE TABLE "IndustryConfiguration" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "name" TEXT NOT NULL,
  "priorityInstruments" TEXT[] DEFAULT ARRAY[]::TEXT[], "priorityCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "enabled" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "IndustryConfiguration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "IndustryConfiguration_slug_key" ON "IndustryConfiguration"("slug");

CREATE TABLE "DataSource" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "domain" TEXT NOT NULL, "dataTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "country" TEXT, "region" TEXT, "apiAvailable" BOOLEAN NOT NULL DEFAULT false, "apiEndpoint" TEXT,
  "apiKeyRequired" BOOLEAN NOT NULL DEFAULT false, "updateFrequency" TEXT, "historicalData" BOOLEAN NOT NULL DEFAULT false,
  "commercialUse" TEXT, "redistributionAllowed" TEXT, "attributionRequired" BOOLEAN NOT NULL DEFAULT true, "licence" TEXT,
  "status" "DataStatus" NOT NULL DEFAULT 'UNAVAILABLE', "lastSuccessfulFetch" TIMESTAMP(3), "lastFailedFetch" TIMESTAMP(3),
  "lastDataTimestamp" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketInstrument" (
  "id" TEXT NOT NULL, "symbol" TEXT NOT NULL, "name" TEXT NOT NULL, "type" "InstrumentType" NOT NULL,
  "category" TEXT NOT NULL, "subCategory" TEXT, "country" TEXT, "region" TEXT, "currency" TEXT, "unit" TEXT,
  "frequency" TEXT, "sourceId" TEXT, "status" "DataStatus" NOT NULL DEFAULT 'UNAVAILABLE', "confidence" TEXT,
  "sourceUrl" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MarketInstrument_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MarketInstrument_symbol_key" ON "MarketInstrument"("symbol");
CREATE INDEX "MarketInstrument_type_category_idx" ON "MarketInstrument"("type", "category");
CREATE INDEX "MarketInstrument_country_status_idx" ON "MarketInstrument"("country", "status");

CREATE TABLE "MarketObservation" (
  "id" TEXT NOT NULL, "instrumentId" TEXT NOT NULL, "sourceId" TEXT NOT NULL, "value" DECIMAL(20,8) NOT NULL,
  "currency" TEXT, "unit" TEXT, "observedAt" TIMESTAMP(3) NOT NULL, "sourceTimestamp" TIMESTAMP(3) NOT NULL,
  "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "status" "DataStatus" NOT NULL DEFAULT 'ACTIVE',
  "confidence" TEXT, "metadata" JSONB, CONSTRAINT "MarketObservation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MarketObservation_instrumentId_sourceId_observedAt_key" ON "MarketObservation"("instrumentId", "sourceId", "observedAt");
CREATE INDEX "MarketObservation_instrumentId_observedAt_idx" ON "MarketObservation"("instrumentId", "observedAt");

CREATE TABLE "FreightRoute" (
  "id" TEXT NOT NULL, "origin" TEXT NOT NULL, "destination" TEXT NOT NULL, "originPort" TEXT, "destinationPort" TEXT,
  "containerType" TEXT NOT NULL, "currency" TEXT, "status" "DataStatus" NOT NULL DEFAULT 'UNAVAILABLE', "sourceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FreightRoute_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "FreightRoute_origin_destination_destinationPort_containerType_key" ON "FreightRoute"("origin", "destination", "destinationPort", "containerType");

CREATE TABLE "Port" (
  "id" TEXT NOT NULL, "code" TEXT NOT NULL, "name" TEXT NOT NULL, "country" TEXT NOT NULL, "region" TEXT,
  "latitude" DOUBLE PRECISION, "longitude" DOUBLE PRECISION, "status" "DataStatus" NOT NULL DEFAULT 'UNAVAILABLE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Port_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Port_code_key" ON "Port"("code");

CREATE TABLE "MarketNews" (
  "id" TEXT NOT NULL, "headline" TEXT NOT NULL, "publisher" TEXT NOT NULL, "sourceUrl" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3) NOT NULL, "country" TEXT, "region" TEXT, "industry" TEXT,
  "categories" TEXT[] DEFAULT ARRAY[]::TEXT[], "summary" TEXT, "imageUrl" TEXT, "sourceType" TEXT, "sourceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "MarketNews_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MarketNews_sourceUrl_key" ON "MarketNews"("sourceUrl");
CREATE INDEX "MarketNews_publishedAt_idx" ON "MarketNews"("publishedAt");
CREATE INDEX "MarketNews_country_industry_idx" ON "MarketNews"("country", "industry");

CREATE TABLE "NewsInstrument" ("newsId" TEXT NOT NULL, "instrumentId" TEXT NOT NULL, CONSTRAINT "NewsInstrument_pkey" PRIMARY KEY ("newsId", "instrumentId"));
CREATE TABLE "CategoryInstrument" ("category" TEXT NOT NULL, "instrumentId" TEXT NOT NULL, "role" TEXT NOT NULL, "weight" DECIMAL(8,4), CONSTRAINT "CategoryInstrument_pkey" PRIMARY KEY ("category", "instrumentId", "role"));

CREATE TABLE "WatchlistItem" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "instrumentId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WatchlistItem_userId_instrumentId_key" ON "WatchlistItem"("userId", "instrumentId");
CREATE INDEX "WatchlistItem_userId_idx" ON "WatchlistItem"("userId");

CREATE TABLE "Conversation" (
  "id" TEXT NOT NULL, "userId" TEXT, "title" TEXT, "context" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Conversation_userId_updatedAt_idx" ON "Conversation"("userId", "updatedAt");
CREATE TABLE "ConversationMessage" (
  "id" TEXT NOT NULL, "conversationId" TEXT NOT NULL, "role" TEXT NOT NULL, "content" TEXT NOT NULL,
  "dataAsOf" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ConversationMessage_conversationId_createdAt_idx" ON "ConversationMessage"("conversationId", "createdAt");

ALTER TABLE "UserMarketProfile" ADD CONSTRAINT "UserMarketProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MarketInstrument" ADD CONSTRAINT "MarketInstrument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MarketObservation" ADD CONSTRAINT "MarketObservation_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "MarketInstrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MarketObservation" ADD CONSTRAINT "MarketObservation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MarketNews" ADD CONSTRAINT "MarketNews_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NewsInstrument" ADD CONSTRAINT "NewsInstrument_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "MarketNews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NewsInstrument" ADD CONSTRAINT "NewsInstrument_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "MarketInstrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CategoryInstrument" ADD CONSTRAINT "CategoryInstrument_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "MarketInstrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "MarketInstrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
