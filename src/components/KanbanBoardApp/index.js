import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import {Redirect} from 'react-router-dom'
import {DragDropContext} from 'react-beautiful-dnd'
import KanbanBoard from '../KanbanBoard'
import './index.css'

class KanbanBoardApp extends Component {
  state = {
    columns: [],
    currentUserId: '',
    boardName: '',
  }

  getBoardIndex = id => {
    const {columns} = this.state
    return columns.findIndex(eachBoard => {
      if (eachBoard.id === id) {
        return true
      }
      return false
    })
  }

  componentDidMount() {
    this.getCurrentUserDetailsFromLocalStorage()
  }

  getCurrentUserDetailsFromLocalStorage = () => {
    const parsedUserDetails = JSON.parse(
      localStorage.getItem('loggedInUserDetails'),
    )

    this.setState(
      {
        currentUserId: parsedUserDetails,
      },
      this.getBoardDetailsFromLocalStorage,
    )
  }

  getBoardDetailsFromLocalStorage = () => {
    const {currentUserId} = this.state
    localStorage.removeItem('loggedInUserDetails')
    const stringifiedData = localStorage.getItem(
      `${currentUserId}-kanbanBoards`,
    )
    const parsedData = JSON.parse(stringifiedData)
    if (parsedData === null) {
      this.setState({
        columns: [],
        boardName: '',
      })
    } else {
      this.setState(parsedData)
    }
  }

  onDragEnd = result => {
    const {destination, source} = result
    const {columns} = this.state

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    const startBoardIndex = this.getBoardIndex(source.droppableId)
    const finishBoardIndex = this.getBoardIndex(destination.droppableId)
    const start = columns[startBoardIndex]
    const finish = columns[finishBoardIndex]
    if (start === finish) {
      const newTasks = Array.from(start.tasks)
      newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, start.tasks[source.index])
      columns[startBoardIndex].tasks = newTasks
      this.setState({
        columns,
      })
    } else {
      const startTasks = Array.from(start.tasks)
      startTasks.splice(source.index, 1)
      const finishTasks = Array.from(finish.tasks)
      finishTasks.splice(destination.index, 0, start.tasks[source.index])
      columns[startBoardIndex].tasks = startTasks
      columns[finishBoardIndex].tasks = finishTasks
      this.setState({
        columns,
      })
    }
  }

  onDeleteBoard = id => {
    const {columns} = this.state
    const updatedColumn = columns.filter(eachCol => eachCol.id !== id)
    this.setState({
      columns: updatedColumn,
    })
  }

  onDeleteTask = (boardId, taskId) => {
    const {columns} = this.state

    const boardIndex = this.getBoardIndex(boardId)

    const updateBoardTasks = columns[boardIndex].tasks.filter(
      eachTask => eachTask.id !== taskId,
    )
    columns[boardIndex].tasks = updateBoardTasks
    this.setState({
      columns,
    })
  }

  onAddTask = (task, id) => {
    const {columns} = this.state
    const boardIndex = this.getBoardIndex(id)

    if (task !== '') {
      const newTask = {
        id: uuidv4(),
        content: `${task}`,
        createdDate: new Date().toUTCString(),
      }
      columns[boardIndex].tasks = [...columns[boardIndex].tasks, newTask]
      this.setState({
        columns,
      })
    }
  }

  onCreateBoard = () => {
    const {boardName, columns} = this.state
    if (boardName !== '') {
      const newColumn = {
        id: uuidv4(),
        title: `${boardName}`,
        tasks: [],
      }
      const updatedColumn = [...columns, newColumn]
      console.log(columns)
      this.setState({
        columns: updatedColumn,
        boardName: '',
      })
    }
  }

  changeBoardName = event => {
    this.setState({boardName: event.target.value})
  }

  onSaveBoard = () => {
    const {currentUserId} = this.state
    localStorage.setItem(
      `${currentUserId}-kanbanBoards`,
      JSON.stringify(this.state),
    )
  }

  onUpdateBoardName = (boardId, newTitle) => {
    const {columns} = this.state
    const boardIndex = this.getBoardIndex(boardId)
    columns[boardIndex].title = newTitle
    this.setState({
      columns,
    })
  }

  onUpdateTask = (taskId, boardId, newTask) => {
    const {columns} = this.state
    if (newTask !== '') {
      const boardIndex = this.getBoardIndex(boardId)
      const taskIndex = columns[boardIndex].tasks.findIndex(eachTask => {
        if (eachTask.id === taskId) {
          return true
        } else {
          return false
        }
      })
      columns[boardIndex].tasks[taskIndex].content = newTask
      this.setState({
        columns,
      })
    }
  }

  onClearAllBoards = () => {
    this.setState({
      columns: [],
      boardName: '',
    })
  }

  onLogout = () => {
    const {history} = this.props
    history.replace('/login')
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInUserDetails')
  }

  render() {
    const {boardName, columns} = this.state
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <nav className="nav-bar">
          <img
            src="https://res.cloudinary.com/dkr26vkii/image/upload/v1627464184/rekconsys_logo_ksujqs.jpg"
            className="nav-logo"
            alt="website logo"
          />
          <button
            type="button"
            className="logout-btn all-btns"
            onClick={this.onLogout}
          >
            Logout
          </button>
        </nav>
        <div className="board-input-container">
          <div className="input-and-btns-container">
            <h1 className="kanban-boards-heading">Create Your Boards</h1>
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
              {columns.map(eachColumn => (
                <KanbanBoard
                  addTask={this.onAddTask}
                  deleteTask={this.onDeleteTask}
                  deleteBoard={this.onDeleteBoard}
                  updateBoardName={this.onUpdateBoardName}
                  taskUpdate={this.onUpdateTask}
                  key={eachColumn.id}
                  column={eachColumn}
                  tasks={eachColumn.tasks}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    )
  }
}
export default KanbanBoardApp
