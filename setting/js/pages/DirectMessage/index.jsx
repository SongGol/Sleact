import React, { useCallback } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import gravatar from 'gravatar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DirectMessage = () => {
    const { workspace, id } = useParams();
    const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
    const { data: myData } = useSWR('/api/users', fetcher);
    const { data: chatData, mutate: mutateChat, setSize } = useSWR(
        `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`, fetcher);
    
    const [chat, onChangeChat, setChat] = useInput('');

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        if (chat?.trim() && chatData) {
            axios
                .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                    content: chat,
                })
                .then(() => {
                    setChat('');
                    mutateChat();
                })
                .catch(console.error);
        }
    }, [chat]);

    if (!userData || !myData) {
        return null;
    }

    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, {s: "24px", d: 'retro'})} alt={userData.nickname}/>
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatData={chatData}/>
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
        </Container>
    )
};

export default DirectMessage;