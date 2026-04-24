# Database migrations

## Member location columns (`countyCode`, `constituencyCode`, `wardCode`)

`Member` stores location as **integer foreign keys** to `County.countyCode`, `Constituency.constituencyCode`, and `Ward.wardCode` (same pattern as `Aspirant`).

### Applying the migration (existing DB with text `county` / `constituency` / `ward`)

1. Ensure `County`, `Constituency`, and `Ward` are seeded.
2. Run:

   ```bash
   npx prisma migrate deploy
   ```

   Or execute the SQL in `migrations/20250309120000_member_location_int_fks/migration.sql` manually against your database.

The migration copies values from the old text columns into codes (matching by name or numeric code), drops the old columns, and adds foreign keys.

### New environments

After `migrate deploy` (or `db push` on an empty DB that matches `schema.prisma`), no extra step is needed.
