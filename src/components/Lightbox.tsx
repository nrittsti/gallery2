import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useEffect, useState } from "react";

import { usePhotos } from "../hooks/usePhotos.tsx";
import { LightboxContext } from "../context/GalleryContext.tsx";

import "./lightbox.css";

export default function Lightbox() {
  const photos = usePhotos();
  const { show, setShow, index, setIndex } = useContext(LightboxContext);

  const close = useCallback(() => {
    setShow(false);
    setIndex(0);
  }, [setShow, setIndex]);

  const next = useCallback(() => {
    setIndex(Math.min(index + 1, photos.length - 1));
  }, [setIndex, index, photos.length]);

  const prev = useCallback(() => {
    setIndex(Math.max(index - 1, 0));
  }, [setIndex, index]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!show) {
        return;
      }
      switch (event.key) {
        case "Escape":
          close();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "ArrowRight":
          next();
          break;
        case " ":
          next();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, next, prev, close]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > 50) {
      next(); // Swipe nach links → nächstes Bild
    }

    if (distance < -50) {
      prev(); // Swipe nach rechts → vorheriges Bild
    }
  };

  const photo = photos[index];

  const valueOrFallback = (val: string | undefined | null): string => {
    return val?.trim() || "\u2014";
  };

  return (
    <Modal show={show} onHide={close} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>
          Photo {index + 1} of {photos.length}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="d-flex flex-column flex-lg-row justify-content-center gap-2">
        {/* Photo */}
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <img
            src={photo.lightbox}
            alt={photo.file}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* EXIF-Metadata */}
        <div className="flex-row" style={{ minWidth: "240px" }}>
          <div className="exif-label">Photo was taken</div>
          <div className="exif-value">{valueOrFallback(photo.createdate)}</div>

          <div className="pt-1 exif-label">Body</div>
          <div className="exif-value">{valueOrFallback(photo.cameramodelname)}</div>

          <div className="pt-1 exif-label">Lens</div>
          <div className="exif-value">{valueOrFallback(photo.lensmodel)}</div>

          <div className="pt-1 exif-label">Focal length 35mm equivalent</div>
          <div className="exif-value">{valueOrFallback(photo.focallengthin35mmformat)}</div>

          <div className="pt-1 exif-label">Aperture</div>
          <div className="exif-value">{valueOrFallback(photo.aperturevalue)}</div>

          <div className="pt-1 exif-label">Exposure</div>
          <div className="exif-value">{valueOrFallback(photo.exposuretime)}</div>

          <div className="pt-1 exif-label">ISO</div>
          <div className="exif-value">{valueOrFallback(photo.iso)}</div>

          <div className="pt-1 exif-label">Flash</div>
          <div className="exif-value">{valueOrFallback(photo.flash)}</div>

          <div className="pt-1 exif-label">Copyright</div>
          <div className="exif-value">CC BY-NC-ND</div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between lightbox-footer">
        <Button type="button" variant="secondary" onClick={prev} disabled={index === 0}>
          ← Previous
        </Button>

        <Button type="button" variant="secondary" onClick={next} disabled={index === photos.length - 1}>
          Next →
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
