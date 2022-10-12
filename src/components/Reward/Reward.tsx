import { Box, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "../Modal/Modal";

type Chain = {
  chainId: string;
  name: string;
};

type Token = {
  address: string;
  symbol: string;
  name: string;
};

export type Reward = {
  chain: Chain;
  token: Token;
  value: number;
};

type Props = {
  value: Reward;
  onChange: (value: Reward) => void;
};

export default function Reward({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
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
        Add Reward
      </button>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Add Reward" handleClose={() => setIsOpen(false)}>
            <Box>
              <Stack>
                <Box>Chain</Box>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
