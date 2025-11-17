

function Leaderboard({participants}) {

    participants.sort((a, b) => {
        if(a == null) a = Infinity
        if(a.score !== b.score) return b.score-a.score;
        if (a.total_time === null && b.total_time === null) {
            return 0; // Dono barabar hain
        }
        if (a.total_time === null) {
            return 1; // 'a' ko "infinity" maano, usse 'b' ke baad rakho
        }
        if (b.total_time === null) {
            return -1; // 'b' ko "infinity" maano, usse 'a' ke baad rakho
        }
    });
    console.log(participants);
    return(
        <>
        <h3>Leaderboard</h3>
        <br/>
        <ul>
        {participants.map((participant, index) => (
            <li className="leaderboard-list" key={participant.participant_id}>
                <span className="leaderboard-elements">{index+1}.</span>
                <span >{participant?.email?? `Guest${index+1}`}</span>
                <span className="leaderboard-elements">{participant?.score ?? 0 }</span>
                <span className="leaderboard-elements">{participant?.total_time ?? 0}</span>
            </li>
        ))}
        </ul>
        </>
    );
}

export default Leaderboard