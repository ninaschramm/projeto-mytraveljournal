import { client } from '../../prisma/prisma'

async function insert(email: string, username: string, password: string) {
    await client.user.create({
        data: {
            email,
            username,
            password
        }
    });
}

async function findByEmail(email: string) {
    const verifyEmail = await client.user.findFirst({
      where: {
        email,
      },
    });
  
    return verifyEmail
  }
  
async function checkUser(username: string) {
    const user = await client.user.findFirst({
        where: {
            username
        },
    });

    return user
}

const userRepository = {
    insert,
    findByEmail,
    checkUser,
  };
  
  export default userRepository;