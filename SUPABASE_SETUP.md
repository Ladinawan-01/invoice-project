# Supabase Authentication Setup

## ⚠️ IMPORTANT: Environment Variables Setup

The `.env.local` file has been created, but you need to add your **Supabase Anon Key**.

### Quick Setup Steps:

1. **Open `.env.local` file** in the root directory of your project

2. **Get your Supabase Anon Key:**
   - Go to: https://supabase.com/dashboard/project/rwpilfomrrixlaigciyw/settings/api
   - Or: https://supabase.com/dashboard → Select project "invoice" → Settings → API
   - Find the **"anon" or "public" key** (it's a long string starting with `eyJ...`)
   - Copy the entire key

3. **Update `.env.local` file:**
   - Replace `YOUR_ANON_KEY_HERE` with your actual anon key
   - The file should look like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rwpilfomrrixlaigciyw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGlsZm9tcnJpeGxhaWdjaXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MT... (your full key)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
DATABASE_URL=postgresql://postgres:Ladinawan4436@db.rwpilfomrrixlaigciyw.supabase.co:5432/postgres
```

4. **Restart your development server** after updating the file:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## How to Get Your Supabase Keys

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project: **invoice** (or project ID: `rwpilfomrrixlaigciyw`)
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Already set: `https://rwpilfomrrixlaigciyw.supabase.co`
   - **anon/public key** → **REQUIRED** - Copy this and paste in `.env.local`
   - **service_role key** → Optional (only for admin operations)

## Features Implemented

✅ **Authentication System**
- Sign up with email/password
- Sign in with email/password
- Sign out functionality
- Protected routes (middleware)
- User session management

✅ **UI Components**
- Beautiful login/signup page matching your invoice dashboard design
- Toast notifications for user feedback
- Loading states during authentication
- Password visibility toggle
- Form validation

✅ **User Profile**
- Display user email in header
- Display user name (if provided during signup)
- Logout button in header

## Authentication Flow

1. **Sign Up**: Users can create an account with email, password, full name, and phone
2. **Email Verification**: After signup, Supabase sends a verification email (optional based on your settings)
3. **Sign In**: Users sign in with email and password
4. **Protected Routes**: Middleware automatically redirects unauthenticated users to `/login`
5. **Session Management**: User sessions are maintained automatically

## Next Steps

1. **Set up environment variables** (see above)
2. **Configure Email Settings** in Supabase Dashboard:
   - Go to **Authentication** → **Settings** → **Email Templates**
   - Customize email templates if needed
   - Enable/disable email confirmation as per your requirements

3. **Run the application**:
   ```bash
   npm run dev
   ```

4. **Test Authentication**:
   - Visit `http://localhost:3000` - should redirect to `/login`
   - Create a new account
   - Sign in
   - Try accessing protected routes

## Database Schema (Optional)

If you want to store additional user data, you can create a `profiles` table in Supabase:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

## Troubleshooting

- **"Invalid API key"**: Make sure you copied the correct keys from Supabase dashboard
- **Redirect loops**: Check that middleware is properly configured
- **Email not sending**: Check Supabase email settings and SMTP configuration

