import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">GOSHEN Clothing</div>
                        <p>Celebrating African heritage through contemporary fashion. Handcrafted with love in Ghana.</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link href="#home">Home</Link></li>
                            <li><Link href="#products">Products</Link></li>
                            <li><Link href="#collections">Collections</Link></li>
                            <li><Link href="#reviews">Reviews</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul className="footer-links">
                            <li><a href="https://wa.me/233540402935" target="_blank">+233 540 402 935</a></li>
                            <li><a href="https://maps.app.goo.gl/DW1LGB21uhvnMoxH7" target="_blank">Visit Our Showroom</a></li>
                            <li><a href="https://www.instagram.com/goshenclothing_gh" target="_blank">@goshenclothing_gh</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <ul className="footer-links">
                            <li><a href="https://www.instagram.com/goshenclothing_gh" target="_blank">Instagram</a></li>
                            <li><a href="https://web.facebook.com/profile.php?id=100063884680815" target="_blank">Facebook</a></li>
                            <li><a href="https://wa.me/233540402935" target="_blank">WhatsApp</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Goshen Clothing. All rights reserved. Handcrafted in Ghana 🇬🇭</p>
                </div>
            </div>
        </footer>
    );
}
