import {memo} from "react";
import Container from 'react-bootstrap/Container';
import './footer.css'

const Footer = memo(function Footer() {
  console.log("Footer Render")
  return (
    <footer className="bg-dark text-light py-3">
      <Container
        className="
          d-flex
          flex-column flex-md-row
          justify-content-center
          align-items-center
          gap-2 gap-md-4
        "
      >
        <div className="text-center text-md-start">
          © {new Date().getFullYear()} Nico Rittstieg
        </div>

        <div className="d-flex gap-3">
          <a
            href="https://pixelfed.social/fotozeit"
            className="text-light d-flex align-items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-image"/>
            Pixelfed
          </a>

          <a
            href="https://www.instagram.com/claudi_und_nico"
            className="text-light d-flex align-items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-instagram"/>
            Instagram
          </a>

          <a
            href="https://github.com/nrittsti"
            className="text-light d-flex align-items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-github"/>
            GitHub
          </a>
        </div>

        <div className="text-center text-md-end">
          All photos are under CC BY-NC-ND licence
        </div>
      </Container>
    </footer>
  );
});

export default Footer;
