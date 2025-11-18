

function Leaderboard({participants}) {

    const sortedParticipants = [...participants].sort((a, b) => {
    // 1. PRIMARY: Score (Descending)
    if (a.score !== b.score) {
        // Use standard comparison on numbers
        return b.score - a.score;
    }

    // 2. TIE-BREAKER: Time (Ascending) - Handle NULL/unfinished first
    
    // Check if both users haven't finished (total_time is null).
    if (a.total_time === null && b.total_time === null) {
        return 0;
    }
    // If user 'a' is null, push 'a' to the bottom (after 'b').
    if (a.total_time === null) {
        return 1; 
    }
    // If user 'b' is null, push 'b' to the bottom (before 'a').
    if (b.total_time === null) {
        return -1; 
    }

    // Both are valid numbers, sort by fastest time (ascending)
    return a.total_time - b.total_time;
});
    //console.log(participants);
    return(
        <>
        <h3>Leaderboard</h3>
        <br/>
        <ul>
        {participants.map((participant, index) => (
            <li className="leaderboard-list" key={participant.participant_id}>
                <span className="leaderboard-elements">{index+1}.</span>
                <span >{(participant?.email.slice(0, 7)+'...') || `Guest${index+1}`}</span>
                <span className="leaderboard-elements">{participant?.score ?? 0 }</span>
                {/* <span className="leaderboard-elements">{participant?.total_time ?? 0}</span> */}
            </li>
        ))}
        </ul>
        </>
    );
}

export default Leaderboard