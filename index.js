const fetch = require('node-fetch');
const url = require('url');
const { parse } = require('node-html-parser');

const getPart = async (partNumber) => {
  const body = {
    "Query": partNumber,
    "RegionId": 1,
    "SuggestionType": "Regular"
  };

  const response = await fetch('https://avto.pro/api/v1/search/query', {
    method: 'put',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  });

  const parts = await response.json();

  const uris = parts.Suggestions.map(suggestion => {
    const q = url.parse(suggestion?.Uri, true);

    return `https://avto.pro/${q.query.uri}`;
  });

  console.log(uris)

  return uris;
};

const getSuppliers = async (url) => {
  const response = await fetch(url);
  const body = await response.text();

  const root = parse(body);

  const suppliers = root.querySelector('#js-partslist-primary').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  const uris = suppliers.map(supplier => `${url}#/products/${supplier.attrs['data-wh-id']}`);

  console.log(uris);

  return uris;
};

const getContacts = async (url) => {
  /*const details = {
    "Descriptor": "MD191470;185;0000;98072",
    "Type": 1,
    "Location": 0,
    "LocationSelection": null,
    "FeedSort": 0,
    "TableType": 0,
    "ClickAction": 1,
    "PartPositionInFeed": 0,
    "RealPositionBeforeBoost": 17
  };*/

  const details = {
    "Descriptor":"MD191470;185;0000;136271",
    "Type":1,
    "Location":0,
    "LocationSelection":null,
    "FeedSort":0,
    "TableType":0,
    "ClickAction":1,
    "PartPositionInFeed":0,
    "RealPositionBeforeBoost":"17"
  };

  const body = `descriptor=${new URLSearchParams(JSON.stringify(details)).toString()}`;

  const response = await fetch("https://avto.pro/product-card/", {
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "Referer": "https://avto.pro/part-MD191470-CHERY-543/",
    },
    body: body.slice(0, body.length - 1),
    "method": "PUT"
  });

  const result = await response.json();

  console.log(JSON.stringify(result.Shops[0].ContactDetails))
}


// getPart('md191470');

// getSuppliers('https://avto.pro/part-MD191470-CHERY-543/')

getContacts('https://avto.pro/part-MD191470-CHERY-543/#/products/MD191470;185;0000;266085');
