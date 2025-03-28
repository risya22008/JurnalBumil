const { UserService } = require("../services/userService");

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    createNewUser = async (req, res) => {
        try {
            const { email, name, password} = req.body;
            const newUser = await this.userService.createUser({ email, name, password});
            
            res.status(201).json({ userId: newUser.id });
        } catch (error) {
            if (error.message.includes("User_email_key")) {
                res.status(403).json({ message: "Email is already taken" });
                return;
            }
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = { UserController };
