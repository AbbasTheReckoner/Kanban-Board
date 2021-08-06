import {MdCancel} from 'react-icons/md'
import styled from 'styled-components'
import {Draggable} from 'react-beautiful-dnd'
import {BsPencilSquare} from 'react-icons/bs'
import './index.css'

const Container = styled.div`
  border: 1px solid lightgrey;
  display: flex;
  justify-content: space-between;
  min-height: 80px;
  width: 220px;
  border-radius: 2px;
  padding: 6px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
`

const kanbanTask = props => {
  const {task, index, columnId, deleteTask, updateTask} = props
  const {id, content, createdDate} = task

  const deletingTask = () => {
    deleteTask(columnId, id)
  }

  const updatingTask = () => {
    updateTask(id)
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div className="task-and-time">
            {content}
            <p className="created-date">
              Created at: <br />
              {createdDate}
            </p>
          </div>
          <div className="icons-container">
            <BsPencilSquare
              className="update-task-icon"
              id="editIcon"
              onClick={updatingTask}
            />
            <span id="onhoverEdit">Edit Task</span>
            <MdCancel onClick={deletingTask} className="task-del-icon" />
          </div>
        </Container>
      )}
    </Draggable>
  )
}

export default kanbanTask
