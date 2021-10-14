import { useState, useEffect } from 'react';
import useNFTContract from '@contract/useNFTContract';

const MintForm = () => {
  const contract = useNFTContract();
  const [minted, setMinted] = useState();
  const [totalSupply, setTotalSupply] = useState();

  useEffect(() => {
    const load = async () => {
      const mintedData = await contract.totalSupply();
      setMinted(mintedData.toString());
      const totalSupply = await contract.TOTAL_SUPPLY();
      setTotalSupply(totalSupply.toString());
    };

    if (contract) {
      load();
    }
  }, [contract]);

  if (totalSupply === undefined || minted === undefined) {
    return null;
  }

  return (
    <div>
      <div>
        Minted {minted} / {totalSupply}
      </div>
    </div>
  );
};

export default MintForm;
