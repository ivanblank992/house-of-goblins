import { useState } from 'react';
import config from '@config';
import { useWeb3Actions, useWeb3State } from '@features/web3/context';
import { metaMaskConnector } from '@features/wallets/connectors';
import useNFTContract from '@contract/useNFTContract';
import utils from '@shared/utils';
import styles from './MintForm.module.css';

const MintForm = () => {
  const { connect } = useWeb3Actions();
  const { isCorrectChain, chainId, web3, currentAddress } = useWeb3State();

  const [value, setValue] = useState();
  const contract = useNFTContract();
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const mint = async () => {
    if (!value || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const tx = await contract.mint(amount, {
        from: currentAddress,
        value: utils.toWei(value, 'ether'),
      });

      await tx.wait();
      setIsLoading(false);
      setValue();
      setIsSuccess(true);
    } catch {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    if (contract) {
      mint();
    } else {
      connect(metaMaskConnector);
    }
  };

  if (isSuccess) {
    return <h3>Success!</h3>;
  }

  return (
    <div className={styles['mint-form']}>
      {web3 && config.chainId !== chainId ? (
        <h3>Incorect chain. Change to {config.chainName}</h3>
      ) : null}
      <div className={styles['form-group']}>
        <label>Price in ETH. (price of 1 is 0.1 ether)</label>
        <input
          disabled={!contract}
          type="number"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className={styles['form-group']}>
        <label>How many?</label>
        <select
          disabled={!contract}
          onChange={(e) => setAmount(e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((o) => (
            <option value={o} key={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className={styles['form-button-wrapper']}>
        <button
          className={styles['form-button']}
          onClick={onSubmit}
          disabled={(web3 && !isCorrectChain) || isLoading}>
          {web3 ? 'Mint' : 'Connect MetaMask'}
        </button>
        {isLoading ? <div>Waiting for transaction confirmation...</div> : null}
      </div>
    </div>
  );
};

export default MintForm;
