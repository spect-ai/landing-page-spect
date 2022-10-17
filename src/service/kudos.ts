const MINTKUDOS_API_HOST = "https://api.mintkudos.xyz";
const API_HOST = "http://localhost:8080";

export const recordClaimInfo = (operationId: string) => {
  let time = 1000;
  const intervalPromise = setInterval(() => {
    time += 1000;
    console.log(time);
    fetch(`${MINTKUDOS_API_HOST}${operationId}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          console.log(data);

          if (data.status === "success") {
            clearInterval(intervalPromise);
            return data;
          }
        }
      })
      .catch((err) => console.log(err));
  }, 1000);
  setTimeout(() => {
    clearInterval(intervalPromise);
    return false;
  }, 120000);
};
