import dayjs from 'dayjs';

const makeSection = (chatList) => {
    const sections = {};
    chatList.forEach((chat) => {
        const monthDate = dayjs(chat.create).format('YYYY-MM-DD');
        if (Array.isArray(sections[monthDate])) {
            sections[monthDate].push(chat);
        } else {
            sections[monthDate] = [chat];
        }
    });

    return sections;
};

export default makeSection;