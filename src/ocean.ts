import { Ocean, ConfigHelper } from '@oceanprotocol/lib';

const config = new ConfigHelper().getConfig('rinkeby');
let ocean: Ocean;

export async function getOceanInstance() {
  if (!ocean) {
    ocean = await Ocean.getInstance(config);
  }
  return ocean;
}
