const bcrypt = require('bcryptjs');

const ADMIN_HASH = '$2b$10$aj4AJW2jRTbjSKtUIdRFSeeWbhIwRck4OR3HCJfRFaxguYu9dN4.W'; // Your current hash
const testPassword = 'bobby2025'; // The password you're trying

bcrypt.compare(testPassword, ADMIN_HASH)
  .then(isMatch => {
    console.log('Does the password match the hash? ', isMatch); // Should log true if correct
  })
  .catch(err => console.error('Error:', err));