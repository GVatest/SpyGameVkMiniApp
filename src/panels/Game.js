import React from 'react';
import * as _ from 'underscore'
import { Panel, Group, Gallery, Header, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

Array.prototype.sample = function() {
    return this[Math.floor(Math.random()*this.length)];
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = 
            {styles: {
                "galary": {
                    height: "100%",
                    borderRadius: "20px",
                    padding: "20px"
                },
                "card": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "0 auto",
                    width: "50%",
                    height: "80vh",
                    borderRadius: "8px",
                },
                "card_inner": {
                    background: "#eee",
                    padding: "15%",
                    borderRadius: "10px",
                    fontSize: "20px",
                    color: "#000",
                    boxShadow: "0px 4px 16px -10px rgba(31, 31, 31, 0.5)",
                    textAlign: "center"
                }
            }
        }
    }
    
    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader left={<PanelHeaderBack onClick={this.props.back} data-to="home"/>}>Spy Game {this.props.timer ? (`${Math.floor(this.props.timer / 60)}:${this.props.timer % 60}`) : null}</PanelHeader>
                <Group header={<Header mode="secondary">Roles</Header>}>
                    <Gallery
                        slideWidth="100%"
                        align="center"
                        style={this.state.styles.galary}
                        showArrows
                    >
                    {this.props.rolesSample.map((role, i) => {
                        if (this.props.spices.indexOf(i) != -1) {
                            return (
                                <div key={i} style={this.state.styles.card}>
                                <div style={this.state.styles.card_inner}>
                                    <span style={{fontWeight: "bold"}}>{this.props.userNames[i]}</span><br />
                                    <span style={{fontWeight: "bold"}}>ШПИОН</span>
                                </div>
                            </div>
                            )
                        }
                        return (
                            <div key={i} style={this.state.styles.card}>
                                <div style={this.state.styles.card_inner}>
                                    <div style={{display: "flex", justifyContent: "center", fontSize: "30px", marginBottom: "20px", alignItems: "center", columnGap: "10px"}}>{this.props.userNames[i]}</div>
                                    <div style={{display: "flex", justifyContent: "center", fontSize: "25px", marginBottom: "20px", alignItems: "center", columnGap: "10px"}}>{this.props.location}</div>
                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", columnGap: "10px"}}>{role.icon}{role.title}</div>
                                </div>
                            </div>
                    )})}
                    </Gallery>
                </Group>
            </Panel>
        )}
};

export default Game