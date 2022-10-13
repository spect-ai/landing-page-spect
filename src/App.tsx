import {
  connectorsForWallets,
  createAuthenticationAdapter,
  darkTheme,
  getDefaultWallets,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";
import { Route, Routes } from "react-router-dom";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import Form from "./pages/Form";
import Home from "./pages/Home";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { SiweMessage } from "siwe";
import GlobalContextProvider, { useGlobal } from "./context/globalContext";
import queryClient from "./utils/queryClient";

const API_HOST = "http://localhost:8080";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    alchemyProvider({ apiKey: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Spect Circles",
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

export const authStatusAtom = atom<
  "loading" | "authenticated" | "unauthenticated"
>("loading");

function App() {
  const [authenticationStatus, setAuthenticationStatus] =
    useAtom(authStatusAtom);
  const [connectedUser, setConnectedUser] = useState("");

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await fetch(`${API_HOST}/auth/nonce`, {
        credentials: "include",
      });
      const res = await response.text();
      return res;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      const verifyRes = await fetch(`${API_HOST}/auth/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
        credentials: "include",
      });
      const res = await verifyRes.json();
      setAuthenticationStatus(
        verifyRes.ok ? "authenticated" : "unauthenticated"
      );
      queryClient.setQueryData("getMyUser", res);
      setConnectedUser(res.id);
      console.log("connect user", res.id);
      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      await fetch(`${API_HOST}/auth/disconnect`, {
        method: "POST",
        credentials: "include",
      });
      setAuthenticationStatus("unauthenticated");
      setConnectedUser("");
    },
  });

  useEffect(() => {
    void (async () => {
      try {
        const user = await (await fetch(`${API_HOST}/user/me`)).json();
        console.log(user);
        setAuthenticationStatus(
          user.ethAddress ? "authenticated" : "unauthenticated"
        );
        if (user.ethAddress) {
          console.log("connectUser");
        }
      } catch (e) {
        console.log(e);
        setAuthenticationStatus("unauthenticated");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={authenticationStatus}
        >
          <RainbowKitProvider
            chains={chains}
            modalSize={"compact"}
            theme={darkTheme()}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/form/:formId"
                element={
                  <Form
                    connectedUser={connectedUser}
                    setConnectedUser={setConnectedUser}
                    setAuthenticationStatus={setAuthenticationStatus}
                  />
                }
              />
            </Routes>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
