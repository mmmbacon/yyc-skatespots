import { describe, it, expect } from 'vitest';
import { avatarSrc, DEFAULT_AVATAR, DEFAULT_PIN_IMAGE } from './config';

describe('avatarSrc', () => {
  it('uses default avatar when picture is missing', () => {
    expect(avatarSrc(null)).toBe(DEFAULT_AVATAR);
    expect(avatarSrc('')).toBe(DEFAULT_AVATAR);
  });

  it('replaces legacy pin image path used as avatar', () => {
    expect(avatarSrc(DEFAULT_PIN_IMAGE)).toBe(DEFAULT_AVATAR);
  });

  it('replaces legacy seed skateboard icon', () => {
    expect(
      avatarSrc(
        'https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-skateboard-50_hpu6mg.png',
      ),
    ).toBe(DEFAULT_AVATAR);
  });

  it('keeps real profile photos', () => {
    const url = 'https://lh3.googleusercontent.com/a/example';
    expect(avatarSrc(url)).toBe(url);
  });
});
