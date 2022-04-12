import Modal from '@components/Modal';
import React, { useCallback } from 'react';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { toast } from 'react-toastify';

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }) => {
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    const { workspace, channel } = useParams();

    const { data: userData, error: loginError, revalidate: revalidateUser } = useSWR('/api/users', fetcher);
    const { data: channelData, mutate: revalidateChannel } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

    const onCreateChannel = useCallback((e) => {
        e.preventDefault();

        axios.post(`/api/workspaces/${workspace}/channels`, {
            name: newChannel,
        }, {
            withCredentials: true,
        }).then(() => {
            setShowCreateChannelModal(false);
            revalidateChannel();
            setNewChannel('');
        }).catch((err) => {
            console.dir(err);
            toast.error(err.response?.data, {position: 'bottom-center'});
        })
    }, [newChannel]);

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id='channel-label'>
                    <span>채널</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel}></Input>
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    )
};

export default CreateChannelModal;