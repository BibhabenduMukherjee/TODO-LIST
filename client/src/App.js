
import './App.css';
import {useEffect, useState} from "react"
import { ADD_BASE_URL } from './config';
import {GET_BASE_URL} from "./config"
import { DELETE_BASE_URL } from './config'; 
import axios from 'axios';


function App() {
  const [ task , setTask] = useState("");
  const [tasks , setTasks] = useState([])

    useEffect(()=>{
     axios.get(GET_BASE_URL).then((res) =>{
      if(res.data.result.length > 0){
        setTasks(res.data.result);
      }
      
     }).catch(err=> console.log(err))
    },[])


    function Button({id}){
      function handleClick(id){
        // console.log(`task with id  ${id}  deleted`)
          
        axios.put(`${DELETE_BASE_URL}/${id}` , null).
        then((res)=>{
         
          console.log(res.data)
          setTasks(res.data.result)
        }).catch((err)=>{console.log(err)})
      
      
      }
      
         const handleRemoveClick = () =>{
          handleClick(id)
         }
      
        return (
          <button className='p-2 ' onClick={handleRemoveClick}>x</button>
        )
      }
      


   function addTask(e){
    e.preventDefault();
    if(!task){alert("Empty Field Is Not Allowed");return;}
   // console.log(task);
    const sendData = {task : task}
    axios.post( ADD_BASE_URL,  sendData ,{
      headers: { 'Content-Type': 'application/json' }
    }).then((res)=>{
     
      setTasks(res.data.result)
       console.log(res)
      setTask("")
    }).catch(err => console.log(err))
   
   }

  
  return (
    <div className="App mx-auto container">
      <h2 className = " AddT mt-4 text-center fs-2">To Do List App </h2>
     <form onSubmit={addTask} className = "  mt-4 row row-cols-lg-auto g-3 align-items-center">
     <div className="col-12">
    <label className="visually-hidden" htmlFor="inlineFormInputGroupUsername">Username</label>
    <div className="input-group">
      <div className="input-group-text">+</div>
      <input autoComplete='off' value={task} onChange={(e)=>{setTask(e.target.value)}} type="text" className="form-control" id="inlineFormInputGroupUsername" placeholder="Enter Task"/>
    </div>
    <div className="d-grid gap-2 mt-2">
  <button onClick={addTask} className="btn btn-primary" type="button">Add Task</button>
  
</div>
  </div>
     </form>
   
    <div className="container mt-4 ">

    {tasks.length > 0 ? <div>

    {tasks.map((task)=>(
      <div className = "row mt-2" key={task.id}>
       
       <div className = " mx-auto taskContainer  col-12 d-flex  justify-content-center">
       <h5 className=" pt-1">{task.task}</h5>
       <div style={{ flex: 1 }} /> 
        <Button id= {task.id}/>

       </div>
       {/* <div className = "col-6 p-2 d-flex justify-content-center">
       <h5>Delete</h5>
      
       </div> */}

      
      </div>
  
    ))}

    </div> : ""}
      
    </div>
    
     

    </div>

    
  );
}

export default App;


