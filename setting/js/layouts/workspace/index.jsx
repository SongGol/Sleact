import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Link, Route, Router, useNavigate } from 'react-router-dom';
import { AddButton, Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceModal, WorkspaceName, Workspaces, WorkspaceWrapper } from './styles';
import Menu from '@components/Menu'
import Modal from '@components/modal'
import gravartar from 'gravatar';
import fetcher from '@utils/fetcher'
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast, ToastContainer } from 'react-toastify';
import useInput from '@hooks/useInput';
import useSWR from 'swr';

const Workspace = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    const { data: userData, error: loginError, mutate: revalidateUser } = useSWR('/api/users', fetcher);
    let navigate = useNavigate();

    // const dispatch = useDispatch();

    // let userData;

    // dispatch(getWorkspace())
    //     .then(response => {
    //         if (response.payload.success) {
    //             console.log(response.payload.workspace);
    //             userData = response.payload.workspace;
    //         } else {
    //             alert('Failed to sign up');
    //         }
    //     });

    // axios.get('/api/users/workspace')
    //         .then(response => {
    //         if (response.data.success === true) {
    //             console.log(response.data.workspace);
    //             userData = cloneDeep(response.data.workspace);
    //         } else {
    //             alert('Failed to sign up');
    //         }
    //     });

    const onLogoutHandler = useCallback(() => {
        axios
          .post('/api/users/logout')
          .then(() => {
            revalidateUser();
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center' });
          });
    }, []);

    //토글 함수
    const onClickUserProfile = useCallback((e) => {
        e.stopPropagation();
        setShowUserMenu((prev) => !prev);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    });

    const onCreateWorkspace = useCallback((e) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;
        axios.post('/api/workspaces', {
            workspace: newWorkspace,
            url: newUrl,
        }).then(() => {
            revalidateUser();
            setShowCreateWorkspaceModal(false);
            setNewWorkspace('');
            setNewUrl('');
        }).catch((err) => {
            console.dir(err);
        })
    }, []);

    const onCloseModal = useCallback(() => {

    }, []);

    console.log(`userData: ${userData}`)


    if (loginError) {
        navigate('/login');
        return <>rr</>;
    }

    return (
        <>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravartar.url(userData.email, { s: "28px", d: "retro"})} alt={userData.nickname} />
                    </span>
                    {showUserMenu &&
                        <Menu style={{right: 0, top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                <img scr={gravartar.url(userData.email, {s:"36px", d:"radio"})} alt={userData.nickname} />
                                <div>
                                    <span id="profile-name">{userData.nickname}</span>
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogoutHandler}>로그아웃</LogOutButton>
                        </Menu>}
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces.map((ws) => {
                        console.log("map" + ws)
                        return (
                            <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkspace}></AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName>
                        Sleact
                    </WorkspaceName>
                    <MenuScroll>
                        {/* <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top:95, left:80}}>
                            <WorkspaceModal>
                                
                            </WorkspaceModal>
                        </Menu>
                        <ChannelList userData={userData}/>
                        <DMList userData={userData}/> */}
                    </MenuScroll>
                </Channels>
                <Chats>
                    chat
                    {/* <Router>
                        <Routes>
                            <Route path="/workspace/channel" element={Auth(Channel, true)}>
                            </Route>
                            <Route path="/workspace/dm" element={Auth(DirectMessasge, true)}>
                            </Route>
                        </Routes>
                    </Router> */}
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id='workspace-label'>
                        <span>워크스페이스 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}></Input>
                    </Label>
                    <Label id='workspace-url-label'>
                        <span>워크스페이스 url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}></Input>
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
        </>
    );
};

export default Workspace;