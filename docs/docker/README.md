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
