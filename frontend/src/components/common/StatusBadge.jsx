export default function StatusBadge({ status }) {
    const s = status?.toLowerCase().replace(' ', '-');
    return (
        <span className={`badge status-${s}`} style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
            {status}
        </span>
    );
}