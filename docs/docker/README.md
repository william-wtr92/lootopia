# 💡 Some Docker & Compose Utils

#### In Lootopia project, we use Docker to containerize our applications.

- In the **Lootopia project**, we use Docker to containerize our applications. This allows us to run our applications
  in a
  consistent environment, whatever the host system. It's also easier to manage dependencies and isolate our applications
  from each other.
- **Compose** is a tool for defining and running **multi-container Docker applications**, giving us the ability to
  define our
  different applications and our Postgres database in a single **YAML file**.

## 🐳 Docker: How to use it

- Go to the `root` of the project.
- **Build the Docker images**: To build the Docker images for our applications, we use
  the `docker-compose build --no-cache` command.
- **Run the Docker containers**: To run the Docker containers for our applications, we use the `docker-compose up -d`
  command.
- **Stop the Docker containers**: To stop the Docker containers for our applications, we use the `docker-compose down`
  command.

**⚠️ The `--no-cache` & `-d` flags :**

- `--no-cache` flag tells Docker to build the images from scratch, which can help avoid issues with cached layers.
- `-d` flag tells Docker to run the containers in detached mode, which means they run in the background.

### 🧩 Helpful Docker commands

- `docker system prune -a --volumes` : Remove all unused containers, networks, images (both dangling and unreferenced),
  and volumes.

## 🧠 Compose: Environnements

**To be able to deploy** our app from a **Compose file** and on different environments `Dev` & `Production`, we used the
feature that allows us to put targets in **Compose** and aliases in **DockerFiles**.

- _**DockerFile**_ structure for **various environments** :

> Source of example:`docker/{prod, dev}/Dockerfile.{ressource} (client, server)`

```Dockerfile
FROM base AS dev
```

```Dockerfile
FROM base AS production
```

You can see that we have two targets `dev` and `production` in the **DockerFile**, we can use these targets in the Compose
file to
specify which target to use when building the image.

- _**Compose file**_ structure for **various environments** :

```yaml
services:
  client:
    build:
      context: .
      target: dev
```

```yaml
services:
  server:
    build:
      context: .
      target: production
```

You can see that we have specified the target to use when building the image in the **Compose file**, this allows us to
build different images for **different environments**.