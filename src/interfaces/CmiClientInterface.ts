import type { CmiOptions } from '../types';

export interface CmiClientinterface {
  getDefaultOpts(): CmiOptions;

  getRequireOpts(): CmiOptions;

  generateHash(storekey: null): string;
}
