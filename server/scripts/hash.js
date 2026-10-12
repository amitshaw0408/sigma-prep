// Usage: npm run hash -- "my password"   → prints a bcrypt hash for ADMIN_PASSWORD_HASH
import bcrypt from 'bcryptjs'
const pw = process.argv[2]
if (!pw) { console.error('Usage: npm run hash -- "your-password"'); process.exit(1) }
console.log(bcrypt.hashSync(pw, 12))
