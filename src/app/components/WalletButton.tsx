import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button onClick={() => disconnect()}>
        Disconnect {address?.slice(0, 6)}...
      </button>
    );
  }

  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </button>
  );
}
