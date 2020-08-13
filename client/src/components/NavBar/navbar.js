import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import 'antd/dist/antd.css';
import "./navbar.css"

export default function Navbar() {
    const [menuBtn, setMenuBtn] = useState({
        menuOpen: false,
        menuClass: "menu-btn",
        linksClass: "nav-links",
    })

    const handleHamburgerClick = () => {
        if (!menuBtn.menuOpen) {
            setMenuBtn({
                menuOpen: !menuBtn.menuOpen,
                menuClass: "menu-btn open",
                linksClass: "nav-links open"
            })
        } else {
            setMenuBtn({
                menuOpen: !menuBtn.menuOpen,
                menuClass: "menu-btn",
                linksClass: "nav-links"
            })
        }
    }

    return (
        <>
        <div className="wrapper">
            <Row justify="end">
                <Col className={menuBtn.menuClass} onClick={handleHamburgerClick}>
                    <div className="menu-btn_burger"></div>
                </Col>
            </Row>
            <Col className={menuBtn.linksClass}>
                <Row justify="end" className="">
                    <Button type="text" href="/account" className="nav-btns">Account</Button>
                </Row>
                <Row justify="end" className="">
                    <Button type="text" href="/cartographer" className="nav-btns">New Map</Button>
                </Row>
                <Row justify="end" className="">
                    <Button type="text" href="/#login" className="nav-btns">Login</Button>
                </Row>
            </Col>
        </div>
        </>
    )
}
