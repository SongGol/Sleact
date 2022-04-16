import ChatBox from "@components/ChatBox";
import ChatList from '@components/ChatList';
import { Container, Header } from '@pages/Channel/styles';
import React, { useCallback } from 'react';
import useInput from '@hooks/useInput'

const Channel = () => {
    const [chat, onChangeChat, setChat] = useInput('');
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log("submit");
        setChat('');
    }, []);

    return (
        <Container>
            <Header>채널</Header>
            {/* <ChatList /> */}
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        </Container>
    )
};

export default Channel;
