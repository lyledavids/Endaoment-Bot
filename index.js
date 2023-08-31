// Setup our environment variables via dotenv
require('dotenv').config()

const mainnetEndpoint = `https://gateway.thegraph.com/api/${process.env.THEGRAPHKEY}/subgraphs/id/3iUnNee1poQFDRiZL3eLKZEajkfufKZ3kagMVczAsmPD`
const axios = require('axios');
const { ethers, id } = require('ethers');
const fetch = require('node-fetch');

// Import relevant classes from discord.js
const { Client, Intents, Interaction, Constants, MessageEmbed} = require('discord.js');
const { url } = require('inspector');
const { json } = require('stream/consumers');
const { time } = require('console');

const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }
);



client.on('ready', function(e){
    console.log(`Logged in as ${client.user.tag}!`)

    
    //guild is link for discord, e.g. Endaoment is 734855436276334746  https://discord.com/channels/734855436276334746/.....
    const guildId = "823031986368675840";
    const guild = client.guilds.cache.get(guildId);
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: "get-largest-grantors",
        description: "Returns up to 5 of the largest grantors on Endaoment",
    })

    commands?.create({
        name: "get-entity-based-on-ein",
        description: "Get details of a entity based on ein provived",
        options: [
            {
                name: 'ein',
                description: 'ein of entity',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    commands?.create({
        name: "get-registries-summary",
        description: "Get summary of registries",
    })
    commands?.create({
        name: "get-entity-from-entity-manager",
        description: "Get details of a entity based on entity-manager address provived",
        options: [
            {
                name: 'entity-manager',
                description: 'entity-manager address',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    commands?.create({
        name: "get-portfolio-from-id",
        description: "Get portfolio from id",
        options: [
            {
                name: 'id',
                description: 'portfolio id',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options} = interaction

    if (commandName === 'get-entity-based-on-ein') {
        ein = options.getString('ein')
        console.log(ein)
        const query = `
        {
            ndaoEntities(where: {ein: "${ein}"}) {
              contractAddress: id
              ein
              totalEthReceived
              entityManager
              recognizedUsdcBalance
              totalUsdcDonationsReceived
              totalUsdcDonationFees
              totalUsdcGrantsReceived
            }
          }
    `;

    axios.post(mainnetEndpoint, { query })
    .then(async response => {
        console.log('Full Response:', response.data);
        const entities = response.data.data.ndaoEntities;
        console.log('entities', entities);

        if (entities && entities.length > 0) {
            const entity = entities[0];
            const entityEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Entity Information`)
                .addField("Contract Address", entity.contractAddress)
                .addField("EIN", entity.ein)
                //.addField("Total ETH Received", entity.totalEthReceived)
                .addField("Entity Manager", entity.entityManager)
                .addField("Recognized USDC Balance", entity.recognizedUsdcBalance)
                .addField("Total USDC Donations Received", entity.totalUsdcDonationsReceived)
                .addField("Total USDC Donation Fees", entity.totalUsdcDonationFees)
                .addField("Total USDC Grants Received", entity.totalUsdcGrantsReceived);

            interaction.reply({ embeds: [entityEmbed] });
        } else {
            interaction.reply({
                content: "No NDAO entity information found."
            });
        }
        // interaction.reply({
        //             content: "No NDnd."
        //         });
    })
    .catch(error => {
        console.error('Error fetching NDAO entity information:', error);
        interaction.reply({
            content: "An error occurred while fetching NDAO entity information."
        });
    });

    } else if (commandName === 'get-largest-grantors') {
        
        const query = `
        {
            ndaoEntities (
              orderBy: totalUsdcGrantedOut, orderDirection: desc, first: 5
            ) {
              contractAddress:id
              entityManager
              totalUsdcReceived
              totalUsdcGrantedOut
              totalUsdcGrantedOutFees
            }
          }
        `;

        axios.post(mainnetEndpoint, { query })
            .then(response => {
                const entities = response.data.data.ndaoEntities;
                console.log(entities)

                if (entities && entities.length > 0) {
                    const entityEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Largest Endaoment Grantors`);

                    entities.forEach(entity => {
                        entityEmbed.addField("Entity Manager", entity.entityManager);
                        entityEmbed.addField("Total Usdc Received", ToReadable(entity.totalUsdcReceived));
                        

                        entityEmbed.addField("\u200B", "\u200B");
                    });

                    interaction.reply({ embeds: [entityEmbed] });
                } else {
                    interaction.reply({
                        content: "Nothing found."
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                interaction.reply({
                    content: "An error occurred"
                });
            });
    } else if (commandName === 'get-entity-from-entity-manager') {
        einman = options.getString('entity-manager')
        console.log(einman)
        const query = `
        {
            ndaoEntities(where: {entityManager: "${einman}"}) {
              contractAddress: id
              ein
              totalEthReceived
              entityManager
              recognizedUsdcBalance
              totalUsdcDonationsReceived
              totalUsdcDonationFees
              totalUsdcGrantsReceived
            }
          }
    `;

    axios.post(mainnetEndpoint, { query })
    .then(async response => {
        console.log('Full Response:', response.data);
        const entities = response.data.data.ndaoEntities;
        console.log('entities', entities);

        if (entities && entities.length > 0) {
            const entity = entities[0];
            const entityEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Entity Information`)
                .addField("Contract Address", entity.contractAddress)
                //.addField("EIN", entity.ein)
                //.addField("Total ETH Received", entity.totalEthReceived)
                .addField("Entity Manager", entity.entityManager)
                .addField("Recognized USDC Balance", entity.recognizedUsdcBalance)
                .addField("Total USDC Donations Received", entity.totalUsdcDonationsReceived)
                .addField("Total USDC Donation Fees", entity.totalUsdcDonationFees)
                .addField("Total USDC Grants Received", entity.totalUsdcGrantsReceived);

            interaction.reply({ embeds: [entityEmbed] });
        } else {
            interaction.reply({
                content: "No NDAO entity information found."
            });
        }
        // interaction.reply({
        //             content: "No NDnd."
        //         });
    })
    .catch(error => {
        console.error('Error fetching NDAO entity information:', error);
        interaction.reply({
            content: "An error occurred while fetching NDAO entity information."
        });
    });

    } else if (commandName === 'get-registries-summary') {
        const query = `
            {
                registries {
                    entityFactories
                    swapWrappers
                    portfolios
                    address
                    owner
                }
            }
        `;
    
        axios.post(mainnetEndpoint, { query })
            .then(async response => {
                const registries = response.data.data.registries;
    
                if (registries && registries.length > 0) {
                    const registriesEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Registries Information`);
    
                    for (const registry of registries) {
                        const entityFactories = registry.entityFactories;
                        const swapWrappers = registry.swapWrappers;
                        const portfolios = registry.portfolios;
                        const address = registry.address;
                        const owner = registry.owner;
    
                        registriesEmbed.addField("Entity Factories", entityFactories.join('\n'));
                        registriesEmbed.addField("Swap Wrappers", swapWrappers.join('\n'));
                        registriesEmbed.addField("Portfolios", portfolios.join('\n'));
                        registriesEmbed.addField("Address", address);
                        registriesEmbed.addField("Owner", owner);
                        registriesEmbed.addField("\u200B", "\u200B"); // Empty field for spacing
                    }
    
                    interaction.reply({ embeds: [registriesEmbed] });
                } else {
                    interaction.reply({
                        content: "No registries found."
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching registries:', error);
                interaction.reply({
                    content: "An error occurred while fetching registries."
                });
            });
    } else if (commandName === 'get-portfolio-from-id') {
        portfolioid = options.getString('id')
        console.log(portfolioid)
        const query = `
            {
                portfolioPosition(
                    id: "${portfolioid}"
                ) {
                    shares
                    portfolio
                    investedUsdc
                    entity {
                        id
                        totalUsdcReceived
                        totalUsdcPaidOut
                    }
                }
            }
        `;
    
        axios.post(mainnetEndpoint, { query })
            .then(response => {
                const positionData = response.data.data.portfolioPosition;
    
                if (positionData) {
                    const entityData = positionData.entity;
    
                    const positionEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Portfolio Position`)
                        .addField("Shares", positionData.shares)
                        .addField("Portfolio", positionData.portfolio)
                        .addField("Invested USDC", positionData.investedUsdc)
                        .addField("Entity ID", entityData.id)
                        .addField("Total USDC Received", entityData.totalUsdcReceived)
                        .addField("Total USDC Paid Out", entityData.totalUsdcPaidOut);
    
                    interaction.reply({ embeds: [positionEmbed] });
                } else {
                    interaction.reply({
                        content: "No portfolio position data found."
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching portfolio position:', error);
                interaction.reply({
                    content: "An error occurred while fetching portfolio position data."
                });
            });
    }
    
    

})


async function getResponse(url) {
	console.log(url)

    let options = {method: 'GET', headers: {'Content-Type': 'application/json'}};

    const data = await fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json.Floor_Price))
    .catch(err => console.error('error:' + err));
    return data
}

function ToReadable(amount) {
    //const decimals = 18; // eth
    const decimals = 6; // usdc
    const divisor = 10 ** decimals;

    const readableAmount = parseFloat(amount) / divisor;
    //console.log(readableAmount)
    return readableAmount.toFixed(2); // Return with correct decimal precision
}



client.login(process.env.DISCORD_TOKEN)