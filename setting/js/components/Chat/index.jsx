import React from 'react';
import { ChatWrapper } from '@components/Chat/styles';

const Chat = ({ data }) => {
    const user = data.Sender;

    return (
        <ChatWrapper>
            <div className="chat-img">
                <img src={gravatar.url(user.email, { s: '36px', d: 'retro'})} alt={user.nickname} />
            </div>
            <div className="chat-text">
                <div className="chat-user">
                    <b>{user.nickname}</b>
                    <span>{data.createdAt}</span>
                </div>
                <p>{data.content}</p>
            </div>
        </ChatWrapper>
    )
};

export default Chat;