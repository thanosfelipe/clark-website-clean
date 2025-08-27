// Temporary script to manage admin users
// Run with: node admin-setup.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://aifgbbgclcukazrwezwk.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZmdiYmdjbGN1a2F6cndlendrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5MTMxNCwiZXhwIjoyMDY3NjY3MzE0fQ.zRxk5aTxIJ_29Izw2npMG41o7qtyLRs2BhZY4ytT-C0' // You'll need to get this from Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function listAdminUsers() {
  console.log('📋 Current admin users:')
  
  const { data: adminUsers, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role, is_active')
    .order('created_at')

  if (error) {
    console.error('❌ Error fetching admin users:', error.message)
    return
  }

  if (adminUsers.length === 0) {
    console.log('   No admin users found.')
    return
  }

  adminUsers.forEach(user => {
    console.log(`   • ${user.email} (${user.name}) - ${user.is_active ? 'Active' : 'Inactive'}`)
  })
}

async function createAdminUser(email, password, name = 'Admin') {
  console.log(`🔧 Creating admin user: ${email}`)

  // First, create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  })

  if (authError) {
    console.error('❌ Error creating auth user:', authError.message)
    return false
  }

  console.log('✅ Auth user created')

  // Then add to admin_users table
  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .insert({
      email: email,
      name: name,
      role: 'admin',
      is_active: true,
      password_hash: 'managed_by_supabase_auth' // Not used since we use Supabase Auth
    })
    .select()

  if (adminError) {
    console.error('❌ Error adding to admin_users table:', adminError.message)
    // Clean up the auth user if admin_users insert failed
    await supabase.auth.admin.deleteUser(authData.user.id)
    return false
  }

  console.log('✅ Admin user created successfully!')
  return true
}

async function resetUserPassword(email, newPassword) {
  console.log(`🔑 Resetting password for: ${email}`)

  // First, check if user exists in admin_users
  const { data: adminUser, error: checkError } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', email)
    .single()

  if (checkError || !adminUser) {
    console.error('❌ Admin user not found in database')
    return false
  }

  // Reset password in Supabase Auth
  const { data, error } = await supabase.auth.admin.updateUserById(
    email, // This should be user ID, but we'll use email lookup
    { password: newPassword }
  )

  if (error) {
    console.error('❌ Error resetting password:', error.message)
    return false
  }

  console.log('✅ Password reset successfully!')
  return true
}

// Main execution
async function main() {
  console.log('🚀 Admin User Management Script')
  console.log('================================')
  
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command) {
    console.log('📖 Usage:')
    console.log('  node admin-setup.js list')
    console.log('  node admin-setup.js create <email> <password> [name]')
    console.log('  node admin-setup.js reset <email> <new-password>')
    console.log('')
    console.log('⚠️  Remember to update the SUPABASE_SERVICE_KEY at the top of this file!')
    return
  }

  switch (command) {
    case 'list':
      await listAdminUsers()
      break
      
    case 'create':
      const email = args[1]
      const password = args[2]
      const name = args[3] || 'Admin'
      
      if (!email || !password) {
        console.error('❌ Email and password are required')
        return
      }
      
      await createAdminUser(email, password, name)
      break
      
    case 'reset':
      const resetEmail = args[1]
      const newPassword = args[2]
      
      if (!resetEmail || !newPassword) {
        console.error('❌ Email and new password are required')
        return
      }
      
      await resetUserPassword(resetEmail, newPassword)
      break
      
    default:
      console.error('❌ Unknown command:', command)
  }
}

main().catch(console.error)