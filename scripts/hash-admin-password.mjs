import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });
const password = await rl.question('Password (input is visible): ');
rl.close();
const salt = crypto.randomBytes(16);
const derived = crypto.scryptSync(password, salt, 64);
console.log(`scrypt$${salt.toString('base64url')}$${derived.toString('base64url')}`);
