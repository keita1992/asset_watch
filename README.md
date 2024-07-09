# Asset Watch

Welcome to **Asset Watch** - your dynamic dashboard for monitoring your financial portfolio. This application enables users to input their cash, stocks, and other investments to visualize their asset allocation and assess risk effectively.

## Features

- **Portfolio Visualization**: Get a comprehensive overview of your asset distribution across different categories.
- **Risk Assessment**: Evaluate the potential risks associated with your investment choices.
- **Real-time Updates**: Keep your dashboard up-to-date as you add or modify your investments.

## Demo

Experience Asset Watch firsthand through our live demo: [https://asset-watch.keita1992.link/](https://asset-watch.keita1992.link/)

## Technology Stack

Asset Watch leverages a modern tech stack including:

- **Frontend**: Developed with Next.js for a seamless user experience.
- **Infrastructure**: Hosted on AWS, utilizing services such as AWS Amplify, DynamoDB, API Gateway, and Lambda for robust and scalable performance.
- **Containerization**: Supported by Docker, facilitating straightforward setup and development across various environments.

## Getting Started

Follow these instructions to set up a local development environment.

### Prerequisites

Ensure you have the following installed:

- Node.js
- Docker

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/keita1992/asset_watch.git
   cd asset-watch
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the application using Docker
   Build and run the Docker container with:
   ```bash
   docker compose build
   docker compose up -d
   ```
   Access the application at `http://localhost:3000`.

## dev

```bash
docker compose exec nodejs bash -c "npm run dev"
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## Contact

- Keita Iimori
- Blog Link: [https://keita-blog.com/](https://keita-blog.com/)
