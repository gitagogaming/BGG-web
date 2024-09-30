export default function Replays() {
    const replayInputs = Array.from({ length: 50 }, (_, index) => (
        <input key={index} type="text" placeholder={`Replay Input ${index + 1}`} className="form-control mb-2" />
    ));

    return (
        <div>
            <h2>Replays</h2>
            <form>
                {replayInputs}
            </form>
        </div>
    );
}