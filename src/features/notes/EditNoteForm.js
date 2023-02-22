import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateNoteMutation, useDeleteNoteMutation } from './notesApiSlice'
import useAuth from '../../hooks/useAuth'

const EditNoteForm = ({ note, users }) => {
  const { isManager, isAdmin } = useAuth()

  const [updateNote, { isLoading, isSuccess, isError, error }] = useUpdateNoteMutation()

  const [deleteNote, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(note.title)
  const [text, setText] = useState(note.text)
  const [completed, setCompleted] = useState(note.completed)
  const [userId, setUserId] = useState(note.user)

  useEffect(() => {
    console.log(isSuccess)
    if (isSuccess || isDelSuccess) {
      setTitle('')
      setText('')
      setUserId('')
      navigate('/dash/notes')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onTextChanged = (e) => setText(e.target.value)
  const onCompletedChanged = (e) => setCompleted((prev) => !prev)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await updateNote({ id: note.id, title, text, completed, user: userId })
    }
  }
  const onDeleteNoteClicked = async (e) => {
    await deleteNote({ id: note.id })
  }

  const created = new Date(note.createdAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  const updated = new Date(note.updatedAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    )
  })

  let canSave = [title, text, userId].every(Boolean) && !isLoading

  const errClass = isError || isDelError ? 'errmsg' : 'offscreen'
  const validTitleClass = !title ? 'form__input--incomplete' : ''
  const validTextClass = !text ? 'form__input--incomplete' : ''

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

  let deleteButton = null
  if (isManager || isAdmin) {
    deleteButton = (
      <button className="icon-button" title="Delete" onClick={onDeleteNoteClicked}>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    )
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave} onClick={onSaveNoteClicked}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>

        <label htmlFor="title" className="form__label">
          Title:
        </label>
        <input
          type="text"
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          value={title}
          onChange={onTitleChanged}
        />

        <label htmlFor="text" className="form__label">
          Text:
        </label>
        <textarea
          className={`form__input ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <label htmlFor="note-completed" className="form__label">
          Work Completed:
        </label>
        <input
          className="form__checkbox"
          type="checkbox"
          id="note-completed"
          name="completed"
          value={completed}
          onChange={onCompletedChanged}
        />

        <label htmlFor="username" className="form__label">
          Assigned to:
        </label>
        <select className="form-select" id="note-username" name="userId" value={userId} onChange={onUserIdChanged}>
          {' '}
          {options}
        </select>

        <div className="form__divider">
          <p className="form__created">
            Created:
            <br />
            {created}
          </p>
          <p className="form__updated">
            Updated:
            <br />
            {updated}
          </p>
        </div>
      </form>
    </>
  )

  return content
}
export default EditNoteForm
