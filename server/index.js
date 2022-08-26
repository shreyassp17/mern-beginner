const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const FriendModel = require('./models/Friends');

require('dotenv').config()
app.use(cors());
app.use(express.json());

//Database Connecton
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.post('/addfriend', async (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const email = req.body.email;
    const friend = new FriendModel({ name: name, age: age, email: email });
    await friend.save();
    res.send("Success");
    // res.send(friend);
})

app.get('/read', async (req, res) => {
    FriendModel.find({}, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result);
        }
    });
});

app.put('/update', async (req, res) => {
    const newAge = req.body.newAge;
    const id = req.body.id;

    try {
        await FriendModel.findById(id, (error, friendToUpdate) => {
            friendToUpdate.age = Number(newAge);
            friendToUpdate.save();
        });

    }
    catch (err) {
        console.log(err);
    }
    res.send("Update success");
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    await FriendModel.findByIdAndRemove(id).exec();
    res.send("Delete success");
})

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3001')
}
);