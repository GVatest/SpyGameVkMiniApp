import React, { useEffect } from 'react';
import { Panel, ButtonGroup, Headline, NativeSelect, FormStatus, FormItem, Input, Button, PanelHeader, Header, Group, Cell, List, Avatar } from '@vkontakte/vkui';


const Home = ({setTimer, timerInterval, timer, setIsGameStarted, nameInputs, generateNameInputs, regex, error, setError, playersAmount, go, setPlayersAmount, spicesAmount, setSpicesAmount, id, fetchedUser, locations }) => {

	const validatePlayersAmount = (amount) => {
		setPlayersAmount(amount)
		if (!amount) {
			setError(false)
		} else if (parseInt(amount) > 12 || parseInt(amount) < 3) {
			setError("Incorrect amount of players")
		} else if (amount.match(regex)) {
			setError("Only numbers supported")
		} else {
			setError(false)
			generateNameInputs(amount)
		}
	}

	useEffect(() => {
		generateNameInputs(playersAmount)
	}, [])

	return (
		<Panel id={id}>
			<PanelHeader>Spy Game {timer ? (`${Math.floor(timer / 60)}:${timer % 60}`) : null}</PanelHeader>

			{fetchedUser &&
			<Group header={<Header mode="secondary">User Data</Header>}>
				<Cell
					before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
					description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
				>
					{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
				</Cell>
			</Group>}

			<Group header={<Header mode="secondary">Game Settings</Header>}>
					{	error
					&&
						<FormItem>
							<FormStatus header="Input incorrect" mode="error">
								{error}
							</FormStatus>
						</FormItem>
					}
				<FormItem>
					<Headline level="2" style={{ marginBottom: 16 }}>
						Amount of Players
  					</Headline>
        			<Input type="number" value={playersAmount} onChange={(event) => {validatePlayersAmount(event.target.value)}} />
				</FormItem>
				<FormItem>
					<Headline level="2" style={{ marginBottom: 16 }}>
						Amount of Spies
  					</Headline>
					<NativeSelect value={spicesAmount} onChange={(event) => {setSpicesAmount(event.target.value)}}>
						<option value="1">1</option>
						<option value="2">2</option>
					</NativeSelect>
				</FormItem>
				<FormItem>
					<ButtonGroup mode="horizontal" gap="m" stretched>
						<Button onClick={go} size="l" mode="secondary" data-to="game">Start Game</Button>
						<Button onClick={() => {setIsGameStarted(false); clearInterval(timerInterval); setTimer(0)}} size="l" appearance="negative" mode="secondary">Finish Game</Button>
					</ButtonGroup>
				</FormItem>
				<FormItem header={<Header mode="secondary">Players Names</Header>}>
					{ playersAmount &&
						nameInputs.map((input) => {
							return (
									input
								)
						})
					}
				</FormItem>
			</Group>

			<Group header={<Header mode="secondary">Game Locations</Header>}>
				<List>
					{locations.map((location, i) => {
						return (
							<Cell key={i} expandable before={location.icon}>
								<Input className='location' defaultValue={location.title}/>
							</Cell>
						)})}
				</List>
			</Group>
		</Panel>
	)
};

export default Home;
