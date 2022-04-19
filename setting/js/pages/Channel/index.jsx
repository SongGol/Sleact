import ChatBox from "@components/ChatBox";
import ChatList from '@components/ChatList';
import InviteChannelModal from '@components/InviteChannelModal';
import { Container, Header } from '@pages/Channel/styles';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useInput from '@hooks/useInput'
import useSocket from '@hooks/useSocket';
import makeSection from '@utils/makeSection';
import fetcher from '@utils/fetcher';
import useSWR, { useSWRInfinite } from 'swr';
import axios from 'axios';

const Channel = () => {
    const { workspace, channel } = useParams();
    const { data: myData } = useSWR('/api/users', fetcher);
    const { data: channelData } = useSWR(
        `/api/workspaces/${workspace}/channels/${channel}`
        , fetcher
    );
    const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite(
        (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`
        , fetcher
    );
    const { data: channelMembersData } = useSWR(
        myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
        fetcher
    );

    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
    const [chat, onChangeChat, setChat] = useInput('');
    const scrollbarRef = useRef(null);

    const [socket] = useSocket(workspace);

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log(chat);
        if (chat?.trim() && chatData && channelData) {
            const savedChat = chat;
            mutateChat((prevChatData) => {
                prevChatData?.[0].unshift({
                    id: (chatData[0][0]?.id || 0) + 1,
                    content: savedChat,
                    UserId: myData.id,
                    User: myData,
                    ChannelId: channelData.id,
                    Channel: channelData,
                    createdAt: new Date(),
                });
                return prevChatData;
            }, false)
                .then(() => {
                    setChat('');
                    scrollbarRef.current?.scrollToBottom();
                });
            axios
                .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
                    content: chat,
                })
                .then(() => {
                    revalidate();
                })
                .catch(console.error);
        }
    }, [chat, chatData, myData, channelData, workspace, channel]);

    //로딩시 스크롤바 제일 아래로
    useEffect(() => {
        if (chatData?.length === 1) {
            scrollbarRef.current?.scrollToBottom();
        }
    }, [chatData]);

    const onMessage = useCallback((data) => {
        if (data.Channel.name === channel && data.UserId !== myData?.id) {
            mutateChat((chatData) => {
                chatData?.[0].unshift(data);
                return chatData;
            }, false).then(() => {
                if (scrollbarRef.current) {
                    if (scrollbarRef.current.getScrollHeight()
                        < scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150) {
                        setTimeout(() => {
                            scrollbarRef.current?.scrollToBottom();
                        }, 50);
                    }
                }
            })
        }
    }, [channel, myData]);

    useEffect(() => {
        socket?.on('message', onMessage);
        return () => {
            socket?.off('message', onMessage);
        }
    }, [socket, onMessage])

    const onClickInviteChannel = useCallback(() => {
        setShowInviteChannelModal(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setShowInviteChannelModal(false);
    }, [])

    if (!myData || !myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat()?.reverse() : []);

    return (
        <Container>
            <Header>
                <span>#{channel}</span>
                <div style={{}}>
                    <span>{channelMembersData?.length}</span>
                    <button
                        onClick={onClickInviteChannel}
                        className="c-button-unstyled p-ia__view_header__button"
                        aria-label="Add people to #react-native"
                        data-sk="tooltip_parent"
                        type="button"
                    >
                        <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
                    </button>
                </div>
            </Header>
            <ChatList chatSections={chatSections} scrollRef={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd} />
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}/>
            <InviteChannelModal 
                show={showInviteChannelModal}
                onCloseModal={onCloseModal}
                setShowInviteChannelModal={setShowInviteChannelModal}
            />
        </Container>
    );
};

export default Channel;
