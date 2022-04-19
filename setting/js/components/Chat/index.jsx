import React, { memo, useMemo } from 'react';
import gravatar from 'gravatar';
import { ChatWrapper } from '@components/Chat/styles';
import regexifyString from 'regexify-string';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';
const Chat = ({ data }) => {
    const user = 'Sender' in data ? data.Sender : data.User;
    const { workspace } = useParams();

    console.log(`in chat ${data}`)

    const result = useMemo(() => 
        data.content.startsWith('uploads\\') ? 
        (<img src={`${BACK_URL}/${data.content}`} style={{maxHeight: 200}}/>) :
        (regexifyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
            const arr = match.match(/@\[(.+?)]\((\d+?)\)/);
            if (arr) {
                return (
                    <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`} >
                        @{arr[1]}
                    </Link>
                );
            }
            return <br key={index} />
        }
    }), [data.content]));

    return (
        <ChatWrapper>
            <div className="chat-img">
                <img src={gravatar.url(user.email, { s: '36px', d: 'retro'})} alt={user.nickname} />
            </div>
            <div className="chat-text">
                <div className="chat-user">
                    <b>{user.nickname}</b>
                    <span>{dayjs(data.createdAt).format('h:mm A')}</span>
                </div>
                <p>{result}</p>
            </div>
        </ChatWrapper>
    )
};

export default memo(Chat);