

function Leaderboard({participants}) {

    const sortedParticipants = [...participants].sort((a, b) => {
    // 1. PRIMARY: Score (Descending)
    if (a.score !== b.score) {
        return b.score - a.score;
    }
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
        <h3 className="lb-title">Leaderboard</h3>
      <ul className="lb-list">
        {sortedParticipants.map((participant, index) => (
          <li className="lb-row" key={participant.participant_id}>
            <span className="lb-rank">{index + 1}.</span>
            <span className="lb-name">
              {participant?.email
                ? participant.email.split("@")[0].slice(0, 10) + "..."
                : `Guest${index + 1}`}
            </span>
            <span className="lb-score">{participant?.score ?? 0}</span>
          </li>
        ))}
      </ul>
        </>
    );
}

export default Leaderboard