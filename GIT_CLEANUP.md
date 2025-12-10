# Git Security Cleanup Guide

## What Was Fixed

1. **Firebase keys** - Moved from hardcoded in `auth.js` to environment variables
2. **Stripe secret key** - Removed from client-side `.env` (should only be on server)
3. **`.gitignore`** - Updated to ignore `build/`, `.firebase/`, and `.env` files

## Critical Security Issue Found

⚠️ **Your `.env` file had a Stripe SECRET key (`sk_test_...`) which should NEVER be on the client side!**

- Client side should only have: `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- Secret keys should ONLY be on the server

## Steps to Clean Up Git

### 1. Remove Sensitive Files from Git

```bash
cd "c:\programming hero\assignment-11\loomware\loomware-client"

# Remove build artifacts and .env from Git history
git rm -r --cached build
git rm -r --cached .firebase
git rm --cached .env

# Commit the removal
git commit -m "Remove sensitive files and build artifacts"
```

### 2. Try Pushing Again

```bash
git push
```

### 3. If GitHub Still Blocks

If GitHub still detects the secret, you have two options:

**Option A: Allow this push (then rotate keys)**
- Click: https://github.com/MaahinSK/loomware-client/security/secret-scanning/unblock-secret/36fY10ogyiJbUpmkK3KBKwSHwKY
- Then immediately rotate your Stripe keys (see below)

**Option B: Clean Git history completely**
```bash
# Use BFG Repo Cleaner or git filter-branch to remove secrets from history
# This is more complex but more secure
```

## After Pushing Successfully

### IMMEDIATELY Rotate Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Click "Create secret key" to generate a new one
3. Copy the new secret key
4. Update your **server-side** `.env` file with the new key
5. Delete the old exposed key from Stripe dashboard
6. Redeploy your server to Vercel

### Update Environment Variables

**Client-side `.env` should have:**
```env
REACT_APP_API_URL=https://loomware-serverv2.vercel.app/api
REACT_APP_FIREBASE_API_KEY=AIzaSyBeJcwtgcHbGQMK1TBaXIzh154ESb8zank
REACT_APP_FIREBASE_AUTH_DOMAIN=loomware-a50ce.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=loomware-a50ce
REACT_APP_FIREBASE_STORAGE_BUCKET=loomware-a50ce.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=44276511742
REACT_APP_FIREBASE_APP_ID=1:44276511742:web:d5c18a7833622a6f66c6af
# Only publishable key on client!
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Server-side `.env` should have:**
```env
STRIPE_SECRET_KEY=sk_test_your_NEW_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Firebase Hosting Environment Variables

Since you're using Firebase Hosting, you may also need to set environment variables there:

```bash
firebase functions:config:set stripe.secret="sk_test_your_NEW_key"
```

## Summary

✅ Firebase keys now use environment variables  
✅ `.gitignore` updated to prevent future issues  
✅ Stripe secret key removed from client  
⚠️ **MUST rotate Stripe keys after pushing**  
⚠️ **MUST update server with new keys**  

## Best Practices Going Forward

1. **Never commit `.env` files**
2. **Never put secret keys on client side**
3. **Always use environment variables**
4. **Rotate keys immediately if exposed**
5. **Add `build/` to `.gitignore`**
