import React, { useEffect, useState } from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import ImageFileSelector from './UI/ImageFileSelector';
import CustomFilePicker from './UI/customFilePicker';
import Autocomplete from './AutoComplete';
import { useCurrentGameConfig } from '../context/currentGameConfig';

// ISSUES:
// 1. ✅ When adding multiple images, it causes a 'refresh' of the page causing them all to unload and no longer render as expected
// 2. ✅ When setting away team logo, it updates the home team only.

// TO DO:
// 1. Make the custom hero image selection work with the CustomFilePicker
// ✅ Auto Select Hero Image when selecting a hero.
// Add 'memo' to the mix.. seems ideal for this as it rerenders multiple times with the same info for no apparent reason

const GenerateTeamSide = ({ team, players, setPlayers, teamInfo, setTeamInfo, currentGame }) => {
    const [teamLogoUrl, setTeamLogoUrl] = useState(teamInfo.teamLogoUrl);
    const [LogoFiles, setLogoFiles] = useState([]);

    const { currentGameConfig } = useCurrentGameConfig();
    const localURL = `http://localhost:8080`;

    const [isLoading, setIsLoading] = useState(true);


    // stops errors from happening upon initial startup due to currentGameConfig not being fully loaded
    useEffect(() => {
        if (currentGameConfig.roles) {
            setIsLoading(false);
        }
    }, [currentGameConfig]);
    

    // unsure if this is needed in the end
    useEffect(() => {
        if (teamInfo.teamLogoUrl !== teamLogoUrl) {
            console.log("GenTeamSide: Setting Team Logo URL:", teamInfo.teamLogoUrl, "for Team:", team);
            setTeamInfo({ ...teamInfo, teamLogoUrl: teamLogoUrl });
        }
    }, [teamInfo]);


    const renderTooltip = (message) => (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {message}
        </Tooltip>
    );


    // useEffect(() => {
    //     const curConfig = currentGameConfig[currentGame];

    //     if (curConfig) {
    //         const tanks = currentGameConfig[currentGame].heroes.Tank.hero.map(tank => tank.name);
    //         console.log("Mapped Tanks:", tanks);

    //     }
    // }, [currentGameConfig]);



    const handleFileSelect = (image) => {
        // console.log("SelectedTeamLogo Image", image);
        setTeamLogoUrl(image);
        console.log("GenTeamSide: Setting Team Logo for Team:", team, "to:", image, `${team}Logo`);
        handleTeamInfoChange({ target: { value: image } }, `${team}Logo`);
    };


    const getRoleOptions = () => {
        if (!currentGameConfig || !currentGameConfig.roles) {
            console.error("Error: Game configuration or roles not found.");
            return [];
        }

        const rolesConfig = currentGameConfig.roles.role;
        if (!rolesConfig) {
            console.error(`Error: Role configuration for ${currentGame} not found.`);
            return [];
        }

        return rolesConfig;
    };


    const getHeroOptions = (role) => {
        if (!currentGameConfig || !currentGameConfig.heroes) {
            console.error("Error: Game configuration or heroes not found.");
            return [];
        }

        if (!role) {
            // Return all heroes if no role is selected
            return Object.values(currentGameConfig.heroes).flatMap(roleConfig => roleConfig.hero.map(hero => hero.name));
        }

        const roleConfig = currentGameConfig.heroes[role];
        if (!roleConfig || !roleConfig.hero) {
            console.error(`Error: Role configuration for ${role} not found.`);
            return [];
        }

        const heroes = roleConfig.hero.map(hero => hero.name);
        console.log("Current heroes from the config:", heroes);
        return heroes;
    };



    const handleInputChange = (event, index, field) => {
        const newPlayers = players.map((player, i) =>
            i === index ? { ...player, [field]: event.target.value } : player
        );
        setPlayers(newPlayers);
    };


    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            //  this is setting the image url for the player..
            const imageUrl = `${localURL}/uploads/teamLogos/${file.name}`;
            const newPlayers = players.map((player, i) =>
                i === index ? { ...player, image: file, imageUrl: imageUrl } : player
            );
            setPlayers(newPlayers);
        }
    };



    // EVERY time the user types in a team name it causes this to run.. this is literally ever keypress.. this is NOT ideal
    // there is a part at the bottom where it sends to the server.. this is alot of overhead
    const handleTeamInfoChange = async (event, field) => {
        if (event.preventDefault) {
            event.preventDefault();
        }

        const value = event.target.type === 'file' ? event.target.files[0] : event.target.value;
        const newTeamInfo = { ...teamInfo, [field]: value };

        if (event.target.type === 'file') {
            console.log("Uploading Files: ", event.target.files);

            let logoFileExtension = newTeamInfo.teamLogo.split('.').pop();
            newTeamInfo.teamLogoUrl = `${localURL}/uploads/teamLogos/${newTeamInfo.teamName}.${logoFileExtension}`;
            newTeamInfo.teamLogo = value.name;

            // Upload the file to the server
            const formData = new FormData();
            formData.append('teamLogo', value);
            formData.append('teamName', newTeamInfo.teamName);

            try {
                formData.append('folder', 'BGGTOOL-LOGOS');
                const response = await fetch(`${localURL}/api/uploadImage`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('File uploaded successfully:', data);

                    // Update the teamLogoUrl with the response data
                    // newTeamInfo.teamLogoUrl = data.filename;
                } else {
                    console.error('Error uploading file:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        // Update the state with the new team info

        // EVERY time the user types in a team name it causes this to run.. this is literally ever keypress.. this is NOT ideal..
        // really seems to just be for the team name..  perhaps not as bad as i think...
        setTeamInfo(newTeamInfo); // this is sending info back to Match.js 
        console.log('Final Team Info:', newTeamInfo);
    };


    const handleFileClick = (id) => {
        const fileInput = document.getElementById(id);
        fileInput.click();
    };


    // Fetching the team logo files from the server, used for 'autoComplete' for team names
    useEffect(() => {
        const FetchTeamLogos = async () => {
            try {
                const response = await fetch(`${localURL}/getLogoFiles`);
                if (response.ok) {
                    const data = await response.json();
                    setLogoFiles(data);
                } else {
                    console.error('Error fetching TeamLogo files:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching TeamLogo files:', error);
            }
        }
        FetchTeamLogos();
    }
    , []);

    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <div className={`grid-container  ${team === 'Team2' ? 'reverse' : ''}`}>

                {/* Team Name */}
                <div className="grid-item">
                    <Form.Group controlId={`teamName`}>
                        <Form.Label>Team Name</Form.Label>
                        <Autocomplete
                            items={LogoFiles}
                            teamName={teamInfo.teamName}
                            handleTeamInfoChange={handleTeamInfoChange} 
                            className='team-name-input'
                        />
                    </Form.Group>
                </div>


                {/* Team Info Box*/}
                <div className="grid-item">
                    <Form.Group controlId={`teamInfo`}>
                        <Form.Label>Team Info</Form.Label>
                        <Form.Control
                            type="text"
                            value={teamInfo.teamInfo}
                            onChange={(e) => handleTeamInfoChange(e, 'teamInfo')}
                            className='team-info-input'
                        />
                    </Form.Group>
                </div>

                {/* Team Logo */}
                <div className="grid-item">
                    <Form.Group controlId={`teamLogo`}>
                        {/* <Form.Label>Logo</Form.Label> */}
                        <div className="d-flex align-items-center">
                            <div className="image-container teamLogo">

                                {/* Custom File picker Part1 */}
                                <ImageFileSelector
                                    logoURL={teamLogoUrl}
                                    onClick={() => handleFileClick(`filePickerButton-${team}`)}
                                />

                                {/* Opens the component */}
                                <CustomFilePicker
                                    buttonID={`filePickerButton-${team}`}
                                    onSelect={handleFileSelect}
                                    team={team}
                                />
                            </div>
                        </div>


                    </Form.Group>
                </div>
            </div>


            {/* Team Score, Team Color & Team Side Choice Radio */}
            <div className={`grid-container ${team === 'Team2' ? 'reverse' : ''}`}>
                <div className="grid-item">
                    <Form.Group controlId={`teamScore`}>
                        <Form.Label>Score</Form.Label>
                        <Form.Control
                            type="number"
                            value={teamInfo.teamScore}
                            onChange={(e) => handleTeamInfoChange(e, 'teamScore')}
                            min={0}
                            step={1}
                        />
                    </Form.Group>
                </div>

                {/* Team Color */}
                <div className="grid-item">
                    <Form.Group controlId={`teamColor`}>
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                            type="color"
                            value={teamInfo.teamColor}
                            onChange={(e) => handleTeamInfoChange(e, 'teamColor')}
                        />
                    </Form.Group>
                </div>


                {/* Team Side Radio */}
                <div className="grid-item">
                    <Form.Group controlId={`teamGroup`} className={`px-2 ${team === 'Team2' ? 'hidden' : ''}`}>
                        <Form.Label>Side</Form.Label>
                        <div className="d-flex gap-3">
                            <Form.Check
                                type="radio"
                                label="A"
                                name={`group${team}`}
                                id={`groupA${team}`}
                                checked={teamInfo.teamGroup === 'A'}
                                onChange={(e) => handleTeamInfoChange(e, 'teamGroup')}
                                value="A"
                                className='ml-2'
                            />
                            <Form.Check
                                type="radio"
                                label="D"
                                name={`group${team}`}
                                id={`groupD${team}`}
                                checked={teamInfo.teamGroup === 'D'}
                                onChange={(e) => handleTeamInfoChange(e, 'teamGroup')}
                                value="D"
                                className='ml-2'
                            />
                            <Form.Check
                                type="radio"
                                label="N"
                                name={`group${team}`}
                                id={`groupN${team}`}
                                checked={teamInfo.teamGroup === 'N'}
                                onChange={(e) => handleTeamInfoChange(e, 'teamGroup')}
                                value="N"
                                className='ml-2'

                            />
                        </div>
                    </Form.Group>
                </div>
            </div>


            {/* Player Section */}
            {players.map((player, index) => (
                <div key={index} className={`grid-container players ${team === 'Team2' ? 'reverse' : ''}`}
                >

                    {/* Player Name */}
                    <div className="grid-item">
                        <Form.Group controlId={`playerInput${index}`}>
                            <Form.Label>{`P${index + 1}`}</Form.Label>
                            <Form.Control
                                type="text"
                                value={player.playerName}
                                onChange={(e) => handleInputChange(e, index, 'playerName')}
                            />
                        </Form.Group>
                    </div>

                    {/* Player Hero Select */}
                    <div className="grid-item">
                        <Form.Group controlId={`heroSelect${index}`}>
                            <Form.Label>Hero</Form.Label>
                            <Form.Control
                                as="select"
                                value={player.hero}
                                onChange={(e) => handleInputChange(e, index, 'hero')}
                            >
                                <option value="">Select Hero</option>
                                {getHeroOptions(player.role).map((hero, heroIndex) => (
                                    <option key={heroIndex} value={hero}>{hero}</option>
                                ))}

                            </Form.Control>
                        </Form.Group>
                    </div>

                    {/* Player Hero Role */}
                    <div className="grid-item">
                        <Form.Group controlId={`roleSelect${index}`}>
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                value={player.role}
                                onChange={(e) => handleInputChange(e, index, 'role')}
                            >
                                <option value="">Select Role</option>
                                {getRoleOptions().map((role, roleIndex) => (
                                    <option key={roleIndex} value={role}>{role}</option>
                                ))}

                            </Form.Control>
                        </Form.Group>
                    </div>

                    {/* Player Hero Info -BattleTag/College/etc- */}
                    <div className="grid-item">
                        <Form.Group controlId={`infoInput${index}`}>
                            <Form.Label>Info</Form.Label>
                            <Form.Control
                                type="text"
                                value={player.info}
                                onChange={(e) => handleInputChange(e, index, 'info')}
                            />
                        </Form.Group>
                    </div>

                    {/*  Player Select Hero Image  */}
                    <div className="grid-item">
                        {/* <Form.Group controlId={`heroImage${index}`}> */}
                        <Form.Group>
                            {/* <Form.Label>Image</Form.Label> */}
                            <div className="d-flex align-items-center">
                                <div className="image-container">

                                    <ImageFileSelector
                                        logoURL={player.imageUrl || `/configs/${currentGame}/images/heroes/icons/Icon-${player.hero}.webp`}
                                        onClick={() => handleFileClick(`selectHeroImage${index}-${team}`)}
                                    />
                                    <Form.Control
                                        type="file"
                                        className="d-none"
                                        id={`selectHeroImage${index}-${team}`}
                                        onChange={(e) => handleFileChange(e, index)}
                                    />

                                    {/* How can we make the custom file picker work instead of the default 'form control' input type above.. */}
                                    {/* CustomFilePicker can be used direclty with ImageFileSelector component but CustomFilePicker is set up to handle team logos currently.. */}
                                    {/* <CustomFilePicker
                                    buttonID={`selectHeroImage${index}-${team}`}
                                    onSelect={handleFileChange}
                                    team = {team}
                                    />
                                    */}
                                </div>


                                {/* Clear Hero Image Button */}
                                <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip("Clear Image")}
                                    delay={{ show: 450, hide: 100 }}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className="d-flex justify-content-center align-items-center p-2"
                                        onClick={() => handleInputChange({ target: { value: '' } }, index, 'imageUrl')}
                                    />
                                </OverlayTrigger>

                            </div>
                        </Form.Group>
                    </div>


                </div>
            ))}
        </div>
    );
};

export default GenerateTeamSide;