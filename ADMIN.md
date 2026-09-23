# Admin setup (Sri Parameswari Sweets)

Footer link **Admin** (shield icon) opens `/admin`.  
There is **no password in the footer** on purpose — putting credentials on a public page is how shops get hacked.

## Is this a good approach?

**Yes, for a small family shop:**

| Approach | Verdict |
|----------|---------|
| Footer → `/admin` login page | Good UX |
| Edit prices / photos without touching code | Needs a real database + file storage |
| “Admin” that only saves in the browser | **Bad** — other visitors never see changes |
| Full custom backend / WordPress | Overkill for this site |

We use **Supabase** (free tier): login, product table, photo storage. The public website reads products from there; if Supabase isn’t configured yet, it still shows the built-in catalog from `src/data.ts`.

## One-time setup (~10 minutes)

### 1. Create a free Supabase project
1. Go to [https://supabase.com](https://supabase.com) → New project  
2. Project Settings → API → copy **Project URL** and **anon public** key  

### 2. Create the database + storage rules
1. Supabase → **SQL Editor** → New query  
2. Paste everything from `supabase/schema.sql` → Run  
3. **Storage** → New bucket → name: `project-images` → turn **Public** ON  
   (If Policies shows `0`, re-run the storage policy section at the bottom of `supabase/schema.sql`)  

### 3. Create your admin login
1. **Authentication** → **Users** → Add user  
2. Enter your email + a strong password (this is your admin login)  
3. Confirm the user if email confirmation is required (or disable “Confirm email” under Auth → Providers → Email for a private shop)

### 4. Wire the website
**Local:** copy `.env.example` → `.env.local` and paste URL + anon key, then `npm run dev`.

**Vercel:** Project → Settings → Environment Variables:

- `VITE_SUPABASE_URL` = your Project URL  
- `VITE_SUPABASE_ANON_KEY` = your anon key  

Redeploy. Then open `https://YOUR-SITE.vercel.app/admin`.

### 5. First login in Admin
1. Sign in with the email/password from step 3  
2. Click **Import starter catalog** (loads the 14 current sweets)  
3. Edit prices, upload photos, add/hide products → **Save**  
4. Open the public site — changes appear after refresh  

## What you can do in Admin
- Change 250g / 500g / 1kg prices  
- Upload product photos (or paste an image URL)  
- Add / edit / delete products  
- Hide a product without deleting (`Visible on website`)  
- Reorder with sort order  

## Security notes
- Only **you** should have the Auth user  
- Never put the password in the footer or in GitHub  
- The anon key is public by design; access is protected by Supabase **Row Level Security** (shoppers can only *read* active products; only logged-in admins can write)

## Login details (fill in for yourself — do not commit)

| Field | Value |
|-------|--------|
| Admin URL | `https://YOUR-VERCEL-URL/admin` or `http://localhost:5173/admin` |
| Email | _(the user you created in Supabase)_ |
| Password | _(only you know this)_ |
