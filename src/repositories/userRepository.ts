import { client } from '../../prisma/prisma'

async function insert(email: string, username: string, password: string) {
    await client.users.create({
        data: {
            email,
            username,
            password
        }
    });
}

async function findByEmail(email: string) {
    const verifyEmail = await client.users.findFirst({
      where: {
        email,
      },
    });
  
    return verifyEmail
  }
  
  

async function checkUser(username: string) {
    const user = await client.users.findUnique({
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