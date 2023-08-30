import crypto from 'node:crypto';
import { CmiClientinterface } from '../interfaces/CmiClientInterface';
import { CmiOptions } from '../types';

export default class BaseCmiClient implements CmiClientinterface {
  /**
   * string default base url for CMI's API
   */
  DEFAULT_API_BASE_URL = 'https://testpayment.cmi.co.ma';

  /**
   * array of languages supported by CMI
   */
  LANGUAGES = ['ar', 'fr', 'en'];

  /**
   * array of required options for CMI
   */
  requiredOpts: CmiOptions;

  /**
   * Initializes a new instance of the {CmiClient} class.
   *
   * The constructor takes a require multiple argument. it must be an array
   *
   * Configuration setting include the following options:
   *
   * - storekey (string) : it's necessary to generate hash key
   * - clientid (string) : it given by CMI you should contcat them to get a unique clientid
   * - oid (string) : command_id it should be unique for each time your would like to make transaction
   * - okUrl (string) The URL used to redirect the customer back to the mechant's web site (accepted payment)
   * - failUrl (string) The URL used to redirect the customer back to the mechant's web site (failed/rejected payment)
   * - email (string) Customer email
   * - BillToName (string) Customer's name (firstname and lastname)
   * - amount (Numeric) Transaction amount
   */
  constructor(requiredOpts: CmiOptions) {
    if (!requiredOpts) {
      throw new Error('requiredOpts is required');
    }

    // MERGE DEFAULT OPTIONS WITH REQUIRED OPTIONS AND ASSIGN IT TO REQUIRED OPTIONS
    requiredOpts = { ...this.getDefaultOpts(), ...requiredOpts };

    // VALIDATE REQUIRED OPTIONS
    this.validateOptions(requiredOpts);

    // ASSIGN
    this.requiredOpts = requiredOpts;
  }

  /**
   * Get default cmi options
   * @returns {CmiOptions} default cmi options
   */
  getDefaultOpts(): CmiOptions {
    return {
      storetype: '3D_PAY_HOSTING',
      TranType: 'PreAuth',
      currency: '504', // 504 is MAD
      rnd: '0.12564400 1669294756',
      lang: 'en',
      hashAlgorithm: 'ver3',
      encoding: 'UTF-8', // Optional
      refreshtime: '5', // Optional
    };
  }

  /**
   * Get all required options
   * @returns {CmiOptions} required options
   */
  public getRequireOpts(): CmiOptions {
    return this.requiredOpts;
  }

  /**
   * Generate Hash to make request to CMI page
   * @returns {string} calculated hash
   */
  public generateHash(storekey: string | null | undefined = ''): string {
    // amount|BillToCompany|BillToName|callbackUrl|clientid|currency|email|failUrl|hashAlgorithm|lang|okurl|rnd|storetype|TranType|storeKey
    /**
     * ASSIGNE STORE KEY
     */
    if (storekey == null || storekey == undefined || storekey == '') {
      storekey = this.requiredOpts.storekey;
    }

    // EXCLUDE STOREKEY FROM REQUIRE OPTIONS
    delete this.requiredOpts.storekey;

    const cmiParams = this.requiredOpts;
    // sort the required options by key alphabetically like natcasesort in php
    const sortedKeys = Object.keys(cmiParams).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
    );
    const sortedCmiParams = <CmiOptions>{};
    type T = keyof typeof sortedCmiParams;
    sortedKeys.forEach((key) => {
      sortedCmiParams[key as T] = cmiParams[key as T];
    });

    let hashval = '';
    for (const key in sortedCmiParams) {
      if (key != 'HASH' && key != 'encoding') {
        hashval += sortedCmiParams[key as T] + '|';
      }
    }

    hashval += storekey;

    const hash = crypto.createHash('sha512').update(hashval).digest('hex');
    // convert it to base64
    const calculatedHash = Buffer.from(hash, 'hex').toString('base64');
    this.requiredOpts.HASH = calculatedHash;
    return calculatedHash;
  }

  private validateOptions(opts: CmiOptions): void {
    try {
      // VALIDATE STOREKEY SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.storekey) {
        throw Error('storekey is required');
      }
      if (typeof opts.storekey !== 'string' && opts.storekey !== null) {
        throw new Error('storekey must be a string or null');
      }
      if (opts.storekey === '') {
        throw new Error("storekey can't be empty");
      }
      if (opts.storekey && /\s/.test(opts.storekey)) {
        throw new Error("storekey can't contain whitespace");
      }

      // VALIDATE CLIENTID SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.clientid) {
        throw new Error('clientid is required');
      }
      if (typeof opts.clientid !== 'string' && opts.clientid !== null) {
        throw new Error('clientid must be a string or null');
      }
      if (opts.clientid === '') {
        throw new Error("clientid can't be empty");
      }
      if (opts.clientid && /\s/.test(opts.clientid)) {
        throw new Error("clientid can't contain whitespace");
      }

      // VALIDATE STORETYPE SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.storetype) {
        throw new Error('storetype is required');
      }
      if (typeof opts.storetype !== 'string' && opts.storetype !== null) {
        throw new Error('storetype must be a string or null');
      }
      if (opts.storetype === '') {
        throw new Error("storetype can't be empty");
      }
      if (opts.storetype && /\s/.test(opts.storetype)) {
        throw new Error("storetype can't contain whitespace");
      }

      // VALIDATE trantype SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.TranType) {
        throw new Error('trantype is required');
      }
      if (typeof opts.TranType !== 'string' && opts.TranType !== null) {
        throw new Error('trantype must be a string or null');
      }
      if (opts.TranType === '') {
        throw new Error("trantype can't be empty");
      }
      if (opts.TranType && /\s/.test(opts.TranType)) {
        throw new Error("trantype can't contain whitespace");
      }

      // VALIDATE AMOUNT SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.amount) {
        throw new Error('amount is required');
      }
      if (typeof opts.amount !== 'string' && opts.amount !== null) {
        throw new Error('amount must be a string or null');
      }
      if (opts.amount === '') {
        throw new Error("amount can't be empty");
      }
      if (opts.amount && /\s/.test(opts.amount)) {
        throw new Error("amount can't contain whitespace");
      }

      // VALIDATE currency SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.currency) {
        throw new Error('currency is required');
      }
      if (typeof opts.currency !== 'string' && opts.currency !== null) {
        throw new Error('currency must be a string or null');
      }
      if (opts.currency === '') {
        throw new Error("currency can't be empty");
      }
      if (opts.currency && /\s/.test(opts.currency)) {
        throw new Error("currency can't contain whitespace");
      }

      // VALIDATE OID SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.oid) {
        throw new Error('oid is required');
      }
      if (typeof opts.oid !== 'string' && opts.oid !== null) {
        throw new Error('oid must be a string or null');
      }
      if (opts.oid === '') {
        throw new Error("oid can't be empty");
      }
      if (opts.oid && /\s/.test(opts.oid)) {
        throw new Error("oid can't contain whitespace");
      }

      // VALIDATE okUrl SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY AND SHOULD BE A VALID URL USING THIS REGIX "/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i"
      if (!opts.okUrl) {
        throw new Error('okUrl is required');
      }
      if (typeof opts.okUrl !== 'string' && opts.okUrl !== null) {
        throw new Error('okUrl must be a string or null');
      }
      if (opts.okUrl === '') {
        throw new Error("okUrl can't be empty");
      }
      if (opts.okUrl && /\s/.test(opts.okUrl)) {
        throw new Error("okUrl can't contain whitespace");
      }

      // VALIDATE failUrl SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY AND SHOULD BE A VALID URL USING THIS REGIX "/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i"
      if (!opts.failUrl) {
        throw new Error('failUrl is required');
      }
      if (typeof opts.failUrl !== 'string' && opts.failUrl !== null) {
        throw new Error('failUrl must be a string or null');
      }
      if (opts.failUrl === '') {
        throw new Error("failUrl can't be empty");
      }
      if (opts.failUrl && /\s/.test(opts.failUrl)) {
        throw new Error("failUrl can't contain whitespace");
      }

      // VALIDATE LANG SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY AND SHOULD BE ONE OF THIS LANGUAGES "ar", "fr", "en"
      if (!opts.lang) {
        throw new Error('lang is required');
      }
      if (typeof opts.lang !== 'string' && opts.lang !== null) {
        throw new Error('lang must be a string or null');
      }
      if (opts.lang === '') {
        throw new Error("lang can't be empty");
      }
      if (opts.lang && /\s/.test(opts.lang)) {
        throw new Error("lang can't contain whitespace");
      }
      if (opts.lang && !this.LANGUAGES.includes(opts.lang)) {
        throw new Error('lang must be one of this languages "ar", "fr", "en"');
      }

      // VALIDATE EMAIL SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY AND SHOULD BE A VALID EMAIL USING THIS REGIX "/^[^\s@]+@[^\s@]+\.[^\s@]+$/"
      if (!opts.email) {
        throw new Error('email is required');
      }
      if (typeof opts.email !== 'string' && opts.email !== null) {
        throw new Error('email must be a string or null');
      }
      if (opts.email === '') {
        throw new Error("email can't be empty");
      }
      if (opts.email && /\s/.test(opts.email)) {
        throw new Error("email can't contain whitespace");
      }
      if (opts.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(opts.email)) {
        throw new Error('email must be a valid email');
      }

      // VALIDATE BillToName SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY
      if (!opts.BillToName) {
        throw new Error('BillToName is required');
      }
      if (typeof opts.BillToName !== 'string' && opts.BillToName !== null) {
        throw new Error('BillToName must be a string or null');
      }
      if (opts.BillToName === '') {
        throw new Error("BillToName can't be empty");
      }
      if (opts.BillToName && /\s/.test(opts.BillToName)) {
        throw new Error("BillToName can't contain whitespace");
      }

      // VALIDATE HASHALGORITHM SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY AND SHOULD BE ONE OF THIS HASHALGORITHM "SHA1", "SHA256", "SHA512"
      if (!opts.hashAlgorithm) {
        throw new Error('hashAlgorithm is required');
      }
      if (typeof opts.hashAlgorithm !== 'string' && opts.hashAlgorithm !== null) {
        throw new Error('hashAlgorithm must be a string or null');
      }
      if (opts.hashAlgorithm === '') {
        throw new Error("hashAlgorithm can't be empty");
      }
      if (opts.hashAlgorithm && /\s/.test(opts.hashAlgorithm)) {
        throw new Error("hashAlgorithm can't contain whitespace");
      }

      // VALIDATE CALLBACKURL SHOULD BE A STRING OR NULL, CAN'T BE EMPTY STRING, CAN'T CONTAIN WHITESPACE, CAN'T BE AN OBJECT OR ARRAY AND SHOULD BE A VALID URL USING THIS REGIX "/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i"
      if (!opts.callbackURL) {
        throw new Error('callbackUrl is required');
      }
      if (typeof opts.callbackURL !== 'string' && opts.callbackURL !== null) {
        throw new Error('callbackUrl must be a string or null');
      }
      if (opts.callbackURL === '') {
        throw new Error("callbackUrl can't be empty");
      }
      if (opts.callbackURL && /\s/.test(opts.callbackURL)) {
        throw new Error("callbackUrl can't contain whitespace");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
