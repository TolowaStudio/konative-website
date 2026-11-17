/**
 * Konative data access — Cloudflare D1 first, Supabase fallback during migration.
 * Target: D1-only; remove Supabase once migration verified (2026-07-09 decision).
 */
export {
  CloudflareBindingUnavailableError,
  DatabaseUnavailableError,
  getBindings,
  getD1,
  rethrowD1OperationFailure,
} from "./client";
export {
  readWithSupabaseFallback,
  noteSupabaseFallback,
  logSupabaseFallbackError,
  isSupabaseFallbackDisabled,
  SupabaseFallbackDisabledError,
} from "./supabaseFallback";
export {
  isD1TbcpReady,
  isD1QueueReady,
  isD1SponsorshipReady,
  resetD1ReadyCache,
} from "./isPopulated";
export {
  queryTbcpAwards,
  queryTbcpAwardsList,
  queryTbcpAwardBySlug,
  queryTbcpSlugs,
  type TbcpAwardRow,
} from "./queries/tbcp";
export {
  queryActiveSponsorshipPlacement,
  querySponsorshipPlacements,
  type SponsorshipPlacementRow,
  type SponsorshipAnalyticsFilters,
} from "./queries/sponsorship";
export {
  haversineKm,
  bboxForRadiusKm,
  queryInterconnectionQueueRadius,
  type InterconnectionQueueDbRow,
} from "./queries/queue";
export {
  queryDcFacilitiesMap,
  countDcFacilities,
  type DcFacilityMapRow,
} from "./queries/dc-facilities";
export {
  queryNetworkFacilitiesMap,
  countNetworkFacilities,
  type NetworkFacilityMapRow,
} from "./queries/network-facilities";
export {
  queryGenerationPipelineMap,
  countGenerationPipeline,
  type GenerationPipelineMapRow,
} from "./queries/generation-pipeline";
