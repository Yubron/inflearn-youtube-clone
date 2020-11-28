import React, {useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd'
import {useSelector} from 'react-redux'
import Axios from 'axios'
import LikeDislikes from './LikeDislikes'

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [OpenReply, setOpenReply] = useState(false);
    const [commentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    };

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value);
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result);
                setCommentValue("");
                setOpenReply(false);
                props.refreshFunction(response.data.result);
            } else {
                alert('failed to save comment');
            }
        })
    };

    const actions = [
        <LikeDislikes  userId={localStorage.getItem('userId')}  commentId={props.comment._id} />
        ,<span onClick={onClickReplyOpen} key="comment-z-reply-to"> Reply to </span>
    ]


    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image}  alt  />}
                content={ <p> {props.comment.content} </p> }
            />
            {OpenReply && 
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={commentValue}
                        placeholder="input comment"

                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} > Submit </button>
                </form>
            }

        </div>
    )
}

export default SingleComment
