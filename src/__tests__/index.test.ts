import uuid from '../index';

describe('valid UUID', () => {
  let VALID_UUID_REGEX: RegExp;

  beforeAll(() => {
    VALID_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  });

  test('should match a valid UUID', () => {
    expect(VALID_UUID_REGEX.test(uuid.v4())).toBeTruthy();
  });
});
