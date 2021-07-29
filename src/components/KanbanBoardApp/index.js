import React, { Component }  from 'react';
import {Redirect} from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanBoard from '../KanbanBoard'
import './index.css'


class KanbanBoardApp extends Component {

  state = {tasks: {},
          columns: {},
          columnOrder: [],
          currentUserDetails:[],
          boardName:'',
          taskId:1}

componentDidMount(){
  this.getCurrentUserDetailsFromLocalStorage()
  
}


getCurrentUserDetailsFromLocalStorage=()=>{
  const parsedUserDetails = JSON.parse(localStorage.getItem('loggedInUserDetails'))
    if(parsedUserDetails===null){
      this.setState({
          currentUser:[{id:'',email:'',password:''}]
      })
    }else{
      this.setState({
        currentUserDetails:parsedUserDetails
      },this.getBoardDetailsFromLocalStorage)
    }
     
  }
  

getBoardDetailsFromLocalStorage=()=>{
  const {currentUserDetails} = this.state
  const currentUser = currentUserDetails[0].id
  const stringifiedData = localStorage.getItem(`${currentUser}-kanbanBoards`)
  const parsedData = JSON.parse(stringifiedData)
  if (parsedData === null) {
    this.setState({tasks: {},
                  columns: {},
                  columnOrder: [],
                  boardName:'',
                  taskId:1
                }) 
  }else{
      this.setState(parsedData)
    }  
}

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
  };

  
  onDeleteBoard = id => {
    const {columns,columnOrder} = this.state
    const keys = Object.keys(columns);
    const deleteBoardEl = keys.filter(eachId => eachId === id)
    delete columns[deleteBoardEl[0]]
    const updatedColumnOrder = columnOrder.filter(eachCol=>eachCol!==id)
    this.setState({
     columns,
     columnOrder:updatedColumnOrder
    })
  }

  onDeleteTask = (boardId, taskId) => {
    const {columns,tasks} = this.state
   
    const updateBoardTasks = columns[boardId].taskIds.filter(
      eachTask => eachTask !== taskId,
    )
    columns[boardId].taskIds = updateBoardTasks
    delete tasks[taskId]
    this.setState({
      columns,
      tasks
    })
    
  }


  onAddTask = (task, id) => {
    const {columns,tasks,taskId} = this.state
    const keys = Object.keys(columns);
    const boardIndex = keys.findIndex(eachBoard => {
      if (eachBoard === id) {
        return true
      }
      return false
    })
    const colId = keys[boardIndex] 
    if (task !== '') {
      const newTask = {
        id: `task-${taskId}`,
        content: `${task}`,
        createdDate: new Date().toUTCString()
      }
      tasks[`task-${taskId}`] = newTask
      columns[colId].taskIds = [...columns[colId].taskIds,`task-${taskId}`]
      this.setState(prevState=>({
        columns,
        tasks,
        taskId:prevState.taskId+1
      }))
    }
  }


  onCreateBoard = () => {
    const {boardName, columns,columnOrder} = this.state
    if (boardName !== '') {
      const newBoardId = columnOrder.length+1
      columns[`column-${newBoardId}`] = {
        id: `column-${newBoardId}`,
        title:`${boardName}`,
        taskIds: [],
      }
      const updatedColumnOrder = [...columnOrder,`column-${newBoardId}`]
      console.log(columns)
      this.setState({
        columnOrder:updatedColumnOrder,
        columns,
        boardName: '',
      })
    }
  }

  changeBoardName = event => {
    this.setState({boardName : event.target.value})
  }

  onSaveBoard = () => {
    const {currentUserDetails} = this.state
    const currentUser= currentUserDetails[0].id
    localStorage.setItem(`${currentUser}-kanbanBoards`, JSON.stringify(this.state))
  }

  onUpdateBoardName=(boardId,newTitle)=>{
    const {columns} = this.state 
    columns[boardId].title =  newTitle
    this.setState({
      columns,
    })
  }

  onUpdateTask = (taskId,newTask)=>{
    if(newTask!==''){
        const {tasks} = this.state 
        tasks[taskId].content =  newTask
        this.setState({
            tasks
        })
    }
  }

  onClearAllBoards=()=>{
      this.setState({
        tasks: {},
        columns: {},
        columnOrder: [],
        boardName:'',
        taskId:1
      })
  }

  onLogout=()=>{
    const {history} = this.props
    history.replace('/login')
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInUserDetails')
  }

  render() {
    const {boardName,columnOrder,columns}=this.state
    const token = JSON.parse(localStorage.getItem('token'))
    if(!token){
        return <Redirect to="/login" />
    }
    return (
        <div>
             <nav className="nav-bar">  
                  <h1 className="nav-heading">Kanban Board</h1>
                  <button
                  type="button"
                  className="logout-btn all-btns"
                  onClick={this.onLogout}
                  >
                  Logout
                  </button>
  
            </nav>
            <div className="board-input-container">
                <input
                type="text"
                placeholder="Create Your Board"
                className="board-input"
                value={boardName}
                onChange={this.changeBoardName}
                />
                <button
                type="button"
                className="create-board-btn"
                onClick={this.onCreateBoard}
                >
                Create Board
                </button>
                <button
                type="button"
                className="save-board-btn all-btns"
                onClick={this.onSaveBoard}
                >
                Save
                </button>
                <button
                type="button"
                className="clear-board-btn all-btns"
                onClick={this.onClearAllBoards}
                >
                Clear all
                </button>
            </div>
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="boards-container">
                {columnOrder.map(columnId => {
                    const column = columns[columnId];
                    const tasks = column.taskIds.map(
                    taskId => this.state.tasks[taskId],
                    );
                    return <KanbanBoard 
                    addTask={this.onAddTask}
                    deleteTask={this.onDeleteTask}
                    deleteBoard={this.onDeleteBoard}
                    updateBoardName={this.onUpdateBoardName}
                    taskUpdate= {this.onUpdateTask}
                    key={column.id}
                    column={column} 
                    tasks={tasks} />;
                })}
                </div>
            </DragDropContext> 
        </div>
    );
  }
}
export default KanbanBoardApp


