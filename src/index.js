require("dotenv").config();
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Fn. to remove 'Introduction' role from members
async function removeIntroductionRole(member) {
  const introRole = member.guild.roles.cache.get(process.env.INTRODUCTION_ROLE_ID);

  // Check if the member has the 'Introduction' role
  if (member.roles.cache.has(introRole.id)){
    // Remove the 'Introduction' role from the member
    await member.roles.remove(introRole);
  }
}

//* Functions related to setting Reminder DMs

// Function to check and send reminders
async function checkReminders() {
  const guild = client.guilds.cache.first(); // Assuming the bot is in only one guild
  const reminderRole = guild.roles.cache.get(process.env.REMINDER_ROLE_ID);
  
  const membersWithReminder = await guild.members.fetch({ cache: false });
  
  membersWithReminder.forEach(async (member) => {
    if (member.roles.cache.has(reminderRole.id)) {
      try {
        await member.send(`This is a reminder to introduce yourself in the server! You can click on the 'Skip' button in the <#${process.env.HOW_TO_INTRO_CHANNEL_ID}> channel to stop the reminders. Don't worry, you are still free to introduce yourself anytime even if you skipped. 🫡`);
      } catch (error) {
        console.error(`Failed to send reminder to ${member.user.tag}: ${error}`);
      }
    }
  });
}
//------------------------------------------------------------------------//

client.on("ready", async (c) => {
  console.log(`${c.user.tag} is online! 🫡`);

  // Run the reminder check every 24 hours
  setInterval(checkReminders, 24 * 60 * 60 * 1000);

  // Send #howToIntro msg when bot online
  const howToIntroChannel = client.channels.cache.get(
    process.env.HOW_TO_INTRO_CHANNEL_ID
  );

  // Create buttons
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("introduce")
      .setLabel("Introduce")
      .setStyle("Primary"),
    new ButtonBuilder()
      .setCustomId("remind")
      .setLabel("Remind me to introduce later")
      .setStyle("Secondary"),
    new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("Skip introducing yourself")
      .setStyle("Danger")
  );

  // Send the message with the buttons
  await howToIntroChannel.send({
    content: "Would you like to introduce yourself ?",
    components: [row],
  });
});

// Event to handle button interactions
client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    // Handle 'introduce' button
    if (interaction.customId === "introduce") {
      const introductionChannel = client.channels.cache.get(process.env.INTRODUCTION_CHANNEL_ID);

      // Send an ephemeral reply
      await interaction.reply({ content: `Please introduce yourself in ${introductionChannel}.`, ephemeral: true });
    }
    // Handle 'remind'button
    else if (interaction.customId === "remind") {
      // Remove the 'Introduction' role from the member
      await removeIntroductionRole(interaction.member);

      // Assign the 'Reminder' role to the member
      const reminderRole = interaction.guild.roles.cache.get(process.env.REMINDER_ROLE_ID);
      await interaction.member.roles.add(reminderRole);

      await interaction.reply({ content: "Ok! You can introduce your self later! I will send you a reminder later 🫡", ephemeral: true });
    }
    // Handle 'skip' button
    else if (interaction.customId === "skip") {
      // Remove the 'Introduction' and 'Reminder' role from the member
      await removeIntroductionRole(interaction.member);

      const reminderRole = interaction.guild.roles.cache.get(process.env.REMINDER_ROLE_ID);
      await interaction.member.roles.remove(reminderRole);

      await interaction.reply({ content: "Alright! but if you change your mind you are still free to tell us about yourself anytime 🫡", ephemeral: true });
    }
  }
})

// Event to handle new messages
client.on("messageCreate", async (msg) => {
  
  console.log(msg.content);
  // Check if the msg is sent in #introductions channel
  if (msg.channel.id === process.env.INTRODUCTION_CHANNEL_ID) {
    
    // Remove the 'Introduction' role from the member
    await removeIntroductionRole(msg.member);

    // Remove the Reminder role from the member
    const reminderRole = msg.guild.roles.cache.get(process.env.REMINDER_ROLE_ID);
    await msg.member.roles.remove(reminderRole);
  }

  // ping pong
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

// Event to handle new members
client.on("guildMemberAdd", async (member) => {

  // Get 'Introduction' role
  const introRole = member.guild.roles.cache.get(process.env.INTRODUCTION_ROLE_ID);

  // Assign the role to new member
  await member.roles.add(introRole);

  await member.send(
    `Welcome to the server, ${member.displayName}! We're glad to have you here. Feel free to introduce yourself in the #introduction channel.`
  );
});

client.login(process.env.TOKEN);
