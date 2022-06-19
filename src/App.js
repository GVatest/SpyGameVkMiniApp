import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import * as _ from 'underscore'
import { Icon16NeutralFaceOutline, Icon16GridOfThree, Icon16HeadphonesOutline, Icon16PopupStickersCircleFillRaspberryPinkProduct, Icon20MarketCircleFillYellow, Icon20FireCircleFillRed, Icon20CalendarCircleFillRed, Icon16PlayCircleFillPink, Icon20CakeCircleFillPurple, Icon20VotestTransferCircleFillTurquoise, Icon24DataSaverCircleFillGreen, Icon12StarCircleFillYellow, Icon16MessagesCircleFillGreen, Icon20AddCircleFillGray, Icon20AchievementCircleFillBlue } from '@vkontakte/icons';
import { View, Input, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Game from './panels/Game';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [fetchedUser, setUser] = useState(null)
	const [playersAmount, setPlayersAmount] = useState("6")
	const [spicesAmount, setSpicesAmount] = useState("1")
	const [activePanel, setActivePanel] = useState('home')
	const regex=/^[a-zA-Z]+$/
	const [error, setError] = useState(playersAmount.match(regex))
	const [userNames, setUserNames] = useState([])
	const [nameInputs, setNameInputs] = useState([<Input className='username' key={13} style={{marginBottom: "10px"}} type="text" placeholder={fetchedUser ? fetchedUser?.first_name : "UserName"}/>])
	const [isGameStarted, setIsGameStarted] = useState(false)
	const [flash, setFlash] = useState(false)
	const [timer, setTimer] = useState(0)
	const [gameLocation, setGameLocation] = useState("")
	const [rolesSample, setRolesSample] = useState([])
	const [spies, setSpies] = useState([])
	const [timerInterval, setTimerInterval] = useState(null)


	const defaultLocations = {
		"data": [
			{
				"title": "Стройплощадка",
				"icon": <Icon16NeutralFaceOutline/>
			},	
			{
				"title": "Метро",
				"icon": <Icon20MarketCircleFillYellow/>
			},	
			{
				"title": "Парламент",
				"icon": <Icon16HeadphonesOutline/>
			},	
			{
				"title": "Стадион",
				"icon": <Icon16PopupStickersCircleFillRaspberryPinkProduct/>
			},	
			{
				"title": "Музей",
				"icon": <Icon16GridOfThree/>
			},	
			{
				"title": "Дом престарелых",
				"icon": <Icon16PopupStickersCircleFillRaspberryPinkProduct/>
			},	
			{
				"title": "Экскурсионный автобус",
				"icon": <Icon20MarketCircleFillYellow/>
			},	
			{
				"title": "Рок-концерт",
				"icon": <Icon16HeadphonesOutline/>
			},	
			{
				"title": "Шахта",
				"icon": <Icon20FireCircleFillRed/>
			},	
			{
				"title": "Свадьба",
				"icon": <Icon20CakeCircleFillPurple/>
			},	
			{
				"title": "Заправочная станция",
				"icon": <Icon20CalendarCircleFillRed/>
			},	
			{
				"title": "Библиотека",
				"icon": <Icon16PlayCircleFillPink/>
			},
			{
				"title": "Шоколадная фабрика",
				"icon": <Icon20CalendarCircleFillRed/>
			},
			{
				"title": "Кладбище",
				"icon": <Icon20CakeCircleFillPurple/>
			},
			{
				"title": "Джаз-бэнд",
				"icon": <Icon20VotestTransferCircleFillTurquoise/>
			},
			{
				"title": "Виноградник",
				"icon": <Icon24DataSaverCircleFillGreen/>
			},
			{
				"title": "Порт",
				"icon": <Icon12StarCircleFillYellow/>
			},
			{
				"title": "Автогонки",
				"icon": <Icon16MessagesCircleFillGreen/>
			},
			{
				"title": "Тюрьма",
				"icon": <Icon20AddCircleFillGray/>
			},
			{
				"title": "Выставка кошек",
				"icon": <Icon20AchievementCircleFillBlue/>
			},
		]
	}

	const roles = {
		"data": [
			{
				"title": "IOS разработчик",
				"icon": <Icon16NeutralFaceOutline/>
			},	
			{
				"title": "Vk Mini Apps разработчик",
				"icon": <Icon20MarketCircleFillYellow/>
			},	
			{
				"title": "Бэкенд разработчик",
				"icon": <Icon16HeadphonesOutline/>
			},	
			{
				"title": "Аналитик",
				"icon": <Icon16PopupStickersCircleFillRaspberryPinkProduct/>
			},	
			{
				"title": "Тестировщик, QA",
				"icon": <Icon16GridOfThree/>
			},	
			{
				"title": "Разработчик Python",
				"icon": <Icon16PopupStickersCircleFillRaspberryPinkProduct/>
			},	
			{
				"title": "Разработчик ПО",
				"icon": <Icon20MarketCircleFillYellow/>
			},	
			{
				"title": "DevOps",
				"icon": <Icon16HeadphonesOutline/>
			},	
			{
				"title": "Сисадмин",
				"icon": <Icon20FireCircleFillRed/>
			},	
			{
				"title": "Веб-разработчик",
				"icon": <Icon20CakeCircleFillPurple/>
			},	
			{
				"title": "Белый хакер",
				"icon": <Icon20CalendarCircleFillRed/>
			},	
			{
				"title": "Data Scientist",
				"icon": <Icon16PlayCircleFillPink/>
			},
		]
	}

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
			}
		});

		async function getFlashInfo() {
			const flashFetch = await bridge.send("VKWebAppFlashGetInfo")
			switch (flashFetch.type) {
				case "VKWebAppFlashGetInfoResult":
					if (flashFetch.data.is_available) {
						setFlash(true)
					} else {
						setFlash(false)
					}
				case "VKWebAppFlashGetInfoFailed":
					setFlash(false)
			}
		}
		getFlashInfo()
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo')
			setUser(user)
		}
		fetchData()
	}, [])

	const getUserNames = () => {
		const inputs = document.querySelectorAll(".username")
		let userNames = []
		inputs.forEach((elem) => {
			userNames.push(elem.childNodes[0].value)
		})
		
		userNames = userNames.filter((elem) => {
			return elem != ""
		})
		if (userNames.length < inputs.length) {
			setError("Fill in all user names")
			return false
		}
		setError(false)
		setUserNames(userNames)
		return true
	}

	const generateNameInputs = (amount) => {
		if (!error || (amount >= 10 && amount <= 12)) {
			const inputs = Array.from(Array(parseInt(amount) - 1), (item, i) => {return <Input className='username' required style={{marginBottom: "10px"}} key={i} type="text" placeholder='UserName'/>})
			setNameInputs([<Input className='username' key={13} style={{marginBottom: "10px"}} type="text" placeholder={fetchedUser ? fetchedUser?.first_name : "UserName"}/>, ...inputs])
		}
	}

	const getLocations = () => {
		const inputs = document.querySelectorAll(".location")
		let userLocations = []
		inputs.forEach((elem) => {
			userLocations.push(elem.childNodes[0].value)
		})
		return userLocations
	}
	
	const go = e => {
		if (getUserNames()) {
			if (!isGameStarted) {
				startCountDown(playersAmount)
				setActivePanel(e.currentTarget.dataset.to);
				setIsGameStarted(true)
				const userLocations = getLocations()
				setGameLocation(userLocations.sample())
				const rolesBuffer = _.sample(roles.data, parseInt(playersAmount))
				setRolesSample(rolesBuffer)
				setSpies(_.sample(rolesBuffer, parseInt(spicesAmount)).map((item) => {
					return rolesBuffer.indexOf(item)
				}))
			} else {
				setError("Game already started")
			}
		}
	};

	const back = e => {
		generateNameInputs(playersAmount)
		setActivePanel(e.currentTarget.dataset.to);
	};

	const startCountDown = (playersAmount) => {
		var countDown = 0
		console.log(playersAmount)
		if (parseInt(playersAmount) <= 4 && 3 <= parseInt(playersAmount)) {
			countDown = 360
		} else if (parseInt(playersAmount) <= 6 && 5 <= parseInt(playersAmount)) {
			countDown = 420
		} else if (parseInt(playersAmount) <= 8 && 7 <= parseInt(playersAmount)) {
			countDown = 480
		} else if (parseInt(playersAmount) <= 10 && 9 <= parseInt(playersAmount)) {
			countDown = 540
		} else if (parseInt(playersAmount) <= 12 && 10 <= parseInt(playersAmount)) {
			countDown = 600
		}
		const timerInterval = setInterval(() => {
			if (countDown < 0) {
				setTimer(0)
				bridge.send("VKWebAppFlashSetLevel", {"level": 1});
				let on = 0
				const flashInterval = setInterval(() => {
					if (on) {
						bridge.send("VKWebAppFlashSetLevel", {"level": 0});
					} else {
						bridge.send("VKWebAppFlashSetLevel", {"level": 1});
					}
				}, 3000)
				setTimeout(() => {
					bridge.send("VKWebAppFlashSetLevel", {"level": 0});
					clearInterval(flashInterval)
				}, 18000)
				clearInterval(timerInterval)
				return
			}
			countDown = countDown - 1
			setTimer(countDown)
		}, 1000)
		setTimerInterval(timerInterval)
	}

	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout>
					{/* <SplitLayout popout={popout}> */}
						<SplitCol>
							<View activePanel={activePanel}>
								<Home setTimer={setTimer} timerInterval={timerInterval} timer={timer} setIsGameStarted={setIsGameStarted} nameInputs={nameInputs} generateNameInputs={generateNameInputs} regex={regex} error={error} setError={setError} go={go} locations={defaultLocations.data} spiesAmount={spicesAmount} setSpicesAmount={setSpicesAmount} playersAmount={playersAmount} setPlayersAmount={setPlayersAmount} id='home' fetchedUser={fetchedUser} />
								<Game timer={timer} location={gameLocation} spices={spies} rolesSample={rolesSample} back={back} userNames={userNames} go={go} spicesAmount={spicesAmount} playersAmount={playersAmount} id="game"/>
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
