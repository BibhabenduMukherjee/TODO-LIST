const express  =  require("express")
const cors = require("cors")
const app = express();
const uuid= require("uuid")
app.use(cors())
const storage = require('node-persist');

async function start (){
    await storage.init({
        dir: './upload',
     
        stringify: JSON.stringify,
     
        parse: JSON.parse,
     
        encoding: 'utf8',
     
        logging: false, 
     
        ttl: false, 
        expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
     
       
    });
}


app.use(express.json())
app.use(express.urlencoded({extended : false}))

let alltasks = []

app.get("/getTask" , async(req , res)=>{
    const result = await storage.getItem("task")
    res.status(200).json({result})
})

app.put("/deleteTask/:id" , async (req , res)=>{
    const id = req.params.id
    // we have the id -> task
    // search in the node-persist storage with this id
    
    //const AllTask = await storage.getItem('task'); // [{id,task},{id,task}]
    const taskIndex = alltasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
        // Return a 404 error if the task is not found
        res.status(404).json({result : 'Task not found'});
      } else {
        // Remove the task from the array and update the storage
        alltasks.splice(taskIndex, 1);
        await storage.setItem('task', alltasks);
        const result = await storage.getItem("task")
      res.status(201).json({result,message:"Task Deleted"});
      }

})

app.post("/addTask" ,async (req , res)=>{
    const {task} = req.body
    const id = uuid.v4()
    alltasks.push({id,task})
   await storage.setItem("task" , alltasks)
   const result = await storage.getItem("task")
    res.status(201).json({result})
})

start()

process.on("SIGINT", async()=>{
    await storage.clear()
    process.exit();

})

app.listen(3002 , ()=>{
    console.log("SERVER START..");
})
