import dotenv from 'dotenv';
import server from './index';

dotenv.config();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})