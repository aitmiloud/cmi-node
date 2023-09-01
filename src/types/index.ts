export interface CmiOptions {
  storekey?: string;
  clientid?: string;
  okUrl?: string;
  failUrl?: string;
  shopurl?: string;
  storetype?: string;
  TranType?: string;
  currency?: string;
  rnd?: string;
  amount?: string;
  lang?: string;
  hashAlgorithm?: string;
  encoding?: string;
  refreshtime?: string;
  callbackURL?: string;
  oid?: string;
  email?: string;
  BillToName?: string;
  HASH?: string;
}

export type ValidationRule = {
  field: keyof CmiOptions;
  required: boolean;
  type: 'stringOrNull' | 'isURL' | 'validLang' | 'isEmail' | 'validHashAlgorithm';
  allowEmpty: boolean;
  noWhitespace: boolean;
  validLang?: string[];
  validHashAlgorithm?: string[];
  isURL?: boolean;
  isEmail?: boolean;
};

// export interface CmiHashParams {}

// export interface CmiGenerateLinkOptions {}
