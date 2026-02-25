import getPool from "../../../../../db/connect_MySQL.js";
import type { NormalizedCoinMeta } from "../../../domain/coins/type/normalize.type.js";

//-------------------------------------------------------------------------------------//

export async function saveMetadataCmc(data: NormalizedCoinMeta[]) {
  if (!data.length) return;
  const pool = await getPool();

  const values = data.map((c) => [
    c.id,
    c.name,
    c.symbol,
    c.slug,
    c.description,
    c.logo,
    c.website,
    c.explorer,
    c.platform?.id ?? null,
    c.platform?.name ?? null,
    c.platform?.symbol ?? null,
    c.platform?.slug ?? null,
    c.platform?.tokenAddress ?? null,
    c.infinite,
    c.addedAt,
    c.launchedAt,
  ]);

  const sql = `
    INSERT INTO cmc_metadata (
      cmc_id, name, symbol, slug, description, logo, website, explorer,
      platform_id, platform_name, platform_symbol, platform_slug, platform_token_address,
      infinite, added_at, launched_at
    ) VALUES ?
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      symbol = VALUES(symbol),
      slug = VALUES(slug),
      description = VALUES(description),
      logo = VALUES(logo),
      website = VALUES(website),
      explorer = VALUES(explorer),
      platform_id = VALUES(platform_id),
      platform_name = VALUES(platform_name),
      platform_symbol = VALUES(platform_symbol),
      platform_slug = VALUES(platform_slug),
      platform_token_address = VALUES(platform_token_address),
      infinite = VALUES(infinite),
      added_at = VALUES(added_at),
      launched_at = VALUES(launched_at)
  `;

  await pool.query(sql, [values]);
}
