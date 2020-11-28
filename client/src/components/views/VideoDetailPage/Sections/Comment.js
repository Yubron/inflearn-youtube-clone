import React, {useState} from 'react'
import Axios from 'axios'
import {useSelector} from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {
    
    const user = useSelector(state => state.user);
    
    const [commentValue, setCommentValue] = useState("")

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    
    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.postId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result);
                setCommentValue("");
                props.refreshFunction(response.data.result);
            } else {
                alert('failed to save comment');
            }
        })

    }

    return (
        <div>
            <br />
            <p> Replies </p> 
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId= {props.postId} />   
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} postId= {props.postId} />
                    </React.Fragment>
                )
            ))}
            

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="input comment"
                />

                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} > Submit </button>
            </form>
        </div>
    )
}

export default Comment
