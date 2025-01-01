# 👨🏻‍🔬 Architecture of the monorepo

- The monorepo is a _**single repository that contains multiple projects**_.
- It is a way to organize your codebase and _**manage your dependencies**_. It is a good fit for large projects with
  multiple teams working on different parts of the codebase.

## ❓ Why use a monorepo

- **_Code sharing_**: It allows you to share code between projects. This can be useful for sharing common libraries,
  components, or utilities.
- **_Dependency management_**: It allows you to manage your dependencies in a single place. This can make it easier to
  keep your dependencies up to date and avoid version conflicts.
- **_Consistent tooling_**: It allows you to use consistent tooling across all your projects. This can make it easier to
  set up and maintain your development environment.
- **_Simplified build process_**: It allows you to build and test your projects together. This can make it easier to
  ensure that your projects work well together.

## 📦 Structure of the monorepo

- `/root/`: The root of the monorepo contains the **_configuration files, Docker Compose, scripts_** that are used to  manage the monorepo.

- `/apps/client & /apps/server`: These directories contains the **_applications_** that are part of the monorepo. Each application is a separate project with its own **_source code, dependencies, and build process_**.

- `/packages`: This directory contains the **_shared packages_** that are used by the applications. These packages can be shared between the applications and can contain **_shared code, components, or utilities_**.

- `/docker`: This directory contains the **_Dockerfiles_** for the applications and shared packages. These Dockerfiles are used to build the **_Docker images_** for the applications and shared packages.

- `/.github`: This directory contains the **_GitHub Actions_** workflows, **_pull request templates_**, and other GitHub related files.

- `/scripts` : The scripts in this directory are used to automatically install git hooks on pre-commit and pre-push.

- `/docs`: This directory contains the **_documentation_** for the monorepo.

- `/infra`: This directory contains the **_infrastructure as code_** for the monorepo. This can include **_Terraform scripts, K8s config, CloudFormation templates, or other infrastructure code_**.

## 🚧 Architecture

![Software Architecture](./assets/arch.png)
