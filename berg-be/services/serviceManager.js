import { PrismaClient } from "@prisma/client";
import { UserService } from "./user.service.js";
import { ProjectService } from "./project.service.js";
import { TaskService } from "./task.service.js";
import { BatchService } from "./batch.service.js";

const prisma = new PrismaClient();

export class ServiceManager {
  constructor() {
    this.userService = new UserService(prisma);
    this.projectService = new ProjectService(prisma);
    this.batchService = new BatchService(prisma);
    this.taskService = new TaskService(prisma);
  }

  getUserService() {
    return this.userService;
  }

  getProjectService() {
    return this.projectService;
  }

  getBatchService() {
    return this.batchService;
  }

  getTaskService() {
    return this.taskService;
  }
}

export const serviceManager = new ServiceManager();
