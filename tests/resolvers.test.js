const { describe, it } = require('node:test');
const assert = require('node:assert');
const { GraphQLError } = require('graphql');
const resolvers = require('../resolvers');

describe('resolvers authentication', () => {
  it('me requires authenticated user', async () => {
    await assert.rejects(
      async () => resolvers.Query.me(null, {}, { currentUser: null }),
      (err) => err instanceof GraphQLError && err.extensions.code === 'UNAUTHENTICATED',
    );
  });

  it('me returns current user when authenticated', async () => {
    const user = { _id: '1', name: 'Test', email: 'test@example.com' };
    const result = await resolvers.Query.me(null, {}, { currentUser: user });
    assert.strictEqual(result._id, '1');
    assert.strictEqual(result.name, 'Test');
    assert.strictEqual(result.picture, '/default_avatar.png');
  });
});
