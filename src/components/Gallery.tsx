import {useContext} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";

import {usePhotos} from "../hooks/usePhotos.tsx";
import {LightboxContext} from "../context/GalleryContext.tsx";

import './gallery.css'


export default function Gallery() {
  const photos = usePhotos();
  const {setShow: setShowLightbox, setIndex: setIndexLightbox} = useContext(LightboxContext);
  const openLightbox = (index: number) => {
    setIndexLightbox(index);
    setShowLightbox(true);
  }
  return (
    <>
      <Container className="my-4">
        <Row className="g-3 pt-5"> {photos.map((photo, index) => (
          <Col key={`${photo.file}-${index}`} xs={12} sm={6} md={4} lg={3}>
            <Card className="rounded-0 gallery-card">
              <Card.Img src={photo.grid}
                        alt={photo.createdate}
                        className="rounded-0"
                        loading="lazy"
                        onClick={() => openLightbox(index)}
                        style={{cursor: "pointer"}}/>
            </Card>
          </Col>))}
        </Row>
      </Container>
    </>
  );
}
