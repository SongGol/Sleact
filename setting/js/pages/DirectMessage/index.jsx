import React, { useCallback, useRef } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import makeSection from '@utils/makeSection';
import useSWR, { useSWRInfinite } from 'swr';
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
            axios
                .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                    content: chat,
                })
                .then(() => {
                    mutateChat();
                    setChat('');
                    
                })
                .catch(console.error);
        }
    }, [chat]);

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
            <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd} />
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
    )
};

export default DirectMessage;