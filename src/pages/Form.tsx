import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FormType, KudosType } from "..";
import LongText from "../components/LongText/LongText";
import { PinkBlur, VioletBlur } from "../modules/1-Hero-Section";
import Navbar from "../modules/1-Hero-Section/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../components/Select/Select";
import { AddData } from "../service/collection";
import { Connect } from "../components/ConnectWallet";
import { useAccount, useDisconnect } from "wagmi";
import RewardField from "../components/Reward/Reward";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { TwitterShareButton } from "react-share";
import { TwitterCircleFilled, TwitterOutlined } from "@ant-design/icons";

const API_HOST = "http://localhost:8080";
const MINTKUDOS_API_HOST = "https://api.mintkudos.xyz";

type Props = {
  connectedUser: string;
  setConnectedUser: (connectedUser: string) => void;
  setAuthenticationStatus: (
    authenticationStatus: "loading" | "authenticated" | "unauthenticated"
  ) => void;
};

export default function Form({
  connectedUser,
  setConnectedUser,
  setAuthenticationStatus,
}: Props) {
  const { formId } = useParams();
  const [form, setForm] = useState<FormType>();
  const [data, setData] = useState<any>({});
  const [memberOptions, setMemberOptions] = useState([]);
  const { disconnect } = useDisconnect();
  const [submitted, setSubmitted] = useState(false);
  const [kudos, setKudos] = useState({} as KudosType);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (form?.parents) {
      (async () => {
        const res = await (
          await fetch(
            `${API_HOST}/circle/${form.parents[0].id}/memberDetails?circleIds=${form.parents[0].id}`
          )
        ).json();
        const memberOptions = res.members?.map((member: string) => ({
          label: res.memberDetails && res.memberDetails[member]?.username,
          value: member,
        }));
        setMemberOptions(memberOptions);
      })();
    }
  }, [form]);

  useEffect(() => {
    (async () => {
      const formData = await (
        await fetch(`${API_HOST}/collection/v1/slug/${formId}`, {
          credentials: "include",
        })
      ).json();
      setForm(formData);

      if (formData.mintkudosTokenId) {
        const kudo = await (
          await fetch(
            `${MINTKUDOS_API_HOST}/v1/tokens/${formData.mintkudosTokenId}`
          )
        ).json();
        console.log("owowo");
        console.log({ kudo });
        setKudos(kudo);
      }
    })();
  }, [connectedUser]);

  useEffect(() => {
    if (form) {
      const tempData: any = {};
      form.propertyOrder.forEach((propertyId) => {
        if (
          ["longText", "shortText", "ethAddress", "user", "date"].includes(
            form.properties[propertyId].type
          )
        ) {
          tempData[propertyId] = "";
        } else if (form.properties[propertyId].type === "singleSelect") {
          // @ts-ignore
          tempData[propertyId] = form.properties[propertyId].options[0];
        } else if (
          ["multiSelect", "user[]"].includes(form.properties[propertyId].type)
        ) {
          tempData[propertyId] = [];
        }
      });
      setData(tempData);
    }
  }, [form]);

  if (claimed) {
    return (
      <Container>
        <div className="header bg-purple bg-opacity-5">
          <div>
            <VioletBlur className="absolute top-0 left-0" />
            <PinkBlur className="absolute right-0 bottom-48 h-1/6 w-1/6 opacity-50" />
            <PinkBlur className="absolute bottom-36 left-72 h-24 w-24" />
            <h1>{form?.name}</h1>
            <p>{form?.description}</p>
          </div>
        </div>
        <div className="form flex-1">
          <h1>{`${
            form?.messageOnSubmission || "Your response has been submitted!"
          }`}</h1>
          <div className="flex flex-row justify-start align-center">
            {kudos?.imageUrl && (
              <>
                <img
                  src={`${kudos.imageUrl}`}
                  alt="kudos"
                  className="max-w-sm h-auto ease-in-out duration-300 mb-8"
                />
              </>
            )}
            <div className="flex flex-col ml-8 justify-start">
              <h3>You have successfully claimed this Kudos!</h3>
              <div className="flex flex-col justify-start align-center mt-8">
                <div className="flex flex-row justify-start align-middle">
                  <TwitterShareButton
                    url={`https://spect.network/`}
                    title={
                      "I just filled out a web3 native form and claimed my Kudos on @JoinSpect via @mintkudosXYZ 🎉"
                    }
                  >
                    <button className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700">
                      <TwitterOutlined
                        style={{
                          fontSize: "2rem",
                          marginLeft: "0.2rem",
                          marginRight: "0.2rem",
                          color: "rgb(29, 155, 240, 1)",
                        }}
                      />
                      <span className="ml-4">Share on Twitter</span>
                    </button>
                  </TwitterShareButton>
                </div>
                <div className="flex flex-row justify-start align-middle">
                  <button
                    className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700  inline-flex items-center"
                    onClick={() => {
                      window.open(
                        `https://opensea.io/assets/matic/0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6/${kudos.tokenId}`,
                        "_blank"
                      );
                    }}
                  >
                    <img src="/openseaLogo.svg" className="h-8" />
                    <span className="ml-4">View on Opensea</span>
                  </button>
                </div>
                <div className="flex flex-row justify-start align-center">
                  <button
                    className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700 inline-flex items-center"
                    onClick={() => {
                      window.open(
                        `https://rarible.com/token/polygon/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6:${kudos.tokenId}?tab=overview`,
                        "_blank"
                      );
                    }}
                  >
                    {" "}
                    <img src="/raribleLogo.svg" className="h-8" />
                    <span className="ml-4">View on Rarible</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer bg-purple bg-opacity-5">
          <Navbar />
        </div>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container>
        <div className="header bg-purple bg-opacity-5">
          <div>
            <VioletBlur className="absolute top-0 left-0" />
            <PinkBlur className="absolute right-0 bottom-48 h-1/6 w-1/6 opacity-50" />
            <PinkBlur className="absolute bottom-36 left-72 h-24 w-24" />
            <h1>{form?.name}</h1>
            <p>{form?.description}</p>
          </div>
        </div>
        <div className="form flex-1">
          <h1>{`${
            form?.messageOnSubmission || "Your response has been submitted!"
          }`}</h1>
          {form?.mintkudosTokenId && (
            <>
              <h5 className="mb-4">
                The creator of this form is distributing kudos to everyone that
                submitted a response
              </h5>
              <img
                src={`${kudos.imageUrl}`}
                alt="kudos"
                className="max-w-sm h-auto ease-in-out duration-300 mb-8 mt-8"
              />
              {connectedUser && (
                <button
                  className="px-8 py-3 rounded-xl text-md text-purple text-bold bg-purple bg-opacity-5 hover:bg-opacity-25 duration-700"
                  onClick={async () => {
                    const res = await (
                      await fetch(
                        `${API_HOST}/collection/v1/${form?.id}/airdropKudos`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        }
                      )
                    ).json();
                    setClaiming(true);
                    console.log(res);
                  }}
                  disabled={claiming || claimed}
                >
                  Claim Kudos{" "}
                </button>
              )}
              {!connectedUser && <Connect />}{" "}
            </>
          )}
        </div>
        <div className="footer bg-purple bg-opacity-5">
          <Navbar />
        </div>
      </Container>
    );
  }

  if (form && !submitted) {
    return (
      <Container>
        <Confetti
          width={width}
          height={height}
          recycle={false}
          gravity={0.07}
          numberOfPieces={600}
        />

        <ToastContainer />
        <div className="header bg-purple bg-opacity-5">
          <div>
            <VioletBlur className="absolute top-0 left-0" />
            <PinkBlur className="absolute right-0 bottom-48 h-1/6 w-1/6 opacity-50" />
            <PinkBlur className="absolute bottom-36 left-72 h-24 w-24" />
            <h1>{form?.name}</h1>
            <p>{form?.description}</p>
          </div>
        </div>
        <div className="form flex-1">
          {!connectedUser &&
            !form.canFillForm &&
            form.formRoleGating?.length > 0 && (
              <div className="mb-4">
                <h5>
                  This form is role gated. Please connect your wallet to access
                  form.
                </h5>
              </div>
            )}
          {!connectedUser &&
            !form.canFillForm &&
            form.formRoleGating?.length > 0 && (
              <div className="mb-4">
                <Connect />
              </div>
            )}
          {connectedUser && (
            <button
              className="px-8 py-3 rounded-xl text-md text-purple text-bold bg-purple bg-opacity-5 hover:bg-opacity-25 duration-700"
              onClick={async () => {
                await fetch(`${API_HOST}/auth/disconnect`, {
                  method: "POST",
                  credentials: "include",
                });
                disconnect();

                localStorage.removeItem("connectorIndex");
                setAuthenticationStatus("unauthenticated");
                setConnectedUser("");
              }}
            >
              Logout
            </button>
          )}
          {connectedUser && !form.canFillForm && (
            <div className="mt-4">
              <h5>Looks like you dont have access to this form.</h5>
            </div>
          )}
          {form.canFillForm && (
            <div>
              {form.propertyOrder.map((propertyId) => (
                <div key={propertyId} className="field">
                  {form.properties[propertyId].isPartOfFormView && (
                    <h1>{form.properties[propertyId].name}</h1>
                  )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "shortText" && (
                      <input
                        value={data?.[propertyId]}
                        onChange={(e) =>
                          setData({ ...data, [propertyId]: e.target.value })
                        }
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "longText" && (
                      <LongText
                        value={data?.[propertyId]}
                        onSave={(val) =>
                          setData({ ...data, [propertyId]: val })
                        }
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "date" && (
                      <input
                        type="date"
                        value={data?.[propertyId]}
                        onChange={(e) =>
                          setData({ ...data, [propertyId]: e.target.value })
                        }
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "number" && (
                      <input
                        type="number"
                        value={data?.[propertyId]}
                        onChange={(e) => {
                          setData({
                            ...data,
                            [propertyId]: parseFloat(e.target.value),
                          });
                        }}
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "singleSelect" && (
                      <Dropdown
                        selected={data?.[propertyId]}
                        onChange={(value) => {
                          setData({ ...data, [propertyId]: value });
                        }}
                        options={form.properties[propertyId].options as any}
                        multiple={false}
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "multiSelect" && (
                      <Dropdown
                        selected={data?.[propertyId]}
                        onChange={(value) =>
                          setData({ ...data, [propertyId]: value })
                        }
                        options={form.properties[propertyId].options as any}
                        multiple={true}
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "user" && (
                      <Dropdown
                        selected={data?.[propertyId]}
                        onChange={(value) =>
                          setData({ ...data, [propertyId]: value })
                        }
                        options={memberOptions}
                        multiple={false}
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "user[]" && (
                      <Dropdown
                        selected={data?.[propertyId]}
                        onChange={(value) =>
                          setData({ ...data, [propertyId]: value })
                        }
                        options={memberOptions}
                        multiple={true}
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "ethAddress" && (
                      <input
                        value={data?.[propertyId]}
                        onChange={(e) =>
                          setData({ ...data, [propertyId]: e.target.value })
                        }
                      />
                    )}
                  {form.properties[propertyId].isPartOfFormView &&
                    form.properties[propertyId].type === "reward" && (
                      <RewardField
                        circleId={form.parents[0].slug}
                        reward={data?.[propertyId]}
                        onChange={(value) =>
                          setData({ ...data, [propertyId]: value })
                        }
                      />
                    )}
                </div>
              ))}
              <button
                className="px-8 py-3 rounded-xl text-md text-purple text-bold bg-purple bg-opacity-5 hover:bg-opacity-25 duration-700"
                onClick={async () => {
                  console.log({ data });
                  const res = await AddData(form.id || "", data);
                  if (res.id) {
                    toast.success("Form submitted successfully");
                    // reset data
                    const tempData: any = {};
                    form.propertyOrder.forEach((propertyId) => {
                      if (
                        [
                          "longText",
                          "shortText",
                          "ethAddress",
                          "user",
                          "date",
                        ].includes(form.properties[propertyId].type)
                      ) {
                        tempData[propertyId] = "";
                      } else if (
                        form.properties[propertyId].type === "singleSelect"
                      ) {
                        tempData[propertyId] = (
                          form.properties[propertyId] as any
                        ).options[0];
                      } else if (
                        ["multiSelect", "user[]"].includes(
                          form.properties[propertyId].type
                        )
                      ) {
                        tempData[propertyId] = [];
                      }
                    });
                    setData(tempData);
                    setSubmitted(true);
                  } else {
                    toast.error("Error adding data");
                  }
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
        <div className="footer bg-purple bg-opacity-5">
          <Navbar />
        </div>
      </Container>
    );
  }
}

// const DateInput = styled.input`
//   border-radius: 0.55rem;
//   border 1px solid rgb(255, 255, 255, 0.1);
//   width: 100%;
//   color: rgb(255, 255, 255, 0.7);
//   margin-top: 10px;
// `;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: white;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  button {
    font-weight: 600;
  }

  .header {
    width: 100%;
    @media (max-width: 768px) {
      padding: 2rem 1rem;
    }
    @media (min-width: 768px) and (max-width: 1024px) {
      padding: 2rem 4rem;
    }
    @media (min-width: 1024px) and (max-width: 1280px) {
      padding: 2rem 12rem;
    }
    padding: 2rem 24rem;
    display: flex;
    flex-direction: column;
  }

  .form {
    width: 100%;
    @media (max-width: 768px) {
      padding: 2rem 1rem;
    }
    @media (min-width: 768px) and (max-width: 1024px) {
      padding: 2rem 4rem;
    }
    @media (min-width: 1024px) and (max-width: 1280px) {
      padding: 2rem 12rem;
    }
    padding: 2rem 24rem;

    .field {
      margin-bottom: 2rem;

      input {
        width: 100%;
        border-radius: 0.55rem;
        border: 1px solid rgb(255, 255, 255, 0.1);
        width: 100%;
        color: rgb(255, 255, 255, 0.9);
        margin-top: 10px;
        padding: 0.5rem 0.5rem;
        border-radius: 0.5rem;
        background-color: rgb(20, 20, 20);

        &:focus {
          outline: none;
          border: 1px solid #bf5af2;
        }
      }

      h1 {
        font-size: 1.3rem;
        font-weight: 600;
        text-transform: capitalize;
      }
    }

    input[type="date"] {
      padding: 0.4rem 0.5rem;
    }
  }

  .footer {
    width: 100%;
    padding: 1rem 0rem;
  }
`;
