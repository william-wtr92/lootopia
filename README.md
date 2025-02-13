# 🧩 Lootopia

Lootopia is an innovative platform, structured as an immersive ecosystem, dedicated to the participation and organisation of treasure hunts.

## 🐐 Contributors

- [@William](https://github.com/william-wtr92) > Fullstack Developer / Team Leader
- [@Pascal](https://github.com/Scalpal) > Fullstack Developer
- [@Delphine](https://github.com/delphinepb) > Fullstack Developer

## 🔨 Setup

### 🐳 From Docker environment

- Make sure you have **Docker** installed on your machine.
- Setup ur **.env** file with the following
  variables -> [See example](https://github.com/william-wtr92/lootopia/blob/main/.env.example).

- To run this project clone this repository and run it locally using **docker commands**. <br><br>

  - **🚀 Production:** <br>
    **Start the project:**
    ```bash
    make SERVICE=prod up
    ```

    **Stop the project:**

    ```bash
    make SERVICE=prod stop
    ```

  - **⚙️ Development:** <br>
    **Start the project:**

    ```bash
    make up
    ```

    **Stop the project:**

    ```bash
    make stop
    ```

### 🔑 From the local environment

- You need to have **PNPM** installed, if not you can install it by following
  the [instructions](https://pnpm.io/installation).
- Setup ur **.env** file with the following
  variables -> [See example](https://github.com/william-wtr92/lootopia/blob/main/.env.example).
- Install [PostgreSQL](https://www.postgresql.org/download/) & [PostGIS](https://postgis.net/documentation/getting_started/) & [Redis](https://redis.io/docs/install/install-redis/) on
  your local machine.
- Install the dependencies by running `pnpm install` at `root`.
- Start the `development server` by running the following commands at `root`:

  ##### **🖥️ Front - Lootopia Client:**

  ```bash
  pnpm run dev:client
  ```

  ##### **🖥️ Back - Lootopia Server:**

  ```bash
  pnpm run dev:server
  ```

### **🔗 Access the project:** <br>

- **[Front - Lootopia Client](http://localhost:3000)** run on port `3000`
- **[Back - Lootopia Server](http://localhost:3001)** run on port `3001`

## ⭐️ Tech Stack

- Client: NextJS & TypeScript
- Mobile: Expo (React Native) & TypeScript
- Server: HonoJS / RPC & TypeScript
- Database: PostgreSQL / PostGIS / CosmosDB
- Cache: Redis
- Mockup: Figma
- GitHooks: Husky
- CI/CD: Github Actions
- GitOps & Continuous Deployment: ArgoCD
- Testing: Jest
- Monitoring: Grafana / Prometheus / Sentry
- Containerization: Docker
- Orchestration: Kubernetes / Helm
- Infrastructure: Azure / Terraform

## 💡 Other Tools

- Agile Methodology: Jira
- Documentation: Notion / Markdown

## 📝 License

> No part of this software may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the author. For permission requests, write to the author at the email provided in the contact details.

> For more details, see the [LICENSE.md](./LICENSE.md) file.
