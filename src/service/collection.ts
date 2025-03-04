const API_HOST = "http://localhost:8080";

export const AddData = async (collectionId: string, data: any) => {
  return await (
    await fetch(`${API_HOST}/collection/v1/${collectionId}/addData`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
      }),
      credentials: "include",
    })
  ).json();
};

export const UpdateData = async (
  collectionId: string,
  dataId: string,
  data: any
) => {
  return await (
    await fetch(
      `${API_HOST}/collection/v1/${collectionId}/updateData?dataId=${dataId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
        credentials: "include",
      }
    )
  ).json();
};
