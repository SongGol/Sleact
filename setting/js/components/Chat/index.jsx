import React from 'react';
import gravatar from 'gravatar';
import { ChatWrapper } from '@components/Chat/styles';

const Chat = ({ key, data }) => {
    const user = data.Sender;
    console.log(`chat component user: ${user}`)

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