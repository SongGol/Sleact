import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { Scrollbars } from 'react-custom-scrollbars';
import Chat from '@components/Chat';
import React, { useCallback } from 'react';

const ChatList =({ chatSections, setSize, isEmpty, isReachingEnd, scrollRef }) => {
    const onScroll = useCallback((values) => {
        if (values.scrollTop === 0 && !isReachingEnd) {
            //가장 위에서 데이터 로딩
            setSize((prevSize) => prevSize + 1)
                .then(() => {
                    //스크롤 위치 유지
                    scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight);
                })
        }
    }, []);

    return (
        <ChatZone>
            <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
            {Object.entries(chatSections).map(([date, chats]) => {
                return (
                    <Section className={`section-${date}`} key={date}>
                        <StickyHeader>
                            <button>{date}</button>
                        </StickyHeader>
                        {chats?.map((chat) => 
                            <Chat key={chat.id} data={chat} />
                        )}
                    </Section>
                );
            })}
            </Scrollbars>
        </ChatZone>
    );
};

export default ChatList;