import axios from "axios";

async function downloadImage(url: string) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data, "binary");
}

export { downloadImage };
