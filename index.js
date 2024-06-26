require('dotenv').config()
const axios = require('axios');
const schedule = require('node-schedule');

const cronSchedule = '0 8 * * *'; //every day at 8AM

const job = schedule.scheduleJob(cronSchedule, function(){
    getAuthorisation().then((authorisation) => {
        getBinCollection(authorisation).then((binCollections) => {
            console.log(binCollections);
            binCollections.forEach(binCollection => {
                if (isTomorrow(binCollection.date)) {
                    sendNotication(binCollection.type);
                }
                
            });
        });
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

async function sendNotication(binType) {
    const message = "" + binType + " bin will be collected tomorrow";
    await axios.post(
        `${process.env.HOME_ASSISTANT_URL}/api/webhook/${process.env.WEBHOOK_ID}`,
        { message: message },
        { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("Notification sent: " + message);
}

/**
 * 
 * @param binDate - date in format like 'Thursday, May 23, 2024'
 * @returns boolean
 */
function isTomorrow(binDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    //add 8 hours to binDate since it's around 8AM when the bin is collected
    const binDate = new Date(binDate);
    binDate.setHours(binDate.getHours() + 8);
    
    return binDate.getDate() === tomorrow.getDate() && binDate.getMonth() === tomorrow.getMonth() && binDate.getFullYear() === tomorrow.getFullYear();
}