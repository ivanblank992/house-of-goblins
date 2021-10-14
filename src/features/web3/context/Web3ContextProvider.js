import { useCallback, useMemo, useReducer } from "react";
import { ethers } from "ethers";
import PropTypes from "prop-types";
import web3ContextReducer, {
  ACTIONS,
  initialState
} from "./web3ContextReducer";
import { Web3StateContext, Web3ActionsContext } from "./web3Context";

const Web3ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(web3ContextReducer, initialState);

  const subscribeToProviderEvents = useCallback((provider, web3) => {
    if (!provider.on) {
      return;
    }
    provider.on("accountsChanged", async accounts => {
      const selectedAddress = accounts[0];

      if (selectedAddress) {
        dispatch({
          type: ACTIONS.ACCOUNT_CHANGED,
          payload: {
            currentAddress: accounts[0],
            signer: await web3.getSigner()
          }
        });
      } else {
        dispatch({ type: ACTIONS.DISCONNECTED });
      }
    });

    provider.on("chainChanged", chainId => {
      dispatch({ type: ACTIONS.CHAIN_CHANGED, payload: { chainId } });
    });

    provider.on("disconnect", () => {
      dispatch({ type: ACTIONS.DISCONNECTED });
    });
  }, []);

  const disconnect = useCallback(async () => {
    if (state.web3?.currentProvider?.close) {
      await state.web3.currentProvider.close();
    }
    dispatch({
      type: ACTIONS.DISCONNECTED
    });
  }, [state.web3]);

  const connect = useCallback(
    async connector => {
      try {
        const provider = await connector.connect();

        const web3 = new ethers.providers.Web3Provider(provider);
        const signer = await web3.getSigner();
        const currentAddress = await signer.getAddress();
        const chainId = await signer.getChainId();

        subscribeToProviderEvents(provider, web3);

        dispatch({
          type: ACTIONS.CONNECTED,
          payload: {
            web3,
            chainId,
            currentAddress,
            signer
          }
        });
      } catch (err) {
        dispatch({
          type: ACTIONS.DISCONNECTED
        });
      }
    },
    [subscribeToProviderEvents]
  );

  const actions = useMemo(
    () => ({
      connect,
      disconnect
    }),
    [connect, disconnect]
  );

  return (
    <Web3StateContext.Provider value={state}>
      <Web3ActionsContext.Provider value={actions}>
        {children}
      </Web3ActionsContext.Provider>
    </Web3StateContext.Provider>
  );
};

export default Web3ContextProvider;

Web3ContextProvider.propTypes = {
  children: PropTypes.any
};
