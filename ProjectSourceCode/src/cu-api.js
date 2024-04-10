const { default: axios } = require("axios");

let srcdb = [2247, 2241, 2237];

const search = async (keyword, src = 0) => {
  if (src > srcdb.length - 1) return [];
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

  let req = await axios.request(config);

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

const getCourseInfo = async (code, crn = '', src = 0) => {
  if (src > srcdb.length - 1) return null;
  let body = JSON.stringify({
    group: `code:${code}`,
    srcdb: srcdb[src],
  });
  if(crn != '') {
    body = JSON.stringify({
      key: `crn:${crn}`,
      srcdb: srcdb[src],
    })
  }

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://classes.colorado.edu/api/?page=fose&route=details`,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  let req = await axios.request(config);

  const json = req.data;

  // try a different term to get data
  if (json == "") {
    console.log('going deeper')
    return await getCourseInfo(code, crn, src + 1);
  }

  // avoid getting info that "Varies by section"
  if (JSON.stringify(json).includes("Varies")) {
    console.log('trying a different one')
    return await getCourseInfo(code, json.allInGroup[0].crn, src);
  }

  return {
    title: json.title,
    credit_hours: JSON.parse(json.cart_opts)?.credit_hrs?.options[0]?.label ?? -1,
    description: json.description
  };
};

module.exports = { search, getCourseInfo };
