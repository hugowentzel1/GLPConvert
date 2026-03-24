# 🚀 Complete Setup Checklist - Personalized URL System

## ✅ COMPLETED AUTOMATICALLY:

- [x] Redirect app files created (`sunspire-outreach-redirects/`)
- [x] Company helper functions (`lib/company.ts`)
- [x] Personalized demo page (`app/page.tsx`)
- [x] Main project changes pushed to GitHub
- [x] CSV template created
- [x] Google Sheets formulas guide
- [x] Email campaign template

## 🔄 MANUAL STEPS TO COMPLETE:

### PHASE A: Deploy Redirect App

1. **Create GitHub Repository:**
   - Go to [github.com](https://github.com) → New repository
   - Name: `sunspire-outreach-redirects`
   - Private
   - Don't initialize with README

2. **Push Redirect Code:**

   ```bash
   cd sunspire-outreach-redirects
   git remote add origin https://github.com/YOUR_USERNAME/sunspire-outreach-redirects.git
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Add New → Project → Import Git Repository
   - Choose `sunspire-outreach-redirects` → Deploy

4. **Add Domain:**
   - After deploy: Project → Settings → Domains → Add
   - Enter: `demo.sunspiredemo.com`
   - Copy the CNAME target

5. **Configure Namecheap DNS:**
   - Go to Namecheap → Domain List → Manage `sunspiredemo.com`
   - Advanced DNS → Add New Record → CNAME Record
   - Host: `demo`
   - Value: (paste Vercel CNAME)
   - TTL: Automatic
   - Save, then verify in Vercel

### PHASE B: Deploy Demo Updates

1. **Main site auto-deploys** (already pushed to GitHub)
2. **Test personalization:**
   - `https://sunspiredemo.com/?company=AcmeSolar`
   - Should show "Custom Sunspire Demo for AcmeSolar"

### PHASE C: Generate 100K Links

1. **Create Google Sheet** with company names
2. **Use formulas from** `docs/google-sheets-formulas.md`
3. **Export to CSV** for email campaign

### PHASE D: Email Campaign Setup

1. **Prepare CSV** using template from `data/outreach-campaign-template.csv`
2. **Set up Instantly/Smartlead** campaign
3. **Use email template** from `email-campaigns/outreach-email-template.txt`

## 🧪 TESTING CHECKLIST:

### Test Redirect System:

- [ ] `https://demo.sunspiredemo.com/test-company` redirects to `https://sunspiredemo.com/?company=test-company`
- [ ] UTM parameters are added correctly
- [ ] No 404 errors

### Test Personalization:

- [ ] Company name displays correctly
- [ ] Dynamic colors change per company
- [ ] Page title updates
- [ ] Meta robots tag added for SEO protection

### Test Email Campaign:

- [ ] CSV imports correctly
- [ ] Personalization variables work
- [ ] Links are clickable
- [ ] Tracking works

## 📊 EXPECTED RESULTS:

### After Setup:

- **Infinite personalized URLs**: `demo.sunspiredemo.com/[any-slug]`
- **Each redirects to**: `sunspiredemo.com/?company=[slug]`
- **Page automatically shows**: Company name, custom colors, branding
- **Ready for 100K+ prospects**: Each gets their own unique link

### Performance:

- **Redirect speed**: <100ms
- **Page load**: <2s
- **Scalability**: Unlimited prospects
- **SEO safe**: No duplicate content issues

## 🚨 CRITICAL CHECKS:

### Before Going Live:

- [ ] All redirects work (test 10+ random slugs)
- [ ] Demo page personalizes correctly
- [ ] No broken links or 404s
- [ ] Email templates render properly
- [ ] Tracking and analytics work

### Compliance:

- [ ] Unsubscribe links included
- [ ] Postal address in emails
- [ ] CAN-SPAM compliant
- [ ] GDPR considerations (if applicable)

## 🎯 NEXT STEPS AFTER SETUP:

1. **Test with 100 prospects** first
2. **Monitor deliverability** and engagement
3. **Scale up gradually** (20 → 40 → 70 → 100+ per inbox)
4. **Track conversions** from personalized links
5. **Optimize based on data**

## 📞 SUPPORT:

If you encounter issues:

1. Check Vercel deployment logs
2. Verify DNS propagation (can take up to 48 hours)
3. Test redirects manually
4. Check browser console for JavaScript errors

---

**Status**: 🟡 Ready for manual deployment steps
**Estimated completion time**: 30-60 minutes
**Difficulty**: Easy (mostly copy-paste)
