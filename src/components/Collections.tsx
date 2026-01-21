const COLLECTIONS = [
    {
        title: "Casual Elegance",
        count: "8 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.05.jpeg",
    },
    {
        title: "Evening Glamour",
        count: "6 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.06.jpeg",
    },
    {
        title: "Signature Prints",
        count: "12 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.07.jpeg",
    },
    {
        title: "Luxury Line",
        count: "5 Pieces",
        image: "WhatsApp Image 2025-12-30 at 12.12.08.jpeg",
    },
    {
        title: "New Arrivals",
        count: "10 Pieces",
        image: "aaaaaaa.jpeg",
    }
];

export default function Collections() {
    return (
        <section className="collections" id="collections">
            <div className="container">
                <div className="section-header">
                    <h2>Explore Our Collections</h2>
                    <p>Browse through our curated lookbooks featuring different styles and occasions.</p>
                </div>

                <div className="collections-grid">
                    {COLLECTIONS.map((c, i) => (
                        <div key={i} className="collection-item">
                            <img src={`/images/goshen/${c.image}`} alt={c.title} />
                            <div className="collection-overlay">
                                <h3 className="collection-title">{c.title}</h3>
                                <span className="collection-count">{c.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
