import CmiClient from '../index';

const validOptions = {
  storekey: 'Fiamane_store_key23',
  clientid: '600003445',
  oid: '135ABC',
  shopurl: 'https://google.com',
  okUrl: 'https://google.com',
  failUrl: 'https://google.com',
  email: 'test@gmail.com',
  BillToName: 'test',
  BillToCompany: 'test',
  amount: '100',
  callbackUrl: 'https://google.com',
};

describe('Creating new CmiClient class instance', () => {
  const cmiClient = new CmiClient(validOptions);

  test('should return a new instance of CmiClient', () => {
    expect(cmiClient).toBeInstanceOf(CmiClient);
  });

  test('should return a hash string', () => {
    expect(typeof cmiClient.generateHash(validOptions.storekey)).toBe('string');
  });
});

describe('Testing CmiClient class methods', () => {
  const cmiClient = new CmiClient(validOptions);

  test('should return a default options object', () => {
    expect(cmiClient.getDefaultOpts()).toBeInstanceOf(Object);
  });

  test('should return a hash string', () => {
    expect(typeof cmiClient.generateHash(validOptions.storekey)).toBe('string');
  });

  test('should return a require options object', () => {
    expect(cmiClient.getRequireOpts()).toBeInstanceOf(Object);
  });
});

describe('Testing invalid options', () => {
  const invalidStoreKey = { ...validOptions, storekey: '' };

  test('should throw an error if storekey is not provided', () => {
    //const cmiClient = new CmiClient(invalidStoreKey);
    expect(() => new CmiClient(invalidStoreKey)).toThrow('storekey is required');
  });

  const invalidClientId = { ...validOptions, clientid: '' };

  test('should throw an error if clientid is not provided', () => {
    expect(() => new CmiClient(invalidClientId)).toThrow('clientid is required');
  });

  const invalidOid = { ...validOptions, oid: '' };

  test('should throw an error if oid is not provided', () => {
    expect(() => new CmiClient(invalidOid)).toThrow('oid is required');
  });

  const invalidOkUrl = { ...validOptions, okUrl: '' };

  test('should throw an error if okUrl is not provided', () => {
    expect(() => new CmiClient(invalidOkUrl)).toThrow('okUrl is required');
  });

  const invalidFailUrl = { ...validOptions, failUrl: '' };

  test('should throw an error if failUrl is not provided', () => {
    expect(() => new CmiClient(invalidFailUrl)).toThrow('failUrl is required');
  });

  const invalidEmail = { ...validOptions, email: '' };

  test('should throw an error if email is not provided', () => {
    expect(() => new CmiClient(invalidEmail)).toThrow('email is required');
  });

  const invalidBillToName = { ...validOptions, BillToName: '' };

  test('should throw an error if BillToName is not provided', () => {
    expect(() => new CmiClient(invalidBillToName)).toThrow('BillToName is required');
  });

  const invalidAmount = { ...validOptions, amount: '' };

  test('should throw an error if amount is not provided', () => {
    expect(() => new CmiClient(invalidAmount)).toThrow('amount is required');
  });

  const invalidCallbackUrl = { ...validOptions, callbackUrl: '' };

  test('should throw an error if CallbackURL is not provided', () => {
    expect(() => new CmiClient(invalidCallbackUrl)).toThrow('callbackUrl is required');
  });
});

describe('Testing if CmiClient class methods return html form', () => {
  const cmiClient = new CmiClient(validOptions);

  test('should return a html form', () => {
    expect(typeof cmiClient.redirect_post()).toBe('string');
  });
});
