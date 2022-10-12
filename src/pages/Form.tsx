import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FormType } from "..";
import LongText from "../components/LongText/LongText";
import Reward from "../components/Reward/Reward";
import { PinkBlur, VioletBlur } from "../modules/1-Hero-Section";
import Navbar from "../modules/1-Hero-Section/Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../components/Select/Select";
import { AddData } from "../service/collection";

const API_HOST = "http://localhost:8080";

export default function Form() {
  const { formId } = useParams();
  const [form, setForm] = useState<FormType>();
  const [data, setData] = useState<any>({});
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    if (form?.parents) {
      console.log({ form: form.parents });
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

        console.log({ memberOptions });
      })();
    }
  }, [form]);

  useEffect(() => {
    (async () => {
      const formData = await (
        await fetch(`${API_HOST}/collection/v1/slug/${formId}`)
      ).json();

      console.log({ formData });
      setForm(formData);
    })();
  }, []);

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
          </div>
        </div>
        <div className="form flex-1">
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
                    onSave={(val) => setData({ ...data, [propertyId]: val })}
                  />
                )}
              {form.properties[propertyId].isPartOfFormView &&
                form.properties[propertyId].type === "date" && (
                  <DateInput
                    type="date"
                    value={data?.[propertyId]}
                    onChange={(e) =>
                      setData({ ...data, [propertyId]: e.target.value })
                    }
                  />
                )}
              {form.properties[propertyId].isPartOfFormView &&
                form.properties[propertyId].type === "number" && (
                  <DateInput
                    type="number"
                    value={data?.[propertyId]}
                    onChange={(e) =>
                      setData({ ...data, [propertyId]: e.target.value })
                    }
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
                  <Reward
                    value={data?.[propertyId]}
                    onChange={(value) => {
                      setData({ ...data, [propertyId]: value });
                    }}
                  />
                )}
            </div>
          ))}
          <button
            className="
              px-8
              py-3
              rounded-xl
              text-md
              text-purple
              text-bold
              bg-purple
              bg-opacity-5
              hover:bg-opacity-25
              duration-700"
            onClick={async () => {
              console.log({ data });
              const res = await AddData(form.id || "", data);
              console.log({ res });
              if (res) {
                toast.success("Data added successfully");
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
              }
            }}
          >
            Submit
          </button>
        </div>
        <div className="footer bg-purple bg-opacity-5">
          <Navbar />
        </div>
      </Container>
    );
  }
}

const DateInput = styled.input`
  border-radius: 0.55rem;
  border 1px solid rgb(255, 255, 255, 0.1);
  background-color: white;
  width: 100%;
  color: rgb(255, 255, 255, 0.7);
  margin-top: 10px;
`;

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
    padding: 2rem 24rem;
    display: flex;
    flex-direction: column;
  }

  .form {
    width: 100%;
    padding: 2rem 24rem;

    .field {
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 1.3rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    input {
      width: 100%;
      color: #1a1a1a;
      padding: 0.5rem 0.5rem;
      border-radius: 0.5rem;
    }

    input[type="date"] {
      padding: 0.3rem 0.5rem;
    }
  }

  .footer {
    width: 100%;
    padding: 1rem 0rem;
  }
`;
