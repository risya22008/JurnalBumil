function getSevenDaysAgoDate () {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const pad = (n) => n.toString().padStart(2, '0');
    const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const sevenDaysAgoStr = formatDate(sevenDaysAgo);
    return sevenDaysAgoStr;
}

module.exports = { getSevenDaysAgoDate }