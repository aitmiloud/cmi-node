import CmiClient from '../index';

const validOptions = {
  storekey: 'Atzapps_store_key23',
  clientid: '60000999',
  oid: '135ABC',
  shopurl: 'https://google.com',
  okUrl: 'https://google.com',
  failUrl: 'https://google.com',
  email: 'test@gmail.com',
  BillToName: 'test',
  amount: '7896',
  callbackURL: 'https://google.com',
  tel: '212652124874',
};

describe('CmiClient', () => {
  let cmiClient: CmiClient;

  beforeEach(() => {
    cmiClient = new CmiClient(validOptions);
  });

  test('creates a new instance of CmiClient', () => {
    expect(cmiClient).toBeInstanceOf(CmiClient);
  });

  test('generates a hash string', () => {
    const hash = cmiClient.generateHash(validOptions.storekey);
    expect(typeof hash).toBe('string');
  });

  test('returns default options object', () => {
    const defaultOpts = cmiClient.getDefaultOpts();
    expect(defaultOpts).toBeInstanceOf(Object);
  });

  test('returns required options object', () => {
    const requiredOpts = cmiClient.getRequireOpts();
    expect(requiredOpts).toBeInstanceOf(Object);
  });

  describe('invalid options', () => {
    const invalidCases = [
      { key: 'storekey', message: 'storekey is required' },
      { key: 'clientid', message: 'clientid is required' },
      { key: 'oid', message: 'oid is required' },
      { key: 'okUrl', message: 'okUrl is required' },
      { key: 'failUrl', message: 'failUrl is required' },
      { key: 'email', message: 'email is required' },
      { key: 'BillToName', message: 'BillToName is required' },
      { key: 'amount', message: 'amount is required' },
      { key: 'callbackURL', message: 'callbackURL is required' },
    ];

    invalidCases.forEach(({ key, message }) => {
      test(`throws an error if ${key} is not provided`, () => {
        const invalidOptions = { ...validOptions, [key]: null };
        expect(() => new CmiClient(invalidOptions)).toThrow(message);
      });
    });

    test('throws an error if email is not a valid email', () => {
      const invalidOptions = { ...validOptions, email: 'invalid_email' };
      expect(() => new CmiClient(invalidOptions)).toThrow('email must be a valid email');
    });

    test('throws an error if lang is not one of "ar", "fr", "en"', () => {
      const invalidOptions = { ...validOptions, lang: 'es' };
      expect(() => new CmiClient(invalidOptions)).toThrow('lang must be one of these languages: ar, fr, en');
    });
  });

  test('returns an HTML form string', () => {
    const form = cmiClient.redirect_post();
    expect(typeof form).toBe('string');
  });
});
