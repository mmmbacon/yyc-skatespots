const { describe, it } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');

describe('email auth validation', () => {
  it('bcrypt hash and compare work', async () => {
    const hash = await bcrypt.hash('password123', 10);
    assert.strictEqual(await bcrypt.compare('password123', hash), true);
    assert.strictEqual(await bcrypt.compare('wrong', hash), false);
  });
});
