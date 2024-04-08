require('dotenv').config()
const axios = require('axios');

console.log(process.env.UPRN);

getAuthorisation().then((authorisation) => {
    getBinCollection(authorisation).then((binCollection) => {

        console.log(binCollection);
    });
});

async function getAuthorisation() {
    const response = await axios.get('https://www.fife.gov.uk/api/citizen?preview=false&locale=en');
    return response.headers['authorization'];
}

async function getBinCollection(authorisation) {
    const response = await axios.post('https://www.fife.gov.uk/api/custom?action=powersuite_bin_calendar_collections&actionedby=bin_calendar&loadform=true&access=citizen&locale=en', {
        name: "bin_calendar",
        data: {
            uprn: `${process.env.UPRN}`
        },
        email: "",
        caseid: "",
        xref: "",
        xref1: "",
        xref2: ""
    }, {
        headers: {
            'Authorization': authorisation,
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://www.fife.gov.uk',
            'Referer': 'https://www.fife.gov.uk/services/bin-calendar',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
    return response.data.data.tab_collections;
}