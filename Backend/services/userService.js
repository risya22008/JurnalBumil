const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");

class UserService {
    async createUser(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = { ...user, password: hashedPassword };
        
        const userRef = await db.collection("User").add(newUser);
        return { id: userRef.id, ...newUser };
    }
}

module.exports = { UserService };