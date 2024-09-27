import React, {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import ImageFileSelector from './ImageFileSelector';
import CustomFilePicker from './customFilePicker';
import Autocomplete from './AutoComplete';
import CldImage from './CldImage';


// Cloudinary Widget and the Fun Stuff
// import CloudinaryUploadWidget from './CloudinaryUploadWidget';
// import { Cloudinary } from "@cloudinary/url-gen";
// import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";


// ISSUES:
// 1. ✅ When adding multiple images, it causes a 'refresh' of the page causing them all to unload and no longer render as expected
// 2. ✅ When setting away team logo, it updates the home team only.

// TO DO:
// Auto Select Hero Image when selecting a hero.

const GenerateTeamSide = ({ team, players, setPlayers, teamInfo, setTeamInfo, currentGame }) => {
    const [teamLogoUrl, setTeamLogoUrl] = useState(teamInfo.teamLogoUrl);
    const [LogoFiles, setLogoFiles] = useState([]);


    // const [publicId, setPublicId] = useState("");
    // const [cloudName] = useState("ddnp1mpva");
    // const [uploadPreset] = useState("bgg-logos");

    // const [uwConfig] = useState({
    //     cloudName,
    //     uploadPreset,
    //     cropping: true, //add a cropping step
    //     // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    //     // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    //     // multiple: false,  //restrict upload to a single file
    //     // folder: "user_images", //upload files to the specified folder
    //     // tags: ["users", "profile"], //add the given tags to the uploaded files
    //     // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    //     clientAllowedFormats: ["image"], //restrict uploading to image files only
    //     maxImageFileSize: 2500000,  //restrict file size to less than 2MB
    //     // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    //     // theme: "purple", //change to a purple theme
    //   });

    //   const cld = new Cloudinary({
    //     cloud: {
    //       cloudName
    //     }
    //   });
    
    //   const myImage = cld.image(publicId);
    



    const handleFileSelect = (image) => {
        console.log("Image", image);
        setTeamLogoUrl(image);
        handleTeamInfoChange({ target: { value: image } }, `${team}Logo`);
    };

    const getRoleOptions = () => {
        if (currentGame === 'Valorant') {
            return ['Duelist', 'Controller', 'Sentinel', 'Initiator'];
        } else if (currentGame === 'Overwatch') {
            return ['Tank', 'DPS', 'Support'];
        }
        return [];
    };

    const getHeroOptions = (role) => {
        const valorantHeroes = {
            Duelist: ['Jett', 'Phoenix', 'Reyna', 'Raze', 'Yoru', 'Neon'],
            Controller: ['Brimstone', 'Omen', 'Viper', 'Astra', 'Harbor'],
            Sentinel: ['Cypher', 'Sage', 'Killjoy', 'Chamber'],
            Initiator: ['Sova', 'Breach', 'Skye', 'KAY/O', 'Fade', 'Gekko']
        };

        const overwatchHeroes = {
            Tank: ['D.Va', 'Orisa', 'Reinhardt', 'Roadhog', 'Sigma', 'Winston', 'Wrecking Ball', 'Zarya'],
            DPS: ['Ashe', 'Bastion', 'Doomfist', 'Echo', 'Genji', 'Hanzo', 'Junkrat', 'McCree', 'Mei', 'Pharah', 'Reaper', 'Soldier: 76', 'Sombra', 'Symmetra', 'Torbjörn', 'Tracer', 'Widowmaker'],
            Support: ['Ana', 'Baptiste', 'Brigitte', 'Lúcio', 'Mercy', 'Moira', 'Zenyatta']
        };

        if (currentGame === 'Valorant') {
            if (!role) {
                // Return all heroes if no role is selected
                return Object.values(valorantHeroes).flat();
            }
            return valorantHeroes[role] || [];
        } else if (currentGame === 'Overwatch') {
            if (!role) {
                // Return all heroes if no role is selected
                return Object.values(overwatchHeroes).flat();
            }
            return overwatchHeroes[role] || [];
        }
        return [];
    };



    const handleInputChange = (event, index, field) => {
        const newPlayers = players.map((player, i) =>
            i === index ? { ...player, [field]: event.target.value } : player
        );
        setPlayers(newPlayers);

        console.log('Updated Players:', newPlayers);
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const newPlayers = players.map((player, i) =>
                i === index ? { ...player, image: file, imageUrl: imageUrl } : player
            );
            setPlayers(newPlayers);
        }
    };


    // We are trying to upload to the server.. and it works as expected but when we upload multiple times in a row WITHOUT changing the team name
    // It ends up causing the whole form to reset/reload.. every single input/combobox etc just resets to default values which makes no apparent sense to me..
    // 
    const handleTeamInfoChange = async (event, field) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
    

        const value = event.target.type === 'file' ? event.target.files[0] : event.target.value;
        const newTeamInfo = { ...teamInfo, [field]: value };

        console.log('Updated Team Info:', newTeamInfo);

        if (event.target.type === 'file') {
            console.log("Da files", event.target.files);
            // newTeamInfo.teamLogoUrl = URL.createObjectURL(value);

            let logoFileExtension = newTeamInfo.teamLogo.split('.').pop();
            newTeamInfo.teamLogoUrl = `http://localhost:8080/uploads/teamLogos/${newTeamInfo.teamName}.${logoFileExtension}`;
            newTeamInfo.teamLogo = value.name;

            // Upload the file to the server
            const formData = new FormData();
            formData.append('teamLogo', value);
            formData.append('teamName', newTeamInfo.teamName);

   

            try {
                // const response = await fetch('http://localhost:8080/upload', {
                //     method: 'POST',
                //     body: formData
                // });

                    // setting a var for cloudinary folder
                formData.append('folder', 'BGGTOOL-LOGOS');
                const response = await fetch('http://localhost:8080/api/uploadImage', {
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
        setTeamInfo(newTeamInfo); // whats this for again? :P
        console.log('Final Team Info:', newTeamInfo);
    };

    const handleFileClick = (id) => {
        const fileInput = document.getElementById(id);
        fileInput.click();
        // fileInput.onchange = (e) => {
        //     handleTeamInfoChange(e, `${team}Logo`);
        // };
    };

    useEffect(() => {
        const FetchTeamLogos = async () => {
            try {
                const response = await fetch('http://localhost:8080/getLogoFiles');
                if (response.ok) {
                    const data = await response.json();
                    console.log('TeamLogo Files:', data);
                    setLogoFiles(data);
                } else {
                    console.error('Error fetching TeamLogo files:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching TeamLogo files:', error);
            }
        }
        FetchTeamLogos();
        }, []);

        
    const handleSelect = (item) => {
        handleTeamInfoChange({ target: { value: item.teamName } }, 'teamName');
    };


    return (
        <div>
      

      <div style={{ width: "800px" }}>
        {/* <AdvancedImage
          style={{ maxWidth: "100%" }}
          cldImg={myImage}
          plugins={[responsive(), placeholder()]}
        /> */}
      </div>

            <div className={`grid-container  ${team === 'Team2' ? 'reverse' : ''}`}>

                {/* Team Name */}
                <div className="grid-item">
                    <Form.Group controlId={`teamName`}>
                        <Form.Label>Team Name</Form.Label>
                        <Autocomplete items={LogoFiles} onSelect={handleSelect} />

                        {/* <Form.Control
                            type="text"
                            value={teamInfo.teamName}
                            onChange={(e) => handleTeamInfoChange(e, 'teamName')}
                            className='team-name-input'
                        /> */}
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
                        <Form.Label>Logo</Form.Label>
                        <div className="d-flex align-items-center">
                        <div className="image-container">

    
                            
                            {/*  Displays the image for Cloud Images */}
                            {/* <CldImage publicId='pioneers-logos-idZ89lWao9_kyju1g'
                                onClick={() => document.getElementById('filePickerButton').click()}
                            /> */}


                            {/* Custom File picker Part1 */}
                            <ImageFileSelector
                                logoURL={teamLogoUrl}
                                onClick={() => document.getElementById('filePickerButton').click()}
                            />

                            {/* Opens the component */}
                            {/* Custom File Picker part2 */}
                            <CustomFilePicker onSelect={handleFileSelect} />

                                {/* THE OG FILE SELECTOR - Part 1 */}
                                 {/* <ImageFileSelector
                                    logoURL={teamInfo.teamLogoUrl}
                                    onClick={() => handleFileClick(`selectTeamLogo-${team}`)}
                                />  */}
                        </div>


                                {/* The OG File Selector - Part2 */}
                            {/* <Form.Control
                                type="file"
                                accept='image/*'
                                className="d-none"
                                // id={`selectTeamLogo`}
                                id={`selectTeamLogo-${team}`}

                                onChange={(e) => handleTeamInfoChange(e, `${team}Logo`)}
                            /> */}
                        </div>


                    </Form.Group>
                </div>
            </div>


            {/* Team Score  & Team Color */}
            {/* Team Score */}
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
                // style={{ height:'50px' }}
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
                        <Form.Group controlId={`heroImage${index}`}>
                            <Form.Label>Image</Form.Label>
                            <div className="d-flex align-items-center">
                                <div className="image-container">

                                    <ImageFileSelector
                                        logoURL={player.imageUrl}
                                        onClick={() => handleFileClick(`selectHeroImage${index}`)}
                                    />
                                </div>
                                <Form.Control
                                    type="file"
                                    className="d-none"
                                    id={`selectHeroImage${index}`}
                                    onChange={(e) => handleFileChange(e, index)}
                                />
                                {/* <input type="file" className="d-none" id={`selectHeroImage${index}`} onChange={(e) => handleFileChange(e, index)} /> */}
                            </div>
                        </Form.Group>
                    </div>


                </div>
            ))}
        </div>
    );
};

export default GenerateTeamSide;