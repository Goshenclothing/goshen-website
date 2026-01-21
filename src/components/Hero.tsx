import Link from 'next/link';

const HERO_IMAGES = [
    'WhatsApp Image 2025-12-30 at 12.12.45.jpeg',
    'WhatsApp Image 2025-12-30 at 12.12.4jj.jpeg',
    'WhatsApp Image 2025-12-30 at 12.12.46.jpeg',
    'WhatsApp Image 2025-12-30 at 12.12.47.jpeg'
];

export default function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero-images">
                {HERO_IMAGES.map((img, i) => (
                    <img
                        key={i}
                        src={`/images/goshen/${img}`}
                        alt="African Fashion"
                        className="floating-img"
                    />
                ))}
            </div>

            <div className="hero-content">
                <span className="hero-badge">✨ Handcrafted in Ghana</span>
                <h1>Embrace the <span className="highlight">Beauty</span> of African Fashion</h1>
                <p className="hero-description">
                    Discover our exquisite collection of handcrafted African kimonos and contemporary designs.
                    Each piece tells a story of heritage, elegance, and modern sophistication.
                </p>
                <div className="hero-buttons">
                    <Link href="#products" className="btn btn-primary">Explore Collection</Link>
                    <Link href="#contact" className="btn btn-secondary">Visit Showroom</Link>
                </div>
            </div>
        </section>
    );
}
