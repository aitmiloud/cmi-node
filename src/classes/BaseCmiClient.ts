import crypto from 'node:crypto';
import { CmiClientinterface } from '../interfaces/CmiClientInterface';
import { CmiOptions, ValidationRule } from '../types';

export default class BaseCmiClient implements CmiClientinterface {
  /**
   * string default base url for CMI's API
   */
  readonly DEFAULT_API_BASE_URL = 'https://testpayment.cmi.co.ma';

  /**
   * array of languages supported by CMI
   */
  readonly LANGUAGES = ['ar', 'fr', 'en'];

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
      rnd: Date.now().toString(),
      lang: 'fr',
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
    const validationRules: ValidationRule[] = [
      { field: 'storekey', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      { field: 'clientid', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      { field: 'storetype', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      { field: 'TranType', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      { field: 'amount', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      { field: 'currency', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      { field: 'oid', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      { field: 'okUrl', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true, isURL: true },
      { field: 'failUrl', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true, isURL: true },
      {
        field: 'lang',
        required: true,
        type: 'stringOrNull',
        allowEmpty: false,
        noWhitespace: true,
        validLang: ['ar', 'fr', 'en'],
      },
      { field: 'email', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true, isEmail: true },
      { field: 'BillToName', required: true, type: 'stringOrNull', allowEmpty: false, noWhitespace: true },
      {
        field: 'hashAlgorithm',
        required: true,
        type: 'stringOrNull',
        allowEmpty: false,
        noWhitespace: true,
        validHashAlgorithm: ['SHA1', 'SHA256', 'SHA512'],
      },
      {
        field: 'callbackURL',
        required: true,
        type: 'stringOrNull',
        allowEmpty: false,
        noWhitespace: true,
        isURL: true,
      },
    ];

    for (const rule of validationRules) {
      const value = opts[rule.field];

      if (rule.required && (value === undefined || value === null)) {
        throw new Error(`${rule.field} is required`);
      }

      if (value !== null) {
        if (rule.type === 'stringOrNull' && typeof value !== 'string' && value !== null) {
          throw new Error(`${rule.field} must be a string or null`);
        }

        if (rule.isURL && typeof value === 'string' && !/^https?:\/\/.+/.test(value)) {
          throw new Error(`${rule.field} must be a valid URL`);
        }

        if (rule.isEmail && typeof value === 'string' && !/^.+@.+\..+$/.test(value)) {
          throw new Error(`${rule.field} must be a valid email`);
        }

        if (rule.validLang && typeof value === 'string' && !rule.validLang.includes(value)) {
          throw new Error(`${rule.field} must be one of these languages: ${rule.validLang.join(', ')}`);
        }

        if (!rule.allowEmpty && (value === '' || (typeof value === 'string' && /^\s*$/.test(value)))) {
          throw new Error(`${rule.field} can't be empty`);
        }

        if (rule.noWhitespace && typeof value === 'string' && /\s/.test(value)) {
          throw new Error(`${rule.field} can't contain whitespace`);
        }
      }
    }
  }
}
