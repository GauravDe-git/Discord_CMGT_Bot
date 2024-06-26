# Discord Bot

This is a Discord bot built with Node.js and discord.js. 

## Features

- Sends a reminder to introduce oneself in the server.
- Handles new members by assigning them an 'Introduction' role and sending them a welcome message.
- Responds to button interactions in the server.

## Setup

1. Clone this repository.
2. Install the dependencies by running `npm install`.
3. Request the `.env` file from author and paste it in the root directory of the project, and add your bot token and other environment variables like so:

    ```env
    TOKEN=your-bot-token
    INTRODUCTION_ROLE_ID=your-introduction-role-id
    REMINDER_ROLE_ID=your-reminder-role-id
    HOW_TO_INTRO_CHANNEL_ID=your-how-to-intro-channel-id
    INTRODUCTION_CHANNEL_ID=your-introduction-channel-id
    ```

4. Run the bot by using the command `node src/index.js`.