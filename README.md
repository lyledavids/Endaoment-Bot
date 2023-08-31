# Endaoment Bot
EndaomentBot is a discord for Endaoment where users can query about entities ,portfolio, entity managers and more using Discord
 
### Built with
- Graphql, The Graph 
- Nodejs
- Discord.js

## Commands


## Command: get-largest-grantors

Description: Returns up to 5 of the largest grantors on Endaoment.

---

## Command: get-entity-based-on-ein

Description: Get details of an entity based on the provided EIN.

Options:

- **Name**: ein
- **Description**: EIN of the entity
- **Required**: true
- **Type**: String

---

## Command: get-registries-summary

Description: Get a summary of registries.

---

## Command: get-entity-from-entity-manager

Description: Get details of an entity based on the provided entity-manager address.

Options:

- **Name**: entity-manager
- **Description**: Entity-manager address
- **Required**: true
- **Type**: String

---

## Command: get-portfolio-from-id

Description: Get a portfolio from the provided ID.

Options:

- **Name**: id
- **Description**: Portfolio ID
- **Required**: true
- **Type**: String