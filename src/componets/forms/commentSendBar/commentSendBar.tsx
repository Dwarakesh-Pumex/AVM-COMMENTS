import './CommentSendBar.css'
import TextInput from '../inputs/TextInput/TextInput';
import attachmentIcon from '../../../assets/images/comments/attachment.svg'

function CommentSendBar(){
    return(
   <div className="comment-box">
  <button className="comment-box-attachment-button"><img src={attachmentIcon} alt="edit" /></button>
  <TextInput name="email"
                id="comment"
                placeholder="Add a Comment"
                type="comment"
                required
                className='comment-input'
  />
  <button className="send-button">Send</button>
  <button className="cancel-button">Cancel</button>
</div>

    )
}
export default CommentSendBar;