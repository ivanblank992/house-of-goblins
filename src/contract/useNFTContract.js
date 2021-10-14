import { ethers } from "ethers";
import { useWeb3State } from "@features/web3/context";
import { useMemo } from "react";
import config from "@config";
import NFTInterface from "./abi/NFTInterface.json";

const useNFTContract = () => {
  const { signer, isCorrectChain } = useWeb3State();

  const nftContract = useMemo(() => {
    if (!signer || !isCorrectChain) return null;
    return new ethers.Contract(config.nftContractAddress, NFTInterface, signer);
  }, [signer, isCorrectChain]);

  return nftContract;
};

export default useNFTContract;
