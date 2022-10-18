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
import { AddData, UpdateData } from "../service/collection";
import { Connect } from "../components/ConnectWallet";
import { useAccount, useDisconnect } from "wagmi";
import RewardField from "../components/Reward/Reward";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { TwitterShareButton } from "react-share";
import { TwitterCircleFilled, TwitterOutlined } from "@ant-design/icons";
import { recordClaimInfo } from "../service/kudos";

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
  const [claimed, setClaimed] = useState(false);
  const [claimedJustNow, setClaimedJustNow] = useState(false);
  const [submitAnotherResponse, setSubmitAnotherResponse] = useState(false);
  const [updateResponse, setUpdateResponse] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const formData = await (
        await fetch(`${API_HOST}/collection/v1/public/slug/${formId}`, {
          credentials: "include",
        })
      ).json();
      setForm(formData);
      setClaimed(formData.kudosClaimedByUser);
      setSubmitted(formData.previousResponses?.length > 0);

      if (formData.mintkudosTokenId) {
        const kudo = await (
          await fetch(
            `${MINTKUDOS_API_HOST}/v1/tokens/${formData.mintkudosTokenId}`
          )
        ).json();

        setKudos(kudo);
      }
      setLoading(false);
    })();
  }, [connectedUser, updateResponse]);

  useEffect(() => {
    if (form) {
      setLoading(true);
      console.log(updateResponse);
      console.log(form?.previousResponses?.length);
      const tempData: any = {};

      if (updateResponse && form?.previousResponses?.length > 0) {
        console.log({
          wut: form.previousResponses[form.previousResponses.length - 1],
        });
        const lastResponse =
          form.previousResponses[form.previousResponses.length - 1];
        form.propertyOrder.forEach((propertyId) => {
          console.log({ propertyId, resp: lastResponse[propertyId] });
          if (
            ["longText", "shortText", "ethAddress", "user", "date"].includes(
              form.properties[propertyId].type
            )
          ) {
            tempData[propertyId] = lastResponse[propertyId] || "";
          } else if (form.properties[propertyId].type === "singleSelect") {
            tempData[propertyId] =
              lastResponse[propertyId] ||
              // @ts-ignore
              form.properties[propertyId].options[0];
          } else if (
            ["multiSelect", "user[]"].includes(form.properties[propertyId].type)
          ) {
            tempData[propertyId] = lastResponse[propertyId] || [];
          }
        });
      } else {
        console.log("setting data to empty object");
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
      }
      setData(tempData);
      setLoading(false);
    }
  }, [form]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (claimed && !submitAnotherResponse && !updateResponse) {
    return (
      <>
        {claimedJustNow && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            gravity={0.07}
            numberOfPieces={600}
          />
        )}
        <Container>
          <div className="header bg-purple bg-opacity-5">
            <div>
              <VioletBlur className="absolute top-0 left-0" />
              <PinkBlur className="absolute right-0 bottom-48 h-1/6 w-1/6 opacity-50" />
              <PinkBlur className="absolute bottom-36 left-72 h-24 w-24" />
              <h1>{form?.name}</h1>
              <p>{form?.description}</p>
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
                <h1>You have claimed this Kudos 🎉</h1>
                <div className="flex flex-col justify-start align-center">
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
                            fontSize: "1.8rem",
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
            {form?.updatingResponseAllowed && (
              <div className="flex flex-row justify-end align-end">
                <button
                  className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700"
                  onClick={() => {
                    setUpdateResponse(true);
                    setSubmitted(false);
                  }}
                >
                  Update response
                </button>
              </div>
            )}
            {form?.multipleResponsesAllowed && (
              <div className="flex flex-row justify-end align-end">
                <button
                  className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700"
                  onClick={() => {
                    setSubmitAnotherResponse(true);
                  }}
                >
                  Submit another response
                </button>
              </div>
            )}
            <a href="https://circles.spect.network/">
              <div className="flex flex-row justify-end align-end">
                <button
                  className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700"
                  onClick={() => {}}
                >
                  Create your own form
                </button>
              </div>
            </a>
          </div>

          <div className="footer bg-purple bg-opacity-5">
            <Navbar />
          </div>
        </Container>
      </>
    );
  }

  if (submitted && !submitAnotherResponse && !updateResponse) {
    return (
      <Container>
        <div className="header bg-purple bg-opacity-5">
          <div>
            <VioletBlur className="absolute top-0 left-0" />
            <PinkBlur className="absolute right-0 bottom-48 h-1/6 w-1/6 opacity-50" />
            <PinkBlur className="absolute bottom-36 left-72 h-24 w-24" />
            <h1>{form?.name}</h1>
            <p>{form?.description}</p>
            {!connectedUser && !form?.canFillForm && (
              <div className="">
                <Connect />
              </div>
            )}
            {connectedUser && (
              <button
                className="px-8 py-3 rounded-xl text-md text-purple text-bold bg-purple bg-opacity-5 hover:bg-opacity-25 duration-700 "
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
          </div>
        </div>
        <div className="form flex-1">
          <h1>{`${
            form?.messageOnSubmission || "Your response has been submitted!"
          }`}</h1>
          {form?.mintkudosTokenId && (
            <>
              <div className="flex flex-row justify-start align-center">
                <img
                  src={`${kudos.imageUrl}`}
                  alt="kudos"
                  className="max-w-sm h-auto ease-in-out duration-300 mb-8  mr-8"
                />
                <div className="flex flex-col justify-start align-center">
                  <h5 className="mb-4">
                    The creator of this form is distributing kudos to everyone
                    that submitted a response
                  </h5>
                  {connectedUser && (
                    <button
                      className="px-8 py-3 rounded-xl text-md text-purple text-bold bg-purple bg-opacity-5 hover:bg-opacity-25 duration-700 inline-flex items-center w-52 justify-center"
                      onClick={async () => {
                        setClaiming(true);
                        try {
                          const res = await fetch(
                            `${API_HOST}/collection/v1/${form?.id}/airdropKudos`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }
                          );

                          console.log(res);
                          if (res.ok) {
                            setClaimed(true);
                            setClaimedJustNow(true);
                          }
                        } catch (e) {
                          console.log(e);
                          toast.error(
                            "Something went wrong, please try again later"
                          );
                        }

                        setClaiming(false);
                      }}
                    >
                      {claiming && (
                        <svg
                          aria-hidden="true"
                          className="mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-pink-500"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      )}
                      Claim Kudos{" "}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          {form?.updatingResponseAllowed && (
            <div className="flex flex-row justify-end align-end">
              <button
                className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700"
                onClick={() => {
                  setUpdateResponse(true);
                  setSubmitted(false);
                }}
              >
                Update response
              </button>
            </div>
          )}
          {form?.multipleResponsesAllowed && (
            <div className="flex flex-row justify-end align-end">
              <button
                className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700"
                onClick={() => {
                  setSubmitAnotherResponse(true);
                }}
              >
                Submit another response
              </button>
            </div>
          )}
          <a href="https://circles.spect.network/">
            <div className="flex flex-row justify-end align-end">
              <button
                className="px-8 py-3 rounded-xl text-md text-zinc-400 hover:text-white hover:bg-white hover:bg-opacity-5 duration-700"
                onClick={() => {}}
              >
                Create your own form
              </button>
            </div>
          </a>
        </div>
        <div className="footer bg-purple bg-opacity-5">
          <Navbar />
        </div>
      </Container>
    );
  }

  if (form) {
    return (
      <Container>
        <ToastContainer />
        <div className="header bg-purple bg-opacity-5">
          <div>
            <VioletBlur className="absolute top-0 left-0" />
            <PinkBlur className="absolute right-0 bottom-48 h-1/6 w-1/6 opacity-50" />
            <PinkBlur className="absolute bottom-36 left-72 h-24 w-24" />
            <h1>{form?.name}</h1>
            <p>{form?.description}</p>
            <div className="mt-8 mb-4">
              {!connectedUser &&
                !form.canFillForm &&
                form.formRoleGating?.length > 0 && (
                  <div className="mb-2">
                    <h5>
                      This form is role gated. Please connect your wallet to
                      access form.
                    </h5>
                  </div>
                )}

              {!connectedUser &&
                !form.canFillForm &&
                form.mintkudosTokenId &&
                !form.formRoleGating?.length && (
                  <div className="mb-2">
                    <h5>
                      This form distributes kudos to everyone that submits a
                      response. Please connect your wallet to access form.
                    </h5>
                  </div>
                )}
              {!connectedUser && !form.canFillForm && (
                <div className="">
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
            </div>
          </div>
        </div>
        <div className="form flex-1">
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
              <div className="flex justify-end">
                <button
                  className="px-8 py-3 rounded-xl text-md text-purple text-bold bg-purple bg-opacity-5 hover:bg-opacity-25 duration-700"
                  onClick={async () => {
                    console.log({ data });
                    let res;
                    if (updateResponse) {
                      console.log("update");
                      const lastResponse =
                        form.previousResponses[
                          form.previousResponses.length - 1
                        ];
                      res = await UpdateData(
                        form.id || "",
                        lastResponse.slug,
                        data
                      );
                    } else {
                      console.log("add");
                      res = await AddData(form.id || "", data);
                    }
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
                      setSubmitAnotherResponse(false);
                      setUpdateResponse(false);
                    } else {
                      toast.error("Error adding data");
                    }
                  }}
                >
                  Submit
                </button>
              </div>
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
