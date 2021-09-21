import { blankTrait } from './util/blankTrait';
import { faqs } from './util/faqs';
import { fusionAbi } from './util/fusionAbi';
import { s01Abi } from './util/s01Abi';
import { staff } from './util/staff';

export const config = {
  abi: {
    s01: s01Abi,
    fusion: fusionAbi,
  },
  addresses: {
    mainnet: {
      s00: '0x10fE2787a8a8d191fB4389A71083Fc0CC2dC1E35',
      s01: '0xBe19793179c787f5d268e5e13C99CB735703c086',
      fusion: '0xd92Cc219AcF2199DeadAC2b965B35B9e84FA7F0A',
    },
    testnet: {
      s00: '0x0B60303f941E7EBCe46F09aFbA2f30a5D20ED281',
      s01: '0x0B60303f941E7EBCe46F09aFbA2f30a5D20ED281',
      fusion: '0xd92Cc219AcF2199DeadAC2b965B35B9e84FA7F0A',
    },
    whitelist: [
      '0xA23270E0fb611896e26617bdFb0cA5D52a00556c',
    ],
  },
  blankTrait: blankTrait,
  content: {
    faqs: faqs,
    staff: staff,
  },
  customEventInit: {
    bubbles: true,
    composed: true,
    cancelable: true,
  },
  wallet: {
    blankAddress: '000000000000000000000000000000000000000000',
  },
};
