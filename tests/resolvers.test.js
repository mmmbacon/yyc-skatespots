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
    const user = { _id: '1', name: 'Test' };
    const result = await resolvers.Query.me(null, {}, { currentUser: user });
    assert.deepStrictEqual(result, user);
  });
});
