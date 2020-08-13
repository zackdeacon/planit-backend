import React from 'react'
import {Row, Col} from 'antd'
import "./landingcontent.css"

export default function LandingContent() {
    return (
        <>
        <div className="vid-container">
            <video autoPlay="autoplay" loop="loop" muted className="vid">
                <source src="./assets/video/planit.mp4" type="video/mp4" />
            </video>
            <div className="filter-div">
                <Row justify="center" className="content" >
                    <Col xs={{span: 8}}className="header-container">
                        <Row justify="center">
                            <img className="our-world" src="./assets/images/ourworld.png" alt="our world"/>
                        </Row>
                        <Row justify="center">
                            <img className="your-plan" src="./assets/images/yourplan.png" alt="your plan"/>
                        </Row>
                    </Col>
                    <Col md={{span: 3}} xs={{span: 4}}>
                        <img src="./assets/logos/logo.png" alt="logo"/> 
                    </Col>
                </Row>
            </div>
        </div>
        </>
    )
}
