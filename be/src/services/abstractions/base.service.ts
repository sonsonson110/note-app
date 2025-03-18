import { PrismaClient } from "@prisma/client";

export abstract class BaseService {
    public prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
}