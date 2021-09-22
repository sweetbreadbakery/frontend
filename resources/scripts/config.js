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
      s00: '0x10fE2787a8a8d191fB4389A71083Fc0CC2dC1E35',
      s01: '0x6CD79b5fe03cf8Cb462fC8fA0914EBCfe5DD4C5f',
      fusion: '0xd92Cc219AcF2199DeadAC2b965B35B9e84FA7F0A',
    },
    whitelist: [
      '0x34aE7ACe92ED790cEf0147e0A366AAdD8D8CB6db', // sweetbread
      '0x59F8CDFBE5a5E793FF8CB34e6a91DCe8119fC294', // madotsuki
      '0x893587F9bDaC8b299abBa713a9eAa56758d98fE7', // accell
      '0xA23270E0fb611896e26617bdFb0cA5D52a00556c', // rawdawg
      '0x81a5F4c1718BC4C177E9F4b362Ddf2CEa53D7C63', // derpherpenstein
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
