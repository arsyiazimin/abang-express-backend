import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as md5 from 'md5';
import * as crypto from 'crypto';

@Injectable()
export class PasswordHasherService {
    async hasPassword(password: string) {
        // const bcryptHash = bcrypt.hash(password, 10);
        const encryptedPass = await this.encryptCrypto(password)
        const salt = await this.hasPasswordBcrypt(await encryptedPass);
        const encrypted = await this.encryptCrypto(await md5(salt + md5(md5(salt + encryptedPass))));

        let dataPassword = {
            // LOGIN_PASS: await md5(salt + md5(md5(salt + password))),
            LOGIN_PASS: await encrypted,
            SPASS: salt
        }
        return dataPassword;
    }

    async hasPasswordBcrypt(password: string) {
        return await bcrypt.hash(password, 10);
    }

    async encryptCrypto(password: string) {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        return hash;
    }

    async compareHash(
        password: string | undefined,
        hash: string | undefined,
        salt: string | undefined,
    ): Promise<boolean> {
        const encryptedPass = await this.encryptCrypto(password)

        if (await this.compareBcrypt(encryptedPass, salt)) {
            const encodePass = md5(salt + md5(md5(salt + encryptedPass)));
            const encodeCryptp = await this.encryptCrypto(encodePass)

            // if (encodePass === hash) {
            if (encodeCryptp === hash) {
                return true;
            } else {
                return false;
            }
        } else {
            return false
        }
    }

    async compareBcrypt(password, salt): Promise<boolean> {
        // const pass = await this.encryptCrypto(password)
        return await bcrypt.compare(password, salt)
    }

    async compareMd5(password: string | undefined, hash: string | undefined): Promise<boolean> {
        const enc = md5(password);
        if (enc === hash) {
            return true
        } else {
            return false
        }
    }
}
