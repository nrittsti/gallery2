import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {useContext, useMemo} from "react";

import {FilterContext} from "../context/GalleryContext.tsx";
import {allPhotos, getAvailableYears} from "../utils/photos.ts";

export default function Navigation() {
  const availableYears = useMemo(() => getAvailableYears(allPhotos), []);
  const {year, setYear} = useContext(FilterContext);
  const handleYearClick = (selectedYear: number | null) => {
    setYear(selectedYear);
  };
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="px-3 fixed-top">
      <Navbar.Brand>Nico's Photo Gallery</Navbar.Brand>
      <Navbar.Toggle/>
      <Navbar.Collapse>
        <Nav className="me-auto">
          {availableYears.map((yearValue) => (
            <Nav.Link
              key={yearValue}
              onClick={(e) => {
                e.preventDefault();
                handleYearClick(yearValue);
              }}
              active={year === yearValue}
            >
              {yearValue}
            </Nav.Link>
          ))}
          </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
