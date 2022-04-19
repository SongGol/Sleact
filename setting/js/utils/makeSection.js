import dayjs from 'dayjs';

const makeSection = (chatList) => {
    const sections = {};
    chatList.forEach((chat) => {
        const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
        if (Array.isArray(sections[monthDate])) {
            sections[monthDate].push(chat);
        } else {
            sections[monthDate] = [chat];
        }
    });
    console.log(sections)

    return sections;
};

export default makeSection;