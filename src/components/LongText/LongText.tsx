import "./styles.scss";
import styled from "styled-components";
import Editor from "rich-markdown-editor";
import { useState } from "react";
import { storeImage } from "../../service/ipfs";
import { toast } from "react-toastify";

type Props = {
  value: string;
  onSave?: (val: string) => void;
};

export default function LongText({ value, onSave }: Props) {
  const [content, setcontent] = useState(value);

  return (
    <Container>
      <Editor
        defaultValue={value}
        onChange={(val) => {
          setcontent(val());
        }}
        uploadImage={async (file) => {
          const { imageGatewayURL } = await toast.promise(storeImage(file), {
            pending: "Upload is pending",
            success: {
              render: "Image Uploaded",
            },
            error: "Some error occured🤯",
          });
          return imageGatewayURL;
        }}
        onBlur={() => {
          onSave && onSave(content);
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  padding: 0.5rem;
  max-height: 25vh;
  overflow-y: auto;
`;
