import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import Chat from '@components/Chat';
import React, { useCallback, useRef } from 'react';

const ChatList = ({ chatSections }) => {
    const scrollbarRef = useRef(null);
    const onScroll = useCallback(() => {

    }, []);


    return (
        <ChatZone>
            <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
            {Object.entries(chatSections).map(([date, chats]) => {
                return (
                    <Section className={`section-${date}`} key={date}>
                        <StickyHeader>
                            <button>{date}</button>
                        </StickyHeader>
                        {chats?.map((chat) => {
                            <Chat key={chat.id} data={chat} />
                        })}
                    </Section>
                )
            })}
            </Scrollbars>
        </ChatZone>
    );
};

export default ChatList;