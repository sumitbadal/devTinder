const express = require("express");
const app = express();

app.get("/test", (req, res)=> {
    res.send("Hi this is test");
})
app.listen(3000, () => {
    console.log(`Server running on 3000 port`);
});