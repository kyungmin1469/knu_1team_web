const express = require('express');
const apiController = require('./controller');
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use("/api", apiController);

app.post("/api/login", (req,res) => {
    const body = req.body;
    const {email, password} = body; 
    //const email = body.email;
    //const password = body.password;
    console.log(email, password);
    // DB에 해당 '이메일', '패스워드' 조회해서 로그인 여부 판단
    return res.json({message: "로그인 성공"});
});

app.listen(8000, () => {
    console.log('Express Running on 8000');
});

//깃