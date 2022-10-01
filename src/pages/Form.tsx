import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FormType } from "..";
import LongText from "../components/LongText/LongText";
import SingleSelect from "../components/SingleSelect/SingleSelect";
import { PinkBlur, VioletBlur } from "../modules/1-Hero-Section";
import Navbar from "../modules/1-Hero-Section/Navbar";

const API_HOST = "http://localhost:8080";

export default function Form() {
  const { formId } = useParams();
  const [form, setForm] = useState<FormType>();

  useEffect(() => {
    (async () => {
      const formData = await (
        await fetch(`${API_HOST}/collection/v1/slug/${formId}`)
      ).json();

      console.log({ formData });
      setForm(formData);
    })();
  }, []);

  if (form) {
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
          {form.propertyOrder.map((propertyId) => (
            <div key={propertyId} className="field">
              <h1>{form.properties[propertyId].name}</h1>
              {form.properties[propertyId].type === "shortText" && <input />}
              {form.properties[propertyId].type === "longText" && <LongText />}
              {form.properties[propertyId].type === "singleSelect" && (
                <SingleSelect
                  options={form.properties[propertyId].options as any}
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
  }

  .footer {
    width: 100%;
    padding: 1rem 0rem;
  }
`;
