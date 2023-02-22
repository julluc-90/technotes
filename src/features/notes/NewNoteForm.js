import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddNewNoteMutation } from './notesApiSlice'

const NewNoteForm = ({ users }) => {
  const [addNote, { isLoading, isSuccess, isError, error }] = useAddNewNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [userId, setUserId] = useState(users[0].id)

  useEffect(() => {
    console.log(isSuccess)
    if (isSuccess) {
      setTitle('')
      setText('')
      setUserId('')
      navigate('/dash/notes')
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onTextChanged = (e) => setText(e.target.value)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await addNote({ title, text, user: userId })
    }
  }

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    )
  })

  let canSave = [title, text, userId].every(Boolean) && !isLoading

  const errClass = isError ? 'errmsg' : 'offscreen'
  const validTitleClass = !title ? 'form__input--incomplete' : ''
  const validTextClass = !text ? 'form__input--incomplete' : ''

  const errContent = error?.data?.message ?? ''

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave} onClick={onSaveNoteClicked}>
              <FontAwesomeIcon icon={faSave} />
            </button>
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

        <label htmlFor="username" className="form__label form__checkbox-containter">
          Assigned to:
        </label>
        <select className="form-select" id="note-username" name="userId" value={userId} onChange={onUserIdChanged}>
          {' '}
          {options}
        </select>
      </form>
    </>
  )

  return content
}
export default NewNoteForm
