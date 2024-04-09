const { default: axios } = require("axios");

let srcdb = [2247, 2241, 2237];

const search = async (keyword, src = 0) => {
  if (src > srcdb.length-1) return [];
  let body = JSON.stringify({
    other: {
      srcdb: srcdb[src],
    },
    criteria: [
      {
        field: "keyword",
        value: keyword,
      },
    ],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://classes.colorado.edu/api/?page=fose&route=search&keyword=${keyword}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  req = await axios.request(config);

  const apidata = req.data.results;

  let data = [];
  for (const datum of apidata) {
    if (!data.some((d) => d.title == datum.title))
      data.push({
        title: datum.title,
        code: datum.code,
      });
  }

  if (data.length < 5) {
    return data.concat(await search(keyword, src + 1));
  }

  return data;
};

module.exports = { search };
