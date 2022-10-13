import { Box, Input, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Chain, Registry, Reward, Token } from "../..";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "../../utils/registry";
import Modal from "../Modal/Modal";

type Props = {
  reward: Reward;
  onChange: (reward: Reward) => void;
  circleId: string;
};

const API_HOST = "http://localhost:8080";

export default function RewardField({ reward, onChange, circleId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [registry, setRegistry] = useState<Registry>();

  const [chain, setChain] = useState<Chain>(reward?.chain);
  const [token, setToken] = useState<Token>(reward?.token);
  const [value, setValue] = useState(reward?.value.toString());

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const res = await (
          await fetch(`${API_HOST}/circle/slug/${circleId}/getRegistry`)
        ).json();
        console.log({ res });
        setRegistry(res);
      })();
    }
  }, [isOpen]);

  return (
    <>
      <button
        className="px-8
        py-3
        rounded-xl
        text-md
        text-zinc-400
        text-bold
        bg-white
        bg-opacity-5
        hover:bg-opacity-25
        duration-700"
        onClick={() => setIsOpen(true)}
      >
        {reward?.value
          ? `${reward.value} ${reward.token.symbol} on ${reward.chain.name}`
          : "Add Reward"}
      </button>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Add Reward"
            handleClose={() => {
              onChange({
                chain,
                token,
                value: parseFloat(value),
              });
              setIsOpen(false);
            }}
          >
            <Box height="96">
              <Box padding="8">
                <Stack>
                  <Text size="extraLarge" weight="semiBold">
                    Chain
                  </Text>
                  <Stack direction="horizontal" wrap>
                    {getFlattenedNetworks(registry as Registry)?.map(
                      (aChain) => (
                        <Box
                          key={aChain.name}
                          onClick={() => {
                            setChain(aChain);
                            setToken({} as Token);
                          }}
                          cursor="pointer"
                        >
                          <Tag
                            hover
                            tone={
                              chain?.chainId === aChain.chainId
                                ? "accent"
                                : "secondary"
                            }
                          >
                            <Text
                              color={
                                chain?.chainId === aChain.chainId
                                  ? "accent"
                                  : "inherit"
                              }
                            >
                              {aChain.name}
                            </Text>
                          </Tag>
                        </Box>
                      )
                    )}
                  </Stack>
                  <Text size="extraLarge" weight="semiBold">
                    Token
                  </Text>
                  <Stack direction="horizontal" wrap>
                    {getFlattenedCurrencies(
                      registry as Registry,
                      chain?.chainId as string
                    ).map((aToken) => (
                      <Box
                        key={aToken.address}
                        onClick={() => {
                          setToken(aToken);
                        }}
                        cursor="pointer"
                      >
                        <Tag
                          hover
                          tone={
                            token?.address === aToken.address
                              ? "accent"
                              : "secondary"
                          }
                        >
                          <Text
                            color={
                              token?.address === aToken.address
                                ? "accent"
                                : "inherit"
                            }
                          >
                            {aToken.symbol}
                          </Text>
                        </Tag>
                      </Box>
                    ))}
                  </Stack>
                  <Text size="extraLarge" weight="semiBold">
                    Value
                  </Text>
                  <Input
                    label=""
                    units={token?.symbol}
                    min={0}
                    placeholder="10"
                    type="number"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  />
                  {/* <Button width="full" size="small">
          Save
        </Button> */}
                </Stack>
              </Box>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
