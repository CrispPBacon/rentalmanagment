import axios, { AxiosError } from "axios";

// const apiKey = "5c1fa84a-fe34-404b-8d40-b1d49bec58a9";

const send_data = async (url: string, data: {}) => {
  const response = await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err: AxiosError) => {
      console.error(err.message);
    });
  return response;
};

export { send_data };
