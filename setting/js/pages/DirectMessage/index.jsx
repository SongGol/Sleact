import React, { useCallback, useEffect, useRef } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import makeSection from '@utils/makeSection';
import useSWR, { mutate, useSWRInfinite } from 'swr';
import gravatar from 'gravatar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DirectMessage = () => {
    const { workspace, id } = useParams();
    const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
    const { data: myData } = useSWR('/api/users', fetcher);
    const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`, fetcher);
    console.log(`Direct Message component chat data: ${chatData}`)
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
    
    const [chat, onChangeChat, setChat] = useInput('');
    const scrollbarRef = useRef(null);

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log(chat);
        if (chat?.trim() && chatData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    content: savedChat,
                    SenderId: myData.id,
                    Sender: myData,
                    ReceiverId: userData.id,
                    Receiver: userData,
                    createdAt: new Date(),
                });
                return prevChatData;
            }, false)
                .then(() => {
                    setChat('');
                    scrollbarRef.current?.scrollToBottom();
                });
            axios
                .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                    content: chat,
                })
                .then(() => {
                    //mutateChat();
                })
                .catch(console.error);
        }
    }, [chat, chatData, myData, userData, workspace, id]);

    //로딩시 스크롤바 제일 아래로
    useEffect(() => {
        if (chatData?.length === 1) {
            scrollbarRef.current?.scrollToBottom();
        }
    }, []);

    if (!userData || !myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat()?.reverse() : []);

    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, {s: "24px", d: 'retro'})} alt={userData.nickname}/>
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd} />
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
    )
};

export default DirectMessage;