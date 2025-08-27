# Admin User Management

This document explains how to manage admin users for the forklift management system.

## Overview

The system uses Supabase Auth for authentication combined with a custom `admin_users` table for authorization. Admin users must exist in both:
1. **Supabase Auth** - for login credentials
2. **admin_users table** - for admin permissions and role management

## Admin User Management Script

The `admin-setup.js` script provides easy management of admin users.

### Prerequisites

- Node.js installed
- Supabase project access
- Service role key from Supabase dashboard

### Configuration

The script is already configured with your project details:
- Supabase URL: `https://aifgbbgclcukazrwezwk.supabase.co`
- Service role key is already set in the file

### Available Commands

#### 1. List All Admin Users
```bash
node admin-setup.js list
```
Shows all admin users with their email, name, and status.

#### 2. Create New Admin User
```bash
node admin-setup.js create <email> <password> [name]
```

**Examples:**
```bash
# Create admin with default name "Admin"
node admin-setup.js create admin@clark.gr mySecurePassword123

# Create admin with custom name
node admin-setup.js create john@clark.gr myPassword456 "John Doe"
```

**What this does:**
- Creates user in Supabase Auth with the provided credentials
- Adds user to `admin_users` table with admin role
- Sets user as active by default

#### 3. Reset User Password
```bash
node admin-setup.js reset <email> <new-password>
```

**Example:**
```bash
node admin-setup.js reset admin@clark.gr newSecurePassword789
```

## Admin Users Table Structure

The `admin_users` table contains:
- `id` - Primary key
- `email` - Must match Supabase Auth email
- `name` - Display name
- `role` - User role (typically "admin")
- `is_active` - Whether user can log in
- `password_hash` - Not used (managed by Supabase Auth)
- `created_at` / `updated_at` - Timestamps

## Authentication Flow

1. User enters email/password on login page
2. System authenticates with Supabase Auth
3. System checks if user exists in `admin_users` table with `is_active = true`
4. If both checks pass, user is logged in with 30-minute session timeout

## Session Management

- **Session Duration:** 30 minutes of inactivity
- **Warning:** Shows 5 minutes before expiry
- **Auto-logout:** Automatic logout when session expires
- **Activity Tracking:** Mouse, keyboard, scroll events extend session

## Security Features

- **Database validation:** All admin users must be in `admin_users` table
- **Active status check:** Only `is_active = true` users can log in
- **Session timeout:** Automatic logout after 30 minutes
- **Server-side validation:** Middleware validates all admin routes
- **Automatic cleanup:** Sessions and local storage cleared on logout

## Troubleshooting

### Can't log in with correct credentials
1. Check if user exists: `node admin-setup.js list`
2. Verify user is active in the list
3. Try resetting password: `node admin-setup.js reset email@example.com newPassword`

### User exists but can't access admin panel
- User might exist in Supabase Auth but not in `admin_users` table
- Check the `is_active` status in the database
- Re-create the user: `node admin-setup.js create email@example.com password`

### Session expires too quickly
- Sessions are set to 30 minutes for security
- User activity (mouse, keyboard, scroll) extends the session
- Warning appears 5 minutes before expiry with option to extend

## Best Practices

1. **Strong Passwords:** Use complex passwords for admin accounts
2. **Limited Admin Users:** Only create admin accounts for users who need them
3. **Regular Cleanup:** Deactivate unused admin accounts by setting `is_active = false`
4. **Monitor Sessions:** 30-minute timeout ensures security even if users forget to log out
5. **Backup Access:** Keep at least one working admin account as backup

## Manual Database Management

If you prefer to manage users directly in Supabase:

1. **Via Supabase Dashboard:**
   - Go to Authentication → Users for auth management
   - Go to Table Editor → admin_users for permissions

2. **Remember:** Users need to exist in BOTH places to work properly

## Script Maintenance

Keep the `admin-setup.js` file for future admin user management. The service role key is already configured and should be kept secure.