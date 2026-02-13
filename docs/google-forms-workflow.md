# Google Forms Workflow For DB Inserts

This workflow is for adding real studios/halls into Railway DB without seed.

## Roles

- Studio owner: fills Google Form(s)
- You: sends raw responses to assistant and approves inserts
- Assistant: translates text fields, validates payload, prepares Prisma-ready records

## End-to-end flow

1. Owner submits:
- Studio Intake once
- Hall Intake for each hall

2. You export responses from Google Forms:
- preferred: Google Sheets -> CSV
- or copy one response as plain text

3. You send the payload to assistant with this prompt:

```
Convert this form response to Prisma-ready payload for StudiosMD.
Rules:
1) Build i18n JSON for ru/ro/en (source language is ru).
2) Keep district_key exactly from allowed enum.
3) Parse image URLs into arrays.
4) Convert yes/no facts to booleans.
5) Keep HL_tags max 6 and remove forbidden fact-like tags.
6) Return:
   - validation report
   - normalized Studio object (if provided)
   - normalized Hall object(s)
Wait for my OK before any DB write commands.

Form payload:
[paste CSV row or JSON here]
```

4. Assistant returns:
- Validation report (missing fields, invalid URLs, invalid numbers)
- Normalized objects ready for Prisma
- Optional fix suggestions

5. You reply `OK`.

6. Assistant executes DB write (choose one):
- Prisma Studio manual insert guidance
- or one-off Prisma script with `create` / `upsert`

7. Assistant reports:
- created/updated IDs
- what was inserted
- any skipped records with reason

## Validation checklist

Before insert, always check:
- `ST_district_key` in: `botanica|ciocana|centru|buiucani|riscani`
- `HL_price_per_hour` is integer > 0
- optional numeric fields are valid integers if present
- all fact fields are booleans (`yes/no -> true/false`)
- `HL_tags` length <= 6
- `HL_tags` does not include: `daylight`, `blackout`, `parking`, `changing_room`, `furniture`, `flash_light`, `continuous_light`
- images arrays are non-empty and contain valid URLs

## Recommended operating mode

Use batch-by-batch imports:
- one studio batch at a time
- run validation first
- run insert only after explicit `OK`

This keeps production writes controlled and auditable.
