import { ethers } from "ethers";

export default {
  fromWei: value => ethers.utils.formatEther(value),
  toWei: value => ethers.utils.parseUnits(value, "ether").toString(),
  isAddress: address => ethers.utils.isAddress(address)
};
