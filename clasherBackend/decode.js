const fs = require("fs");
const axios = require("axios");
const lzma = require("lzma-native");

const url =
"https://game-assets.clashofclans.com/33dedc491430cd13e911ab9ba8377f64c6ea497d/logic/buildings.csv";

async function decode() {

  const res = await axios.get(url, { responseType: "arraybuffer" });

  const buffer = Buffer.from(res.data);

  console.log("Downloaded:", buffer.length);

  // Remove SC header
  const compressed = buffer.slice(10);

  lzma.decompress(compressed, (result, err) => {

    if (err) {
      console.log("Decompression error:", err);
      return;
    }

    fs.writeFileSync("decoded_buildings.csv", result);

    console.log("Decoded successfully");
  });
}

decode();