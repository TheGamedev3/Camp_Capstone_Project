

import { DummyPlayer } from "./mongooseSys/Seeder";


const peoplePictures = {
  1: 'https://th.bing.com/th/id/OIP.8_HvWJEZbwr3hkUuZL0jMgAAAA?rs=1&pid=ImgDetMain',
  2: 'https://tse4.mm.bing.net/th/id/OIP.oc1jS8YijLvwPBfKRfsJUgHaHa?rs=1&pid=ImgDetMain',
  3: 'https://static.vecteezy.com/system/resources/thumbnails/037/983/656/small_2x/ai-generated-confident-brunette-business-woman-student-with-folded-arms-photo.jpg',
  4: 'https://tse4.mm.bing.net/th/id/OIP.tHqgBxygPpSN7tCrxYw0PwHaK5?rs=1&pid=ImgDetMain'
};

export const SeedData: DummyPlayer[] = [
    ["Ryan", 1],
    ["Aaron", 2],
    ["Sarah", 3],
    ["Gary", 1],
    ["Maurice", 2],
    ["Laura", 3],
    ["Frank", 2],
    ["Miranda", 4]
].map(([username, profile]: string[])=>{return{
    username,
    profile:peoplePictures[profile],
    email:`${username.toLowerCase()}@gmail.com`,
    password:`${username.toLowerCase()}1234`
}});

