import { Chain, Registry } from "..";

export function getFlattenedNetworks(registry: Registry) {
  if (!registry) return null;
  const networks: Array<Chain> = [];
  for (const networkId of Object.keys(registry)) {
    networks.push({
      name: registry[networkId].name,
      chainId: networkId,
    } as Chain);
  }
  return networks;
}

export function getFlattenedCurrencies(registry: Registry, chainId: string) {
  if (!chainId || !registry) {
    return [];
  }
  const currencies = Object.values(registry[chainId].tokenDetails);
  return currencies;
}
