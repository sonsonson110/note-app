import bcrypt from "bcrypt";

export class PasswordHashHelper {
    private readonly SALT_ROUNDS = 10;

    async generate(password: string) {
        return bcrypt.hash(password, this.SALT_ROUNDS)
    }

    async verify(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash)
    }
}

export default new PasswordHashHelper()