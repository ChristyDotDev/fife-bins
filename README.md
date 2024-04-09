# Bin Day Notifier

Using Home Assistant and the Fife Bin Calendar available online

## Env

```
UPRN = UPRN_FOR_ADDRESS_FROM_FIFE_COUNCIL
HOME_ASSISTANT_URL = http://homeassistant.whateverurl:8123
WEBHOOK_ID = SOMEWEBHOOK_ID
```
UPRN is your unique property reference number, you can find this on the API request made after you select your address on https://www.fife.gov.uk/services/bin-calendar
HOME_ASSISTANT_URL is the URL and port of your Home Assistant instances, WEBHOOK_ID is the ID of the webhook automation you've created in HA (below)

## Home Assistant Webhook

You can set up an Automation to handle webhooks in Home Assistant, the GUI editor will let you do most of this (particularly handy for picking the right notification service) but you'll need to use the YAML editor for part of it since it uses the [JSON from the trigger](https://www.home-assistant.io/docs/automation/trigger/#webhook-data)

More in the [Automation Docs](https://www.home-assistant.io/docs/automation/)

```
alias: Bin Day Reminder Webhook
description: ""
trigger:
  - platform: webhook
    allowed_methods:
      - POST
    local_only: true
    webhook_id: "-YOUR_WEBHOOK_ID_GOES_HERE"
condition: []
action:
  - service: notify.YOUR_DEVICE_FOR_PUSH_NOTIFICATIONS
    data:
      message: "Bin Day Reminder: {{trigger.json.message}}"
mode: parallel
max: 4
```