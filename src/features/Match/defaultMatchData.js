export const defaultMatchData = {
    currentGame: 'Overwatch',
    teams: {
        team1: {
            teamName: '',
            teamInfo: '',
            teamLogo: '',
            teamLogoUrl: '',
            teamScore: 0,
            teamColor: '',
            teamGroup: '',
            players: Array(6).fill({
                player: '',
                playerName: '',
                hero: '',
                role: '',
                info: '',
                image: null,
                imageUrl: null
            })
        },
        team2: {
            teamName: '',
            teamInfo: '',
            teamLogo: '',
            teamLogoUrl: '',
            teamScore: 0,
            teamColor: '',
            teamGroup: '',
            players: Array(6).fill({
                player: '',
                playerName: '',
                hero: '',
                role: '',
                info: '',
                image: null,
                imageUrl: null
            })
        }
    },
    maps: {
        selectedMap: '',
        mapData: Array(7).fill({
            map: '',
            team1Score: 0,
            team2Score: 0,
            completed: false
        })
    }
};