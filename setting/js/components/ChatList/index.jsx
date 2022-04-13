import { ChatZone, Section } from '@components/ChatList/styles';
import Chat from '@components/Chat';
import React from 'react';

const ChatList = ({ chatData }) => {
    return (
        <ChatZone>
            {chatData?.map((chat) => {
                <Chat key={chat.id} data={chat} />
            })}
        </ChatZone>
    );
};

export default ChatList;