import { client } from '../../prisma/prisma'

async function getTripsByUser(userId: number) {
    const result = await client.trips.findMany({
        where:
         { 
            userId,
         }
    })   
    
    return result
}

const tripsRepository = {
    getTripsByUser,
  };
  
  export default tripsRepository;