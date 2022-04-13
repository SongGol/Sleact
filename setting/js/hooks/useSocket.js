import io from 'socket.io-client';
import { useCallback } from 'react';
import axios from 'axios';

const backUrl = 'http://localhost:3095';

const sockets = {};

const useSocket = ({ workspace }) => {
    const disconnect = useCallback(() => {
        if (workspace) {
            sockets[workspace].disconnect();
            delete sockets[workspace];
        }
    }, [workspace]);

    if (!workspace) {
        return [undefined, disconnect];
    }

    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);

    return [sockets[workspace], disconnect];
};

export default useSocket;