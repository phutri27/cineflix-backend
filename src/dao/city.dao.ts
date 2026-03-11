import { prisma } from "../lib/prisma";

class City{
    async create(name: string) {
        return await prisma.city.create({
            data: {
                name
            }
        });
    }

    async findAll() {
        return await prisma.city.findMany();
    }

    async update(id: number, name: string) {
        return await prisma.city.update({
            where: {
                id
            },
            data: {
                name
            }
        });
    }

    async delete(id: number) {
        return await prisma.city.delete({
            where: {
                id
            }
        });
    }
}
export const cityObj = new City()