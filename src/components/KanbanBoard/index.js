import React,{Component} from 'react';
import styled from 'styled-components';
import { MdCancel } from  "react-icons/md";
import { Droppable } from 'react-beautiful-dnd';
import { BsPencilSquare } from "react-icons/bs";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import KanbanTask from '../KanbanTask';
import './index.css'

const TaskList = styled.div`
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'transparent')};
  flex-grow: 1;
  width:200px;
  min-height: 120px;
`;

class KanbanBoard extends Component {
  state = {
    newTask: '',
    newBoardName:this.props.column.title,
    isBoardUpdating:false,
    isTaskUpdating:false,
    updatedTaskId:''
  }

  deletingBoard=()=>{
    const {column,deleteBoard} = this.props
    const {id}=column 
    deleteBoard(id)
  }

 
  addingTask = () => {
    const {column, addTask} = this.props
    const {id} = column
    const {newTask} = this.state
    addTask(newTask, id)
    this.setState({
      newTask: '',
    })
  }


  changeTaskInput = event => {
    this.setState({
      newTask: event.target.value,
    })
  }

  updatingTask=(taskId)=>{
    const {tasks} = this.props 
    // console.log(tasks,taskId)
    const taskIndex = tasks.findIndex(eachTask=>{
        if(eachTask.id===taskId){
            return true
        }
        return false
    }) 
    const taskContent = tasks[taskIndex].content
    this.setState({
      isTaskUpdating:true,
      updatedTaskId:taskId,
      newTask: taskContent
    })
  }

  updatingTaskVal=()=>{
    const {taskUpdate} = this.props
    const {newTask,updatedTaskId} = this.state 
    taskUpdate(updatedTaskId,newTask)
    this.setState({
      isTaskUpdating:false,
      newTask:''
    })
  }

  onChangeUpdatedName =event=>{
    this.setState({
      newBoardName:event.target.value
    })
  }

  updateBoardStatus=()=>{
   this.setState({
     isBoardUpdating:true,
   })
  }

  updatingBoardName=()=>{
    const {updateBoardName,column} = this.props
    const {newBoardName} = this.state 
    const {id} = column
    updateBoardName(id,newBoardName)
    this.setState({
      isBoardUpdating:false
    })
  }

  render() {
    const {newTask,isBoardUpdating,isTaskUpdating,newBoardName} = this.state
    const {column,deleteTask} = this.props
    return (   
        <div className="board-container">
        <div className="board-name-and-delete-icon-container">
            {isBoardUpdating ?
            <div className="board-name-and-update-icon">
              <input type="text"
              onChange={this.onChangeUpdatedName} 
              className="update-input-field" 
              value={newBoardName} />
              <IoCheckmarkDoneCircleOutline className="update-icon" onClick={this.updatingBoardName} />
              </div>: 
            <div className="board-name-and-update-icon">
            <h1 className="board-name">{newBoardName}</h1>
            <BsPencilSquare onClick={this.updateBoardStatus} id="editBoardIcon" className="update-icon"/>
            <p id="editBoardName">Edit Board name</p>
            </div>}
            
          <button
            className="del-icon"
            type="button"
            onClick={this.deletingBoard}
          >
            <MdCancel />
          </button>
        </div>

        
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <TaskList
              innerRef={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {this.props.tasks.map((task, index) => (
                <KanbanTask key={task.id} 
                columnId={column.id} 
                task={task} 
                deleteTask={deleteTask}
                updateTask={this.updatingTask} 
                index={index} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
        <div className="task-input-and-btn-container">
          <input
            className="task-input-field"
            placeholder={isTaskUpdating?'Update Task':'Enter Task'}
            value={newTask}
            onChange={this.changeTaskInput}
          />
          {isTaskUpdating? (<button
            type="button"
            className="update-task-btn"
            onClick={this.updatingTaskVal}
          >
            Update Task
          </button>)  :   (<button
            type="button"
            className="add-task-btn"
            onClick={this.addingTask}
          >
            Add Task
          </button>)}
       
          </div>
        </div>
    );
  }
}

export default KanbanBoard