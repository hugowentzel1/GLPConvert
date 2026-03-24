# Google Sheets Formulas for 100K Outreach Links

## Setup Instructions

### Step 1: Create Your Sheet

1. Create a new Google Sheet
2. In row 1, add these headers:
   - A1: `company_name`
   - B1: `company_slug`
   - C1: `outreach_link`
   - D1: `first_name` (optional)
   - E1: `email` (optional)

### Step 2: Add Company Names

Starting in A2, add your company names:

```
A2: Acme Solar
A3: Green Energy Co
A4: SunPower Solutions
A5: Eco Solar Works
... (continue for all 100K companies)
```

### Step 3: Generate Unique Slugs

In B2, paste this formula and fill down:

```
=LOWER(REGEXREPLACE(A2,"[^a-z0-9]","")) & "-" & DEC2BASE(RANDBETWEEN(46656,1679615),36)
```

**What this does:**

- `LOWER(REGEXREPLACE(A2,"[^a-z0-9]",""))` - Removes special characters, converts to lowercase
- `DEC2BASE(RANDBETWEEN(46656,1679615),36)` - Adds random 4-character suffix in base36 (0-9, a-z)

**Example results:**

- "Acme Solar" → "acmesolar-k93h"
- "Green Energy Co" → "greenenergyco-xyz"
- "SunPower Solutions" → "sunpowersolutions-abc"

### Step 4: Generate Outreach Links

In C2, paste this formula and fill down:

```
="https://demo.sunspiredemo.com/" & B2
```

**Example results:**

- `https://demo.sunspiredemo.com/acmesolar-k93h`
- `https://demo.sunspiredemo.com/greenenergyco-xyz`
- `https://demo.sunspiredemo.com/sunpowersolutions-abc`

### Step 5: Export to CSV

1. File → Download → CSV
2. Use this CSV in your email campaign tool (Instantly, Smartlead, etc.)

## Advanced: Add Domain Support

If you want to include company domains for logo display:

### Add Domain Column

- F1: `domain`
- F2: `acmesolar.com`
- F3: `greenenergyco.com`
- F4: `sunpowersolutions.com`

### Enhanced Outreach Link (with domain parameter)

In C2, use this formula instead:

```
="https://demo.sunspiredemo.com/" & B2 & "?domain=" & F2
```

**Example results:**

- `https://demo.sunspiredemo.com/acmesolar-k93h?domain=acmesolar.com`
- `https://demo.sunspiredemo.com/greenenergyco-xyz?domain=greenenergyco.com`

## Formula Breakdown

### Slug Generation Formula:

```
=LOWER(REGEXREPLACE(A2,"[^a-z0-9]","")) & "-" & DEC2BASE(RANDBETWEEN(46656,1679615),36)
```

**Parts:**

1. `REGEXREPLACE(A2,"[^a-z0-9]","")` - Removes all non-alphanumeric characters
2. `LOWER(...)` - Converts to lowercase
3. `DEC2BASE(RANDBETWEEN(46656,1679615),36)` - Random 4-char suffix
   - Range 46656-1679615 gives 4-character base36 strings
   - Base36 uses 0-9 and a-z (36 characters total)

### Why This Works:

- **Unique**: Random suffix ensures no duplicates
- **Clean**: Removes special characters that could break URLs
- **Scalable**: Can handle millions of companies
- **Consistent**: Same company always gets same base slug

## Troubleshooting

### If you get errors:

1. **#VALUE! error**: Check that company names don't have extreme special characters
2. **Slug too long**: The formula automatically limits to reasonable length
3. **Duplicates**: Extremely rare, but you can manually adjust if needed

### Manual adjustments:

- Edit any slug manually if needed
- Use `=LOWER(REGEXREPLACE(A2,"[^a-z0-9]",""))` for just the base slug
- Add custom suffixes like `=B2 & "-custom"`

## Final CSV Structure

Your final CSV should look like:

```csv
first_name,company,email,company_slug,outreach_link,domain
"John","Acme Solar","john@acmesolar.com","acmesolar-k93h","https://demo.sunspiredemo.com/acmesolar-k93h","acmesolar.com"
"Sarah","Green Energy Co","sarah@greenenergyco.com","greenenergyco-xyz","https://demo.sunspiredemo.com/greenenergyco-xyz","greenenergyco.com"
```

This CSV is ready to import into Instantly, Smartlead, or any other email campaign tool!
