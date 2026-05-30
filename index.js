express = require("express")
app = express()
app.use(express.json())
jwt = require("jsonwebtoken")
function authMiddleware(req, res, next){
    const token = req.headers.token
    if(!token){
        return res.status(403).json({
            message: "Unauthorized"
        })
    }
    const decoded = jwt.verify(token, "secretkey")
    if(!decoded){
        return res.status(403).json({
            message: "Unauthorized"
        })
    }
    req.username = decoded.username
    next()
}
let users = []
app.post("/signup", (req, res)=>{
    let username = req.body.username
    let password = req.body.password
    const userExists = users.find(user => user.username === username)
    if(userExists){
        return res.status(403).json({
            message: "User already exists"
        })
    }
    users.push({username, password})
    res.json({
        message: "User created successfully"
    })
})

app.post("/signin", (req, res)=> {
    let username = req.body.username
    let password = req.body.password
    const userExists = users.find(user => user.username === username && user.password === password)
    if(!userExists){
        return res.status(403).json({
            message: "Invalid username or password"
        })
    }
    const token = jwt.sign({
        username
    }, "secretkey")       // used to decode the token and verify the user
    res.json({
        token: token
    })
})

let notes = []
app.post("/notes", authMiddleware, (req, res)=>{
    const username = req.username
    const note = req.body.note
    notes.push({username, note})
    res.json({
        message: "Note added successfully"
    })
})

app.get("/notes", authMiddleware, (req, res)=>{
    const username = req.username
    userNotes = notes.filter(note => note.username === username)
    res.json({
        notes: userNotes
    })
})

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.get("/signin", (req, res)=>{
    res.sendFile(__dirname + "/signin.html")
})
app.get("/signup", (req, res)=> {
    res.sendFile(__dirname + "/signup.html")
})
app.listen(3000)