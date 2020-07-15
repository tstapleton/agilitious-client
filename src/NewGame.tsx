import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from 'react-use-localstorage';
import { v4 } from 'uuid';
import './NewGame.css';
import SidebarHeader from './SidebarHeader';

const gameId = v4();
const defaultPlayerId = v4();

export default function NewGame() {
	const [playerName, setPlayerName] = useLocalStorage('playerName', '');
	const [playerId, setPlayerId] = useLocalStorage('playerId', defaultPlayerId);
	const [fileName, setFileName] = useState('');

	const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
	const baseUrl = `${protocol}://${process.env.REACT_APP_BASE_URL}`;

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPlayerName(event.target.value);
	}

	const uploadIssues = async (data: string | ArrayBuffer) => {
		await fetch(`${baseUrl}/api/games/${gameId}/issues`, {
			method: 'PUT',
			headers: {
				'content-type': 'text/plain'
			},
			body: data
		});
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (!file) {
			return;
		}

		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			if (e.target && e.target.result) {
				uploadIssues(e.target.result);
			}
		}

		setFileName(file.name);
		fileReader.readAsText(file)

		if (!playerId) {
			setPlayerId(defaultPlayerId);
		}
	};

	return (
		<div className="NewGame">
			<SidebarHeader />
			<form>
				<label>Player name</label>
				<input onChange={handleNameChange} type="text" value={playerName} />
				<label>Upload Jira issues</label>
				<input accept=".csv" className="custom-file-input" type="file" onChange={handleFileUpload} />
				{fileName && <span className="file-upload-name">{fileName}</span>}
			</form>
			<Link to={`/games/${gameId}`}><button>Start a new game</button></Link>
			<p>Share this game with your teammates:</p>
			<p>{`${baseUrl}/games/${gameId}`}</p>
		</div>
	)
}