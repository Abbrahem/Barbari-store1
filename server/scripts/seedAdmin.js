import { auth } from '../src/firebaseAdmin.js';

async function upsertAdmin(email, password) {
  try {
    // Try to get existing user
    let user;
    try {
      user = await auth.getUserByEmail(email);
      // Update password if provided
      if (password) {
        await auth.updateUser(user.uid, { password });
      }
    } catch (e) {
      // Create if not found
      if (e.code === 'auth/user-not-found') {
        user = await auth.createUser({ email, password, emailVerified: true, disabled: false });
      } else {
        throw e;
      }
    }

    // Ensure admin claims
    await auth.setCustomUserClaims(user.uid, { admin: true });

    console.log(`[seedAdmin] Admin user is ready.`);
    console.log(`  email: ${email}`);
    console.log(`  uid:   ${user.uid}`);
    console.log(`  claims: { admin: true }`);
    process.exit(0);
  } catch (err) {
    console.error('[seedAdmin] Failed to seed admin:', err.code || '', err.message || err);
    process.exit(1);
  }
}

// Read from env or fallback to hardcoded
const email = process.env.ADMIN_EMAIL || 'barbri@gmail.com';
const password = process.env.ADMIN_PASSWORD || 'barbri123';

if (!email || !password) {
  console.error('[seedAdmin] ADMIN_EMAIL/ADMIN_PASSWORD not set.');
  process.exit(1);
}

upsertAdmin(email, password);
